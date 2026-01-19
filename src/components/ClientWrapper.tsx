"use client";

import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ClientWrapperProps {
  children: React.ReactNode;
  user: any;
}

export default function ClientWrapper({ children, user }: ClientWrapperProps){
  return (
    <AppProvider>
      <div>{children}</div>
      {/* <Footer /> */}
      <Header user={user}/>
    </AppProvider>
  );
}
