"use client";

import { inputBase, inputStyles, type InputStyleType } from "@/config/inputConfig";
import { controlInputStyles, isControlType } from "@/config/inputTypeConfig";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  styleType?: InputStyleType;
};

export default function Input({
  styleType = "outlined",
  className = "",
  type = "text",
  ...props
}: Props) {
  // Checkbox/radio/color/range/file get their own styles; everything else is a
  // text-style field that uses the styleType appearance.
  const styles = isControlType(type)
    ? controlInputStyles[type]
    : `${inputBase} ${inputStyles[styleType]}`;

  return <input type={type} {...props} className={`${styles} ${className}`} />;
}
