import { border, colorMain, grayMid } from "./theme";

export const INPUT_TYPES = [
  "text",
  "number",
  "date",
  "time",
  "email",
  "password",
  "checkbox",
  "radio",
  "color",
  "range",
  "file",
] as const;

export type InputType = (typeof INPUT_TYPES)[number];

/**
 * Native types that are NOT full-width text fields. They skip the text-field
 * base/styleType and use the dedicated styles below instead.
 */
export const CONTROL_INPUT_TYPES = [
  "checkbox",
  "radio",
  "color",
  "range",
  "file",
] as const;

export type ControlInputType = (typeof CONTROL_INPUT_TYPES)[number];

export function isControlType(type: string | undefined): type is ControlInputType {
  return (CONTROL_INPUT_TYPES as readonly string[]).includes(type ?? "");
}

export const controlInputStyles: Record<ControlInputType, string> = {
  checkbox:
    `h-4 w-4 rounded ${grayMid.border} accent-blue-600 ${colorMain.focusRing} disabled:opacity-50 disabled:cursor-not-allowed`,
  radio:
    `h-4 w-4 ${grayMid.border} accent-blue-600 ${colorMain.focusRing} disabled:opacity-50 disabled:cursor-not-allowed`,
  color:
    `h-10 w-14 cursor-pointer rounded-md ${border} bg-white p-1 disabled:opacity-50 disabled:cursor-not-allowed`,
  range:
    "w-full accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
  file:
    "w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200 disabled:opacity-50",
};
