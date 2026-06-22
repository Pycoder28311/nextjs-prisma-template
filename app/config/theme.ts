/**
 * Central design tokens for the whole project.
 *
 * Every value here is a Tailwind class-name string (not a CSS value), so it can
 * be dropped straight into a `className`. Import these tokens in the other style
 * config files instead of hardcoding utilities — change a value once here and it
 * propagates everywhere.
 *
 * ── How this matches the `useTheme` (next-themes) library ──────────────────────
 * This project does NOT read theme values through React. Theming is done purely
 * in CSS: `next-themes`' `useTheme()` writes a class (`dark`, `ocean`, `forest`,
 * `sunset`) onto <html>, and `app/globals.css` redefines the Tailwind gray
 * palette variables (`--color-white`, `--color-gray-50 … --color-gray-950`)
 * inside each of those theme classes.
 *
 * Consequence:
 *   • Any utility built on the gray scale or white — `bg-gray-100`,
 *     `text-gray-600`, `border-gray-300`, `text-white`, `bg-background` … —
 *     AUTOMATICALLY re-colours when the user switches theme. No JS needed.
 *   • Fixed brand accents (blue / green / red below) are NOT overridden by the
 *     theme classes, so they stay constant across every theme — which is what
 *     you want for a recognisable brand colour.
 *
 * So the rule used below:
 *   • Tokens that should follow the active theme  → expressed as gray-* / white.
 *   • Tokens that should stay constant (brand)    → expressed as blue/green/red.
 *
 * NOTE for Tailwind: all class names are written here as complete literal
 * strings (never built dynamically like `bg-${c}-500`) so Tailwind's source
 * scanner detects them and generates the CSS, even though they're consumed via
 * interpolation in the other config files.
 */

/* ── Radius ──────────────────────────────────────────────────────────────── */
export const radius = "rounded-lg"; // default corner radius (buttons, inputs)
export const radiusBig = "rounded-2xl"; // large radius (cards, big search, modals)

/* ── Padding ─────────────────────────────────────────────────────────────── */
export const paddingSmall = "px-3 py-1.5"; // compact controls
export const paddingBig = "px-5 py-3"; // roomy controls

/* ── Border & shadow ─────────────────────────────────────────────────────── */
// Theme-adaptive default border (gray-300 follows the active theme).
export const border = "border border-gray-300";
export const shadow = "shadow-sm";

/* ── Colour token shape ──────────────────────────────────────────────────────
 * Each colour exposes the same keys so call sites can compose them uniformly:
 *   bg / bgHover / bgActive → solid fill plus its hover + clicked (:active) state
 *   text                    → text / icon colour
 *   border                  → border colour
 *   ring                    → focus-visible ring (used on buttons)
 *   focusBorder / focusRing → input focus border + soft ring
 */
export type ColorToken = {
  bg: string;
  bgHover: string;
  bgActive: string;
  text: string;
  border: string;
  ring: string;
  focusBorder: string;
  focusRing: string;
};

/** Main brand accent — blue. Constant across all themes. */
export const colorMain: ColorToken = {
  bg: "bg-blue-500",
  bgHover: "hover:bg-blue-600",
  bgActive: "active:bg-blue-700",
  text: "text-blue-600",
  border: "border-blue-500",
  ring: "focus-visible:ring-blue-500",
  focusBorder: "focus:border-blue-500",
  focusRing: "focus:ring-2 focus:ring-blue-500/30",
};

/** Secondary brand accent — green. Constant across all themes. */
export const colorSecondary: ColorToken = {
  bg: "bg-green-500",
  bgHover: "hover:bg-green-600",
  bgActive: "active:bg-green-700",
  text: "text-green-600",
  border: "border-green-500",
  ring: "focus-visible:ring-green-500",
  focusBorder: "focus:border-green-500",
  focusRing: "focus:ring-2 focus:ring-green-500/30",
};

/**
 * Colour of the "primaries" — the solid neutral fill used by primary/solid
 * buttons. Built on the gray scale, so it follows the active theme (e.g. a dark
 * fill in light mode becomes a light fill in dark mode, with readable text).
 */
export const colorPrimaries: ColorToken = {
  bg: "bg-gray-800",
  bgHover: "hover:bg-gray-900",
  bgActive: "active:bg-black",
  text: "text-white",
  border: "border-gray-800",
  ring: "focus-visible:ring-gray-500",
  focusBorder: "focus:border-gray-700",
  focusRing: "focus:ring-2 focus:ring-gray-500/30",
};

/** Global danger / red colour. Constant across all themes. */
export const colorRed: ColorToken = {
  bg: "bg-red-600",
  bgHover: "hover:bg-red-700",
  bgActive: "active:bg-red-800",
  text: "text-red-600",
  border: "border-red-400",
  ring: "focus-visible:ring-red-500",
  focusBorder: "focus:border-red-500",
  focusRing: "focus:ring-2 focus:ring-red-500/30",
};

/* ── Gray shades (3) — all follow the active next-themes theme ───────────────
 * grayLight  → surfaces / subtle fills      (gray-100)
 * grayMid    → borders / dividers           (gray-300)
 * grayStrong → muted text / strong elements (gray-600)
 */
export type GrayToken = {
  bg: string;
  bgHover: string;
  bgActive: string;
  text: string;
  border: string;
  borderHover: string;
};

export const grayLight: GrayToken = {
  bg: "bg-gray-100",
  bgHover: "hover:bg-gray-200",
  bgActive: "active:bg-gray-300",
  text: "text-gray-100",
  border: "border-gray-100",
  borderHover: "hover:border-gray-200",
};

export const grayMid: GrayToken = {
  bg: "bg-gray-300",
  bgHover: "hover:bg-gray-400",
  bgActive: "active:bg-gray-500",
  text: "text-gray-300",
  border: "border-gray-300",
  borderHover: "hover:border-gray-400",
};

export const grayStrong: GrayToken = {
  bg: "bg-gray-600",
  bgHover: "hover:bg-gray-700",
  bgActive: "active:bg-gray-800",
  text: "text-gray-600",
  border: "border-gray-600",
  borderHover: "hover:border-gray-700",
};

/* ── Convenience bundle ──────────────────────────────────────────────────── */
const theme = {
  radius,
  radiusBig,
  paddingSmall,
  paddingBig,
  border,
  shadow,
  colorMain,
  colorSecondary,
  colorPrimaries,
  colorRed,
  grayLight,
  grayMid,
  grayStrong,
};

export default theme;
