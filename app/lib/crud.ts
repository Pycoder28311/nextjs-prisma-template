import type { Dispatch, SetStateAction } from "react";
import type { LoadingInfo } from "@/context/AppContext";
import { applyOperation } from "@/lib/stateUpdater";

async function request(url: string, method: string, body?: object) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  return res.json();
}

type WithId = { id: number | string };
type Operation = NonNullable<LoadingInfo>["operation"];

function startLoading(
  model: string,
  operation: Operation,
  onLoading?: (info: LoadingInfo) => void
): number {
  const startedAt = Date.now();
  onLoading?.({ model, operation, status: "loading", startedAt, durationMs: null });
  return startedAt;
}

function endLoading(
  model: string,
  operation: Operation,
  startedAt: number,
  status: "loaded" | "failed",
  onLoading?: (info: LoadingInfo) => void
) {
  onLoading?.({ model, operation, status, startedAt, durationMs: Date.now() - startedAt });
}

export async function createRecord<T extends WithId>(
  model: string,
  data: object,
  setState?: Dispatch<SetStateAction<T[]>>,
  onSuccess?: (result: T) => void,
  check?: () => boolean,
  onLoading?: (info: LoadingInfo) => void
) {
  if (check && !check()) return;
  const startedAt = startLoading(model, "create", onLoading);
  try {
    const result = await request(`/api/${model}/create`, "POST", data);
    endLoading(model, "create", startedAt, "loaded", onLoading);
    if (setState) applyOperation("create", setState, result);
    onSuccess?.(result);
    return result;
  } catch {
    endLoading(model, "create", startedAt, "failed", onLoading);
  }
}

export async function readRecords<T extends WithId>(
  model: string,
  where?: object,
  select?: object,
  setState?: Dispatch<SetStateAction<T[]>>,
  onSuccess?: (result: T[]) => void,
  check?: () => boolean,
  onLoading?: (info: LoadingInfo) => void
) {
  if (check && !check()) return;
  const startedAt = startLoading(model, "read", onLoading);
  try {
    const result = await request(`/api/${model}/read`, "POST", { where, select });
    endLoading(model, "read", startedAt, "loaded", onLoading);
    if (setState) applyOperation("read", setState, result);
    onSuccess?.(result);
    return result;
  } catch {
    endLoading(model, "read", startedAt, "failed", onLoading);
  }
}

export async function updateRecords<T extends WithId>(
  model: string,
  where: object,
  data: object,
  setState?: Dispatch<SetStateAction<T[]>>,
  onSuccess?: (result: any) => void,
  check?: () => boolean,
  onLoading?: (info: LoadingInfo) => void
) {
  if (check && !check()) return;
  const startedAt = startLoading(model, "update", onLoading);
  try {
    const result = await request(`/api/${model}/update`, "PATCH", { where, data });
    endLoading(model, "update", startedAt, "loaded", onLoading);
    if (setState) applyOperation("update", setState, { ...data, ...(where as object) } as T);
    onSuccess?.(result);
    return result;
  } catch {
    endLoading(model, "update", startedAt, "failed", onLoading);
  }
}

export async function deleteRecords<T extends WithId>(
  model: string,
  where: object,
  setState?: Dispatch<SetStateAction<T[]>>,
  onSuccess?: (result: any) => void,
  check?: () => boolean,
  onLoading?: (info: LoadingInfo) => void
) {
  if (check && !check()) return;
  const startedAt = startLoading(model, "delete", onLoading);
  try {
    const result = await request(`/api/${model}/delete`, "DELETE", { where });
    endLoading(model, "delete", startedAt, "loaded", onLoading);
    if (setState) applyOperation("delete", setState, where as Pick<T, "id">);
    onSuccess?.(result);
    return result;
  } catch {
    endLoading(model, "delete", startedAt, "failed", onLoading);
  }
}
