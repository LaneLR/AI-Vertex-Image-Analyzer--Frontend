import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const userAgent = req.headers.get("user-agent") || "";
    const isMobileApp = userAgent.includes("FlipFinder-Mobile-App");
    const token = req.nextauth.token;

    if (isMobileApp && pathname === "/") {
      return NextResponse.redirect(new URL(token ? "/dashboard" : "/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/api/stripe/webhook")) {
          return true;
        }

        const isPublic = 
          pathname === "/" || 
          pathname === "/login" || 
          pathname === "/about" ||
          pathname === "/terms" ||
          pathname === "/privacy" ||
          pathname.startsWith("/api/auth");
        
        if (isPublic) return true;
        return !!token; 
      },
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  // 3. UPDATED MATCHER
  // Added api/stripe/webhook to the exclusion list to be safe
  matcher: ["/((?!api/stripe/webhook|_next/static|_next/image|favicon.ico|images).*)"],
};