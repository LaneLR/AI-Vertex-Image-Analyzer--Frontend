import { withAuth } from "next-auth/middleware";

export default withAuth({
  // This is the most important part to break the loop
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const config = { 
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (NextAuth internal routes)
     * 2. /login, /register (Auth pages)
     * 3. /_next/* (Static files)
     * 4. /images/*, favicon.ico (Public assets)
     */
    "/((?!api/auth|login|register|_next|images|favicon.ico).*)"
  ] 
};