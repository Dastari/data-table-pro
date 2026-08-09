# data-table-pro

Reusable React data table components built on TanStack Table with multiple UI adapter entrypoints.

## Adapters

`data-table-pro` ships one shared table implementation with base and
virtualization-first adapter entrypoints:

- `data-table-pro`: shadcn-compatible default
- `data-table-pro/heroui`: HeroUI-flavored adapter
- `data-table-pro/thegridcn`: The Gridcn-flavored adapter
- `data-table-pro/virtual`: shadcn with eager TanStack Virtual support
- `data-table-pro/heroui/virtual`: HeroUI with eager TanStack Virtual support
- `data-table-pro/thegridcn/virtual`: The Gridcn with eager TanStack Virtual support

All adapter entrypoints export the same table runtime API:

- `DataTable`

Dedicated subpath exports are also available:

- `data-table-pro/url-state`: `useDataTableUrlState`
- `data-table-pro/data-source`: typed server data source hook with manual table props
- `data-table-pro/adapter`: stable non-virtual adapter-authoring factory
- `data-table-pro/adapter/virtual`: virtual adapter-authoring factory
- `data-table-pro/advanced`: advanced composition hooks, panels, and adapter helpers
- `data-table-pro/types`: public TypeScript types

The current feature set includes client/manual filtering with local or
server-provided facets, grouping and aggregation, sorting and
pagination, unknown-total pagination, selection, detail panels, table/card
views, row/card virtualization, nested column groups, column
sizing/order/pinning/visibility, versioned persistence, named saved views,
versioned URL state, CSV export, inline row editing, density controls,
loading/empty states, summary rows, alternate row shading, infinite loading,
typed server data sources, and host-owned
drag/upload integrations. See
[`docs/API.md`](./docs/API.md) for the complete contract.

## Breaking Changes In 3.0.0

- package output is ESM-only; `require()`/CommonJS entrypoints were removed
- React peers are now `react@^19.2.0` and `react-dom@^19.2.0`
- `nuqs` is an optional peer used only by `data-table-pro/url-state`
- toolbar search now filters client-side tables by default; disable with `manualFiltering` or `enableToolbarQueryFiltering={false}`
- column filters, CSV export, row expansion, density, column pinning/reordering, selection policies, labels, and column preference persistence were added

## 4.0.0 Compatibility

Version 4.0.0 removes no public prop, type, or package entrypoint. It is a
compatibility-first major that releases the accumulated state, persistence,
quality, dependency, accessibility, and package-splitting work after 3.0.9.
The previously planned API cleanup is deferred to a future 5.0 release.

## Installation

```bash
pnpm add github:Dastari/data-table-pro#v4.3.0
```

This package is installed from GitHub refs. It is not published to npm.
Release tags such as `v4.3.0` include committed `dist/` output, so consumers
do not need to allow package build scripts during install.

Peer dependencies:

- `react@^19.2.8`
- `react-dom@^19.2.8`
- `nuqs@^2.9.2` only when using `data-table-pro/url-state`
- `@heroui/styles@^3.2.2` when using `data-table-pro/heroui`

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

### Virtualization-first entrypoints

Use a `/virtual` entrypoint when virtualization is enabled on initial render
or when the application preloads routes:

```tsx
import { DataTable } from "data-table-pro/virtual";

<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  virtualization
/>;
```

The existing base entrypoints remain source-compatible with
`virtualization`. They load the virtual row/card implementation only when the
prop enables it and render a bounded initial set as the Suspense fallback
(20 rows or 12 cards by default). Applications that never enable
virtualization do not statically load `@tanstack/react-virtual`.

Custom adapter authors should use `createDataTable` from
`data-table-pro/adapter`, or `createVirtualDataTable` from
`data-table-pro/adapter/virtual`.

### Advanced composition

`data-table-pro/advanced` is the supported import path for adapter authors and consumers composing around the extracted internals:

```tsx
import {
  createDataTable,
  primitiveUiKit,
  useColumnLayout,
  useControllableState,
  useDataTableColumns,
  useDataTableInstance,
  useDataTableState,
  useRowEditing,
  useStableCallback,
  DataTableBodyRow,
  DataTableCardPanel,
  DataTableFooterSection,
  DataTableHeaderCell,
  DataTableTablePanel,
  DataTableToolbarSection,
  type DataTableUiKit,
} from "data-table-pro/advanced";
```

