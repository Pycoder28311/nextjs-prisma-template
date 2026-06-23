# Reusable UI Components — Mandatory Use

The framework ships a set of ready-made components under `app/framework/ui/`.
Whenever the user asks for any element that matches one of these, you **must**
use the corresponding component. Never substitute a raw HTML element or a
one-off styled `<div>`.

| When the user asks for… | Use this component | Import path | Key prop |
| --- | --- | --- | --- |
| Any button (primary, secondary, delete, nav, …) | `Button` | `@/framework/ui/buttons/Button` | `styleType` |
| Any text / label with sizing or an icon | `Text` | `@/framework/ui/text/Text` | `size`, `icon` |
| Any text input / form field | `Input` | `@/framework/ui/input/Input` | `styleType`, `type` |
| A search box | `SearchInput` | `@/framework/ui/searchInput/SearchInput` | `styleType` |
| An alert / toast / notification | `Alert` / `useAlert` | `@/framework/ui/Alert`, `@/framework/ui/useAlert` | — |
| A modal / dialog (absolute-positioned) | `AbsoluteModal` | `@/framework/ui/context/AbsoluteModal` | — |
| A modal / dialog (fixed/centered) | `FixedModal` | `@/framework/ui/context/FixedModal` | — |
| A rich-text / WYSIWYG editor | `RichTextEditor` | `@/framework/ui/RichTextEditor` | — |

---

## Style type doesn't exist? Ask first.

Each component accepts a named `styleType` (or `size` for `Text`). The valid
names come from the config files (see `instructions/style-configs.md`). If the
user requests a style type that is **not** in the config:

> **STOP. Do not invent a new variant.** Ask the user: *"The style type
> '[name]' doesn't exist. Did you mean one of [list the existing names]? Or
> would you like me to add a new variant to the config?"*

Only proceed after the user confirms either an existing name or explicitly asks
you to add a new one to the config.
