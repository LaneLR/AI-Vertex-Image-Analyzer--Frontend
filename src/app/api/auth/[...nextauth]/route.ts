import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db"; 

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB(); 
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ where: { email: credentials.email } });

        if (!user) throw new Error("No user found with that email");
        if (!user.isVerified) throw new Error("Please verify your email before logging in");
        if (!user.password) throw new Error("Please sign in with Google");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { 
          id: user.id.toString(), 
          email: user.email 
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      await connectDB(); 
      if (account?.provider === "google") {
        const [dbUser] = await User.findOrCreate({
          where: { email: user.email! },
          defaults: {
            email: user.email!,
            isVerified: true,
            subscriptionStatus: 'basic',
            dailyScansCount: 0
          }
        });
        user.id = dbUser.id.toString();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { 
    signIn: "/login",
    error: "/login" 
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };