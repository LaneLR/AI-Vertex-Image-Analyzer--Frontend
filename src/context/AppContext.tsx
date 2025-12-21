"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextRef {
  isSubscriber: boolean;
  setIsSubscriber: (val: boolean) => void;
  dailyScansUsed: number;
  incrementScans: () => void;
  maxFreeScans: number;
}

const AppContext = createContext<AppContextRef | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [dailyScansUsed, setDailyScansUsed] = useState(0);
  const maxFreeScans = 5;

  const incrementScans = () => {
    if (!isSubscriber) {
      setDailyScansUsed((prev) => Math.min(prev + 1, maxFreeScans));
    }
  };

  return (
    <AppContext.Provider value={{ isSubscriber, setIsSubscriber, dailyScansUsed, incrementScans, maxFreeScans }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}