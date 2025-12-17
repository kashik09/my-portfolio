import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protect Admin
    if (path.startsWith("/admin")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }

      const allowedRoles = ["ADMIN", "OWNER", "MODERATOR", "EDITOR"]
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/", req.url))
      }

      if (path.startsWith("/admin/users") || path.startsWith("/admin/settings")) {
        if (!["ADMIN", "OWNER"].includes(token.role as string)) {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      }

      return NextResponse.next()
    }

    // Protect Dashboard
    if (path.startsWith("/dashboard")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
