

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HistoryClient from "@/components/HistoryClient";

export default async function HistoryPage() {
  // 1. Get the session using NextAuth
  const session = await getServerSession(authOptions);

  // 2. Security Check: Only logged-in users can see history
  if (!session || !session.user) {
    redirect("/login");
  }

  // 3. Return the UI.
  return <HistoryClient user={session.user} />;
}

