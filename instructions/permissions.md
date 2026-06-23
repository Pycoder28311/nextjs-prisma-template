# Permissions — What Claude Can and Cannot Edit

This file is the single source of truth for edit permissions across the project.
When in doubt about whether a path is safe to touch, check here first.

---

## Quick reference

| Path | Permission |
| --- | --- |
| `app/components/**` | Freely editable |
| `app/config/**` | Edit only when user explicitly asks |
| `app/page.tsx` and new routes under `app/**` | Freely editable |
| `prisma/schema.prisma` | Edit only when user explicitly asks to add/change a model |
| `app/framework/example/**` | Freely editable |
| `app/framework/ui/navigation/Navbar.tsx` | Editable — **ask for confirmation first** |
| `app/framework/ui/navigation/Footer.tsx` | Editable — **ask for confirmation first** |
| `app/framework/ui/**` *(everything else)* | Read-only. Never edit. |
| `app/framework/data/**` | Read-only. Never edit. |
| `app/framework/lib/**` | Read-only. Never edit. |
| `app/framework/types/**` | Read-only. Never edit. |
| `app/framework/utils/**` | Read-only. Never edit. |
| `app/api/**` | Read-only. **Ask the user first** before touching anything here. |
| `app/auth/**` | Read-only. Never edit. |

---

## Rules in detail

### Freely editable
- `app/components/` — project-specific components, create/edit freely.
- `app/framework/example/` — reference/demo code, no restrictions.
- New page routes anywhere under `app/` that are outside the protected paths above.

### Edit only when the user explicitly asks

**`app/config/`** — The user owns all style and UI metadata decisions here.
Never edit a config file as a side effect of building a page or component.
Only touch it when the user says something like *"add a new button variant"* or
*"change the primary color"*.

**`prisma/schema.prisma`** — Only add or modify a model block when the user
explicitly asks. After editing, run `npm run prisma` (migrate + generate +
type-sync). Do not modify existing model fields as a side effect of other work.

**`app/api/`** — The generic API handles all CRUD automatically via
`app/api/[model]/*`. You almost never need to touch this folder. If a task
appears to require a change here, **STOP, name the exact file and line, and ask
the user for permission** before proceeding.

### Ask for confirmation first (then proceed if approved)

**Navbar** (`app/framework/ui/navigation/Navbar.tsx`) and **Footer**
(`app/framework/ui/navigation/Footer.tsx`) may be edited, but only after asking
the user to confirm. Name the exact file and the change you plan to make before
touching anything.

All other files inside `app/framework/ui/navigation/` (sidebar helpers,
mega-menus, search, hamburger button, etc.) are read-only — the user must
explicitly name them to unlock editing.

### Read-only — never edit without an explicit direct instruction

These paths are reusable framework code shared across every project built on
this scaffold. A silent change here breaks every other consumer.

- `app/framework/data/**`
- `app/framework/lib/**`
- `app/framework/types/**`
- `app/framework/utils/**`
- `app/framework/ui/**` *(except Navbar and Footer as noted above)*
- `app/auth/**`
- `app/api/auth/**`
- `app/api/images/**`
- `app/api/lib/**`
- `app/api/prisma-fields/**`
- `app/api/session/**`
- `app/api/[model]/**`

Reading any of these to understand how to *call* them is expected and
encouraged. Editing them silently is not.

---

## Backend and types — permission summary

The types folder (`app/framework/types/`) is **auto-generated** by
`npm run prisma` — never hand-edit it. If the user asks for a change in types,
the correct action is to update `prisma/schema.prisma` (with permission) and
re-run `npm run prisma`, not to edit the types files directly.

For backend changes (new endpoints, modified API logic), always ask the user
first. See `instructions/backend.md` for how the backend works and the correct
way to add new data models.
