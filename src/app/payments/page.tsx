import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SubscribeButton from "@/components/Payments";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // if (session?.user?.subscriptionStatus === "basic" || session?.user?.paymentProvider !== "stripe") {
  //   redirect("/account");
  // }

  return <SubscribeButton user={session.user} />;
}
