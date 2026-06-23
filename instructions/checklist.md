# Quick Checklist — Before You Finish

- [ ] Every color/spacing/shadow/radius comes from `theme.ts` or a component config — no stray literals.
- [ ] Every button, text element, input, search box, alert, or modal uses the corresponding reusable UI component with a valid named style type.
- [ ] No style type was invented — if the requested type didn't exist, the user was asked first.
- [ ] Layout is responsive (mobile-first, scales up at breakpoints).
- [ ] No config file was edited (unless the user explicitly asked).
- [ ] No protected path was edited without permission — see `instructions/permissions.md`.
- [ ] New code lives in `app/components/`, a new page route, or `app/framework/example/`.
