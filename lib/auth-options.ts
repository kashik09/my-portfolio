import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { isValidEmail, normalizeEmail } from "@/lib/auth-utils"
import { validateAuthEnv } from "@/lib/auth-env"
import { verifyPassword } from "@/lib/password"

const ONE_DAY_SECONDS = 60 * 60 * 24
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30
const DUMMY_PASSWORD_HASH =
  "$2b$12$trWG92Qki.b.ii8VzyUn8.Cg0ke1/Xd7GIvNs7zTg9hxWbBmJPKeC"

validateAuthEnv()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" }, // "1" or "0"
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email)
        const password =
          typeof credentials?.password === "string" ? credentials.password : ""

        if (!email || !password) return null
        if (!isValidEmail(email)) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })
          const userRecord = user as any

          // IMPORTANT: if your schema uses passwordHash, swap user.password -> user.passwordHash
          const storedPassword =
            typeof userRecord?.password === "string"
              ? userRecord.password
              : DUMMY_PASSWORD_HASH

          const isPasswordValid = await verifyPassword(password, storedPassword)
          if (!user || !isPasswordValid) return null

          if (userRecord?.accountStatus === "LOCKED" || userRecord?.accountStatus === "BANNED") {
            return null
          }
          if (userRecord?.twoFactorEnabled === true && userRecord?.twoFactorVerified !== true) {
            return null
          }

          const rememberMe = credentials?.rememberMe === "1"

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: userRecord?.role,
            image: user.image,
            rememberMe, // <-- pass through
          } as any
        } catch {
          throw new Error("CredentialsSignin")
        }
      },
    }),

    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        // Fetch user role from database instead of hardcoding
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          select: { role: true }
        })

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: existingUser?.role || "USER",
        }
      },
    }),

    GitHubProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      async profile(profile) {
        // Fetch user role from database instead of hardcoding
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          select: { role: true }
        })

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: existingUser?.role || "USER",
        }
      },
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "",
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "",
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          accountStatus: true,
          twoFactorEnabled: true,
          twoFactorVerified: true,
        },
      })

      if (!dbUser) return true
      if (dbUser.accountStatus === "LOCKED" || dbUser.accountStatus === "BANNED") return false
      if (dbUser.twoFactorEnabled && !dbUser.twoFactorVerified) return false

      return true
    },
    async jwt({ token, user, trigger }) {
      if (!token.id && token.sub) {
        token.id = token.sub
      }

      // On first sign-in, we receive `user`
      if (user) {
        // @ts-ignore
        token.id = user.id
        // @ts-ignore
        token.role = (user as any).role
        // @ts-ignore
        token.image = (user as any).image

        const rememberMe =
          // Credentials sign-in will set this
          // @ts-ignore
          (user as any).rememberMe === true
            ? true
            : // OAuth sign-ins default to "remember" behavior
              true

        // Store rememberMe on token
        // @ts-ignore
        token.rememberMe = rememberMe

        // Set JWT exp ourselves so "remember me" changes session validity
        const now = Math.floor(Date.now() / 1000)
        token.exp = now + (rememberMe ? THIRTY_DAYS_SECONDS : ONE_DAY_SECONDS)

        // Fetch 2FA status from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { twoFactorEnabled: true, twoFactorVerified: true },
        })
        // @ts-ignore
        token.twoFactorEnabled = dbUser?.twoFactorEnabled || false
        // @ts-ignore
        token.twoFactorVerified = dbUser?.twoFactorVerified || false
      }

      const shouldRefresh =
        trigger === "update" ||
        !token.id ||
        !token.role ||
        token.twoFactorEnabled === undefined ||
        token.twoFactorVerified === undefined

      if (shouldRefresh && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: token.id
            ? { id: token.id as string }
            : { email: token.email as string },
          select: {
            id: true,
            role: true,
            image: true,
            twoFactorEnabled: true,
            twoFactorVerified: true,
          },
        })

        if (dbUser) {
          // @ts-ignore
          token.id = dbUser.id
          // @ts-ignore
          token.role = dbUser.role
          // @ts-ignore
          token.image = dbUser.image
          // @ts-ignore
          token.twoFactorEnabled = dbUser.twoFactorEnabled || false
          // @ts-ignore
          token.twoFactorVerified = dbUser.twoFactorVerified || false
        }
      }

      if (!token.role) {
        token.role = "USER"
      }

      return token
    },

    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.id || token.sub || ""
        // @ts-ignore
        session.user.role = token.role || "USER"
        // @ts-ignore
        session.user.image = token.image
        // @ts-ignore
        session.user.twoFactorEnabled = token.twoFactorEnabled || false
        // @ts-ignore
        session.user.twoFactorVerified = token.twoFactorVerified || false
      }

      // Align session expiry with token.exp (so UI shows the right expiry too)
      if (token?.exp && typeof token.exp === 'number') {
        session.expires = new Date(token.exp * 1000).toISOString()
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    // Cookie expiry can be longer; token.exp is the real enforcement.
    maxAge: THIRTY_DAYS_SECONDS,
  },

  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
