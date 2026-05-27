"use client";

import Image from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  applyImageStyle,
  DEFAULT_IMAGE_STYLE,
  useImageStyleModal,
  type StyleValues,
} from "@/framework/data/image/ImageStyleSettings";

type Position = { x: number; y: number };

function parseStyleData(raw: unknown): StyleValues | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as StyleValues;
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as StyleValues;
  } catch {
    return null;
  }
}

function parsePosition(x: unknown, y: unknown): Position | null {
  const px = typeof x === "number" ? x : x != null ? parseFloat(String(x)) : NaN;
  const py = typeof y === "number" ? y : y != null ? parseFloat(String(y)) : NaN;
  if (Number.isFinite(px) && Number.isFinite(py)) return { x: px, y: py };
  return null;
}

function styleObjectToString(style: React.CSSProperties): string {
  return Object.entries(style)
    .filter(([key, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (key === "width" || key === "height") return false;
      return true;
    })
    .map(([key, value]) => {
      const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebab}:${value}`;
    })
    .join("; ");
}

function findEditorRoot(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  return (el.closest(".tiptap-content") as HTMLElement | null) ?? (el.closest(".ProseMirror") as HTMLElement | null);
}

function ImageNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
}: NodeViewProps) {
  const { open } = useImageStyleModal();
  const stored = parseStyleData(node.attrs.styleData);
  const values: StyleValues = stored ?? DEFAULT_IMAGE_STYLE;
  const { imgStyle, overlayStyle } = applyImageStyle(values);

  const visualStyle: React.CSSProperties = {
    ...imgStyle,
    width: undefined,
    height: undefined,
  };

  const storedPosition = parsePosition(node.attrs.posX, node.attrs.posY);
  const [livePos, setLivePos] = useState<Position | null>(null);
  const effective = livePos ?? storedPosition;

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!effective) return;
    const imgEl = imgRef.current;
    const editorRoot = findEditorRoot(imgEl);
    if (!imgEl || !editorRoot) return;

    const grow = () => {
      const imgH = imgEl.offsetHeight;
      if (!imgH) return;
      const required = effective.y + imgH;
      const currentMin = parseFloat(editorRoot.style.minHeight || "0") || 0;
      if (required > currentMin) {
        editorRoot.style.minHeight = `${required}px`;
      }
    };

    if (imgEl.complete) {
      grow();
      return;
    }
    imgEl.addEventListener("load", grow, { once: true });
    return () => imgEl.removeEventListener("load", grow);
  }, [effective?.y]);

  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string | null) ?? "";
  const title = (node.attrs.title as string | null) ?? undefined;

  const showControls = editor.isEditable && selected;

  const handleEdit = () => {
    open({
      value: values,
      previewSrc: src,
      title: "Image style",
      onSave: (next) => updateAttributes({ styleData: next }),
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editor.isEditable) return;
    if (e.button !== 0) return;
    e.preventDefault();

    const imgEl = imgRef.current;
    const editorRoot = findEditorRoot(imgEl);

    let baseX: number;
    let baseY: number;
    if (storedPosition) {
      baseX = storedPosition.x;
      baseY = storedPosition.y;
    } else if (imgEl && editorRoot) {
      const imgRect = imgEl.getBoundingClientRect();
      const rootRect = editorRoot.getBoundingClientRect();
      baseX = imgRect.left - rootRect.left + editorRoot.scrollLeft;
      baseY = imgRect.top - rootRect.top + editorRoot.scrollTop;
    } else {
      baseX = 0;
      baseY = 0;
    }

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const clamp = (rawX: number, rawY: number): Position => {
      if (!imgEl || !editorRoot) return { x: rawX, y: rawY };
      const imgW = imgEl.offsetWidth;
      const maxX = Math.max(0, editorRoot.clientWidth - imgW);
      return {
        x: Math.min(maxX, Math.max(0, rawX)),
        y: Math.max(0, rawY),
      };
    };

    const onMove = (ev: MouseEvent) => {
      setLivePos(
        clamp(baseX + ev.clientX - startMouseX, baseY + ev.clientY - startMouseY)
      );
    };
    const onUp = (ev: MouseEvent) => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      const final = clamp(
        baseX + ev.clientX - startMouseX,
        baseY + ev.clientY - startMouseY
      );
      updateAttributes({ posX: final.x, posY: final.y });
      setLivePos(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const wrapperStyle: React.CSSProperties = effective
    ? {
        position: "absolute",
        left: `${effective.x}px`,
        top: `${effective.y}px`,
        zIndex: 10,
      }
    : {};

  const wrapperClassName = effective
    ? "inline-block max-w-full align-top"
    : "relative inline-block max-w-full my-2 align-top";

  return (
    <NodeViewWrapper className={wrapperClassName} style={wrapperStyle}>
      <span className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          title={title}
          draggable={false}
          onMouseDown={handleMouseDown}
          style={visualStyle}
          className={`max-w-full h-auto select-none ${
            editor.isEditable ? "cursor-move" : ""
          } ${selected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
        />
        {overlayStyle && (
          <span aria-hidden="true" style={overlayStyle as React.CSSProperties} />
        )}
        {showControls && (
          <div
            contentEditable={false}
            className="absolute top-1 right-1 z-10 flex items-center gap-1 bg-white/95 backdrop-blur shadow-md border border-gray-200 rounded-md px-1 py-0.5"
          >
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleEdit}
              title="Edit image style"
              aria-label="Edit image style"
              className="w-7 h-7 inline-flex items-center justify-center rounded text-gray-700 hover:bg-gray-100"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => deleteNode()}
              title="Remove image"
              aria-label="Remove image"
              className="w-7 h-7 inline-flex items-center justify-center rounded text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </span>
    </NodeViewWrapper>
  );
}

export const ImageWithStyle = Image.extend({
  draggable: false,
  addAttributes() {
    return {
      ...this.parent?.(),
      styleData: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("data-style");
          return parseStyleData(raw);
        },
        renderHTML: (attrs) => {
          const values = parseStyleData(attrs.styleData);
          if (!values) return {};
          const { imgStyle } = applyImageStyle(values);
          const styleString = styleObjectToString(imgStyle);
          return {
            "data-style": JSON.stringify(values),
            ...(styleString ? { style: styleString } : {}),
          };
        },
      },
      posX: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("data-pos-x");
          if (raw === null) return null;
          const v = parseFloat(raw);
          return Number.isFinite(v) ? v : null;
        },
        renderHTML: (attrs) => {
          const v = attrs.posX;
          if (v === null || v === undefined) return {};
          return { "data-pos-x": String(v) };
        },
      },
      posY: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("data-pos-y");
          if (raw === null) return null;
          const v = parseFloat(raw);
          return Number.isFinite(v) ? v : null;
        },
        renderHTML: (attrs) => {
          const pos = parsePosition(attrs.posX, attrs.posY);
          if (!pos) return {};
          return {
            "data-pos-y": String(pos.y),
            style: `position:absolute;left:${pos.x}px;top:${pos.y}px;z-index:10`,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