Use this subpath instead of deep imports from `src`, `dist/chunk-*`, or other generated files. The regular adapter entrypoints remain the recommended API for application tables.

## Shared Styling Contract

Always import:

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
```

`data-table-pro/styles.css` provides:

- Tailwind package scanning for built JavaScript output
- package-owned inline-size container queries used by column `hideOn` and the toolbar

Responsive behavior is based on the table's allocated width, not the browser
viewport. The package uses fixed `sm`/`md`/`lg`/`xl`/`2xl` thresholds of
640/768/1024/1280/1536px for both CSS presentation and TanStack column state;
host Tailwind breakpoint customization and root font-size changes do not alter
these thresholds.

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

Card mode supports three built-in sizing modes:

```tsx
<DataTable
  viewMode="card"
  cardRenderer={renderCard}
  cardSizing="content"
/>
```

- `cardSizing="fixed"` is the default. It uses start-aligned grid tracks capped at `18rem`.
- `cardSizing="content"` uses `flex` and `flex-wrap`; card items are `w-fit max-w-full`, so renderer content determines each card width.
- `cardSizing="fluid"` uses responsive `1fr` grid tracks and stretches card items/renderers to the track width.

Use `cardGridClassName` and `cardClassName` as low-level overrides only when the built-in sizing modes are not enough.

Card mode can virtualize large card sets:

```tsx
<DataTable
  viewMode="card"
  cardRenderer={renderCard}
  virtualization={{
    card: {
      enabled: true,
      estimateCardHeight: 280,
      fallbackCardCount: 12,
      overscan: 4,
      lanes: "auto",
    },
  }}
/>
```

`virtualization.card.lanes` accepts a positive number or `"auto"`. `"auto"` derives lanes from the card viewport width. Before the scroll viewport is measurable, `fallbackCardCount` bounds first-paint work so large card collections do not mount in full.

Virtual rows are measured after mount, including variable-height wrapped table
cells and card lanes. Keep `getRowId`, row objects, and column definitions
stable and immutable: row ids are the virtual scroll keys and built-in search
indexes values by row/column identity. Development builds warn about duplicate
row ids and common identity churn. See [the benchmark harness](benchmarks/README.md)
for repeatable row- and column-scale measurements. Column virtualization is not
currently offered because it would compromise the native table's grouped-header,
pinned-column, resize, detail-row, and accessibility contracts.

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

### Grouped column headers

Define a group with an `id`, a `header`, and nested `columns`. Groups can be
nested to any depth and use the same TanStack-compatible definition shape as
leaf columns:

```tsx
import type {
  DataTableColumnDef,
  DataTableColumnGroupDef,
} from "data-table-pro";

const contactGroup: DataTableColumnGroupDef<Person> = {
  id: "contact",
  header: "Contact",
  meta: {
    align: "center",
    headerClassName: "bg-muted/50 font-semibold",
  },
  columns: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
  ],
};

const columns: Array<DataTableColumnDef<Person>> = [contactGroup];
```

The table creates one header row per nesting level and gives every group
header the span of its visible leaf columns. `header` may be a string or a
TanStack header render function. Use `meta.headerClassName`,
`meta.headerStyle`, and `meta.align` for group styling, or the group-specific
`headerClassName`, `headerStyle`, and `headerHeight` fields. `description`
provides an accessible description and native tooltip for the group heading.
Set `columnGroupHeaderHeight` to establish a table-wide group-heading height;
a group's `headerHeight` takes precedence.

Visibility, filters, ordering, pinning, sizing, editing, responsive hiding,
and CSV export continue to operate on leaf columns. Groups preserve their
shared headings during drag and keyboard reordering: by default a leaf may move
only within the same nested group. Set `freeReordering: true` on every group
boundary that a leaf should be able to cross (both groups when moving between
groups) to permit splitting or joining groups. A group resize handle resizes its
visible descendants proportionally.

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

### Row pinning

Enable first-class row pinning to keep important records at the top or bottom
of the table. `rowPinning` and `onRowPinningChange` follow TanStack's
`{ top: string[]; bottom: string[] }` state shape and also participate in
`initialState`, unified `state`, persistence, saved views, and `apiRef`.

```tsx
const apiRef = React.createRef<DataTableApi<Person>>();

