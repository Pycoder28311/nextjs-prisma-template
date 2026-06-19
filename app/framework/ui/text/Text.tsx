import { textSizeStyles, type TextSize } from "@/config/textConfig";

type Props = {
  value: React.ReactNode;
  size?: TextSize;
  className?: string;
};

export default function Text({ value, size = "medium", className = "" }: Props) {
  return <span className={`${textSizeStyles[size]} ${className}`}>{value}</span>;
}
