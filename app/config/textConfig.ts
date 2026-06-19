export const TEXT_SIZES = [
  "very small",
  "small",
  "medium",
  "big",
  "large",
] as const;

export type TextSize = (typeof TEXT_SIZES)[number];

/**
 * Responsive font-size classes per size.
 * Each grows on wider breakpoints (base = mobile, sm/md/lg = larger screens).
 */
export const textSizeStyles: Record<TextSize, string> = {
  "very small": "text-[0.625rem] sm:text-xs",
  small: "text-xs sm:text-sm",
  medium: "text-sm sm:text-base md:text-lg",
  big: "text-lg sm:text-xl md:text-2xl",
  large: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
};
