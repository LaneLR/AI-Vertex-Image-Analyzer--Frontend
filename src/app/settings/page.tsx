"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Sparkles, 
  Eye, 
  Smartphone,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  // Toggle States
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <main className="min-h-screen bg-[#000000] text-[#F4F4F5] font-sans pb-20">
      
      {/* HEADER */}
      <nav className="flex items-center p-6 max-w-lg mx-auto border-b border-[#F4F4F5]/10">
        <Link href="/account" className="p-2 -ml-2 hover:bg-[#F4F4F5]/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-black tracking-tighter uppercase ml-4 text-[#F4F4F5]">Settings</h1>
      </nav>

      <div className="max-w-md mx-auto p-6 space-y-8">
        
        {/* AI ENGINE SETTINGS */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F4F4F5]/40 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#ff6000]" /> AI Engine Configuration
          </h3>
          
          <div className="bg-[#F4F4F5]/5 rounded-2xl border border-[#F4F4F5]/10 overflow-hidden">
            {/* Toggle Row: High Accuracy */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3387b7]/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#3387b7]" />
                </div>
                <div>
                  <p className="font-bold text-sm">High Accuracy Mode</p>
                  <p className="text-[10px] text-[#F4F4F5]/40">Uses advanced visual tiling</p>
                </div>
              </div>
              <button 
                onClick={() => setHighAccuracy(!highAccuracy)}
                className={`w-12 h-6 rounded-full transition-colors relative ${highAccuracy ? 'bg-[#ff6000]' : 'bg-[#F4F4F5]/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${highAccuracy ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Toggle Row: Save History */}
            <div className="p-4 flex items-center justify-between border-t border-[#F4F4F5]/10">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F4F4F5]/10 flex items-center justify-center">
                  <Database className="w-5 h-5 opacity-60" />
                </div>
                <div>
                  <p className="font-bold text-sm">Cloud Save History</p>
                  <p className="text-[10px] text-[#F4F4F5]/40">Keep logs of all scanned items</p>
                </div>
              </div>
              <button 
                onClick={() => setSaveHistory(!saveHistory)}
                className={`w-12 h-6 rounded-full transition-colors relative ${saveHistory ? 'bg-[#3387b7]' : 'bg-[#F4F4F5]/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${saveHistory ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#F4F4F5]/40">Preferences</h3>
          <div className="bg-[#F4F4F5]/5 rounded-2xl border border-[#F4F4F5]/10 divide-y divide-[#F4F4F5]/10 text-sm font-bold">
            
            <div className="p-4 flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 opacity-40" />
                <span>Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20" />
            </div>

            <div className="p-4 flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 opacity-40" />
                <span>Data & Privacy</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20" />
            </div>

            <div className="p-4 flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 opacity-40" />
                <span>App Version</span>
              </div>
              <span className="text-[10px] font-black text-[#3387b7]">V 1.0.4</span>
            </div>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="pt-4">
          <button className="w-full py-4 rounded-2xl border border-red-500/30 text-red-500 text-sm font-bold hover:bg-red-500/10 transition-colors uppercase tracking-widest">
            Delete All History
          </button>
        </section>

      </div>
    </main>
  );
}