"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontFamily } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { useApp } from "@/framework/ui/context/AppContext";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Highlighter,
  X,
} from "lucide-react";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number | string;
};

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Default", value: "" },
  { label: "Sans serif", value: "Arial, Helvetica, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "'Courier New', ui-monospace, monospace" },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Comic Sans", value: "'Comic Sans MS', cursive" },
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`w-8 h-8 flex items-center justify-center rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-200 mx-0.5 self-center" />;
}

function LinkDialog({
  initialLabel,
  initialHref,
  onSave,
  onCancel,
}: {
  initialLabel: string;
  initialHref: string;
  onSave: (label: string, href: string) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initialLabel);
  const [href, setHref] = useState(initialHref);

  const submit = () => {
    const trimmedHref = href.trim();
    if (!trimmedHref) return;
    onSave(label.trim(), trimmedHref);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Text to display</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Link text"
          autoFocus
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">URL</label>
        <input
          type="url"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="https://example.com"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!href.trim()}
          className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Insert
        </button>
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const { openModal, closeModal } = useApp();

  const currentHeading = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : "p";

  const currentFont = (editor.getAttributes("textStyle").fontFamily as string) ?? "";

  const setHeading = (v: string) => {
    if (v === "p") editor.chain().focus().setParagraph().run();
    else
      editor
        .chain()
        .focus()
        .toggleHeading({ level: Number(v.slice(1)) as 1 | 2 | 3 })
        .run();
  };

  const setFont = (v: string) => {
    if (v === "") editor.chain().focus().unsetFontFamily().run();
    else editor.chain().focus().setFontFamily(v).run();
  };

  const openLinkModal = () => {
    const { from, to, empty } = editor.state.selection;
    const inLink = editor.isActive("link");
    const currentHref = (editor.getAttributes("link").href as string) ?? "";

    let initialLabel = "";
    let labelFrom = from;
    let labelTo = to;

    if (inLink) {
      // Expand range to the full link mark so we can read its full text.
      const $pos = editor.state.doc.resolve(from);
      const linkMark = $pos.marks().find((m) => m.type.name === "link");
      if (linkMark) {
        let start = from;
        let end = to;
        while (start > 0 && editor.state.doc.rangeHasMark(start - 1, start, linkMark.type)) start--;
        while (
          end < editor.state.doc.content.size &&
          editor.state.doc.rangeHasMark(end, end + 1, linkMark.type)
        )
          end++;
        labelFrom = start;
        labelTo = end;
        initialLabel = editor.state.doc.textBetween(start, end, " ");
      }
    } else if (!empty) {
      initialLabel = editor.state.doc.textBetween(from, to, " ");
    }

    openModal(
      <LinkDialog
        initialLabel={initialLabel}
        initialHref={currentHref}
        onCancel={closeModal}
        onSave={(label, href) => {
          const text = label || href;
          const linkNode = {
            type: "text" as const,
            text,
            marks: [{ type: "link", attrs: { href } }],
          };

          if (inLink) {
            editor
              .chain()
              .focus()
              .setTextSelection({ from: labelFrom, to: labelTo })
              .deleteSelection()
              .insertContent(linkNode)
              .run();
          } else if (!empty) {
            if (label && label !== initialLabel) {
              editor
                .chain()
                .focus()
                .deleteRange({ from, to })
                .insertContent(linkNode)
                .run();
            } else {
              editor
                .chain()
                .focus()
                .setTextSelection({ from, to })
                .setLink({ href })
                .run();
            }
          } else {
            editor.chain().focus().insertContent(linkNode).run();
          }

          closeModal();
        }}
      />,
      "Insert link"
    );
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-white">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        label="Undo"
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        label="Redo"
      >
        <Redo2 size={16} />
      </ToolbarButton>

      <Divider />

      <select
        value={currentFont}
        onChange={(e) => setFont(e.target.value)}
        className="h-8 text-sm border border-gray-200 rounded px-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-[8rem]"
        aria-label="Font family"
        style={{ fontFamily: currentFont || undefined }}
      >
        {FONT_OPTIONS.map((opt) => (
          <option key={opt.label} value={opt.value} style={{ fontFamily: opt.value || undefined }}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={currentHeading}
        onChange={(e) => setHeading(e.target.value)}
        className="h-8 text-sm border border-gray-200 rounded px-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Text style"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        label="Bold"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        label="Italic"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        label="Underline"
      >
        <Underline size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        label="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      <Divider />

      <label
        className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 cursor-pointer text-gray-700"
        title="Text color"
      >
        <span className="text-xs font-bold leading-none">A</span>
        <span
          className="absolute bottom-1 left-1.5 right-1.5 h-0.5"
          style={{
            backgroundColor:
              (editor.getAttributes("textStyle").color as string) ?? "#000000",
          }}
        />
        <input
          type="color"
          value={(editor.getAttributes("textStyle").color as string) ?? "#000000"}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Pick text color"
        />
      </label>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
        label="Highlight"
      >
        <Highlighter size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        label="Align left"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        label="Align center"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        label="Align right"
      >
        <AlignRight size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
        label="Justify"
      >
        <AlignJustify size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        label="Bullet list"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        label="Numbered list"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        label="Quote"
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        label="Code block"
      >
        <Code size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        label="Horizontal rule"
      >
        <Minus size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={openLinkModal} active={editor.isActive("link")} label="Link">
        <LinkIcon size={16} />
      </ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  minHeight = 240,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontFamily,
      Color,
      Highlight,
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "tiptap-content focus:outline-none px-4 py-3",
        "data-placeholder": placeholder ?? "",
      },
    },
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [hoveredLink, setHoveredLink] = useState<{
    el: HTMLAnchorElement;
    rect: DOMRect;
  } | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setHoveredLink(null), 150);
  }, [cancelClose]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !editor) return;

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (link && wrapper.contains(link)) {
        cancelClose();
        setHoveredLink({ el: link, rect: link.getBoundingClientRect() });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || (!link.contains(related) && !related.closest?.("[data-link-remove]"))) {
        scheduleClose();
      }
    };

    const clear = () => setHoveredLink(null);

    wrapper.addEventListener("mouseover", onMouseOver);
    wrapper.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("resize", clear);
    return () => {
      wrapper.removeEventListener("mouseover", onMouseOver);
      wrapper.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", clear, true);
      window.removeEventListener("resize", clear);
    };
  }, [editor, cancelClose, scheduleClose]);

  const removeHoveredLink = () => {
    if (!editor || !hoveredLink) return;
    const pos = editor.view.posAtDOM(hoveredLink.el, 0);
    if (pos == null || pos < 0) return;
    editor
      .chain()
      .focus()
      .setTextSelection(pos)
      .extendMarkRange("link")
      .unsetLink()
      .run();
    setHoveredLink(null);
  };

  if (!editor) return null;

  return (
    <>
      <div
        ref={wrapperRef}
        className={`border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col ${className ?? ""}`}
      >
        <Toolbar editor={editor} />
        <div
          className="overflow-auto"
          style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      {hoveredLink && (
        <button
          type="button"
          data-link-remove="true"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onClick={removeHoveredLink}
          aria-label="Remove link"
          title="Remove link"
          className="fixed z-50 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
          style={{
            top: hoveredLink.rect.top - 8,
            left: hoveredLink.rect.right - 6,
          }}
        >
          <X size={12} />
        </button>
      )}
    </>
  );
}
