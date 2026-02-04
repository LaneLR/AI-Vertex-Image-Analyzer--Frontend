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
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  deletionCountdown: number | null;
  setDeletionCountdown: (val: number | null) => void;
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [deletionCountdown, setDeletionCountdown] = useState<number | null>(null);
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
    if (user) {
      setDailyScansUsed(user.dailyScansCount ?? 0);
    }
  }, [user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUser();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [refreshUser]);

  useEffect(() => {
  if (user?.scheduledDeletionDate) {
    const end = new Date(user.scheduledDeletionDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    setDeletionCountdown(diff > 0 ? diff : 0);
  } else {
    setDeletionCountdown(null);
  }
}, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    const userTheme = user?.darkMode;
    const finalTheme = userTheme !== undefined ? userTheme : savedTheme;
    setIsDarkMode(finalTheme);

    if (finalTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
        isDarkMode, 
        setIsDarkMode,
        deletionCountdown,
        setDeletionCountdown,
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
