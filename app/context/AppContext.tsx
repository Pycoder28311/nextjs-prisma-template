"use client";

import { createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { User } from "@/config/types";
import fieldConfig from "@/config/fieldConfig";

export type LoadingStatus = "idle" | "loading" | "loaded" | "failed";

export type LoadingInfo = {
  model: string;
  operation: "create" | "read" | "update" | "delete";
  status: LoadingStatus;
  startedAt: number;
  durationMs: number | null;
};

export type AbsoluteModalSide = "top" | "bottom" | "left" | "right";
export type AbsoluteModalAlign = "start" | "center" | "end";

export type AbsoluteModalPosition = {
  relativeToButton?: boolean;
  anchor?: HTMLElement | null;
  side?: AbsoluteModalSide;
  align?: AbsoluteModalAlign;
  offset?: number;
  matchAnchorWidth?: boolean;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
};

export type OpenAbsoluteModalArgs = {
  component: React.ReactNode;
  position: AbsoluteModalPosition;
  id?: string;
  closeOnLeave?: boolean;
};

type AbsoluteModalEntry = {
  id: string;
  component: React.ReactNode;
  position: AbsoluteModalPosition;
  closeOnLeave: boolean;
};

function computeAbsoluteModalStyle(p: AbsoluteModalPosition): React.CSSProperties {
  const relative = p.relativeToButton ?? true;
  if (!relative || !p.anchor) {
    return { top: p.top, left: p.left, right: p.right, bottom: p.bottom };
  }
  const rect = p.anchor.getBoundingClientRect();
  const side = p.side ?? "bottom";
  const align = p.align ?? "start";
  const offset = p.offset ?? 4;
  const sx = window.scrollX;
  const sy = window.scrollY;
  const style: React.CSSProperties = {};
  const transforms: string[] = [];

  if (side === "bottom" || side === "top") {
    if (side === "bottom") {
      style.top = rect.bottom + sy + offset;
    } else {
      style.top = rect.top + sy - offset;
      transforms.push("translateY(-100%)");
    }
    if (align === "start") style.left = rect.left + sx;
    else if (align === "center") {
      style.left = rect.left + sx + rect.width / 2;
      transforms.push("translateX(-50%)");
    } else {
      style.left = rect.right + sx;
      transforms.push("translateX(-100%)");
    }
  } else {
    if (side === "right") {
      style.left = rect.right + sx + offset;
    } else {
      style.left = rect.left + sx - offset;
      transforms.push("translateX(-100%)");
    }
    if (align === "start") style.top = rect.top + sy;
    else if (align === "center") {
      style.top = rect.top + sy + rect.height / 2;
      transforms.push("translateY(-50%)");
    } else {
      style.top = rect.bottom + sy;
      transforms.push("translateY(-100%)");
    }
  }

  if (transforms.length) style.transform = transforms.join(" ");
  if (p.matchAnchorWidth) style.width = rect.width;
  return style;
}

function AbsoluteModalSlot({
  modal,
  cancelClose,
  closeSoon,
}: {
  modal: AbsoluteModalEntry;
  cancelClose: (id: string) => void;
  closeSoon: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [effectiveSide, setEffectiveSide] = useState<AbsoluteModalSide | undefined>(modal.position.side);
  const [shift, setShift] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const adjustedRef = useRef(false);
  const lastPositionRef = useRef(modal.position);

  if (lastPositionRef.current !== modal.position) {
    lastPositionRef.current = modal.position;
    adjustedRef.current = false;
    setEffectiveSide(modal.position.side);
    setShift({ x: 0, y: 0 });
  }

  const baseStyle = computeAbsoluteModalStyle({
    ...modal.position,
    side: effectiveSide,
  });

  const style: React.CSSProperties = { ...baseStyle };
  if (shift.x !== 0 || shift.y !== 0) {
    const base = typeof baseStyle.transform === "string" ? baseStyle.transform : "";
    style.transform = `${base} translate(${shift.x}px, ${shift.y}px)`.trim();
  }

  useLayoutEffect(() => {
    if (adjustedRef.current) return;
    const isAnchored = (modal.position.relativeToButton ?? true) && !!modal.position.anchor;
    if (!isAnchored) {
      adjustedRef.current = true;
      return;
    }
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const anchorRect = modal.position.anchor!.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const offset = modal.position.offset ?? 4;
    const currentSide = effectiveSide ?? "bottom";

    const sideOverflows = (s: AbsoluteModalSide) => {
      if (s === "right") return anchorRect.right + offset + w > vw - pad;
      if (s === "left") return anchorRect.left - offset - w < pad;
      if (s === "bottom") return anchorRect.bottom + offset + h > vh - pad;
      return anchorRect.top - offset - h < pad;
    };

    let side = currentSide;
    if (sideOverflows(currentSide)) {
      if (currentSide === "right" || currentSide === "left") {
        side = !sideOverflows("bottom") ? "bottom" : !sideOverflows("top") ? "top" : currentSide;
      } else if (currentSide === "bottom") {
        side = !sideOverflows("top") ? "top" : currentSide;
      } else {
        side = !sideOverflows("bottom") ? "bottom" : currentSide;
      }
    }

    if (side !== currentSide) {
      setEffectiveSide(side);
      setShift({ x: 0, y: 0 });
      return;
    }

    let shiftX = shift.x;
    let shiftY = shift.y;
    if (rect.left < pad) shiftX += pad - rect.left;
    else if (rect.right > vw - pad) shiftX += vw - pad - rect.right;
    if (rect.top < pad) shiftY += pad - rect.top;
    else if (rect.bottom > vh - pad) shiftY += vh - pad - rect.bottom;

    if (shiftX !== shift.x || shiftY !== shift.y) {
      setShift({ x: shiftX, y: shiftY });
    }
    adjustedRef.current = true;
  });

  useEffect(() => {
    const handler = () => {
      adjustedRef.current = false;
      setEffectiveSide(modal.position.side);
      setShift({ x: 0, y: 0 });
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [modal.position]);

  return (
    <div
      ref={ref}
      data-absolute-modal
      className="absolute z-[70]"
      style={style}
      onMouseEnter={modal.closeOnLeave ? () => cancelClose(modal.id) : undefined}
      onMouseLeave={modal.closeOnLeave ? () => closeSoon(modal.id) : undefined}
    >
      {modal.component}
    </div>
  );
}

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
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [absoluteModals, setAbsoluteModals] = useState<AbsoluteModalEntry[]>([]);
  const absoluteCloseTimers = useRef<Map<string, number>>(new Map());
  const absoluteIdCounter = useRef(0);
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

  const cancelCloseAbsoluteModal = (id: string) => {
    const t = absoluteCloseTimers.current.get(id);
    if (t !== undefined) {
      window.clearTimeout(t);
      absoluteCloseTimers.current.delete(id);
    }
  };

  const openAbsoluteModal = ({
    component,
    position,
    id,
    closeOnLeave,
  }: OpenAbsoluteModalArgs): string => {
    const modalId = id ?? `abs-modal-${++absoluteIdCounter.current}`;
    cancelCloseAbsoluteModal(modalId);
    setAbsoluteModals((prev) => {
      const without = prev.filter((m) => m.id !== modalId);
      return [...without, { id: modalId, component, position, closeOnLeave: closeOnLeave ?? false }];
    });
    return modalId;
  };

  const closeAbsoluteModal = (id?: string) => {
    if (id === undefined) {
      absoluteCloseTimers.current.forEach((t) => window.clearTimeout(t));
      absoluteCloseTimers.current.clear();
      setAbsoluteModals([]);
      return;
    }
    cancelCloseAbsoluteModal(id);
    setAbsoluteModals((prev) => prev.filter((m) => m.id !== id));
  };

  const closeAbsoluteModalSoon = (id: string, delay = 200) => {
    cancelCloseAbsoluteModal(id);
    const t = window.setTimeout(() => {
      setAbsoluteModals((prev) => prev.filter((m) => m.id !== id));
      absoluteCloseTimers.current.delete(id);
    }, delay);
    absoluteCloseTimers.current.set(id, t);
  };

  const isAbsoluteModalOpen = (id: string) => absoluteModals.some((m) => m.id === id);

  const hasAbsoluteModal = absoluteModals.length > 0;
  useEffect(() => {
    if (!hasAbsoluteModal) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-absolute-modal]")) return;
      if (target.closest("[data-absolute-modal-trigger]")) return;
      closeAbsoluteModal();
    };
    const attachId = window.setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    return () => {
      window.clearTimeout(attachId);
      document.removeEventListener("mousedown", handler);
    };
  }, [hasAbsoluteModal]);

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
      {absoluteModals.map((m) => (
        <AbsoluteModalSlot
          key={m.id}
          modal={m}
          cancelClose={cancelCloseAbsoluteModal}
          closeSoon={closeAbsoluteModalSoon}
        />
      ))}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export type UseAbsoluteModalArgs = {
  component: React.ReactNode;
  side?: AbsoluteModalSide;
  align?: AbsoluteModalAlign;
  offset?: number;
  matchAnchorWidth?: boolean;
  closeOnLeave?: boolean;
};

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
