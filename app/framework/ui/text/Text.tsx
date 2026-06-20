import { textSizeStyles, type TextSize } from "@/config/textConfig";
import { ICONS, type IconName } from "@/config/iconConfig";

type Props = {
  value?: React.ReactNode;
  size?: TextSize;
  /** Icon name resolved from the icon config (react-icons). */
  icon?: IconName;
  /** Where the icon sits relative to the text. Ignored when there is no text. */
  iconPosition?: "left" | "right";
  className?: string;
};

export default function Text({
  value,
  size = "medium",
  icon,
  iconPosition = "left",
  className = "",
}: Props) {
  const Icon = icon ? ICONS[icon] : null;
  const hasText = value !== undefined && value !== null && value !== "";

  // react-icons render at 1em, so the icon scales with the text size class.
  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 ${textSizeStyles[size]} ${className}`}
    >
      {Icon && iconPosition === "left" && <Icon aria-hidden />}
      {hasText && value}
      {Icon && iconPosition === "right" && <Icon aria-hidden />}
    </span>
  );
}
