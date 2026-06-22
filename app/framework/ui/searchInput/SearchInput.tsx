"use client";

import {
  searchInputBase,
  searchInputStyles,
  type SearchInputType,
} from "@/config/searchInputConfig";
import Text from "@/framework/ui/iconText/Text";

type Props = {
  styleType?: SearchInputType;
  onClick?: () => void;
  onType?: (value: string) => void;
  onHover?: () => void;
  className?: string;
  placeholder?: string;
  value?: string;
  /** Show the search icon (defaults to true, uses the built-in icon). */
  searchIcon?: boolean;
  /** Optional component rendered on the left of the input. */
  leftButton?: React.ReactNode;
};

export default function SearchInput({
  styleType = "simple",
  onClick,
  onType,
  onHover,
  className = "",
  placeholder = "Search...",
  value,
  searchIcon = true,
  leftButton,
}: Props) {
  const s = searchInputStyles[styleType];

  return (
    <div
      onMouseEnter={onHover}
      className={`${searchInputBase} ${s.container} ${className}`}
    >
      {leftButton}

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onClick={onClick}
        onChange={(e) => onType?.(e.target.value)}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 ${s.input}`}
      />

      {searchIcon && (
        <Text
          icon="search"
          size={styleType === "BigSearch" ? "big" : "small"}
          className="shrink-0 text-gray-500"
        />
      )}
    </div>
  );
}
