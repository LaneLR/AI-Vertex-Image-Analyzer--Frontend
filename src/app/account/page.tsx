import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path to where your authOptions are
import { redirect } from "next/navigation";
import AccountClient from "@/components/AccountClient";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <AccountClient user={session.user} />;
}
