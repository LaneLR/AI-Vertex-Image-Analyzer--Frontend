// eslint-disable-next-line @typescript-eslint/no-explicit-any
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";

declare module "next-auth" {
  interface User {
    id?: string;
    subscriptionStatus?: string;
    darkMode?: boolean;
    paymentProvider?: string;
    isActive?: boolean;
    lastScanDate?:  any | null;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionStatus?: string;
      darkMode?: boolean;
      paymentProvider?: string;
      isActive?: boolean;
      lastScanDate?: any | null;
    };
  }
}

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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) throw new Error("No user found with this email");
        if (!user.isActive)
          throw new Error("The account associated with this email has been deactivated. Please sign in with a different account.");
        if (!user.isVerified)
          throw new Error("Please verify your email before logging in");
        if (!user.password) throw new Error("Please sign in with Google");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
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
            subscriptionStatus: "basic",
            dailyScansCount: 0,
            darkMode: false,
          },
        });
        user.id = dbUser.id.toString();
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }

      if (trigger === "update" || trigger === "signIn") {
        const dbUser = await User.findByPk(token.id as string);
        token.subscriptionStatus = dbUser?.subscriptionStatus;
        token.paymentProvider = dbUser?.paymentProvider;
        token.providerSubscriptionId = dbUser?.providerSubscriptionId;
        token.cancelAtPeriodEnd = dbUser?.cancelAtPeriodEnd;
        token.subscriptionEndDate = dbUser?.subscriptionEndDate;
        token.isVerified = dbUser?.isVerified;
        token.dailyScansCount = dbUser?.dailyScansCount;
        token.darkMode = dbUser?.darkMode;
        token.isActive = dbUser?.isActive;
        token.lastScanDate = dbUser?.lastScanDate;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        const dbUser = await User.findByPk(token.id as string);
        session.user.subscriptionStatus = dbUser?.subscriptionStatus || "basic";
        (session.user as any).dailyScansCount = dbUser?.dailyScansCount || 0;
        session.user.darkMode = dbUser?.darkMode ?? false;
        session.user.paymentProvider = dbUser?.paymentProvider;
        session.user.isActive = dbUser?.isActive;
        session.user.lastScanDate = dbUser?.lastScanDate;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
