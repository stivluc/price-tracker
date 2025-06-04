import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add paths that should be accessible without authentication
const publicPaths = ["/login"]

export function middleware(request: NextRequest) {
  // Allow access to static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)
  ) {
    return NextResponse.next()
  }

  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true"
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to home if authenticated and trying to access login
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 