"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";

export type LoadingStatus = "idle" | "loading" | "loaded" | "failed";

export type LoadingInfo = {
  model: string;
  operation: "create" | "read" | "update" | "delete";
  status: LoadingStatus;
  startedAt: number;
  durationMs: number | null;
} | null;

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: LoadingInfo;
  setLoading: (info: LoadingInfo) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingInfo>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
