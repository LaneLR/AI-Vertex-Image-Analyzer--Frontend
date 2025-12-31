import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HistoryClient from "@/components/HistoryClient";
import GenerateListingClient from "@/components/GenerateListingClient";

export default async function ListingPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return <GenerateListingClient user={session.user} />;
}

