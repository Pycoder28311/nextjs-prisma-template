import { border, radiusBig, shadow } from "./theme";

export const SEARCH_INPUT_TYPES = ["simple", "BigSearch"] as const;

export type SearchInputType = (typeof SEARCH_INPUT_TYPES)[number];

/** Shared container styles applied to every search input type. */
export const searchInputBase =
  `flex items-center ${border} bg-white text-gray-900 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30`;

export type SearchInputStyle = {
  /** Wrapper sizing/shape. */
  container: string;
  /** The <input> element. */
  input: string;
  /** The search icon. */
  icon: string;
};

export const searchInputStyles: Record<SearchInputType, SearchInputStyle> = {
  simple: {
    container: "h-9 gap-2 px-3 rounded-md",
    input: "text-sm",
    icon: "h-4 w-4",
  },
  BigSearch: {
    container: `h-14 gap-3 px-5 ${radiusBig} ${shadow}`,
    input: "text-lg",
    icon: "h-6 w-6",
  },
};
