# Adapter Setup Reference

## Entry Points

| Adapter | Import path | Extra host styles |
| --- | --- | --- |
| Shadcn default | `data-table-pro` | none beyond host shadcn/theme tokens |
| HeroUI | `data-table-pro/heroui` | `@heroui/styles` |
| The Gridcn | `data-table-pro/thegridcn` | host The Gridcn theme/token CSS |

## Required Imports

### Shadcn default

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
```

### HeroUI

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "data-table-pro/styles.css";
```

The HeroUI adapter adds a `.dtp-heroui` root class and supplies HeroUI slot classes for table containers, dividers, fields, muted text, pagination, empty states, dropdowns, and tooltips. It does not require shadcn-style tokens such as `--border`, `--card`, `--input`, or `--muted`.

Override HeroUI slot styling in the host app only if you want a different visual treatment:

```css
.dtp-heroui {
  --separator: color-mix(in oklch, var(--accent) 45%, transparent);
}
```

### The Gridcn

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
@import "./thegridcn-theme.css";
```

## Styling Ownership

- `data-table-pro/styles.css` owns package scanning and table container-query helpers.
- The host app owns theme tokens and global visual language.
- The package does not ship shadcn theme tokens.
- The package does not ship HeroUI theme tokens.
- The package does not ship The Gridcn theme tokens.

## Known Non-Goals

- no runtime adapter prop
- no mixed-library provider that swaps adapters dynamically
- no bundled The Gridcn registry installer flow
- no package-owned app theme
- no The Gridcn 3D/showcase components

## Recommended `globals.css` order

### Shadcn default

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
```

### HeroUI

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "data-table-pro/styles.css";
```

No shadcn token aliases are required for the HeroUI adapter.

### The Gridcn

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
@import "./thegridcn-theme.css";
```
