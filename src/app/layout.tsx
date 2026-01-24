import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/main.scss";
import ClientWrapper from "../components/ClientWrapper";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "FlipSavvy | AI Thrift Appraisal",
  description: "Identify and value thrift finds instantly with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="global" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true' || (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
          <AppProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </AppProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
