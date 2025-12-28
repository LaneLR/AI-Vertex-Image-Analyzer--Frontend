import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If it's the webhook, bypass everything and return NextResponse.next()
    if (req.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // ALWAYS authorize the webhook route regardless of token
        if (req.nextUrl.pathname.startsWith("/api/stripe/webhook")) {
          return true;
        }
        // Otherwise, require a session token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // Use a very broad matcher and handle logic inside the function above
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};