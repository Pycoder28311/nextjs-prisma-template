"use client";

import Link from "next/link";
import { baseStyles, variantStyles, type ButtonVariant } from "@/config/buttonConfig";

type Props = {
  onClick?: () => void;
  onHover?: () => void;
  disabled?: boolean;
  styleType?: ButtonVariant;
  /** When set, renders a Next.js <Link> instead of a <button>. */
  href?: string;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<any>;
  // Allow passthrough data-* attributes (e.g. AbsoluteModal trigger props).
  [key: `data-${string}`]: string | undefined;
};

export default function Button({
  onClick,
  onHover,
  disabled = false,
  styleType = "primary",
  href,
  children,
  className = "",
  ref,
  ...rest
}: Props) {
  const v = variantStyles[styleType];
  const classes = `${baseStyles} ${v.base} ${v.hover} ${v.active} ${v.disabled} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        ref={ref}
        onClick={onClick}
        onMouseEnter={onHover}
        className={classes}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      onMouseEnter={onHover}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
