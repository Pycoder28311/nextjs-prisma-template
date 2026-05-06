"use client";

import { useState } from "react";
import { updateRecords, type CrudState } from "@/lib/crud";
import { useApp } from "@/context/AppContext";

export type FieldType = "String" | "Int" | "Float" | "Boolean" | "DateTime" | "Json";

type Props = {
  value: string | number | boolean;
  table: string;
  field: string;
  id: number | string;
  onUpdate?: (state: CrudState<any>) => void;
};

function coerce(raw: string | boolean, fieldType: FieldType): string | number | boolean {
  if (fieldType === "Int") return parseInt(raw as string, 10);
  if (fieldType === "Float") return parseFloat(raw as string);
  if (fieldType === "Boolean") return raw as boolean;
  return raw as string;
}

function displayValue(value: string | number | boolean, fieldType: FieldType): string {
  if (fieldType === "Boolean") return value ? "true" : "false";
  if (fieldType === "DateTime") return new Date(value as string).toLocaleString();
  return String(value);
}

export default function EditInput({ value, table, field, id, onUpdate }: Props) {
  const { prismaFields } = useApp();
  const fieldType: FieldType = (prismaFields[table]?.find((f) => f.name === field)?.type as FieldType) ?? "String";

  const toEditable = (v: string | number | boolean) =>
    fieldType === "DateTime" ? new Date(v as string).toISOString().slice(0, 16) : (v as string | boolean);

  const [saved, setSaved] = useState<string | number | boolean>(value);
  const [current, setCurrent] = useState<string | boolean>(toEditable(value));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (current !== toEditable(saved)) {
      setSaving(true);
      await updateRecords(
        table,
        { id },
        { [field]: coerce(current, fieldType) },
        (state) => {
          if (state.loading.status === "loaded") setSaved(coerce(current, fieldType));
          onUpdate?.(state);
        },
      );
      setSaving(false);
    }
    setEditing(false);
  };

  const handleEdit = () => {
    setCurrent(toEditable(saved));
    setEditing(true);
  };

  if (!editing) {
    return (
      <span>
        {displayValue(saved, fieldType)}
        <button onClick={handleEdit}>Edit</button>
      </span>
    );
  }

  const inputEl = (() => {
    if (fieldType === "Boolean") {
      return (
        <input
          type="checkbox"
          checked={current as boolean}
          onChange={(e) => setCurrent(e.target.checked)}
          autoFocus
        />
      );
    }
    if (fieldType === "DateTime") {
      return (
        <input
          type="datetime-local"
          value={current as string}
          onChange={(e) => setCurrent(e.target.value)}
          autoFocus
        />
      );
    }
    if (fieldType === "Int" || fieldType === "Float") {
      return (
        <input
          type="number"
          step={fieldType === "Float" ? "any" : "1"}
          value={current as string}
          onChange={(e) => setCurrent(e.target.value)}
          autoFocus
        />
      );
    }
    if (fieldType === "Json") {
      return (
        <textarea
          value={current as string}
          onChange={(e) => setCurrent(e.target.value)}
          autoFocus
        />
      );
    }
    return (
      <input
        type="text"
        value={current as string}
        onChange={(e) => setCurrent(e.target.value)}
        autoFocus
      />
    );
  })();

  return (
    <span>
      {inputEl}
      <button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
    </span>
  );
}
