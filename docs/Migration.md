# Migration Guide

## 5.0.0 Breaking Changes: TanStack React Table v9

Version 5.0.0 upgrades from `@tanstack/react-table@8.21.3` to v9.1.2. It
targets v9 directly and does not use the deprecated `useLegacyTable`
compatibility hook.

Install the major release from its Git tag:

```bash
pnpm add github:Dastari/data-table-pro#v5.0.0
```

### Compatibility boundary

The component-level wrapper remains compatible where its contract is owned by
this project:

- Controlled v8-style `Record<string, boolean>` row selection is normalized to
  v9's selected-only state at the integration boundary.
- Public and persisted column pinning remains `{ left, right }`. Only the
  TanStack instance receives `{ start, end }`, so existing preferences, URLs,
  saved views, labels, and physical sticky-column styling remain valid.
- `apiRef.current.getState()` remains the stable wrapper snapshot API. Code
  that asks for the underlying v9 table through `apiRef.current.getTable()`
  reads its current TanStack state from `table.store.state`.
- Existing package entrypoints, adapters, persisted preferences, saved views,
  and URL-state formats are unchanged.

The implementation itself now uses `useTable`, one explicit feature registry,
v9 row-model slots, and project-owned table/row/column/cell/header type aliases
that contain TanStack's new feature generic.

### Required consumer changes

Direct TanStack-facing code must adopt these v9 changes:

| V8 form | V9 form used by the project |
| --- | --- |
| `sortingFn` | `sortFn` |
| callable custom `AggregationFn` | context-based `DataTableAggregationFn` definition |
| `table.getState()` | `table.store.state` (snapshot) |
| `getPrePaginationRowModel()` | `getPrePaginatedRowModel()` |
| internal pinning `left` / `right` state and methods | logical `start` / `end` state and method families |
| destructured/spread row, cell, column, or header methods | call methods through their owning instance |
| `getIsSome*Selected()` means some but not all | means at least one; combine with `!getIsAll*Selected()` for indeterminate state |
| raw `Table<TData>`, `Row<TData>`, `ColumnDef<TData>`, etc. | add v9's leading `TFeatures` generic or use project-owned `DataTable*` types |
| primitive row data | record or array row data |

For column sorting, rename only the TanStack column-definition option:

```tsx
const columns: Array<DataTableColumnDef<Person>> = [
  {
    accessorKey: "name",
    sortFn: "alphanumeric",
  },
];
```

Register a custom aggregation as a definition with an `aggregate` method:

```tsx
<DataTable
  aggregationFns={{
    doubledSum: {
      aggregate: ({ getValue, rows }) =>
        rows.reduce((total, row) => total + Number(getValue(row)), 0) * 2,
    },
  }}
  columns={[
    { accessorKey: "team", enableGrouping: true },
    { accessorKey: "hours", aggregationFn: "doubledSum" },
  ]}
  data={rows}
  getRowId={(row) => row.id}
/>
```

The wrapper and underlying table now expose deliberately different pinning and
state boundaries:

```tsx
const wrapperState = apiRef.current?.getState();
// wrapperState.columnPinning is still { left, right }

const table = apiRef.current?.getTable();
const tanStackState = table?.store.state;
// tanStackState.columnPinning is { start, end }
```

Do not extract prototype methods from rows, cells, columns, or headers:

```tsx
// Incorrect in v9: const { getValue } = row;
const value = row.getValue("name");
const values = rows.map((currentRow) => currentRow.getValue("name"));
```

For an indeterminate selection checkbox, test both v9 predicates:

```tsx
const indeterminate =
  table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
```

### Advanced direct-TanStack checklist

Consumers that construct their own TanStack tables alongside this package, or
that rely heavily on the instance returned by `apiRef.current.getTable()`,
should also apply the remaining v9 architecture changes:

- replace `useReactTable(options)` with `useTable({ ...options, features })`;
- register each used feature with `tableFeatures()`; the core row model is
  automatic, while optional row models move from `get*RowModel` table options
  to `create*RowModel()` feature slots;
- move `sortingFns`, `filterFns`, and `aggregationFns` registries into the
  feature registry and rename `sortingFns` to `sortFns`;
- split table-level `enablePinning` into `enableColumnPinning` and
  `enableRowPinning` where applicable;
- register `columnSizingFeature` and `columnResizingFeature` separately, and
  rename `columnSizingInfo`, `setColumnSizingInfo`, and
  `onColumnSizingInfoChange` to their `columnResizing` equivalents; and
