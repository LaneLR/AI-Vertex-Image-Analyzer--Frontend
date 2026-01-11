import SettingsClient from "@/components/SettingsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("[settings/page.tsx] No session found. Redirecting to /login.");
    redirect("/login");
  }

  console.log(`[settings/page.tsx] Session verified for: ${session.user?.email}. Rendering SettingsClient.`);

  return <SettingsClient user={session.user} />;
}