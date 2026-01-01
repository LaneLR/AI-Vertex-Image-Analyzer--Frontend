import { getServerSession } from "next-auth";
import HelpClient from "../../components/HelpClient";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Help Center | Flip Finder",
  description: "Guides, troubleshooting, and support for your AI thrift companion.",
};

export default async function HelpPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("[account/page.tsx] No session found. Redirecting to /login.");
    redirect("/login");
  }
  

  return <HelpClient user={session.user} />;
}