import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/main.scss";
import ClientWrapper from "../components/ClientWrapper";
// 1. Remove this line: import { SessionProvider } from "next-auth/react";
// 2. Import your custom provider instead
import Providers from "@/components/SessionProvider"; 

export const metadata: Metadata = {
  title: "Flip Finder | AI Thrift Appraisal",
  description: "Identify and value thrift finds instantly with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="global">
      <body>
        {/* 3. Wrap everything in your custom Providers component */}
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}