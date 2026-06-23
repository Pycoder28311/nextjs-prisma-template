# theme.ts — The App-Wide Theme

> **Note:** `app/config/theme.ts` does not exist in the repo yet. When the user
> adds it, treat it as the **top-level design system**: app-wide colors,
> spacing scale, radii, shadows, typography, and surface/background tokens for
> things the per-component configs don't cover (page backgrounds, cards,
> panels, layout containers, etc.).

---

## How to use it

- For any component or layout element the user asks for — page wrappers,
  parent containers, **grid cards**, panels, section headers — pull colors,
  spacing, radii, and shadows from `theme.ts` instead of typing literal Tailwind
  values.
- Import it the same way as the other configs: `import { theme } from "@/config/theme";`
  (match whatever export shape the user defines once the file exists).
- If `theme.ts` is missing a token you need, **ask the user** or fall back to the
  closest existing config value — do not silently introduce a new color/scale.
