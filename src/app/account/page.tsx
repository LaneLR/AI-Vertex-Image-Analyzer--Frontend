"use client";
import { useApp } from "@/context/AppContext";
import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  History, 
  ChevronRight, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { isSubscriber, setIsSubscriber, dailyScansUsed, maxFreeScans } = useApp();

  // Mock Recent Searches Data
  const recentSearches = [
    { id: 1, item: "Vintage Levi's 501", price: "$45-60", date: "2h ago" },
    { id: 2, item: "Nike Air Max 97", price: "$110-140", date: "Yesterday" },
    { id: 3, item: "Pyrex Butterfly Gold", price: "$25-40", date: "Dec 18" },
  ];

  return (
    <main className="min-h-screen bg-[#000000] text-[#F4F4F5] font-sans pb-20">
      
      {/* HEADER */}
      <nav className="flex items-center p-6 max-w-lg mx-auto border-b border-[#F4F4F5]/10">
        <Link href="/" className="p-2 -ml-2 hover:bg-[#F4F4F5]/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black tracking-tighter uppercase ml-4">Account</h1>
      </nav>

      <div className="max-w-md mx-auto p-6 space-y-8">
        
        {/* PROFILE SECTION */}
        <div className="flex items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-[#3387b7] flex items-center justify-center border-2 border-[#F4F4F5]/20">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ThriftHunter_99</h2>
            <p className="text-sm text-[#F4F4F5]/60">Joined December 2025</p>
          </div>
        </div>
        <button 
         onClick={() => setIsSubscriber(!isSubscriber)}
         className="bg-[#ff6000] p-4 rounded-xl font-bold"
       >
         {isSubscriber ? "DEMO: Switch to Free" : "UPGRADE TO PRO"}
       </button>
       
       {!isSubscriber && (
         <p>Scans left: {maxFreeScans - dailyScansUsed}</p>
       )}

        {/* SUBSCRIPTION STATUS CARD */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F4F4F5]/40">Your Plan</h3>
          
          <div className={`rounded-2xl p-5 border ${isSubscriber ? 'border-[#3387b7] bg-[#3387b7]/5' : 'border-[#ff6000] bg-[#ff6000]/5'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isSubscriber ? 'bg-[#3387b7] text-white' : 'bg-[#ff6000] text-white'}`}>
                  {isSubscriber ? 'Pro Member' : 'Free Tier'}
                </span>
                <p className="mt-2 text-lg font-bold">
                  {isSubscriber ? 'Unlimited Scanning' : 'Standard Access'}
                </p>
              </div>
              <Zap className={`w-6 h-6 ${isSubscriber ? 'text-[#3387b7]' : 'text-[#ff6000]'}`} />
            </div>

            {/* DAILY USAGE METER (Only for non-subscribers) */}
            {!isSubscriber && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Daily Scans Remaining</span>
                  <span className="text-[#ff6000]">{maxFreeScans - dailyScansUsed} / {maxFreeScans}</span>
                </div>
                <div className="w-full h-2 bg-[#F4F4F5]/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#ff6000] transition-all duration-1000" 
                    style={{ width: `${(dailyScansUsed / maxFreeScans) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-[#F4F4F5]/40 italic">Resets at midnight</p>
                
                <button className="w-full mt-4 bg-[#ff6000] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  UPGRADE TO UNLIMITED
                </button>
              </div>
            )}

            {isSubscriber && (
              <button className="w-full mt-4 border border-[#F4F4F5]/20 text-[#F4F4F5] py-3 rounded-xl font-bold text-sm hover:bg-[#F4F4F5]/5 transition-all">
                MANAGE BILLING
              </button>
            )}
          </div>
        </section>

        {/* RECENT SEARCHES */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F4F4F5]/40">Recent History</h3>
            <button className="text-[10px] font-bold text-[#3387b7]">VIEW ALL</button>
          </div>
          
          <div className="bg-[#F4F4F5]/5 rounded-2xl overflow-hidden divide-y divide-[#F4F4F5]/10 border border-[#F4F4F5]/10">
            {recentSearches.map((search) => (
              <div key={search.id} className="p-4 flex justify-between items-center hover:bg-[#F4F4F5]/5 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F4F4F5]/10 flex items-center justify-center">
                    <History className="w-5 h-5 opacity-40" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{search.item}</p>
                    <p className="text-[10px] text-[#F4F4F5]/40 uppercase tracking-wider">{search.date}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3387b7]">{search.price}</span>
                  <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LOG OUT BUTTON */}
        <button className="w-full py-4 text-sm font-bold text-[#ff6000]/60 hover:text-[#ff6000] transition-colors">
          Log Out
        </button>
      </div>
    </main>
  );
}