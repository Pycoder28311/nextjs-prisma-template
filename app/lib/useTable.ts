"use client";

import { useEffect } from "react";
import { readRecords, deleteRecords, updateRecords, type CrudState } from "./crud";
import { useApp, type LoadingInfo } from "@/context/AppContext";

type WithId = { id: number | string };

export function useTable<T extends WithId>(model: string, filter?: object, select?: object) {
  const { tableRecords, setTableRecords, updateTableRecords, tableLoadings, setTableLoading, tableDeletingId, setTableDeletingId } = useApp();

  const records = (tableRecords[model] ?? []) as T[];
  const loading: LoadingInfo = tableLoadings[model] ?? {
    model,
    operation: "read",
    status: "idle",
    startedAt: 0,
    durationMs: null,
  };

  const syncLoading = (info: LoadingInfo) => setTableLoading(model, info);

  useEffect(() => {
    const status = tableLoadings[model]?.status;
    if (status === "loading" || status === "loaded" || status === "failed") return;
    readRecords<T>(model, filter, select, (s) => {
      syncLoading(s.loading);
      if (s.result) setTableRecords(model, s.result);
    });
  }, [model, filter, select]);

  const append = (item: T) =>
    updateTableRecords(model, (prev) => [...prev, item]);

  const remove = async (id: number | string) => {
    setTableDeletingId(model, id, true);
    await deleteRecords<T>(model, { id }, (s) => {
      syncLoading(s.loading);
      if (s.loading.status === "loaded")
        updateTableRecords(model, (prev) => prev.filter((item) => item.id !== id));
      if (s.loading.status === "loaded" || s.loading.status === "failed")
        setTableDeletingId(model, id, false);
    });
  };

  const update = async (id: number | string, data: object) => {
    await updateRecords<T>(model, { id }, data, (s) => {
      syncLoading(s.loading);
      if (s.result)
        updateTableRecords(model, (prev) => prev.map((item) => item.id === id ? s.result! : item));
    });
  };

  const isDeletingId = (id: number | string) => (tableDeletingId[model] ?? []).includes(id);

  const state: CrudState<T[]> = { result: records, loading };

  return { state, records, loading, append, remove, update, isDeletingId };
}
