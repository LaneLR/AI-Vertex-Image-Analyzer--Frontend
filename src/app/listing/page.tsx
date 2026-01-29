import GenerateListingClient from "@/components/GenerateListingClient";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export const metadata = {
  title: "Listing Studio | ThriftSavvy",
  description: "Generate SEO-optimized content and listing photos.",
};

export default function ListingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GenerateListingClient />;
    </Suspense>
  );}
