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

The host app should install `@heroui/styles` itself. `data-table-pro` only references that stylesheet in documentation and does not bundle it for consumers.

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

## Adapter Class Hooks

Adapter implementations can override specific table surfaces through `ui.classNames`.

Compact toolbar icon buttons now have a dedicated hook:

- `toolbarCompactIconButton`: applied to compact toolbar icon controls such as the collapsed search trigger, options button, view toggle buttons, icon-only selection actions, and icon-only/collapsed toolbar actions

Example:

```ts
classNames: {
  ...shadcnUiKit.classNames,
  toolbarCompactIconButton: "size-8",
}
```

Use that hook when a host design system wants compact toolbar icon buttons to be larger or smaller than the package defaults without targeting toolbar DOM structure directly.

## Full-Height Layout

`DataTable` defaults to `flexGrow={true}`. Put it in a constrained flex content region and let the package handle internal sizing:

```tsx
<main className="flex h-full min-h-0 flex-col">
  <section className="flex min-h-0 flex-1 flex-col">
    <DataTable flexGrow />
  </section>
</main>
```

One host layout constraint remains: an ancestor still needs to establish the actual height boundary with `h-full`, `h-screen`, or a fixed-height container plus `min-h-0`.

Card mode supports explicit grid density without targeting internals:

```tsx
<DataTable
  viewMode="card"
  cardRenderer={renderCard}
  cardGridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
/>
```

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
