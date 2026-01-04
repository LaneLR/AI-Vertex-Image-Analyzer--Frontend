import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userAgent = req.headers.get("user-agent") || "";
    const isMobileApp = userAgent.includes("FlipFinder-Mobile-App");

    if (pathname.startsWith("/api/stripe/webhook")) {
      return NextResponse.next();
    }

    if (isMobileApp && pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const userAgent = req.headers.get("user-agent") || "";
        const isMobileApp = userAgent.includes("FlipFinder-Mobile-App");

        if (pathname.startsWith("/api/stripe/webhook")) return true;

        if (pathname === "/") {
          return isMobileApp ? !!token : true;
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
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth internals)
     * - api/auth/register (Public registration)
     * - api/verify (Public verification)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (your public images folder)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|api/auth/register|api/verify|_next/static|_next/image|favicon.ico|images).*)",
  ],
};