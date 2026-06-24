# data-table-pro

Reusable React data table components built on TanStack Table with multiple UI adapter entrypoints.

## Adapters

`data-table-pro` now ships one shared table implementation with three adapter entrypoints:

- `data-table-pro`: shadcn-compatible default
- `data-table-pro/heroui`: HeroUI-flavored adapter
- `data-table-pro/thegridcn`: The Gridcn-flavored adapter

All three adapter entrypoints export the same table runtime API:

- `DataTable`

Dedicated subpath exports are also available:

- `data-table-pro/url-state`: `useDataTableUrlState`
- `data-table-pro/types`: public TypeScript types

## Breaking Changes In 2.0.1

- `useDataTableUrlState` is no longer exported from `data-table-pro`, `data-table-pro/heroui`, or `data-table-pro/thegridcn`
- import the hook from `data-table-pro/url-state`
- `searchValue`, `onSearchValueChange`, `searchPlaceholder`, and `searchDebounceMs` were removed
- use `toolbarQueryValue`, `onToolbarQueryValueChange`, `toolbarQueryPlaceholder`, and `toolbarQueryDebounceMs` instead
- custom empty-state render functions now receive `toolbarQueryValue` instead of `searchValue`

## Installation

```bash
pnpm add data-table-pro
```

Peer dependencies:

- `react@^19`
- `react-dom@^19`
- `@heroui/styles@^3` when using `data-table-pro/heroui`

Baseline assumptions:

- Tailwind CSS v4
- host application owns theme tokens
- host application imports `data-table-pro/styles.css`

## Quick Start

### Shadcn default

```tsx
import { DataTable, type DataTableColumnDef } from "data-table-pro";
import { useDataTableUrlState } from "data-table-pro/url-state";
import "data-table-pro/styles.css";
```

### HeroUI

```tsx
import { DataTable, type DataTableColumnDef } from "data-table-pro/heroui";
import "@heroui/styles";
import "data-table-pro/styles.css";
```

### The Gridcn

```tsx
import { DataTable, type DataTableColumnDef } from "data-table-pro/thegridcn";
import "data-table-pro/styles.css";
import "./thegridcn-theme.css";
```

## Shared Styling Contract

Always import:

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
```

`data-table-pro/styles.css` provides:

- Tailwind package scanning for the built output
- the package-owned container query helpers used by column `hideOn`

It does not provide:

- shadcn theme tokens
- HeroUI theme tokens
- The Gridcn theme tokens

## Layout Requirements

`DataTable` defaults to `flexGrow={true}` and is designed to fill the remaining height of a constrained flex region. Consumers should only need to place it inside a normal `flex-1 min-h-0` content area:

```tsx
<main className="flex h-full min-h-0 flex-col">
  <section className="flex min-h-0 flex-1 flex-col">
    <DataTable flexGrow />
  </section>
</main>
```

The package owns the internal flex chain between root, toolbar, table/card viewport, scroll area, and footer. Toolbar and footer areas are `shrink-0`; the central table/card viewport and scroll area are `min-h-0 flex-1`.

Remaining parent requirement:

- the nearest height-constrained parent must provide a real flex sizing boundary such as `h-full`, `h-screen`, or a fixed-height panel plus `min-h-0`

For card mode, use `cardGridClassName` instead of targeting internal DOM:

```tsx
<DataTable
  viewMode="card"
  cardRenderer={renderCard}
  cardGridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
/>
```

## Adapter Requirements

### `data-table-pro`

Use this if the host app already provides shadcn-compatible theme tokens and styles.

### `data-table-pro/heroui`

The host app must also import:

```css
@import "@heroui/styles";
```

Use this adapter in apps standardized on HeroUI, React 19, and Tailwind v4.

Install `@heroui/styles` in the host app. This package does not bundle HeroUI styles for consumers.

### `data-table-pro/thegridcn`

The host app must provide a The Gridcn theme or token file. This package does not run the The Gridcn registry installer for the consumer.

## Example

```tsx
import { DataTable, type DataTableColumnDef } from "data-table-pro";

type Person = {
  id: string;
  name: string;
  email: string;
};

const columns: Array<DataTableColumnDef<Person>> = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function PeopleTable({ rows }: { rows: Array<Person> }) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      title="People"
    />
  );
}
```

### Controlled toolbar query

```tsx
<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  toolbarQueryValue={query}
  onToolbarQueryValueChange={setQuery}
/>
```

## Demo App

Run the bundled demo workbench:

```bash
pnpm demo
```

The demo uses generated employee data and can switch between the shadcn, HeroUI, and The Gridcn adapters. It exercises selection, sorting, local automatic pagination, optional row virtualization, column resizing, search, custom filter rows inside the table toolbar, custom toolbar controls, row actions, selection actions, inline editing, card view, hidden rows, infinite scroll, file upload hooks, drag hooks, and loading states.

Toolbar query note:

- `toolbarQueryValue` and `onToolbarQueryValueChange` control the toolbar search input only
- filtering remains consumer-owned unless you pass already-filtered `data`

Mobile toolbar note:

- built-in toolbar controls compact automatically in narrow container widths
- use `compactToolbar` to supply icon-only custom filter/action content for the collapsed toolbar strip
- `compactToolbar` stays inline through small and medium container widths
- `customToolbar` becomes the separate desktop secondary toolbar row from the large container breakpoint upward
- if `compactToolbar` is omitted, `customToolbar` is reused in the compact row as a fallback

Example:

```tsx
<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  toolbarQueryValue={query}
  onToolbarQueryValueChange={setQuery}
  customToolbar={
    <>
      <Button type="button" variant="outline">
        Status
      </Button>
      <Button type="button" variant="outline">
        Reset Filters
      </Button>
    </>
  }
  compactToolbar={
    <>
      <Button type="button" variant="outline" size="icon-sm" aria-label="Status filters">
        <IconFilter />
      </Button>
      <Button type="button" variant="outline" size="icon-sm" aria-label="Reset filters">
        <IconRefresh />
      </Button>
    </>
  }
/>
```

Use `compactToolbar` when the desktop toolbar content is too wide or too text-heavy for the collapsed small/medium toolbar strip.

## Migration Notes

- Existing shadcn consumers can keep importing from `data-table-pro`.
- Existing consumers should now import `data-table-pro/styles.css`.
- Existing consumers can remove copied `.data-table-container-query` and `.dt-hide-on-*` helpers from app globals after upgrading.
- Existing consumers must import `useDataTableUrlState` from `data-table-pro/url-state`.
- Existing consumers must rename legacy `search*` props to `toolbarQuery*`.
- HeroUI migrations change imports to `data-table-pro/heroui` and add `@heroui/styles`.
- The Gridcn migrations change imports to `data-table-pro/thegridcn` and add a host-supplied The Gridcn theme/token stylesheet.

See:

- [`docs/API.md`](./docs/API.md)
- [`docs/Migration.md`](./docs/Migration.md)
- [`docs/Adapters.md`](./docs/Adapters.md)
- [`CHANGELOG.md`](./CHANGELOG.md)
