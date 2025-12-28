import SettingsClient from "@/components/SettingsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default async function SettingsPage() {
  // 1. Get the session using NextAuth
  // const { data: session } = useSession();
  const session = await getServerSession(authOptions);

  // 2. Security Check: Only logged-in users can see settings
  if (!session) {
    console.log("[settings/page.tsx] No session found. Redirecting to /login.");
    redirect("/login");
  }

  console.log(`[settings/page.tsx] Session verified for: ${session.user?.email}. Rendering SettingsClient.`);

  // 3. Return the UI.
  // You can pass session.user to SettingsClient if it needs the user's email or ID.
  return <SettingsClient user={session.user} />;
}