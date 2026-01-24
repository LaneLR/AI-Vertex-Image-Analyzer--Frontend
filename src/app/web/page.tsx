import Loading from "@/components/Loading";
import WebHome from "@/components/WebHomepageClient";
import { Suspense } from "react";

export default function WebPage() {
  return (
    <Suspense fallback={<Loading />}>
      <WebHome />;
    </Suspense>
  );}
