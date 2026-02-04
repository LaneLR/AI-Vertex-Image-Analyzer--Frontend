import HistoryClient from "@/components/HistoryClient";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Scan History | ResaleIQ",
  description: "Review your scanned items.",
};

export default async function HistoryPage() {
    return (
      <Suspense fallback={<Loading />}>
        <HistoryClient />;
      </Suspense>
    );
}
