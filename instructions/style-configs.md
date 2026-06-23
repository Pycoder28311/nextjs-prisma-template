# Component Style Configs — Reference

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

---

## How a config drives a component (example)

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
