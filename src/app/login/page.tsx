import UnifiedAuthPage from "@/components/AuthPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  const hdrs = await headers();
  const userAgent = hdrs.get("user-agent") || "";
  const isMobileApp = userAgent.includes("FlipSavvy-Mobile-App");

  // Mobile logic handled by middleware, but double-check here for SSR edge cases
  if (isMobileApp) {
    if (session) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  }

  if (session) {
    redirect("/dashboard");
  }

  // Web: Unauthenticated users can see login page
  return <UnifiedAuthPage />;
}
