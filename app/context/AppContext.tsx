"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";
import fieldConfig from "@/config/fieldConfig";

export type LoadingStatus = "idle" | "loading" | "loaded" | "failed";

export type LoadingInfo = {
  model: string;
  operation: "create" | "read" | "update" | "delete";
  status: LoadingStatus;
  startedAt: number;
  durationMs: number | null;
};

type AppContextType = {
  isMobile: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  prismaFields: Record<string, any[]>;
  extendField: (table: string, field: string, props: Record<string, any>) => void;
  openModal: (content: React.ReactNode, title?: string) => void;
  closeModal: () => void;
  tableLoadings: Record<string, LoadingInfo>;
  setTableLoading: (table: string, info: LoadingInfo) => void;
  tableRecords: Record<string, any[]>;
  setTableRecords: (table: string, records: any[]) => void;
  updateTableRecords: (table: string, updater: (prev: any[]) => any[]) => void;
  tableDeletingId: Record<string, (number | string)[]>;
  setTableDeletingId: (table: string, id: number | string, add: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [prismaFields, setPrismaFields] = useState<Record<string, any[]>>({});
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [tableLoadings, setTableLoadings] = useState<Record<string, LoadingInfo>>({});
  const [tableRecords, setTableRecordsState] = useState<Record<string, any[]>>({});
  const [tableDeletingId, setTableDeletingIdState] = useState<Record<string, (number | string)[]>>({});

  const setTableLoading = (table: string, info: LoadingInfo) =>
    setTableLoadings((prev) => ({ ...prev, [table]: info }));

  const setTableRecords = (table: string, records: any[]) =>
    setTableRecordsState((prev) => ({ ...prev, [table]: records }));

  const updateTableRecords = (table: string, updater: (prev: any[]) => any[]) =>
    setTableRecordsState((prev) => ({ ...prev, [table]: updater(prev[table] ?? []) }));

  const setTableDeletingId = (table: string, id: number | string, add: boolean) =>
    setTableDeletingIdState((prev) => {
      const current = prev[table] ?? [];
      return {
        ...prev,
        [table]: add ? [...current, id] : current.filter((x) => x !== id),
      };
    });

  const openModal = (content: React.ReactNode, title?: string) => {
    setModalContent(content);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalTitle(undefined);
  };

  const extendField = (table: string, field: string, props: Record<string, any>) => {
    setPrismaFields((prev) => {
      const fields = prev[table] ?? [];
      const idx = fields.findIndex((f) => f.name === field);
      if (idx === -1) return prev;
      const updated = [...fields];
      updated[idx] = { ...updated[idx], ...props };
      return { ...prev, [table]: updated };
    });
  };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
    fetch("/api/prisma-fields")
      .then((res) => res.json())
      .then((data: Record<string, any[]>) => {
        const merged: Record<string, any[]> = {};
        for (const [table, fields] of Object.entries(data)) {
          merged[table] = fields.map((f) => ({
            ...f,
            ...(fieldConfig[table]?.[f.name] ?? {}),
          }));
        }
        setPrismaFields(merged);
      });
  }, []);

  return (
    <AppContext.Provider value={{ isMobile, user, setUser, prismaFields, extendField, openModal, closeModal, tableLoadings, setTableLoading, tableRecords, setTableRecords, updateTableRecords, tableDeletingId, setTableDeletingId }}>
      {children}
      {modalContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">{modalTitle ?? ""}</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5">{modalContent}</div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
