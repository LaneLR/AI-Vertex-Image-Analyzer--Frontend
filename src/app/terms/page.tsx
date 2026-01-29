import { Suspense } from "react";
import TermsClient from "../../components/TermsClient";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Terms of Service | ThriftSavvy",
  description:
    "Read the rules, guidelines, and AI disclaimers for using ThriftSavvy.",
};

export default function TermsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TermsClient />;
    </Suspense>
  );}
