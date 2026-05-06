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
};

type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  prismaFields: Record<string, { name: string; type: string }[]>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [prismaFields, setPrismaFields] = useState<Record<string, { name: string; type: string }[]>>({});

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
    fetch("/api/prisma-fields")
      .then((res) => res.json())
      .then(setPrismaFields);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, prismaFields }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