<DataTable
  apiRef={apiRef}
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  enableRowPinning
  initialState={{ rowPinning: { top: ["important-id"], bottom: [] } }}
/>;

apiRef.current?.pinRow("important-id", "top");
apiRef.current?.unpinRow("important-id");
```

When enabled, each row's action menu includes top, bottom, and unpin actions.
Pinned rows render outside the virtualized center list and receive
`data-dtp-slot="data-table-pinned-row"` plus `data-row-pinned="top"` or
`"bottom"`; use `classNames.rowPinnedTop` and `classNames.rowPinnedBottom`
for adapter styling. `keepPinnedRows` defaults to `true`, keeping supplied rows
visible after client filtering or pagination; set it to `false` to hide pinned
rows that are not in the current model. For server/manual pagination, the
caller must still provide a pinned row in `data` for it to render. Card view
preserves the ordinary card order; it does not provide separate top/bottom
pinned regions.

Toolbar search filters local/client-side data by default. Server-side tables can keep filtering consumer-owned:

```tsx
<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  manualFiltering
  toolbarQueryValue={query}
  onToolbarQueryValueChange={setQuery}
/>
```

Client-side toolbar search now runs through TanStack Table's global-filter
pipeline. This means `globalFilterFn`, nested leaf columns, accessor functions,
sorting, filtering, pagination, and CSV export share one consistent row model.

Unknown-total server pagination can keep Next/Previous navigation without
inventing a total:

```tsx
<DataTable
  columns={columns}
  data={pageRows}
  getRowId={(row) => row.id}
  manualPagination
  pageIndex={pageIndex}
  pageSize={pageSize}
  hasNextPage={hasNextPage}
  onPageIndexChange={setPageIndex}
/>
```

CSV export supports `"filtered"`, `"page"`, `"selected"`, and `"all"` scopes.
String values that begin with spreadsheet formula characters are neutralized
by default; trusted applications can set `escapeFormulaValues: false`.

Versioned state persistence is available through the additive `persistence`
configuration:

```tsx
<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  persistence={{
    key: "people-table",
    version: 2,
    slices: ["visibility", "sizing", "order", "pinning", "density"],
    debounceMs: 150,
    migrate: (payload) => migratePeopleTableState(payload),
    onError: ({ error, operation }) => {
      reportPersistenceError(operation, error);
    },
  }}
/>
```

`columnPrefsKey="people-table"` remains supported as a shorthand. Legacy raw
preference objects are validated, loaded, and upgraded to the versioned
envelope on the next write.

Unified state and imperative commands can be adopted incrementally:

```tsx
const apiRef = React.createRef<DataTableApi<Person>>();
const [tableState, setTableState] = React.useState<DataTableState>(
  initialPeopleTableState,
);

<DataTable
  apiRef={apiRef}
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  state={tableState}
  onStateChange={setTableState}
/>;

apiRef.current?.scrollToRow("person-42");
const snapshot = apiRef.current?.snapshot();
```

Legacy controlled props remain supported and take precedence over the matching
unified slice during the 4.x compatibility window. A development warning
identifies conflicting inputs.

Enhanced URL state remains opt-in and isolated from the base bundle:

```tsx
const url = useDataTableUrlState({
  keyPrefix: "people-",
  version: 2,
  enabled: [
    "columnFilters",
    "columnVisibility",
    "density",
    "columnOrder",
    "columnPinning",
  ],
  migrate: (payload, targetVersion) =>
    migratePeopleUrlState(payload, targetVersion),
});
```

Grouping and row selection are also available as URL slices, but selection is
never written unless `"rowSelection"` is explicitly enabled.

Named saved views use versioned storage. Applications can keep their own UI,
or opt into the built-in table-options controls:

```tsx
<DataTable
  apiRef={apiRef}
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
  savedViews={{
    key: "people-table",
    version: 1,
    onChange: (views) => setSavedViews(views),
  }}
  toolbarDataOperations={{
    columnChooser: true,
    resetLayout: true,
    savedViews: true,
  }}
