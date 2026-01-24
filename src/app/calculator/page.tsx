import CalculatorClient from "@/components/CalculatorClient";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Profit Calculator | Flip Savvy",
  description: "Calculate your earnings and profit margins.",
};

export default function CalculatorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CalculatorClient />;
    </Suspense>
  );
}
