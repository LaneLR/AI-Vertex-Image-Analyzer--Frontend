"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AppContextRef {
  dailyScansUsed: number;
  setDailyScansUsed: (val: number) => void;
  incrementScans: () => void;
  maxFreeScans: number;
}

const AppContext = createContext<AppContextRef | undefined>(undefined);

export function AppProvider({ children, initialScans = 0 }: { children: ReactNode, initialScans?: number }) {
  const [dailyScansUsed, setDailyScansUsed] = useState(initialScans);
  const maxFreeScans = 5;

  useEffect(() => {
    setDailyScansUsed(initialScans);
  }, [initialScans]);

  const incrementScans = () => {
    setDailyScansUsed((prev) => prev + 1);
  };

  return (
    <AppContext.Provider value={{ dailyScansUsed, setDailyScansUsed, incrementScans, maxFreeScans }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}