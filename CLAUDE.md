@AGENTS.md

# Reusable Next.js + Prisma framework

This project is a reusable scaffold. Most code under `app/framework/` and `app/api/` is generic across projects.

## Where the docs live

Framework documentation lives in the **Obsidian vault**, accessed via the `obsidian-vault` MCP server. The full catalog is a single index note at the vault root.

**Before editing framework code, call:**

```
mcp__obsidian-vault__view(path="Index.md")
```

The Index has a routing table mapping common tasks to specific notes. **Read ONLY the notes it points to** for the current task. Do NOT load the whole catalog. Per-task context should rarely exceed Index + 2–3 small notes.

If the MCP server is not available (e.g. fresh clone on a machine without Obsidian + the `claude-code-mcp` plugin running), fall back to reading the source directly — the framework's structure is documented through naming conventions and the folder layout under `app/framework/` and `app/api/`.

## Conventions

- `app/framework/**` — **reusable library**. Treat it like vendor code; don't break its public API unless intentionally extending.
- `app/config/fieldConfig.ts` — **per-project**. Edit freely.
- `app/components/**` and the demo models in `prisma/schema.prisma` (`Product`, `ProductChild`, `TestTable`, `ManyOne`, `ManyTwo`) — **examples**. Safe to delete in a new project.

## Adding a new Prisma model

1. Add the `model` block in `prisma/schema.prisma`
2. Register it in `app/api/lib/models.ts` so `resolveModel()` accepts it
3. Add UI metadata in `app/config/fieldConfig.ts` (labels, options, `relationType`)
4. Add a brief note at `Project/Models/<Name>.md` in the Obsidian vault via `mcp__obsidian-vault__create` (NOT `Prisma Models/` — that folder is framework-only; see the `sync-obsidian-project-notes` skill)
5. Run `npm run prisma` (migrate + generate + type-sync)

No new API routes needed — `[model]/*` handles it.
