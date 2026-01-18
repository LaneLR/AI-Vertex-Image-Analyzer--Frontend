import { getServerSession } from "next-auth";
import HelpClient from "../../components/HelpClient";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Help Center | Flip Savvy",
  description: "Troubleshooting, and support for your AI thrift companion.",
};

export default async function HelpPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  

  return <HelpClient user={session.user} />;
}