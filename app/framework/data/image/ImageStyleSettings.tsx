"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/framework/ui/context/AppContext";

export type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export type StyleValues = {
  blur: number;
  overlayColor: string | null;
  objectFit: ObjectFit;
  positionX: number;
  positionY: number;
  rotate: number;
};

export const DEFAULT_IMAGE_STYLE: StyleValues = {
  blur: 0,
  overlayColor: null,
  objectFit: "cover",
  positionX: 50,
  positionY: 50,
  rotate: 0,
};

const OBJECT_FIT_OPTIONS: ObjectFit[] = ["cover", "contain", "fill", "none", "scale-down"];

// ---------- Helpers ----------

function clampInt(raw: number, min: number, max: number, fallback: number): number {
  if (Number.isNaN(raw) || !Number.isFinite(raw)) return fallback;
  return Math.min(max, Math.max(min, Math.round(raw)));
}

/**
 * Convert a value the panel handles (which may be a full 8-digit hex like
 * "#rrggbbaa") to the 6-digit hex the native <input type="color"> expects.
 */
function toColorInputValue(color: string | null): string {
  if (!color) return "#000000";
  // Accept "#rgb", "#rrggbb", "#rrggbbaa"
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  if (/^#[0-9a-fA-F]{8}$/.test(color)) return color.slice(0, 7);
  if (/^#[0-9a-fA-F]{3}$/.test(color)) {
    const r = color[1], g = color[2], b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#000000";
}

/**
 * Compute CSS styles for an `<img>` and an overlay `<div>` from the style
 * values. Consumers can spread these onto their own elements.
 */
export function applyImageStyle(values: StyleValues): {
  imgStyle: React.CSSProperties;
  overlayStyle: React.CSSProperties | null;
} {
  const imgStyle: React.CSSProperties = {
    filter: values.blur > 0 ? `blur(${values.blur}px)` : undefined,
    objectFit: values.objectFit,
    objectPosition: `${values.positionX}% ${values.positionY}%`,
    transform: values.rotate ? `rotate(${values.rotate}deg)` : undefined,
    width: "100%",
    height: "100%",
  };

  const overlayStyle: React.CSSProperties | null = values.overlayColor
    ? {
        position: "absolute",
        inset: 0,
        backgroundColor: values.overlayColor,
        opacity: 0.25,
        pointerEvents: "none",
      }
    : null;

  return { imgStyle, overlayStyle };
}

/**
 * Replace the binary contents of an existing image. Throws on failure.
 */
export async function replaceImageFile(id: number, file: File): Promise<void> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`/api/images/replace/${id}`, { method: "PATCH", body });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to replace image (HTTP ${res.status})`);
  }
}

/**
 * PATCH an existing image's style fields. Throws on failure so the caller can
 * decide how to surface the error (e.g. via useAlert).
 */
export async function saveImageStyle(id: number, values: StyleValues): Promise<void> {
  const res = await fetch("/api/image/update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      where: { id },
      data: {
        blur: values.blur,
        overlayColor: values.overlayColor,
        objectFit: values.objectFit,
        positionX: values.positionX,
        positionY: values.positionY,
        rotate: values.rotate,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to update image style (HTTP ${res.status})`);
  }
}

// ---------- Sub-components ----------

const labelClass = "text-sm font-medium text-gray-700";
const rangeClass =
  "w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600";
const sectionClass = "flex flex-col gap-1.5";

function SliderRow({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className={sectionClass}>
      <div className="flex items-center justify-between">
        <label className={labelClass}>{label}</label>
        <span className="text-xs tabular-nums text-gray-500">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clampInt(Number(e.target.value), min, max, value))}
        className={rangeClass}
      />
    </div>
  );
}

// ---------- Panel ----------

type PanelProps = {
  value: StyleValues;
  onChange: (next: StyleValues) => void;
  previewSrc?: string;
};