- replace underscore-prefixed v8 internals with public v9 methods, including
  `row.getAllCellsByColumnId()`, `table.getTopRows()`,
  `table.getCenterRows()`, and `table.getBottomRows()`.

The package's own integration has completed this checklist. These items apply
only to consumer code that directly constructs or operates on TanStack
instances.

### Post-5.0 follow-up work

These are optimizations and additional coverage, not release blockers or
unrecorded compatibility requirements:

- replace the broad built-in filter/sort/aggregation registries with an
  audited tree-shakeable registry while retaining documented string names;
- add focused consumer fixtures for v9-only `sortFn`, custom filters, and
  custom aggregations;
- evaluate narrower `useTable` selectors and `Subscribe` boundaries after
  measuring render behavior.

## 4.5.0 additive layout release

Version 4.5.0 removes no public prop, type, or package entrypoint. Existing
tables retain hover-only scrollbars by default; set
`scrollbarVisibility="always"` on data tables that require persistent
horizontal and vertical scrollbars.

Fixed-width `layoutMode="fill"` tables no longer stretch their last visible
data column. When all currently visible data columns are fixed, the table
automatically creates a transparent flexible spacer after the data columns and
before right-pinned row actions. Applications should not define, order, pin,
export, or otherwise reference the reserved `__spacer__` column.

The spacer decision follows current `columnVisibility`, including leaves in
grouped definitions and responsive visibility. Restoring a genuine flexible
data column removes the spacer. If fixed column minimums exceed the viewport,
the table keeps their widths and scrolls horizontally rather than compressing
them. These rules are the same for standard and virtual table adapters.

## 4.4.0 additive modernization release

Version 4.4.0 removes no public prop, type, or package entrypoint. A 4.3 table
keeps native table semantics and its existing toolbar, paging, editing, and
server behavior until a new option is enabled.

- Use `enableGrouping`, `grouping` / `onGroupingChange`, or
  `initialState.grouping` to adopt grouping. `DataTableState.grouping` remains
  optional so existing complete state object literals compile unchanged.
- Use `interactiveGrid` (or `accessibility={{ mode: "grid" }}`) only for an
  application-style keyboard grid. Add `enableCellSelection` separately when
  rectangular range selection is wanted; ordinary row selection is
  independent.
- Use `clipboard` for opt-in copy/paste behavior. `copyToClipboard()` remains
  asynchronous and now loads its implementation on first use. Setting
  `clipboard={{ copy: false }}` continues to disable imperative/default range
  copy.
- Use `toolbarDataOperations` for the searchable column manager, filter chips,
  reset, and saved-view UI. Existing `savedViews` API-ref commands still work
  without built-in controls. Newly created saved views include grouping by
  default; an explicit `savedViews.slices` list remains authoritative.
- Use `autoPageSize`, `stateOverlay`, `enablePrint`, and `enableFullscreen`
  independently. Their optional implementations load only when requested.
- Data-source callbacks may consume the new `globalFilter`, `grouping`,
  `aggregations`, and `expansionPath` request fields and return `rowIds`,
  `facets`, `aggregates`, and `metadata`. Existing sources can ignore all new
  fields and keep returning their prior result shape.
- Numeric range filters without explicit `min` / `max` now expose bounds from
  TanStack's local faceted row model. Set explicit limits to retain fixed
  application-defined bounds; manual/server filters remain server-owned.

The base gzip budget rises from 42 KiB to 48 KiB with a measured 46.1 KiB
static graph. Clipboard, enhanced toolbar operations, auto sizing, error
overlays, virtualization, and the data-source hook are not added to that
default static path when unused.

Column virtualization is not part of 4.4. The package keeps native table
layout and grouped-header, pinning, resizing, detail-row, and accessibility
correctness instead of shipping a partial body-only virtualizer.

## 4.3.0 additive feature release

Version 4.3.0 removes no prop, type, or entrypoint. Existing flat-row tables,
detail panels based on `renderExpandedRow`, manual server data, and column
reordering continue to work.

- New server integrations can import `useDataTableDataSource` from
  `data-table-pro/data-source`; existing `data` plus manual flags remain
  supported.
- `renderExpandedRow` remains a deprecated detail-panel bridge. Use
  `detailPanel={{ render, getRowCanExpand }}` when adopting `getSubRows` so
  application details and hierarchical expansion have independent state.
- Nested column groups are now locked during reordering by default. Add
  `freeReordering: true` to every group boundary that intentionally permits a
  leaf to cross it.
