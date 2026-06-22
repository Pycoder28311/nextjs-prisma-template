import { ICONS, iconSizeStyles, type IconName, type TextSize } from "@/config/iconConfig";

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

  // Sizes come from the icon config: the font scales with the text size class,
  // and the icon gets an explicit responsive w/h relative to the mobile size.
  const { icon: iconSize, font } = iconSizeStyles[size];

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 ${font} ${className}`}
    >
      {Icon && iconPosition === "left" && <Icon className={iconSize} aria-hidden />}
      {hasText && value}
      {Icon && iconPosition === "right" && <Icon className={iconSize} aria-hidden />}
    </span>
  );
}