/>;

const saved = apiRef.current?.createSavedView("My view");
apiRef.current?.applySavedView(saved?.id ?? "");
apiRef.current?.resetState({ clearPersistence: true });
```

The enhanced column chooser is searchable and includes bulk show/hide,
keyboard-accessible move-earlier/move-later actions, and pin controls when
`enableColumnPinning` is enabled. Active search and column filters are also
shown as removable chips.

### Column filters

Declare toolbar filters on column meta:

```tsx
const columns: Array<DataTableColumnDef<Person>> = [
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filter: {
        type: "multi",
        options: ["active", "paused", "archived"],
      },
    },
  },
];
```

### Facets, grouping, and aggregation

Use `type: "faceted"` for a searchable multi-select filter with local
TanStack option counts. Supply `faceting.options` when counts come from the
server. Grouping is controlled with `grouping` / `onGroupingChange` (or stored
in `initialState.grouping`); set `enableGrouping` to expose the accessible
group/ungroup menu and removable grouping bar.

```tsx
const columns: Array<DataTableColumnDef<Person>> = [
  {
    accessorKey: "team",
    header: "Team",
    enableGrouping: true,
    meta: { filter: { type: "faceted" } },
  },
  {
    accessorKey: "hours",
    header: "Hours",
    aggregationFn: "sum",
  },
];

<DataTable
  columns={columns}
  data={people}
  getRowId={(person) => person.id}
  enableGrouping
  initialState={{ grouping: ["team"] }}
/>;
```

## Demo App

Run the bundled demo workbench:

```bash
pnpm demo
```

The demo uses generated employee data and can switch between the shadcn,
HeroUI, and The Gridcn adapters in light or dark themes. It exercises
selection, sorting, local automatic pagination, optional table/card
virtualization, column resizing, search, custom filter rows inside the table
toolbar, custom toolbar controls, row actions, selection actions, inline
editing, card view, hidden rows, infinite scroll, file upload hooks, drag
hooks, and loading states.

## Quality Gates

Contributors need a jsdom 30-supported Node.js release (`^22.22.2`,
`^24.15.0`, or `>=26`) and pnpm 11.17.0. CI uses Node.js 22.22.2.
TypeScript 7 provides the `tsc` command; the `typescript` package name
intentionally points to the official TypeScript 6 compatibility package
because ESLint and declaration bundling still require the compiler API that
TypeScript 7.0 does not ship.

Run the same focused checks used by CI:

```bash
pnpm lint
pnpm typecheck
pnpm demo:typecheck
pnpm test:coverage
pnpm build
pnpm api:check
pnpm test:consumer
pnpm demo:build
pnpm bundle:check
pnpm test:browser
```

`test:browser` covers shadcn, HeroUI, and The Gridcn in light and dark themes
with layout assertions, axe audits, and screenshot baselines.
`test:consumer` packs the repository and builds a clean consumer fixture
against the resulting tarball, including every supported adapter and subpath.
`bundle:check` enforces the base/adapter/URL-state/data-source/demo gzip budgets
and fails if a base, stable adapter-authoring, or data-source entrypoint
statically reaches TanStack Virtual.
`api-snapshots/public-api.md` is the generated, reviewable declaration
reference for this TypeScript package; the repository does not contain a Rust
crate or Rustdoc output. When a reviewed public declaration change is
intentional, regenerate the snapshot with
`pnpm api:update`. Install the browser once with
`pnpm exec playwright install chromium` before running browser tests locally.

Toolbar query note:

- `toolbarQueryValue` and `onToolbarQueryValueChange` control the toolbar search input only
- toolbar query and `column.meta.filter` controls filter client-side rows by default, including text, option, boolean, numeric-range, and date-range filters
- use `manualFiltering` for server-side filtering

Cell overflow note:

- primitive table cells now truncate with ellipsis by default
- custom rendered table cells now clip to their cell bounds by default
- override per column with `column.meta.overflow: "truncate" | "clip" | "wrap" | "visible"`
- use `"visible"` for non-portaled overlay-style cell content when intentional visual overflow is required

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
- [`docs/Roadmap.md`](./docs/Roadmap.md)
- [`CHANGELOG.md`](./CHANGELOG.md)
