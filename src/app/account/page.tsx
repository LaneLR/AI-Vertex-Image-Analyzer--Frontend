import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to where your authOptions are
import { redirect } from "next/navigation";
import AccountClient from "@/components/AccountClient";

export default async function AccountPage() {
  // 1. Get the session using NextAuth's official method
  const session = await getServerSession(authOptions);

  // 2. If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // Pass session.user to your client component
  return <AccountClient user={session.user} />;
}
