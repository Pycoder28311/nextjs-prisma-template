"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type { User } from "@/framework/types";
import fieldConfig from "@/config/fieldConfig";
import { useFixedModalState } from "./FixedModal";
import {
  useAbsoluteModalState,
  type OpenAbsoluteModalArgs,
  type UseAbsoluteModalArgs,
} from "./AbsoluteModal";

export type {
  AbsoluteModalSide,
  AbsoluteModalAlign,
  AbsoluteModalPosition,
  OpenAbsoluteModalArgs,
  UseAbsoluteModalArgs,
} from "./AbsoluteModal";

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
  openAbsoluteModal: (args: OpenAbsoluteModalArgs) => string;
  closeAbsoluteModal: (id?: string) => void;
  closeAbsoluteModalSoon: (id: string, delay?: number) => void;
  cancelCloseAbsoluteModal: (id: string) => void;
  isAbsoluteModalOpen: (id: string) => boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [prismaFields, setPrismaFields] = useState<Record<string, any[]>>({});
  const [tableLoadings, setTableLoadings] = useState<Record<string, LoadingInfo>>({});
  const [tableRecords, setTableRecordsState] = useState<Record<string, any[]>>({});
  const [tableDeletingId, setTableDeletingIdState] = useState<Record<string, (number | string)[]>>({});

  const { openModal, closeModal, modalNode } = useFixedModalState();
  const {
    openAbsoluteModal,
    closeAbsoluteModal,
    closeAbsoluteModalSoon,
    cancelCloseAbsoluteModal,
    isAbsoluteModalOpen,
    modalsNode: absoluteModalsNode,
  } = useAbsoluteModalState();

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
    <AppContext.Provider value={{ isMobile, user, setUser, prismaFields, extendField, openModal, closeModal, openAbsoluteModal, closeAbsoluteModal, closeAbsoluteModalSoon, cancelCloseAbsoluteModal, isAbsoluteModalOpen, tableLoadings, setTableLoading, tableRecords, setTableRecords, updateTableRecords, tableDeletingId, setTableDeletingId }}>
      {children}
      {modalNode}
      {absoluteModalsNode}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function useAbsoluteModal<T extends HTMLElement = HTMLButtonElement>() {
  const id = useId();
  const triggerRef = useRef<T | null>(null);
  const {
    openAbsoluteModal,
    closeAbsoluteModal,
    closeAbsoluteModalSoon,
    cancelCloseAbsoluteModal,
    isAbsoluteModalOpen,
  } = useApp();

  const open = ({ component, side, align, offset, matchAnchorWidth, closeOnLeave }: UseAbsoluteModalArgs) => {
    openAbsoluteModal({
      id,
      component,
      closeOnLeave,
      position: { anchor: triggerRef.current, side, align, offset, matchAnchorWidth },
    });
  };

  const close = () => closeAbsoluteModal(id);
  const closeSoon = (delay?: number) => closeAbsoluteModalSoon(id, delay);
  const cancelClose = () => cancelCloseAbsoluteModal(id);
  const isOpen = isAbsoluteModalOpen(id);
  const toggle = (args: UseAbsoluteModalArgs) => {
    if (isAbsoluteModalOpen(id)) close();
    else open(args);
  };

  return {
    id,
    isOpen,
    open,
    close,
    closeSoon,
    cancelClose,
    toggle,
    triggerRef,
    triggerProps: {
      ref: triggerRef,
      "data-absolute-modal-trigger": "" as const,
    },
  };
}
