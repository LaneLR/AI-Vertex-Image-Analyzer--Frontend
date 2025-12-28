import UnifiedAuthPage from "@/components/AuthPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // If NextAuth session exists, redirect to home immediately
  if (session) {
    console.log("[login/page.tsx] Session found. Redirecting to home.");
    redirect("/");
  }

  console.log("[login/page.tsx] No session found. Rendering UnifiedAuthPage.");
  return <UnifiedAuthPage />;
}