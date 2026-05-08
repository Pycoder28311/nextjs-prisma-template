"use client";

import { useEffect, useRef } from "react";
import { readRecords, deleteRecords, updateRecords, type CrudState } from "./crud";
import { useApp, type LoadingInfo } from "@/context/AppContext";

type WithId = { id: number | string };

export function useTable<T extends WithId>(model: string, filter?: object, select?: object) {
  const { tableRecords, setTableRecords, updateTableRecords, tableLoadings, setTableLoading, tableDeletingId, setTableDeletingId, prismaFields } = useApp();

  const key = model.charAt(0).toLowerCase() + model.slice(1);

  const records = (tableRecords[key] ?? []) as T[];
  const recordsRef = useRef(records);
  recordsRef.current = records;
  const loading: LoadingInfo = tableLoadings[key] ?? {
    model: key,
    operation: "read",
    status: "idle",
    startedAt: 0,
    durationMs: null,
  };

  const syncLoading = (info: LoadingInfo) => setTableLoading(key, info);

  useEffect(() => {
    const status = tableLoadings[key]?.status;
    if (status === "loading" || status === "loaded" || status === "failed") return;
    readRecords<T>(model, filter, select, (s) => {
      syncLoading(s.loading);
      if (s.result) setTableRecords(key, s.result);
    });
  }, [key, filter, select]);

  const append = (item: T) => {
    updateTableRecords(key, (prev) => [...prev, item]);

    const relationFields = (prismaFields[key] ?? []).filter((f) => f.kind !== "scalar");
    for (const f of relationFields) {
      const nested = (item as any)[f.name];
      if (!nested) continue;
      const childKey = (f.type as string)[0].toLowerCase() + (f.type as string).slice(1);
      const childArr: any[] = Array.isArray(nested) ? nested : [nested];
      if (childArr.length > 0)
        updateTableRecords(childKey, (prev) => [...prev, ...childArr]);
    }
  };

  const remove = async (id: number | string) => {
    setTableDeletingId(key, id, true);
    await deleteRecords<T>(model, { id }, (s) => {
      syncLoading(s.loading);
      if (s.loading.status === "loaded") {
        updateTableRecords(key, (prev) => prev.filter((item) => item.id !== id));

        const relationFields = (prismaFields[key] ?? []).filter((f) => f.kind !== "scalar");
        for (const f of relationFields) {
          const childKey = (f.type as string)[0].toLowerCase() + (f.type as string).slice(1);
          const childFields = prismaFields[childKey] ?? [];
          const backRef = childFields.find(
            (cf) => cf.kind !== "scalar" &&
              (cf.type as string).toLowerCase() === key.toLowerCase() &&
              cf.relationFromFields?.length > 0
          );
          const fkField = backRef?.relationFromFields?.[0];
          if (fkField) {
            updateTableRecords(childKey, (prev) => prev.filter((child) => child[fkField] !== id));
          }
        }
      }
      if (s.loading.status === "loaded" || s.loading.status === "failed")
        setTableDeletingId(key, id, false);
    });
  };

  const update = async (id: number | string, data: object) => {
    await updateRecords<T>(model, { id }, data, (s) => {
      syncLoading(s.loading);
      if (s.result)
        updateTableRecords(key, (prev) => prev.map((item) => item.id === id ? s.result! : item));
    });
  };

  const isDeletingId = (id: number | string) => (tableDeletingId[key] ?? []).includes(id);

  const reorderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reorder = (fromIndex: number, toIndex: number) => {
    updateTableRecords(key, (prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    if (reorderTimerRef.current != null) clearTimeout(reorderTimerRef.current);
    reorderTimerRef.current = setTimeout(() => {
      const ids = recordsRef.current.map((r) => r.id);
      fetch(`/api/${key}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }).catch(() => {});
    }, 400);
  };

  const state: CrudState<T[]> = { result: records, loading };

  return { state, records, loading, append, remove, update, isDeletingId, reorder };
}
