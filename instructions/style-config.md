# Using the Style Config Files

This guide tells Claude Code how to style components in this project. The user
keeps **all visual decisions** in one place: the config folder at
`app/config/` (imported as `@/config/...`). Your job is to **consume** those
styles, not invent new ones.

---

## The golden rules

1. **ALWAYS use the styles defined in `app/config/`.** Every component you build
   must pull its look from these config files (and from `theme.ts` — see below).
   Do **not** hand-write ad-hoc Tailwind colors, fonts, shadows, or spacing when
   a config value already exists.
2. **Only use a different style if the user explicitly asks for it.** "Make a
   dashboard" → use the theme. "Make this button bright pink" → that's an
   explicit override, so do it.
3. **Never edit the config files on your own.** Files in `app/config/` are the
   user's source of truth. Touch them **only** when the user specifically asks
   you to change a config (e.g. "add a new button variant", "change the primary
   color in theme.ts"). Adding a page should never require editing a config.
4. **Prefer the existing wrapper components.** They already wire the config in
   for you (see the table below). Reach for raw `<button>`/`<input>` only when no
   wrapper fits.

---

## `theme.ts` — the app-wide theme

> **Note:** `app/config/theme.ts` does not exist in the repo yet. When the user
> adds it, treat it as the **top-level design system**: app-wide colors,
> spacing scale, radii, shadows, typography, and surface/background tokens for
> things the per-component configs below don't cover (page backgrounds, cards,
> panels, layout containers, etc.).

How to use it:

- For any component or layout element the user asks for — page wrappers,
  parent containers, **grid cards**, panels, section headers — pull colors,
  spacing, radii, and shadows from `theme.ts` instead of typing literal Tailwind
  values.
- Import it the same way as the other configs: `import { theme } from "@/config/theme";`
  (match whatever export shape the user defines once the file exists).
- If `theme.ts` is missing a token you need, **ask the user** or fall back to the
  closest existing config value — do not silently introduce a new color/scale.

---

## The component style configs

Each config file defines a small set of **named style types** plus the Tailwind
classes for each. Components take a prop (e.g. `styleType`, `size`) that selects
one of those names. To style something, **pick the right named type** — don't
rewrite the classes.

| Config file (`app/config/`) | Defines | Style types (names) | Used by |
| --- | --- | --- | --- |
| `buttonConfig.ts` | Button variants | `primary`, `secondary`, `tertiary`, `tertiary-bordered`, `underline`, `delete`, `nav` | `<Button>` (`@/framework/ui/buttons/Button`) |
| `textConfig.ts` | Text sizes (responsive) | `very small`, `small`, `medium`, `big`, `large` | `<Text>` (`@/framework/ui/text/Text`) |
| `inputConfig.ts` | Text-field styles | `outlined`, `filled`, `underline`, `ghost`, `pill`, `error` | `<Input>` (`@/framework/ui/input/Input`) |
| `inputTypeConfig.ts` | Native input types + control styles | `text`, `number`, `date`, `checkbox`, `radio`, `color`, `range`, `file`, … | `<Input>` |
| `searchInputConfig.ts` | Search box styles | `simple`, `BigSearch` | `<SearchInput>` |
| `iconConfig.ts` | Named icon set (react-icons) | `home`, `search`, `user`, `settings`, `trash`, `edit`, … | `<Text icon="…">`, anywhere icons are needed |
| `crudButtonConfig.ts` | CRUD actions → button variant | `create`, `edit`, `save`, `delete` (map to button variants) | CRUD buttons / relation linkers |

### How a config drives a component (example)

`buttonConfig.ts` exports `baseStyles` (shared) + a `variantStyles` map. The
`<Button>` component composes them by `styleType`:

```tsx
import Button from "@/framework/ui/buttons/Button";

// Picks the "secondary" entry from variantStyles — no Tailwind written by hand.
<Button styleType="secondary" onClick={save}>Save</Button>
```

`textConfig.ts` exports responsive size classes; `<Text>` selects by `size` and
can render a named icon from `iconConfig.ts`:

```tsx
import Text from "@/framework/ui/text/Text";

<Text size="big" icon="star" iconPosition="left" value="Featured" />
```

So: **choose the name, pass the prop.** That's the whole interface.

---

## Worked example — "make a big dashboard page"

A prompt like *"make a big dashboard page with many parent elements and grid
cards"* should produce a **new page/route** (e.g. `app/dashboard/page.tsx` —
**not** inside `app/config/` and **not** inside any protected framework path)
that:

1. **Pulls every visual value from the theme/configs.** Card backgrounds,
   radii, shadows, page padding, section gaps → from `theme.ts`. Buttons →
   `<Button styleType=…>`. Headings/labels → `<Text size=…>`. Inputs →
   `<Input>`. Icons → `iconConfig` names.
2. **Builds the structure from parent containers + grid cards**, all themed
   consistently so the page matches the rest of the app.
3. **Is responsive.** Use a mobile-first layout that scales up at breakpoints —
   e.g. a card grid such as `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
   gap-4`, fluid containers, and the responsive text sizes already defined in
   `textConfig.ts`. Verify it looks right from small (mobile) to large (desktop)
   widths.
4. **Does not modify any config file** to achieve the look. If the design needs
   a token/variant that doesn't exist, ask the user to add it (or to confirm an
   override) rather than editing the config yourself.

---

## Quick checklist before you finish

- [ ] Every color/spacing/shadow/radius comes from `theme.ts` or a component config — no stray literals.
- [ ] Buttons, text, inputs, search, icons use their wrapper component + a named style type.
- [ ] Layout is responsive (mobile-first, scales up at breakpoints).
- [ ] No config file was edited (unless the user explicitly asked).
- [ ] New code lives outside `app/config/` and outside protected framework paths.
