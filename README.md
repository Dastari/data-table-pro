# data-table-pro

Standalone React data table components extracted from Digitise and packaged for reuse.

Full API documentation is available in [`docs/API.md`](./docs/API.md).

## What is included

- `DataTable` built on `@tanstack/react-table`
- Supporting card view, toolbar, pagination, selection, inline editing, and infinite scroll behavior
- Bundled shadcn-compatible UI primitives required by the table
- `useDataTableUrlState` for `nuqs`-based query-string state
- A compiled stylesheet export at `data-table-pro/styles.css`

## What is intentionally excluded

- Digitise-specific GraphQL ORM helpers and generated GraphQL types
- Any reintegration changes back into the main Digitise frontend

## Installation

```bash
pnpm add data-table-pro
```

Peer dependencies:

- `react`
- `react-dom`

## Usage

```tsx
import "data-table-pro/styles.css";
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
