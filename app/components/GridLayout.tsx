"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

type GridSpec = `${number}x${number}`;
type Layout = "one-column" | "one-row" | GridSpec;

type Props = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  layout?: Layout;
  table?: string;
};

function resolveGrid(layout: Layout): React.CSSProperties & { className: string } {
  if (layout === "one-column") {
    return { className: "flex flex-col gap-3" };
  }
  if (layout === "one-row") {
    return { className: "flex flex-row gap-3 overflow-x-auto" };
  }
  const [rows, cols] = layout.split("x").map(Number);
  return {
    className: "grid gap-3",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, auto)`,
  };
}

export default function GridLayout({ children, title, className = "", layout = "one-column", table }: Props) {
  const { tableLoadings } = useApp();
  const { className: gridClass, ...gridStyle } = resolveGrid(layout);

  const tableLoading = table ? tableLoadings[table] : undefined;

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-3">
        {title && <h2 className="text-lg font-semibold text-gray-700">{title}</h2>}
        {tableLoading && (
          <span className="text-xs text-gray-400 font-mono">
            [{tableLoading.status}] {tableLoading.operation} on <strong>{tableLoading.model}</strong>
            {tableLoading.durationMs != null && ` — ${tableLoading.durationMs}ms`}
          </span>
        )}
      </div>
      <div className={gridClass} style={gridStyle}>
        {children}
      </div>
    </div>
  );
}
