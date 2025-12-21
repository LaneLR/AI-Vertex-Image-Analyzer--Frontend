import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/main.scss";

export const metadata: Metadata = {
  title: "Flip Finder | AI Thrift Appraisal",
  description: "Identify and value thrift finds instantly with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="global">
      <body>
        <AppProvider>
          <Header />
          <div>{children}</div>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}