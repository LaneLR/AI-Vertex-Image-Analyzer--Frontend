import Loading from "@/components/Loading";
import HelpClient from "../../components/HelpClient";
import { Suspense } from "react";

export const metadata = {
  title: "Help Center | ResaleIQ",
  description: "Troubleshooting and support for your AI resell companion.",
};

export default function HelpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HelpClient />;
    </Suspense>
  );}
