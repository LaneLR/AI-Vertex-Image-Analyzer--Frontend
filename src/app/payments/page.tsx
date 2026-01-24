import Loading from "@/components/Loading";
import PaymentsClient from "@/components/Payments";
import { Suspense } from "react";

export const metadata = {
  title: "Subscription | Flip Savvy",
  description: "Select or switch between subscriptions.",
};

export default function PaymentsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentsClient />;
    </Suspense>
  );}
