import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/main.scss";
import ClientWrapper from "../components/ClientWrapper";

export const metadata: Metadata = {
  title: "Flip Finder | AI Thrift Appraisal",
  description: "Identify and value thrift finds instantly with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="global">
      <body>
        {/* We move the AppProvider and Header logic into a ClientWrapper */}
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}