import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/student", "/employer", "/teacher"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtected) {
    // If user is on /login and already authenticated, redirect to their dashboard
    if (pathname === "/login") {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "joltap-secret-key-change-in-production" })
      if (token?.role) {
        const roleRedirectMap: Record<string, string> = {
          STUDENT: "/student",
          EMPLOYER: "/employer",
          TEACHER: "/teacher",
        }
        const redirectUrl = roleRedirectMap[token.role as string] || "/student"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
    }
    return NextResponse.next()
  }

  // Check for token on protected routes
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "joltap-secret-key-change-in-production" })

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based route protection
  const role = token.role as string
  const roleRouteMap: Record<string, string> = {
    STUDENT: "/student",
    EMPLOYER: "/employer",
    TEACHER: "/teacher",
  }

  const allowedRoute = roleRouteMap[role]
  if (allowedRoute && !pathname.startsWith(allowedRoute)) {
    // Redirect to their correct dashboard if they try to access another role's page
    return NextResponse.redirect(new URL(allowedRoute, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/student/:path*", "/employer/:path*", "/teacher/:path*", "/login"],
}
