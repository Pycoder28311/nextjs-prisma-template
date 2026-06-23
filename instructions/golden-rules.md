# Golden Rules — Styling & Config

This guide tells Claude Code how to style components in this project. The user
keeps **all visual decisions** in one place: the config folder at
`app/config/` (imported as `@/config/...`). Your job is to **consume** those
styles, not invent new ones.

---

## Permissions

See **`instructions/permissions.md`** for the full table of what can and cannot
be edited, including framework paths, `app/api/`, config files, and the special
Navbar/Footer confirmation rule.

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
4. **ALWAYS use the reusable UI components.** When the user asks for any element
   that maps to one of the reusable components listed in `instructions/ui-components.md`,
   you **must** use that component — never write a raw `<button>`, `<input>`, etc.
   in its place.
