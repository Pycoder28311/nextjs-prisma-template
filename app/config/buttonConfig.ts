export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "tertiary",
  "tertiary-bordered",
  "underline",
  "delete",
  "nav",
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/** Shared layout/typography/focus styles applied to every button variant. */
export const baseStyles =
  "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium select-none transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export type VariantStyle = {
  /** Always-applied base appearance. */
  base: string;
  /** Applied on hover. */
  hover: string;
  /** Applied while pressed (onClick / :active). */
  active: string;
  /** Applied when disabled. */
  disabled: string;
};

export const variantStyles: Record<ButtonVariant, VariantStyle> = {
  // Cartoonish button: a solid bottom shadow gives it depth, and on click it
  // drops down (translate-y) while the shadow collapses, so it looks pressed.
  primary: {
    base: "bg-blue-500 text-white shadow-[0_4px_0_0_#1d4ed8] focus-visible:ring-blue-500",
    hover: "hover:bg-blue-600",
    active: "active:translate-y-1 active:shadow-[0_0_0_0_#1d4ed8]",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0",
  },
  // Solid colored-fill button.
  secondary: {
    base: "bg-gray-800 text-white focus-visible:ring-gray-500",
    hover: "hover:bg-gray-900",
    active: "active:bg-black",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  // Light, subtle filled button (the former "secondary").
  tertiary: {
    base: "bg-gray-100 text-gray-900 focus-visible:ring-gray-400",
    hover: "hover:bg-gray-200",
    active: "active:bg-gray-300",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  // No background; an animated multi-color gradient spins around the border.
  "tertiary-bordered": {
    base: "btn-spin-border text-gray-900 focus-visible:ring-gray-400",
    hover: "",
    active: "",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  // Text-only button (no padding); an underline wipes in left to right on hover.
  underline: {
    base: "relative px-0! py-0! bg-transparent text-blue-600 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-['']",
    hover: "hover:after:scale-x-100",
    active: "",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  delete: {
    base: "bg-red-600 text-white focus-visible:ring-red-500",
    hover: "hover:bg-red-700",
    active: "active:bg-red-800",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  // Navbar link style: transparent, gray text that darkens on hover.
  nav: {
    base: "bg-transparent text-gray-600 focus-visible:ring-gray-400",
    hover: "hover:text-gray-900 hover:bg-gray-50",
    active: "",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
};
