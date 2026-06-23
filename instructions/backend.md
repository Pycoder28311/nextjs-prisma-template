# Backend — How It Works

This project uses a **zero-custom-endpoint** backend. One generic API handles
every model automatically. You almost never need to write or edit backend code.

---

## The full backend flow

```
prisma/schema.prisma
       │  npm run prisma
       ▼
app/framework/types/   ← auto-generated, never hand-edit
       │
       ▼
app/api/[model]/*      ← generic CRUD routes (read, create, update, delete,
                          reorder, relate) — driven by resolveModel()
       │
       ▼
useTable<T>("modelName")  ← the single frontend hook for all data operations
```

### Step-by-step when the user adds a new model

1. Add the `model` block in `prisma/schema.prisma` *(ask permission first — see `permissions.md`)*.
2. Run `npm run prisma` — this migrates the DB, regenerates the Prisma client,
   and syncs `app/framework/types/`. **Do not edit the types folder by hand.**
3. Add UI metadata in `app/config/fieldConfig.ts` (labels, placeholders,
   options, `relationType`). *(Ask permission before editing config — see `permissions.md`)*.
4. That's it. The generic `app/api/[model]/*` routes pick the model up
   automatically via `resolveModel()` — no new API route needed.

---

## Permissions reminder

- **Never edit** `app/framework/types/` directly — it is generated output.
- **Never edit** anything under `app/api/` without asking the user first.
- If a task seems to require a backend change, **STOP and ask**. In most cases
  the correct fix is adding/updating the Prisma schema and re-running
  `npm run prisma`, not touching the API code.

See `instructions/permissions.md` for the full permissions table.

---

## `useTable<T>(model)` — the only frontend data hook

Import from `@/framework/utils/useTable`. Pass the Prisma model name in
**camelCase** (e.g. `"product"`, `"manyOne"` — not `"Product"` or
`"products"`).

```tsx
import { useTable } from "@/framework/utils/useTable";

const { records, append, update, remove, reorder, connect, disconnect, isDeletingId } =
  useTable<Product>("product");
```

### What it returns

| Return value | Type | Purpose |
| --- | --- | --- |
| `records` | `T[]` | Current cached list, auto-fetched on mount |
| `append(item)` | `(item: T) => void` | Optimistic insert after a successful create — pass to `DataForm.onSuccess` |
| `update(id, data)` | `async` | PATCH a row and sync the cache |
| `remove(id)` | `async` | DELETE a row, update cache + back-refs |
| `reorder(from, to)` | — | Persist drag-reorder via the model's `position` field — wire to `GridLayout.onReorder` |
| `connect(field, thisId, otherId)` | `async` | Many-to-many link |
| `disconnect(field, thisId, otherId)` | `async` | Many-to-many unlink |
| `isDeletingId(id)` | `boolean` | Per-row delete-spinner state |

---

## Framework data components

Use these together with `useTable`. Never hand-roll fetch calls or form
submissions when these exist.

| Component | Import path | Purpose |
| --- | --- | --- |
| `DataForm` | `@/framework/data/DataForm` | Auto-renders a create form from `fieldConfig[table]`. Pass `onSuccess={tableData.append}` to keep the cache in sync. |
| `GridLayout` | `@/framework/data/GridLayout` | Drag-to-reorder list wrapper. Wire `onReorder={tableData.reorder}`. Accepts `layout` prop (`"one-column"`, `"two-column"`, etc.). |
| `EditInput` | `@/framework/data/EditInput` | Inline-editable field on a record row. Wire `update` from `useTable`. |
| `CrudButton` | `@/framework/data/buttons/CrudButton` | Pre-styled action button (create / edit / save / delete). Uses `crudButtonConfig` variant map. |
| `RelationRow` | `@/framework/data/RelationRow` | Full row with inline edit + many-to-many linker + delete. Use for any model with a scalar label and an m2m relation. |
| `ImageUpload` | `@/framework/data/image/ImageUpload` | File upload wired to the Image model. |
| `ImageGallery` | `@/framework/data/image/ImageGallery` | Displays uploaded images. Pass `refreshKey` to trigger a refetch after upload. |

---

## Many-to-many relations

Both sides of the relation must have `relationType: "manyToMany"` in
`app/config/fieldConfig.ts`. Then use `connect` / `disconnect` from `useTable`,
or drop in a `RelationRow` / `RelationLinker` which wires them automatically.

```tsx
// Link manyOne #1 to manyTwo #5
await manyOneData.connect("ManyTwos", 1, 5);

// Unlink them
await manyOneData.disconnect("ManyTwos", 1, 5);
```

---

## Canonical usage pattern

The definitive reference is `app/framework/example/HomePageExample.tsx`.
**Always read it before building a data-driven page.** It shows every primitive
wired together correctly: `useTable`, `DataForm`, `GridLayout`, `EditInput`,
`CrudButton`, `RelationRow`, `ImageUpload`, `ImageGallery`, and
`useAbsoluteModal` / `useAlert`.

Key conventions from the example:

- One `useTable()` call per Prisma model needed on the page.
- `DataForm.onSuccess` → `tableData.append` (no refetch needed).
- `GridLayout.onReorder` → `tableData.reorder`.
- `EditInput.update` → `tableData.update`.
- `CrudButton type="delete"` + `loading={isDeletingId(id)}` + `onClick={() => remove(id)}`.
- Import types from `@/framework/types` once `npm run prisma` has generated them.

---

## What NOT to do

- Do **not** write raw `fetch("/api/...")` calls for CRUD — `useTable` does it.
- Do **not** create new files under `app/api/` without user permission.
- Do **not** edit `app/framework/types/` by hand — it is generated.
- Do **not** call `npm run prisma` without confirming the schema change with the user first.
