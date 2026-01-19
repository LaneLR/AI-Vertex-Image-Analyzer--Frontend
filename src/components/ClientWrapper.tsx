"use client";

import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Header />
      <div>{children}</div>
      {/* <Footer /> */}
    </AppProvider>
  );
}
