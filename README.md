# data-table-pro

Standalone React data table components extracted from Digitise and packaged for reuse.

Full API documentation is available in [`docs/API.md`](./docs/API.md).

## What is included

- `DataTable` built on `@tanstack/react-table`
- Supporting card view, toolbar, pagination, selection, inline editing, and infinite scroll behavior
- Bundled shadcn-compatible UI primitives required by the table
- `useDataTableUrlState` for `nuqs`-based query-string state

## What is intentionally excluded

- Digitise-specific GraphQL ORM helpers and generated GraphQL types
- Any reintegration changes back into the main Digitise frontend
- A package-owned global stylesheet

## Installation

```bash
pnpm add data-table-pro
```

Peer dependencies:

- `react`
- `react-dom`

## Styling requirements

`data-table-pro` does not ship a global stylesheet. The consuming app must provide the existing Tailwind + shadcn stylesheet it already uses for the rest of the application.

That host stylesheet must already:

- import the app's Tailwind and shadcn layers
- define the theme tokens used by the shared UI primitives
- include the table container-query helpers below

```css
.data-table-container-query {
  container-type: inline-size;
  container-name: data-table;
}

@container data-table (width < 40rem) {
  .dt-hide-on-sm {
    display: none;
  }
}

@container data-table (width < 48rem) {
  .dt-hide-on-md {
    display: none;
  }
}

@container data-table (width < 64rem) {
  .dt-hide-on-lg {
    display: none;
  }
}

@container data-table (width < 80rem) {
  .dt-hide-on-xl {
    display: none;
  }
}

@container data-table (width < 96rem) {
  .dt-hide-on-2xl {
    display: none;
  }
}
```

The table root also renders a named Tailwind container class, `@container/data-table`, so any descendant inside the table can use Tailwind container-query variants in `className` strings, such as `@sm/data-table:*`, `@3xl/data-table:*`, or arbitrary thresholds like `@min-[48rem]/data-table:*`.

Tailwind container-query sizes are not the same as viewport breakpoint names. For example, `@md` is `28rem` for container queries, while the table's built-in `hideOn: "md"` behavior uses `48rem`. If you want to match `hideOn`, prefer `@3xl/data-table:*` or `@min-[48rem]/data-table:*`.

Example:

```tsx
const columns: Array<DataTableColumnDef<Person>> = [
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      headerClassName: "hidden @3xl/data-table:table-cell",
      cellClassName: "hidden @3xl/data-table:table-cell",
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      responsiveClassName: "@lg/data-table:text-sm",
    },
  },
];
```

Use `meta.hideOn` when you want the built-in column visibility behavior. Use Tailwind container-query variants in `className` strings when you want custom conditional styling inside the table.

## Usage

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

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```