- Row pinning is opt-in through `enableRowPinning`. Add `rowPinning` to custom
  persistence/saved-view slice lists if those lists override the defaults.
- Responsive presentation is owned by `data-table-pro/styles.css` container
  queries. Consumers should not add viewport media-query copies of the table
  breakpoints.

## 4.0.0 code-splitting entrypoints

No existing import or prop needs to change. The base adapter entrypoints still
accept `virtualization`, but TanStack Virtual is now loaded in an on-demand
chunk only when table or card virtualization is enabled:

```tsx
// Still supported; virtual code loads on first use.
import { DataTable } from "data-table-pro";

<DataTable virtualization columns={columns} data={rows} getRowId={getRowId} />;
```

Applications that always virtualize can remove that first-use async boundary
by changing only the import:

```tsx
import { DataTable } from "data-table-pro/virtual";
```

Equivalent eager entrypoints are `data-table-pro/heroui/virtual` and
`data-table-pro/thegridcn/virtual`. Props, types, styling, state, and adapter
behavior are unchanged. During on-demand loading, the base entry keeps table
state in the parent component and renders a bounded initial fallback (20 rows
or 12 cards by default). Use `fallbackRowCount` or `fallbackCardCount` when a
different first-paint cap is appropriate.

Adapter authors can move from the broad compatibility surface to:

```ts
import { createDataTable } from "data-table-pro/adapter";
import { createVirtualDataTable } from "data-table-pro/adapter/virtual";
```

`data-table-pro/advanced` remains available throughout 4.x. Package JavaScript
is now minified with source maps; generated chunk filenames remain private and
must not be imported directly.

## 4.0.0 dependency and toolchain baseline

The package peer minimums have moved to:

- `react@^19.2.8`
- `react-dom@^19.2.8`
- `nuqs@^2.9.2` when using `data-table-pro/url-state`
- `@heroui/styles@^3.2.2` when using `data-table-pro/heroui`

No table prop, type, or entrypoint was removed, but applications pinned below
one of these peer minimums must update that dependency before consuming the
next release.

Repository contributors now need a jsdom 30-supported Node.js release
(`^22.22.2`, `^24.15.0`, or `>=26`) and pnpm 11.21.0. CI uses Node.js
22.22.2. TypeScript 7.0 removes `baseUrl` and does not expose the programmatic
compiler API needed by typescript-eslint and tsup. The repository therefore
follows the TypeScript team's side-by-side migration:

- `@typescript/native` aliases TypeScript 7 and provides `tsc`
- `typescript` aliases `@typescript/typescript6` for API-based tooling
- path mappings use explicit relative paths instead of `baseUrl`

Keep both compiler packages until the linting and declaration-bundling tools
support the TypeScript 7 API. pnpm 11 also enforces an explicit dependency
build policy: esbuild's installer is allowed, while MSW's unused transitive
postinstall is denied.

## 4.0.0 clickable-row semantic correction

Clickable table rows now preserve their native row semantics instead of
rendering `role="button"` on a `<tr>` that may contain checkboxes, links, and
row-action buttons. The row remains focusable and continues to invoke
`onRowClick` with pointer input, Enter, or Space.

This does not remove or change a public TypeScript API. It is a DOM-semantic
compatibility change: applications or tests that queried
`tr[role="button"]` must stop relying on that undocumented selector. Prefer a
class returned by `getRowClassName`, the row containing known cell content, or
an application-owned wrapper/test identifier.

## 3.0.9 behavior corrections

Version 3.0.9 is source-compatible with 3.0.8: no prop, type, or entrypoint was
removed. It intentionally corrects three runtime behaviors:

1. Client toolbar queries now run through TanStack Table global filtering.
   A supplied `globalFilterFn` is therefore invoked. Keep
   `enableToolbarQueryFiltering={false}` for a display-only query, or
   `manualFiltering` when the server owns filtering.
2. CSV export now defaults to CRLF row endings and neutralizes string values
   beginning with `=`, `+`, `-`, or `@`. Use `lineEnding: "\n"` only for an
   LF-specific consumer. Use `escapeFormulaValues: false` only for trusted
   data when exact legacy output is required.
3. Manual pagination no longer treats the loaded page length as the total when
   both `totalRowCount` and `pageCount` are absent. Supply `hasNextPage` for
   cursor/unknown-total navigation, or supply a known total as before.

New `onActionError` handling is additive. Built-in async callbacks no longer
leave rejected promises unhandled; consumers can use the error context to show
their preferred toast, retry, or inline error state.

## Adopt versioned persistence during 4.x

