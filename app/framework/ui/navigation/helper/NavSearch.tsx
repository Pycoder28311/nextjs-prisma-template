"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp, useAbsoluteModal } from "@/framework/ui/context/AppContext";
import Text from "@/framework/ui/iconText/Text";

export type SearchResult = {
  id: string | number;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  group?: string;
  icon?: ReactNode;
  badge?: string;
};

type Props = {
  placeholder?: string;
  results?: SearchResult[];
  onSearch?: (query: string) => void;
  className?: string;
  iconMode?: boolean;
};

function ResultItem({ item, onClose }: { item: SearchResult; onClose: () => void }) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
      {item.icon && (
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-base">
          {item.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.label}</p>
        {item.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
        )}
      </div>
      {item.badge && (
        <Text
          value={item.badge}
          size="very small"
          className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0"
        />
      )}
    </div>
  );

  if (item.href) return <Link href={item.href} onClick={onClose}>{inner}</Link>;
  return <div onClick={() => { item.onClick?.(); onClose(); }} role={item.onClick ? "button" : undefined}>{inner}</div>;
}

export default function NavSearch({ placeholder = "Search...", results: externalResults, onSearch, className, iconMode = false }: Props) {
  const { tableRecords, prismaFields } = useApp();
  const modal = useAbsoluteModal<HTMLDivElement>();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(!iconMode);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => { setOpen(false); setQuery(""); if (iconMode) setExpanded(false); modal.close(); };
  const clear = () => { setQuery(""); onSearch?.(""); inputRef.current?.focus(); };
  const openExpanded = () => { setExpanded(true); setTimeout(() => inputRef.current?.focus(), 50); };

  // Collapse the field on outside click. The dropdown lives in the AbsoluteModal
  // (which closes itself), so we ignore clicks inside it or on the trigger.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (modal.triggerRef.current?.contains(t)) return;
      if (t.closest("[data-absolute-modal]")) return;
      setOpen(false);
      if (iconMode) { setExpanded(false); setQuery(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [iconMode, modal.triggerRef]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        if (iconMode) { setExpanded(false); setQuery(""); }
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [iconMode]);

  const internalResults: SearchResult[] = [];
  if (!externalResults && query.trim().length > 0) {
    const q = query.toLowerCase();
    for (const [table, records] of Object.entries(tableRecords)) {
      const fields = prismaFields[table] ?? [];
      const labelField = fields.find((f) => f.kind === "scalar" && f.name !== "id" && f.type === "String")?.name;
      if (!labelField) continue;
      for (const record of records as Record<string, any>[]) {
        const val = record[labelField];
        if (val && String(val).toLowerCase().includes(q)) {
          internalResults.push({ id: record.id, label: String(val), description: `ID: ${record.id}`, badge: table, group: table });
        }
      }
    }
  }

  const results = externalResults ?? internalResults;
  const showDropdown = open && query.trim().length > 0;
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    const g = r.group ?? "Results";
    (acc[g] ??= []).push(r);
    return acc;
  }, {});

  const dropdown = (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <Text icon="search" size="big" className="text-gray-300" />
          <Text
            size="small"
            className="text-gray-400"
            value={<>No results for <span className="font-medium text-gray-600">&ldquo;{query}&rdquo;</span></>}
          />
        </div>
      ) : (
        <div className="py-2">
          {Object.entries(grouped).map(([group, items], gi) => (
            <div key={group}>
              {(gi > 0 || Object.keys(grouped).length > 1) && (
                <div className={`px-4 ${gi > 0 ? "pt-3 mt-1 border-t border-gray-100" : "pt-2"} pb-1`}>
                  <Text value={group} size="very small" className="font-semibold text-gray-400 uppercase tracking-wider capitalize" />
                </div>
              )}
              {items.map((item) => <ResultItem key={item.id} item={item} onClose={close} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Keep the dropdown content live as the query/results change while open.
  useEffect(() => {
    if (showDropdown) {
      modal.open({ component: dropdown, side: "bottom", align: "start", offset: 8, matchAnchorWidth: true });
    } else {
      modal.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDropdown, query, results.length, externalResults]);

  if (iconMode) {
    return (
      <div className={`relative w-9 h-9 ${className ?? ""}`}>
        <button
          type="button"
          onClick={openExpanded}
          aria-label="Search"
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${expanded ? "opacity-0 pointer-events-none" : ""}`}
        >
          <Text icon="search" size="medium" className="text-gray-600" />
        </button>

        {expanded && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
            <div
              {...modal.triggerProps}
              className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white ring-2 ring-blue-400 shadow-sm"
            >
              <Text icon="search" size="small" className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                className="w-44 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
              {query && (
                <button type="button" onClick={clear} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <Text icon="close" size="very small" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-56 ${className ?? ""}`}>
      <div
        {...modal.triggerProps}
        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all"
      >
        <Text icon="search" size="small" className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="flex-1 min-w-0 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
        />
        {query && (
          <button type="button" onClick={clear} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <Text icon="close" size="very small" />
          </button>
        )}
      </div>
    </div>
  );
}
