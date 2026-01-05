import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userAgent = req.headers.get("user-agent") || "";
    const isMobileApp = userAgent.includes("FlipFinder-Mobile-App");
    const token = req.nextauth.token;

    // 1. Force Mobile users away from Root
    if (isMobileApp && pathname === "/") {
      return NextResponse.redirect(new URL(token ? "/dashboard" : "/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Define truly public paths here
        const isPublic = 
          pathname === "/" || 
          pathname === "/login" || 
          pathname.startsWith("/api/auth");
        
        if (isPublic) return true;
        return !!token; // Protected paths (like /dashboard) need a token
      },
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  // Catch everything except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};