`columnPrefsKey` remains functional. It now reads legacy raw preference objects
and upgrades them to a validated, versioned envelope on the next write.

Applications that need schema changes, custom storage, or explicit persisted
slices can move additively:

```tsx
// Before and still supported
<DataTable columnPrefsKey="people" />

// Compatibility replacement
<DataTable
  persistence={{
    key: "people",
    version: 2,
    slices: ["visibility", "sizing", "order", "pinning", "density"],
    migrate: (payload, targetVersion) =>
      migrateTablePreferences(payload, targetVersion),
  }}
/>
```

When both props are supplied, `persistence` takes precedence. No removal is
planned during 4.x.

## Adopt unified state during 4.x

The split controlled props remain supported. `initialState`, `state`, and
`onStateChange` can be adopted one slice at a time:

```tsx
const [tableState, setTableState] = useState<DataTableState>(initialState);

<DataTable
  state={tableState}
  onStateChange={setTableState}
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
/>
```

During 4.x, a legacy controlled prop takes precedence over its matching unified
slice. For example, `pageIndex`/`pageSize` override `state.pagination`, and
`sorting` overrides `state.sorting`. Development builds warn when both are
present so migrations can remove conflicts deliberately.

Column sizing can now be controlled with `columnSizing` and
`onColumnSizingChange`. `apiRef` provides snapshot/restore and reset commands
without requiring imports from `data-table-pro/advanced`.

## Adopt expanded URL state during 4.x

Existing query, page, page-size, sort, view, and hidden-row URL behavior is
unchanged. New slices are opt-in and versioned:

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

A mismatched enhanced URL schema is ignored unless `migrate` returns valid
replacement state. URLs created before enhanced slices existed continue to
decode their original fields. Selection requires the explicit
`"rowSelection"` opt-in so adopting the expanded hook does not place row IDs
in shareable URLs accidentally.

## Adopt named saved views and persistence resets

Saved views are additive and do not add built-in controls:

```tsx
const apiRef = useRef<DataTableApi<Person>>(null);

<DataTable
  apiRef={apiRef}
  savedViews={{
    key: "people",
    version: 1,
    onChange: setSavedViews,
  }}
/>;

const view = apiRef.current?.createSavedView("Operations");
apiRef.current?.applySavedView(view?.id ?? "");
apiRef.current?.renameSavedView(view?.id ?? "", "Ops");
apiRef.current?.deleteSavedView(view?.id ?? "");
```

The default saved-view slices exclude pagination, selection, and expansion.
Opt into them with `savedViews.slices` only when those transient values are
meaningful to the application.

Use `clearPersistedState()` to remove preferences without changing live state.
Use `resetColumnLayout({ clearPersistence: true })` or
`resetState({ clearPersistence: true })` to discard the old payload and restore
initial/default values in one command.

## Deferred wrapper API cleanup after 5.0

Version 5.0.0 uses its major boundary for the TanStack v9 migration above. It
does not remove the unrelated wrapper compatibility APIs previously proposed
for 5.0. Those candidates remain deferred until a later major and still
require a stable replacement and deprecation period:

| Current compatibility API | Possible future API | Compatibility path |
| --- | --- | --- |
| `toolbarQueryValue`, `onToolbarQueryValueChange`, `toolbarQueryDebounceMs` | `globalFilter`, `onGlobalFilterChange`, `globalFilterDebounceMs` | Both names must work during a documented deprecation window before removal. |
| Split `pageIndex`/`pageSize` props and callbacks | Unified pagination state and `onPaginationChange` | Unified state remains additive until the split props are formally deprecated. |
| `renderExpandedRow` and `getRowCanExpand` for detail content | `detailPanel={{ render, getCanExpand }}` | The explicit detail-panel API must remain stable before tree expansion takes exclusive ownership. |
| `columnPrefsKey` | Versioned `persistence` configuration | `columnPrefsKey` remains a compatibility shorthand until a later deprecation. |
| `virtualization` on the base component | Dedicated virtual adapter entrypoints | Both entry styles continue to coexist; base imports load virtual panels on demand. |
| Broad `data-table-pro/advanced` imports | Stable `data-table-pro/adapter` contracts | A complete advanced-import mapping is required before removal. |

Any future removal is gated on:

- at least one stable release containing every replacement
- development warnings for conflicting old/new props
- a codemod for renamed props and entrypoints
- migration fixtures for every adapter, server pagination, URL state,
  virtualization, detail panels, and persisted state
- safe migration or invalidation of versioned persisted/URL payloads

