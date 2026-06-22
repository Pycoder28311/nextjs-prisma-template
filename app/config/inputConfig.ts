import { border, colorMain, colorRed, grayLight, grayMid } from "./theme";

export const INPUT_STYLE_TYPES = [
  "outlined",
  "filled",
  "underline",
  "ghost",
  "pill",
  "error",
] as const;

export type InputStyleType = (typeof INPUT_STYLE_TYPES)[number];

/** Shared styles applied to every input style type. */
export const inputBase =
  "w-full px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed";

export const inputStyles: Record<InputStyleType, string> = {
  // Bordered box with a focus ring.
  outlined:
    `rounded-md ${border} bg-white ${grayMid.borderHover} ${colorMain.focusBorder} ${colorMain.focusRing}`,
  // Gray fill that turns white on focus.
  filled:
    `rounded-md border border-transparent ${grayLight.bg} ${grayLight.bgHover} focus:bg-white ${colorMain.focusBorder}`,
  // Bottom border only.
  underline:
    `rounded-none border-0 border-b-2 ${grayMid.border} bg-transparent px-0 ${grayMid.borderHover} ${colorMain.focusBorder}`,
  // No border/background until focus.
  ghost:
    `rounded-md border border-transparent bg-transparent hover:bg-gray-100 focus:bg-white ${colorMain.focusBorder}`,
  // Fully rounded outlined.
  pill:
    `rounded-full ${border} bg-white px-4 ${grayMid.borderHover} ${colorMain.focusBorder} ${colorMain.focusRing}`,
  // Red/danger state.
  error:
    `rounded-md border ${colorRed.border} bg-white text-red-700 placeholder:text-red-300 ${colorRed.focusBorder} ${colorRed.focusRing}`,
};
