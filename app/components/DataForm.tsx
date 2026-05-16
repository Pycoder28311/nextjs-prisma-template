"use client";

import { useEffect, useRef, useState } from "react";
import { createRecord, readRecords, type CrudState } from "@/utils/crud";
import EditInput from "@/components/EditInput";
import CrudButton from "@/components/CrudButton";
import { useApp } from "@/context/AppContext";
import { tableConfig, DEFAULT_IGNORED_FIELDS } from "@/config/fieldConfig";
import CustomSelect from "@/components/CustomSelect";

function FkSelect({
  field,
  label,
  parentKey,
  value,
  onChange,
}: {
  field: string;
  label?: string;
  parentKey: string;
  value: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
}) {
  const { tableRecords, tableLoadings, setTableLoading, setTableRecords, prismaFields } = useApp();

  useEffect(() => {
    const status = tableLoadings[parentKey]?.status;
    if (status === "loading" || status === "loaded" || status === "failed") return;
    readRecords(parentKey, undefined, undefined, (s) => {
      setTableLoading(parentKey, s.loading);
      if (s.result) setTableRecords(parentKey, s.result);
    });
  }, [parentKey]);

  const records = (tableRecords[parentKey] ?? []) as Array<Record<string, any>>;
  const parentFields = prismaFields[parentKey] ?? [];
  const labelField =
    parentFields.find((f) => f.kind === "scalar" && f.name !== "id" && f.type === "String")?.name ?? "id";

  const selected = value && value !== 0 ? [value as string | number] : [];
  const options = records.map((r) => ({ value: r.id as string | number, label: String(r[labelField] ?? r.id) }));

  return (
    <CustomSelect
      options={options}
      selected={selected}
      onChange={(sel) => onChange(sel[0] ?? 0)}
      max={1}
      label={label ?? field}
      placeholder={`Select ${label ?? field}...`}
    />
  );
}

function defaultForType(type: string): string | number | boolean {
  if (type === "Int" || type === "Float") return 0;
  if (type === "Boolean") return false;
  return "";
}

function isEmpty(value: string | number | boolean, type: string): boolean {
  if (type === "String") return value === "";
  if (type === "Int" || type === "Float") return value === "" || isNaN(Number(value));
  return false;
}

type ChildInstance = { id: number; data: Record<string, any> };

type Props = {
  table: string;
  onSuccess?: (result: any) => void;
  closeOnSuccess?: boolean;
  onData?: (data: Record<string, any>) => void;
};

function DataFormFields({ table, onSuccess, closeOnSuccess = true, onData }: Props) {
  const { prismaFields, closeModal } = useApp();
  const instanceCounter = useRef(0);

  const ignoredFields = [...DEFAULT_IGNORED_FIELDS, ...(tableConfig[table]?.ignoredFields ?? [])];
  const allFields = prismaFields[table] ?? [];

  const fkMeta = new Map<string, { parentKey: string; label?: string }>();
  for (const f of allFields.filter((f) => f.kind !== "scalar")) {
    for (const fkName of (f.relationFromFields as string[]) ?? []) {
      const parentKey = (f.type as string)[0].toLowerCase() + (f.type as string).slice(1);
      fkMeta.set(fkName, { parentKey, label: f.label });
    }
  }

  const fkFields = new Set(fkMeta.keys());

  const schemaFields = allFields.filter(
    (f) => f.kind === "scalar" && !ignoredFields.includes(f.name) && !(onData && fkFields.has(f.name))
  );
  const childFields = onData ? [] : allFields.filter((f) => f.kind !== "scalar" && f.relationType === "child");
  const buildInitialValues = (fields: typeof schemaFields) =>
    Object.fromEntries(fields.map((f) => [f.name, defaultForType(f.type)]));

  const [values, setValues] = useState<Record<string, string | number | boolean>>({});
  const [childInstances, setChildInstances] = useState<Record<string, ChildInstance[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<CrudState<any>>({
    result: undefined,
    loading: { model: table, operation: "create", status: "idle", startedAt: 0, durationMs: null },
  });

  useEffect(() => {
    if (schemaFields.length > 0) {
      const initial = buildInitialValues(schemaFields);
      setValues(initial);
      onData?.(initial);
    }
  }, [table, prismaFields]);

  const updateField = (field: string) => (v: string | number | boolean) => {
    const next = { ...values, [field]: v };
    setValues(next);
    setErrors((prev) => ({ ...prev, [field]: "" }));
    onData?.(next);
  };

  const addChild = (fieldName: string) => {
    const id = instanceCounter.current++;
    setChildInstances((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] ?? []), { id, data: {} }],
    }));
  };

  const removeChild = (fieldName: string, id: number) => {
    setChildInstances((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] ?? []).filter((inst) => inst.id !== id),
    }));
  };

  const updateChildData = (fieldName: string, id: number, data: Record<string, any>) => {
    setChildInstances((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] ?? []).map((inst) =>
        inst.id === id ? { ...inst, data } : inst
      ),
    }));
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

  const buildBody = () => {
    const body: Record<string, any> = { ...values };
    for (const f of childFields) {
      const instances = childInstances[f.name] ?? [];
      if (instances.length > 0) {
        const dataArr = instances.map((inst) => inst.data);
        body[f.name] = { create: f.isList ? dataArr : dataArr[0] };
      }
    }
    return body;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await createRecord(table, buildBody(), (s) => {
      setState(s);
      if (s.result) {
        onSuccess?.(s.result);
        if (closeOnSuccess) closeModal();
        const initial = buildInitialValues(schemaFields);
        setValues(initial);
        setChildInstances({});
        setErrors({});
        onData?.(initial);
      }
    });
  };

  const { status, durationMs } = state.loading;

  if (schemaFields.length === 0 && childFields.length === 0)
    return <p className="text-sm text-gray-400 animate-pulse">Loading fields...</p>;

  return (
    <div className="flex flex-col gap-4">
      {schemaFields.map((f) => {
        const fk = fkMeta.get(f.name);
        if (fk) {
          return (
            <FkSelect
              key={f.name}
              field={f.name}
              label={fk.label}
              parentKey={fk.parentKey}
              value={values[f.name] ?? 0}
              onChange={updateField(f.name)}
            />
          );
        }
        return (
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
        );
      })}

      {childFields.map((f) => {
        const childTable = f.type[0].toLowerCase() + f.type.slice(1);
        const instances = childInstances[f.name] ?? [];
        return (
          <div key={f.name} className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{f.label ?? f.name}</p>
              <button
                type="button"
                onClick={() => addChild(f.name)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add {f.label ?? f.name}
              </button>
            </div>
            {instances.map((inst) => (
              <div key={inst.id} className="border border-gray-100 rounded-lg p-3 flex flex-col gap-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeChild(f.name, inst.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <DataFormFields
                  table={childTable}
                  closeOnSuccess={false}
                  onData={(data) => updateChildData(f.name, inst.id, data)}
                />
              </div>
            ))}
          </div>
        );
      })}

      {!onData && (
        <div className="flex items-center gap-3 pt-1">
          <CrudButton type="create" table={table} onClick={handleSubmit} loading={status === "loading"} />
          {durationMs != null && (
            <span className="text-xs text-gray-400">[{status}] {durationMs}ms</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function DataForm({ table, onSuccess }: Omit<Props, "closeOnSuccess" | "onData">) {
  const { openModal } = useApp();

  return (
    <CrudButton
      type="create"
      table={table}
      onClick={() => openModal(<DataFormFields table={table} onSuccess={onSuccess} />, `New ${table}`)}
    />
  );
}
