# Worked Example — "Make a Big Dashboard Page"

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
