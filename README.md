# data-table-pro

Reusable React data table components built on TanStack Table with multiple UI adapter entrypoints.

## Adapters

`data-table-pro` now ships one shared table implementation with three adapter entrypoints:

- `data-table-pro`: shadcn-compatible default
- `data-table-pro/heroui`: HeroUI-flavored adapter
- `data-table-pro/thegridcn`: The Gridcn-flavored adapter

All three entrypoints export the same runtime API:

- `DataTable`
- `useDataTableUrlState`
- the same public TypeScript types

## Installation

```bash
pnpm add data-table-pro
```

Peer dependencies:

- `react@^19`
- `react-dom@^19`

Baseline assumptions:

- Tailwind CSS v4
- host application owns theme tokens
- host application imports `data-table-pro/styles.css`

## Quick Start

### Shadcn default

```tsx
import { DataTable, type DataTableColumnDef } from "data-table-pro";
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

## Demo App

Run the bundled demo workbench:

```bash
pnpm demo
```

The demo uses generated employee data and can switch between the shadcn, HeroUI, and The Gridcn adapters. It exercises selection, sorting, local automatic pagination, optional row virtualization, column resizing, search, custom filter rows inside the table toolbar, custom toolbar controls, row actions, selection actions, inline editing, card view, hidden rows, infinite scroll, file upload hooks, drag hooks, and loading states.

## Migration Notes

- Existing shadcn consumers can keep importing from `data-table-pro`.
- Existing consumers should now import `data-table-pro/styles.css`.
- Existing consumers can remove copied `.data-table-container-query` and `.dt-hide-on-*` helpers from app globals after upgrading.
- HeroUI migrations change imports to `data-table-pro/heroui` and add `@heroui/styles`.
- The Gridcn migrations change imports to `data-table-pro/thegridcn` and add a host-supplied The Gridcn theme/token stylesheet.

See:

- [`docs/API.md`](./docs/API.md)
- [`docs/Migration.md`](./docs/Migration.md)
- [`docs/Adapters.md`](./docs/Adapters.md)