export function ImageStyleSettingsPanel({ value, onChange, previewSrc }: PanelProps) {
  const set = <K extends keyof StyleValues>(key: K, v: StyleValues[K]) =>
    onChange({ ...value, [key]: v });

  const { imgStyle, overlayStyle } = applyImageStyle(value);

  return (
    <div className="flex flex-col gap-4">
      {previewSrc && (
        <div className="relative w-full h-48 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="Style preview"
            style={imgStyle}
            className="block"
          />
          {overlayStyle && <div style={overlayStyle} />}
        </div>
      )}

      <SliderRow
        label="Blur"
        value={value.blur}
        min={0}
        max={20}
        suffix="px"
        onChange={(v) => set("blur", v)}
      />

      <SliderRow
        label="Position X"
        value={value.positionX}
        min={0}
        max={100}
        suffix="%"
        onChange={(v) => set("positionX", v)}
      />

      <SliderRow
        label="Position Y"
        value={value.positionY}
        min={0}
        max={100}
        suffix="%"
        onChange={(v) => set("positionY", v)}
      />

      <SliderRow
        label="Rotate"
        value={value.rotate}
        min={0}
        max={360}
        suffix="°"
        onChange={(v) => set("rotate", v)}
      />

      <div className={sectionClass}>
        <label className={labelClass}>Object fit</label>
        <select
          value={value.objectFit}
          onChange={(e) => set("objectFit", e.target.value as ObjectFit)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        >
          {OBJECT_FIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className={sectionClass}>
        <label className={labelClass}>Overlay color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={toColorInputValue(value.overlayColor)}
            onChange={(e) => set("overlayColor", e.target.value)}
            className="h-9 w-12 border border-gray-300 rounded cursor-pointer bg-white p-0.5"
          />
          <input
            type="text"
            value={value.overlayColor ?? ""}
            placeholder="#rrggbbaa (or empty)"
            onChange={(e) => {
              const next = e.target.value.trim();
              set("overlayColor", next === "" ? null : next);
            }}
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => set("overlayColor", null)}
            disabled={value.overlayColor === null}
            className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Leave empty for no overlay. Accepts #rgb, #rrggbb, or #rrggbbaa.
        </p>
      </div>
    </div>
  );
}

// ---------- Modal hook & button ----------

type OpenArgs = {
  value: StyleValues;
  onSave: (values: StyleValues, newFile?: File | null) => void;
  previewSrc?: string;
  title?: string;
  allowFileReplace?: boolean;
};

function ImageStyleModalBody({
  initial,
  previewSrc,
  allowFileReplace,
  onSave,
  onCancel,
}: {
  initial: StyleValues;
  previewSrc?: string;
  allowFileReplace?: boolean;
  onSave: (values: StyleValues, newFile?: File | null) => void;
  onCancel: () => void;
}) {
  const [current, setCurrent] = useState<StyleValues>(initial);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFileUrl, setNewFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!newFile) {
      setNewFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(newFile);
    setNewFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newFile]);

  const effectivePreview = newFileUrl ?? previewSrc;

  return (
    <div className="flex flex-col gap-5">
      {allowFileReplace && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Replace image file</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
              className="text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />
            {newFile && (
              <button
                type="button"
                onClick={() => setNewFile(null)}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
      <ImageStyleSettingsPanel
        value={current}
        onChange={setCurrent}
        previewSrc={effectivePreview}
      />
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            setCurrent(DEFAULT_IMAGE_STYLE);
            setNewFile(null);
          }}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(current, newFile)}
          className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/**
 * Hook that returns an `open` function which mounts the style panel inside the
 * project's fixed modal (via `useApp().openModal`). On Save the modal closes
 * and the provided `onSave` callback receives the final values.
 */
export function useImageStyleModal() {
  const { openModal, closeModal } = useApp();

  const open = ({
    value,
    onSave,
    previewSrc,
    title = "Image style",
    allowFileReplace,
  }: OpenArgs) => {
    const node: ReactNode = (
      <ImageStyleModalBody
        initial={value}
        previewSrc={previewSrc}
        allowFileReplace={allowFileReplace}
        onCancel={closeModal}
        onSave={(values, newFile) => {
          onSave(values, newFile);
          closeModal();
        }}
      />
    );
    openModal(node, title);
  };

  return { open };
}

/**
 * Convenience button that opens the style modal when clicked. Useful when a
 * consumer just wants to render a trigger next to a file input or thumbnail.
 */
export function ImageStyleModalButton({
  value,
  onSave,
  previewSrc,
  label = "Style",
  title,
  className,
  disabled,
}: {
  value: StyleValues;
  onSave: (values: StyleValues) => void;
  previewSrc?: string;
  label?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { open } = useImageStyleModal();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => open({ value, onSave, previewSrc, title })}
      className={
        className ??
        "px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}
