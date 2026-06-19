"use client";

import { useEffect } from "react";
import { useAbsoluteModal } from "@/framework/ui/context/AppContext";
import Button from "@/framework/ui/buttons/Button";
import { customSelectVariant } from "@/config/crudButtonConfig";

export type SelectOption = { value: string | number; label: string };

type Props = {
  options: SelectOption[];
  selected: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  max?: number;
  label?: string;
  placeholder?: string;
};

export default function CustomSelect({ options, selected, onChange, max, label, placeholder }: Props) {
  const modal = useAbsoluteModal<HTMLButtonElement>();

  const isSingle = max === 1;
  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label)
    .join(", ");

  const toggleValue = (value: string | number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (max === 1) {
      onChange([value]);
      modal.close();
    } else if (max === undefined || selected.length < max) {
      onChange([...selected, value]);
    }
  };

  const panel = (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto max-h-52">
      {options.length === 0 ? (
        <p className="px-3 py-2 text-sm text-gray-400 italic">No options available</p>
      ) : (
        options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          const isDisabled = !isSelected && max !== undefined && max !== 1 && selected.length >= max;
          return (
            <Button
              key={opt.value}
              styleType={customSelectVariant.option}
              disabled={isDisabled}
              onClick={() => toggleValue(opt.value)}
              className={`w-full justify-start! rounded-none! text-left gap-2 ${
                isSelected ? "bg-blue-50! text-blue-700!" : ""
              }`}
            >
              {!isSingle && (
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              )}
              <span className="truncate">{opt.label}</span>
            </Button>
          );
        })
      )}
    </div>
  );

  // AbsoluteModal snapshots its content, so while the dropdown is open we
  // re-push a fresh panel whenever the selection/options change to keep the
  // checkmarks and disabled states in sync (multi-select stays open).
  useEffect(() => {
    if (modal.isOpen) {
      modal.open({ component: panel, side: "bottom", align: "start", offset: 4, matchAnchorWidth: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, options]);

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <Button
        {...modal.triggerProps}
        styleType={customSelectVariant.select}
        onClick={() =>
          modal.toggle({ component: panel, side: "bottom", align: "start", offset: 4, matchAnchorWidth: true })
        }
        className="w-full justify-between text-left"
      >
        <span className={selected.length === 0 ? "text-gray-400" : "text-gray-800"}>
          {selected.length === 0 ? (placeholder ?? "Select...") : selectedLabels}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${modal.isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
    </div>
  );
}
