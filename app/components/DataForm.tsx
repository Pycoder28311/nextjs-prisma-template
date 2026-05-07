"use client";

import { useEffect, useState } from "react";
import { createRecord, type CrudState } from "@/lib/crud";
import EditInput from "@/components/EditInput";
import CrudButton from "@/components/CrudButton";
import { useApp } from "@/context/AppContext";

function defaultForType(type: string): string | number | boolean {
  if (type === "Int" || type === "Float") return 0;
  if (type === "Boolean") return false;
  return "";
}

function isAutoField(f: any): boolean {
  return f.isId || f.hasDefaultValue || f.isUpdatedAt || f.isGenerated || f.kind !== "scalar";
}

function isEmpty(value: string | number | boolean, type: string): boolean {
  if (type === "String") return value === "";
  if (type === "Int" || type === "Float") return value === "" || isNaN(Number(value));
  return false;
}

type Props = {
  table: string;
  onSuccess?: (result: any) => void;
};

function DataFormFields({ table, onSuccess }: Props) {
  const { prismaFields, closeModal } = useApp();
  console.log("Prisma Fields:", prismaFields);

  const schemaFields = (prismaFields[table] ?? []).filter((f) => !isAutoField(f));

  const buildInitialValues = (fields: typeof schemaFields) =>
    Object.fromEntries(fields.map((f) => [f.name, defaultForType(f.type)]));

  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<CrudState<any>>({
    result: undefined,
    loading: { model: table, operation: "create", status: "idle", startedAt: 0, durationMs: null },
  });

  useEffect(() => {
    if (schemaFields.length > 0) setValues(buildInitialValues(schemaFields));
  }, [table, prismaFields]);

  const updateField = (field: string) => (v: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [field]: v }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    for (const f of schemaFields) {
      if (f.isRequired && isEmpty(values[f.name], f.type)) {
        newErrors[f.name] = `${f.label ?? f.name} is required`;
      }
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await createRecord(table, values, (s) => {
      setState(s);
      if (s.result) {
        onSuccess?.(s.result);
        closeModal();
        setValues(buildInitialValues(schemaFields));
        setErrors({});
      }
    });
  };

  const { status, durationMs } = state.loading;

  if (schemaFields.length === 0)
    return <p className="text-sm text-gray-400 animate-pulse">Loading fields...</p>;

  return (
    <div className="flex flex-col gap-4">
      {schemaFields.map((f) => (
        <EditInput
          key={f.name}
          value={values[f.name] ?? defaultForType(f.type)}
          updateValue={updateField(f.name)}
          table={table}
          field={f.name}
          id={0}
          isEditing={false}
          error={errors[f.name]}
        />
      ))}
      <div className="flex items-center gap-3 pt-1">
        <CrudButton type="create" table={table} onClick={handleSubmit} loading={status === "loading"} />
        {durationMs != null && (
          <span className="text-xs text-gray-400">[{status}] {durationMs}ms</span>
        )}
      </div>
    </div>
  );
}

export default function DataForm({ table, onSuccess }: Props) {
  const { openModal } = useApp();

  return (
    <CrudButton
      type="create"
      table={table}
      onClick={() => openModal(<DataFormFields table={table} onSuccess={onSuccess} />, `New ${table}`)}
    />
  );
}
