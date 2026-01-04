import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// middleware.ts
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userAgent = req.headers.get("user-agent") || "";
    const isMobileApp = userAgent.includes("FlipFinder-Mobile-App");

    // If mobile app hits root, send to login
    if (isMobileApp && pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // IMPORTANT: Allow access to /login and / without a token for web users
        if (pathname === "/" || pathname === "/login") {
          return true; 
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /login (The login page itself must be public)
     * 2. /api/auth (NextAuth internals)
     * 3. /_next (Static files)
     * 4. /favicon.ico, /images, etc.
     */
    "/((?!login|api/auth|api/auth/register|api/verify|_next/static|_next/image|favicon.ico|images).*)",
  ],
};