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
    "rounded-md border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30",
  // Gray fill that turns white on focus.
  filled:
    "rounded-md border border-transparent bg-gray-100 hover:bg-gray-200 focus:bg-white focus:border-blue-500",
  // Bottom border only.
  underline:
    "rounded-none border-0 border-b-2 border-gray-300 bg-transparent px-0 hover:border-gray-400 focus:border-blue-500",
  // No border/background until focus.
  ghost:
    "rounded-md border border-transparent bg-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500",
  // Fully rounded outlined.
  pill:
    "rounded-full border border-gray-300 bg-white px-4 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30",
  // Red/danger state.
  error:
    "rounded-md border border-red-400 bg-white text-red-700 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30",
};
