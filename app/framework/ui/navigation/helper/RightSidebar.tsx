"use client";

import { useEffect, type ReactNode } from "react";
import Text from "@/framework/ui/iconText/Text";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  side?: "left" | "right";
};

export default function RightSidebar({ open, onClose, title = "Menu", children, side = "right" }: Props) {
  const isLeft = side === "left";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-40" />}

      <div
        className={`fixed top-0 z-50 h-full w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isLeft ? "left-0" : "right-0"
        } ${
          open ? "translate-x-0" : isLeft ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            <Text value={title} size="medium" />
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Text icon="close" size="small" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </>
  );
}
