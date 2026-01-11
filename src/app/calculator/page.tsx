import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CalculatorClient from "@/components/CalculatorClient";
import SearchHistory from "@/lib/models/SearchHistory";

export default async function CalculatorPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session?.user?.subscriptionStatus === "basic") {
    redirect("/account");
  }

  const rawHistory = await SearchHistory.findAll({
    where: { userId: session.user.id },
    order: [["created_at", "DESC"]],
  });

  const history = rawHistory.map((item) => {
    const plainItem = item.get({ plain: true });
    
    const prices = plainItem.priceRange.match(/\d+/g)?.map(Number) || [0, 0];

    return {
      id: plainItem.id.toString(),
      title: plainItem.itemTitle,
      lowResellValue: prices[0] || 0,
      highResellValue: prices[1] || prices[0] || 0,
      estimatedShipping: 10, // Default fallback
      imageUrl: plainItem.imageUrl || null,
    };
  });

  return <CalculatorClient history={history} />;
}