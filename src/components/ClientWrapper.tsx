"use client";

import { AppProvider, useApp } from "@/context/AppContext";
import Header from "@/components/Header";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const { user } = useApp(); // Get user from our new custom context

  return (
    <AppProvider>
      <div className="main-content-wrapper">{children}</div>
      <Header />
    </AppProvider>
  );
}
