"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { getApiUrl } from "@/lib/api-config";
import { useRouter } from "next/navigation";

interface AppContextRef {
  user: any;
  setUser: (user: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  dailyScansUsed: number;
  setDailyScansUsed: (val: number) => void;
  incrementScans: () => void;
  maxFreeScans: number;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextRef | undefined>(undefined);

export function AppProvider({
  children,
  initialScans = 0,
}: {
  children: ReactNode;
  initialScans?: number;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyScansUsed, setDailyScansUsed] = useState(initialScans);
  const router = useRouter();
  const maxFreeScans = 5;

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/auth/get-user"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setDailyScansUsed(0); 
    router.push("/login");
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user?.dailyScansCount !== undefined) {
      setDailyScansUsed(user.dailyScansCount);
    }
  }, [user]);

  const incrementScans = () => {
    setDailyScansUsed((prev) => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        dailyScansUsed,
        setDailyScansUsed,
        incrementScans,
        maxFreeScans,
        user,
        setUser,
        isLoading,
        refreshUser,
        logout,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp() must be used within an AppProvider");
  return context;
}
