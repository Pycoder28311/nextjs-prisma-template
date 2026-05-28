---
name: sync-obsidian-project-notes
description: Use when the user wants to document or sync project-specific changes (new Prisma models, components, pages, routes, business logic, fieldConfig changes) into the Obsidian vault. Adds NEW notes only — never modifies existing framework notes. Trigger phrases include "sync Obsidian", "document this in Obsidian", "add notes for what I built", "update the vault with the project changes", "track this change in Obsidian".
---

# Sync Obsidian with project-specific changes

## Purpose

Capture **project-specific additions** (everything outside `app/framework/`) in the Obsidian vault as new notes. The framework notes in the vault are reusable templates shared across every project built on this scaffold — they document a stable library and **must not be touched**.

## Hard rules — DO NOT VIOLATE

1. **NEVER edit, rename, move, or delete** any of the following existing notes/folders:
   - `Index.md` (vault root — framework catalog)
   - `Prisma Models/` and any file inside it
   - `Routes/` and any file inside it
   - `UI/` and any file inside it
   - `Data/` and any file inside it
   - `Lib/`, `Scripts/`, `Utils/` and any file inside them

   These describe the reusable framework. Editing them would corrupt the shared template.

2. **All new notes go under `Project/`** at the vault root. Create that folder if it doesn't exist.

3. **Cross-link freely** from new notes into framework notes. Examples:
   - Prisma model reference → `[[User]]`, `[[Image]]`
   - API route reference → `[[Routes/[model]/create]]`, `[[Routes/auth/signup]]`
   - Component reference → `[[UI/navigation/Navbar]]`, `[[Data/DataForm]]`
   - Helper reference → `[[Utils/crud]]`, `[[Lib/prisma]]`

   Wikilinks are one-way pointers — they create connections in Obsidian's graph without modifying the target note.

4. **Never edit the root `Index.md`**. Instead, maintain `Project/Index.md` as the catalog of project-specific notes.

## When this skill applies

The user says (or implies) one of:
- "sync Obsidian" / "update the vault"
- "document this in Obsidian"
- "add notes for [thing I built]"
- "track this project change in Obsidian"
- "what did I add since the framework?"

Or you proactively detect non-framework changes and offer to record them — e.g., after a session that added new files outside `app/framework/`.

## Workflow

### 1. Read the framework catalog first
Before writing new notes, call:
```
mcp__obsidian-vault__view(path="Index.md")
```
This is **read-only** — you're using it to learn which wikilink targets exist so new notes can reference them accurately. Do not modify it.

### 2. Identify project-specific changes

Treat anything in these locations as **project-specific** (in scope for this skill):

| Location | Why |
|---|---|
| `prisma/schema.prisma` — models beyond the 7 framework ones (Account, Session, VerificationToken, PasswordReset, Email, User, Image) | New Prisma models added for this project |
| `app/api/*` — routes that aren't in `[model]/`, `auth/`, `images/`, `session/`, `prisma-fields/`, `lib/` | New custom API routes |
| `app/components/*` | Project-specific components |
| `app/<any-path>/page.tsx` outside `app/auth/` | New pages |
| `app/config/fieldConfig.ts` | Per-project metadata edits |
| `app/api/lib/models.ts` — additions to `ALLOWED_MODELS` | Registering new project models |
| Any file outside `app/framework/` and the items above | Probably project-specific — confirm with user |

Treat anything **inside `app/framework/`** as framework code. If the user asks you to document changes there, push back gently — those changes belong in the framework template, not in a per-project skill.

### 3. Confirm scope before writing

Tell the user:
- Which changes you detected (file paths)
- Which notes you intend to add (vault paths)
- Then wait for confirmation, unless it's a single trivial note.

### 4. Create new notes in `Project/`

Suggested layout:

```
Project/
├── Index.md            ← catalog of project-specific notes (you maintain this)
├── Models/             ← project-specific Prisma models (NOT in framework's "Prisma Models/")
├── Routes/             ← project-specific API routes
├── Pages/              ← project-specific pages (app/<path>/page.tsx)
├── Components/         ← project-specific components (app/components/*)
└── Config/             ← fieldConfig changes, allowedModels additions
```

Adjust the substructure to match what the project actually has. Don't create empty folders.

### 5. Note format — match the framework's style

Tight. Bullet/table-heavy. No big paragraphs.

```markdown
# <Name>

`<path/to/source/in/repo>`

<one-line purpose>

## What it does
- <bullet>
- <bullet>

## Depends on
- [[Routes/[model]/create]]
- [[Prisma Models/User]]
- [[Utils/crud]]

## Notes
- <gotcha, design decision, or context the source doesn't make obvious>
```

For Prisma models specifically, use the same table layout as the framework's model notes (Field / Type / Required / Default / Notes columns).

### 6. Update `Project/Index.md`

After adding notes, update `Project/Index.md` — **append**, don't rewrite. The Index should mirror the framework's `Index.md` style but list only project-specific entries:

- Routing table — task → note(s) for project-specific work
- Catalog — grouped list of all `Project/*` notes with one-liners

If `Project/Index.md` doesn't exist yet, create it.

## Anti-patterns — DO NOT

- ❌ Edit `Routes/[model]/create.md` to mention a new project model. Instead, add `Project/Models/<Name>.md` and link to `[[Routes/[model]/create]]` from there.
- ❌ Add new entries to the root `Index.md` routing table. Add them to `Project/Index.md` instead.
- ❌ Rename or restructure framework folders.
- ❌ Add a project-specific Prisma model note inside `Prisma Models/`. That folder is framework-only.
- ❌ Modify any framework note's body — even to "improve" it. Push corrections back to the framework template separately.
- ❌ Bulk-rewrite `Project/Index.md` — append/edit only the affected rows.

## Ambiguity rule

If unclear whether something is framework-level or project-level: **treat it as project-level**. The framework is intentionally static; bias toward adding under `Project/` rather than modifying the templated docs.

## Tools

Use the `obsidian-vault` MCP tools:
- `mcp__obsidian-vault__view` — read existing notes (framework or project)
- `mcp__obsidian-vault__get_workspace_files` — list what's in the vault
- `mcp__obsidian-vault__create` — write a new note
- `mcp__obsidian-vault__str_replace` / `insert` — modify a `Project/*` note you previously created
- `mcp__obsidian-vault__obsidian_api` — batch operations (creating folders, multi-note writes)

If the MCP server isn't running, tell the user — do not try to write project docs to the repo's filesystem as a fallback.
