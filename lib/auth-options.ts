import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const ONE_DAY_SECONDS = 60 * 60 * 24
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30

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
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // IMPORTANT: if your schema uses passwordHash, swap user.password -> user.passwordHash
        // @ts-ignore
        if (!user || !user.password) return null

        // @ts-ignore
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        // @ts-ignore
        if (user.accountStatus === "LOCKED" || user.accountStatus === "BANNED") return null

        const rememberMe = credentials.rememberMe === "1"

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          // @ts-ignore
          role: user.role,
          image: user.image,
          rememberMe, // <-- pass through
        } as any
      },
    }),

    GoogleProvider({
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
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
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
    async jwt({ token, user, trigger }) {
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

      // Refresh 2FA status on update trigger
      if (trigger === 'update' && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { twoFactorEnabled: true, twoFactorVerified: true },
        })
        // @ts-ignore
        token.twoFactorEnabled = dbUser?.twoFactorEnabled || false
        // @ts-ignore
        token.twoFactorVerified = dbUser?.twoFactorVerified || false
      }

      return token
    },

    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.id
        // @ts-ignore
        session.user.role = token.role
        // @ts-ignore
        session.user.image = token.image
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

  secret: process.env.NEXTAUTH_SECRET,
}