See [the modernization roadmap](./Roadmap.md) for sequencing, acceptance
criteria, and the complete breaking-change register.

## Overview

`data-table-pro` now supports multiple UI adapter entrypoints without changing the table API.

Choose the migration path that matches the UI stack of the host app.

## 3.0.0 Breaking Changes

Projects upgrading to `3.0.0` should review these changes:

1. The package is ESM-only. Remove `require("data-table-pro")` usage.
2. React peers are now `react@^19.2.0` and `react-dom@^19.2.0`.
3. `nuqs` is an optional peer required only when importing `data-table-pro/url-state`.
4. Toolbar search filters local rows by default. Use `manualFiltering` for server-side tables or `enableToolbarQueryFiltering={false}` when the toolbar input should be display-only.
5. `column.meta.filter` renders built-in toolbar filters for text, select,
   multi-select, boolean, numeric-range, and date-range controls. Range filter
   state uses serializable `{ from, to }` objects with inclusive bounds.
6. New optional APIs cover row expansion, column ordering/pinning, CSV export, density, labels, summary rows, RTL direction, and column preference persistence.

## 2.0.1 Breaking Changes

Projects upgrading to `2.0.1` must make these API changes:

1. Move `useDataTableUrlState` imports to `data-table-pro/url-state`.
2. Rename `searchValue` to `toolbarQueryValue`.
3. Rename `onSearchValueChange` to `onToolbarQueryValueChange`.
4. Rename `searchPlaceholder` to `toolbarQueryPlaceholder`.
5. Rename `searchDebounceMs` to `toolbarQueryDebounceMs`.
6. Update custom empty-state render functions to read `toolbarQueryValue`.

## 1. Stay on shadcn/default

No import-path change is required.

Before:

```ts
import { DataTable } from "data-table-pro";
```

After:

```ts
import { DataTable } from "data-table-pro";
import "data-table-pro/styles.css";
```

Host app notes:

- keep the existing shadcn-compatible theme tokens
- import `data-table-pro/styles.css`
- remove copied `.data-table-container-query` and `.dt-hide-on-*` helpers if they were manually duplicated in app globals

## 2. Move to HeroUI

Change imports:

```ts
import { DataTable } from "data-table-pro/heroui";
```

Host stylesheet:

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "data-table-pro/styles.css";
```

Host app requirements:

- React 19
- Tailwind CSS v4
- HeroUI style import in the app
- `@heroui/styles` installed in the host app

Migration notes:

- remove assumptions that the table inherits shadcn-specific theme tokens
- HeroUI table internals use HeroUI-compatible slot classes, so shadcn variables such as `--border`, `--card`, `--input`, and `--muted` are not required
- keep the `DataTable` props unchanged
- downstream app code should only change the import path and host style setup

## 3. Move to The Gridcn

Change imports:

```ts
import { DataTable } from "data-table-pro/thegridcn";
```

Host stylesheet:

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
@import "./thegridcn-theme.css";
```

Host app requirements:

- a host-supplied The Gridcn theme or token stylesheet
- Tailwind CSS v4 recommended

Migration notes:

- no `shadcn add` step is required for `data-table-pro` itself
- no 3D or showcase-only The Gridcn setup is required
- keep the `DataTable` props unchanged

## Required upgrade steps

### Move `useDataTableUrlState` to the dedicated subpath

Before:

```ts
import { useDataTableUrlState } from "data-table-pro";
```

After:

```ts
import { useDataTableUrlState } from "data-table-pro/url-state";
```

The same change applies if the hook was previously imported from `data-table-pro/heroui` or `data-table-pro/thegridcn`.

### Move from `search*` props to `toolbarQuery*`

Before:

```tsx
<DataTable
  searchValue={query}
  onSearchValueChange={setQuery}
  searchPlaceholder="Search people"
  searchDebounceMs={150}
/>
```

After:

```tsx
<DataTable
  toolbarQueryValue={query}
  onToolbarQueryValueChange={setQuery}
  toolbarQueryPlaceholder="Search people"
  toolbarQueryDebounceMs={150}
/>
```

### Update custom empty-state render functions

Before:

```tsx
emptyState={({ searchValue }) => <div>No matches for {searchValue}</div>}
```

After:

```tsx
emptyState={({ toolbarQueryValue }) => (
  <div>No matches for {toolbarQueryValue}</div>
)}
```

## What did not change

- `DataTable` import paths
- adapter entrypoints
- public exported types through `data-table-pro/types`
- layout and styling integration requirements
