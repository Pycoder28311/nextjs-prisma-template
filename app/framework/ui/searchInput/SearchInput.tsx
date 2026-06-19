"use client";

import {
  searchInputBase,
  searchInputStyles,
  type SearchInputType,
} from "@/config/searchInputConfig";

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

function DefaultSearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.3-4.3m1.55-5.2a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
      />
    </svg>
  );
}

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
        <span
          aria-hidden="true"
          className="shrink-0 text-gray-500"
        >
          <DefaultSearchIcon className={s.icon} />
        </span>
      )}
    </div>
  );
}
