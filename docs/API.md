# API Reference

This document describes the public API exported by `data-table-pro`.

## Package Entry Points

Adapter entrypoints export the table component and public types. Dedicated
subpaths expose URL state, advanced composition, and types without relying on
generated chunk names or source-directory deep imports.

### Shadcn default

```ts
import {
  DataTable,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro";

import { useDataTableUrlState } from "data-table-pro/url-state";
import { useDataTableDataSource } from "data-table-pro/data-source";
import type { DataTableProps as DataTablePropsFromSubpath } from "data-table-pro/types";
```

### HeroUI

```ts
import {
  DataTable,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro/heroui";
```

### The Gridcn

```ts
import {
  DataTable,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro/thegridcn";
```

### Virtualization-first adapters

```ts
import { DataTable as ShadcnVirtualDataTable } from "data-table-pro/virtual";
import { DataTable as HeroVirtualDataTable } from "data-table-pro/heroui/virtual";
import { DataTable as GridVirtualDataTable } from "data-table-pro/thegridcn/virtual";
```

These entrypoints export the same `DataTableProps` and public types as their
base adapters, but TanStack Virtual is in their static module graph. Base
adapter entrypoints preserve the base `virtualization` prop by loading the
virtual panels on demand.

### Adapter authoring

```ts
import {
  createDataTable,
  primitiveUiKit,
  type DataTableUiKit,
} from "data-table-pro/adapter";
import { createVirtualDataTable } from "data-table-pro/adapter/virtual";
```

`data-table-pro/adapter` is the narrow stable entrypoint. The virtual factory
is separate so a non-virtual custom adapter does not statically load TanStack
Virtual.

## Host Stylesheet Requirements

Every consuming app should import:

```css
@import "tailwindcss";
@import "data-table-pro/styles.css";
```

`data-table-pro/styles.css` exports:

- Tailwind v4 package scanning for the built output
- the package-owned container-query helpers used by the table

Container helpers included by the package:

```css
.data-table-container-query {
  container-type: inline-size;
  container-name: data-table;
}

@container data-table (width < 640px) {
  .dt-hide-on-sm {
    display: none;
  }
}

@container data-table (width < 768px) {
  .dt-hide-on-md {
    display: none;
  }
}

@container data-table (width < 1024px) {
  .dt-hide-on-lg {
    display: none;
  }
}

@container data-table (width < 1280px) {
  .dt-hide-on-xl {
    display: none;
  }
}

@container data-table (width < 1536px) {
  .dt-hide-on-2xl {
    display: none;
  }
}
```

### Additional HeroUI requirement

HeroUI consumers must also import:

```css
@import "@heroui/styles";
```

`@heroui/styles` should be installed by the consuming app when using `data-table-pro/heroui`.

For the HeroUI adapter, the table root receives `.dtp-heroui` and internal table slots use HeroUI-compatible classes such as `border-separator`, `bg-surface`, `bg-field`, and `text-muted`. Host apps do not need to define shadcn-style variables such as `--border`, `--card`, `--input`, or `--muted`.

```css
.dtp-heroui {
  --separator: color-mix(in oklch, var(--accent) 45%, transparent);
}
```

### Additional The Gridcn requirement

The Gridcn consumers must also import a host-managed The Gridcn theme or token stylesheet.

## Runtime Exports

- `data-table-pro`, `data-table-pro/heroui`, and
  `data-table-pro/thegridcn` export `DataTable`
- `data-table-pro/virtual`, `data-table-pro/heroui/virtual`, and
  `data-table-pro/thegridcn/virtual` export the eager-virtual `DataTable`
- `data-table-pro/url-state` exports `useDataTableUrlState`
- `data-table-pro/data-source` exports `useDataTableDataSource`
- `data-table-pro/adapter` exports `createDataTable` and `primitiveUiKit`
- `data-table-pro/adapter/virtual` exports `createVirtualDataTable`
- `data-table-pro/advanced` exports `createDataTable`, `primitiveUiKit`,
  `DataTableBodyRow`, `DataTableCardPanel`, `DataTableFooterSection`,
  `DataTableHeaderCell`, `DataTableTablePanel`, `DataTableToolbarSection`,
  `useColumnLayout`, `useControllableState`, `useDataTableColumns`,
  `useDataTableInstance`, `useDataTableState`, `useRowEditing`, and
  `useStableCallback`

`data-table-pro/advanced` is the supported compatibility path for advanced
composition. `data-table-pro/adapter` is the narrower stable adapter-authoring
replacement; no advanced import is removed in 4.0.

The URL-state subpath also exports the
`UseDataTableUrlStateOptions`, `DataTableUrlStateSlice`,
`DataTableUrlEnhancedState`, and `DataTableUrlStateMigrationPayload` types.

## Server data sources

Use `data-table-pro/data-source` when sorting, filtering, and pagination are
performed by your backend. The hook accepts either offset or cursor requests,
cancels superseded work, ignores stale responses, deduplicates a repeated
in-flight request, and caches successful results per hook instance (30 seconds
by default). `refresh()` bypasses a fresh cache entry and `invalidate()` removes
one cache key or all cache entries.

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
const [sorting, setSorting] = useState<SortingState>([]);
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

const users = useDataTableDataSource({
  mode: "offset",
  pagination,
  sorting,
  columnFilters,
  query: { organizationId },
  source: async ({ offset, limit, sorting, columnFilters, query, signal }) => {
    const response = await fetch("/api/users", {
      method: "POST",
      signal,
      body: JSON.stringify({ offset, limit, sorting, columnFilters, ...query }),
    });
    return response.json(); // { rows, rowCount?, nextCursor?, facets? }
  },
  onPageIndexChange: (pageIndex) =>
    setPagination((current) => ({ ...current, pageIndex })),
  onPageSizeChange: (pageSize) =>
    setPagination({ pageIndex: 0, pageSize }),
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
});

<DataTable columns={columns} getRowId={(user) => user.id} {...users.tableProps} />;
```

For cursor APIs, set `mode: "cursor"` and pass the cursor for the requested
page as `cursor`; the hook exposes the backend's `nextCursor`. Memoize `source`
with `useCallback`, or include all of its changing inputs in `query`, so a
changed request is observable. Provide `getRequestKey` when `query` contains a
non-serializable value.

## Type Exports

These are exported from the adapter entrypoints and from `data-table-pro/types`.

- `DataTableAlign`
- `DataTableApi`
- `DataTableCardSizing`
- `DataTableCardVirtualizationConfig`
- `DataTableCellOverflow`
- `DataTableCellEditRenderProps`
- `DataTableCardRendererProps`
- `DataTableColumnDef`
- `DataTableColumnGroupDef`
- `DataTableColumnFilterConfig`
- `DataTableColumnFilterOption`
- `DataTableColumnFilterType`
- `DataTableColumnFixed`
- `DataTableColumnMeta`
- `DataTableColumnPrefs`
- `DataTableColumnType`
- `DataTableColumnVisibilityOption`
- `DataTableContainerBreakpoint`
- `DataTableActionErrorContext`
- `DataTableActionErrorSource`
- `DataTableCsvExportOptions`
- `DataTableCsvExportScope`
- `DataTableDensity`
- `DataTableDetailPanel`
- `DataTableDragAndDropConfig`
- `DataTableEditableRowsConfig`
- `DataTableEmptyStateContext`
- `DataTableExpandedRowProps`
- `DataTableFileUploadConfig`
- `DataTableHiddenRowsConfig`
- `DataTableInfiniteScroll`
- `DataTableInitialState`
- `DataTableLabels`
- `DataTableLoadingState`
- `DataTablePersistenceConfig`
- `DataTablePersistenceOperation`
- `DataTablePersistencePayload`
- `DataTablePersistenceSlice`
- `DataTablePersistenceStorage`
- `DataTableResetOptions`
- `DataTableSavedView`
- `DataTableSavedViewSlice`
- `DataTableSavedViewsChangeOperation`
- `DataTableSavedViewsConfig`
- `DataTableSavedViewsPayload`
- `DataTableProps`
- `DataTableRowAction`
- `DataTableRowLoadingState`
- `DataTableState`
- `DataTableSelectionAction`
- `DataTableSummaryRow`
- `DataTableToolbarAction`
- `DataTableToolbarVisibility`
- `DataTableVirtualizationConfig`
- `DataTableViewMode`

## `DataTable`

Generic component signature:

```ts
function DataTable<TData>(props: DataTableProps<TData>): React.ReactElement;
```

### Required props

| Prop | Type | Description |
| --- | --- | --- |
| `columns` | `Array<DataTableColumnDef<TData, any>>` | Column definitions passed to TanStack Table. |
| `data` | `Array<TData>` | Row data. |
| `getRowId` | `(row: TData, index: number) => string` | Stable row identifier used for selection, editing, and row actions. |

### Grouped column headers

Column groups use nested `DataTableColumnDef` objects. A group requires a
stable `id`, a shared `header`, and a non-empty `columns` array:

```tsx
const columns: Array<DataTableColumnDef<Person>> = [
  {
    id: "contact",
    header: "Contact",
    meta: {
      align: "center",
      headerClassName: "bg-muted/50 font-semibold",
      headerStyle: { letterSpacing: "0.025em" },
    },
    columns: [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
    ],
  },
];
```

Groups may be nested to any depth. Every nesting level renders as another
header row; group cells receive `colSpan` for their visible descendants and
`scope="colgroup"`, while leaf headers receive `scope="col"`. A group header
supports string or render-function content plus `meta.headerClassName`,
`meta.headerStyle`, and `meta.align` styling. Group definitions additionally
support `description` (an accessible native tooltip), `headerClassName`,
`headerStyle`, and `headerHeight`; `columnGroupHeaderHeight` sets the default
height for all shared group headers. The DOM also exposes
`data-dtp-slot="data-table-column-group-header"` and `data-header-depth`.

Visibility, toolbar filters, ordering, pinning, sizing, responsive hiding,
editing defaults, card-title detection, and CSV export resolve nested leaf
columns. Leaf columns remain independently pinnable. Reordering is locked to a
leaf's same nested group by default so shared headings remain intact. Set
`freeReordering: true` on every group boundary crossed to allow a leaf to leave,
enter, or split groups. Resizing a group distributes the size change proportionally across its
visible descendants; setting `enableResizing: false` on the group removes its
resize handle. Group definitions themselves do not appear in the leaf-column
visibility, filter, or pinning controls.

### Unified state and API ref

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialState` | `Partial<DataTableState>` | built-in defaults | Initial values for uncontrolled state slices. Initial values take precedence over persisted preferences. |
| `state` | `Partial<DataTableState>` | `undefined` | Controls any supplied unified state slices. |
| `onStateChange` | `(updater: Updater<DataTableState>) => void` | `undefined` | Receives TanStack-compatible full-state updater functions. React state setters can be passed directly. |
| `apiRef` | `React.Ref<DataTableApi<TData>>` | `undefined` | Exposes typed inspection, state, focus, scroll, reset, and CSV commands. |

Legacy controlled props remain supported. If a legacy prop and its matching
`state` slice are both supplied, the legacy prop takes precedence during the
4.x compatibility window and a development warning is emitted.

`DataTableApi<TData>` provides:

- `getTable()` for the TanStack table instance
- `getState()` and `snapshot()` for cloned wrapper state
- `restore(partialState)`, `resetColumnLayout(options?)`, and
  `resetState(options?)`
- `clearPersistedState()`
- `getSavedViews()`, `createSavedView(name)`, `applySavedView(id)`,
  `renameSavedView(id, name)`, `deleteSavedView(id)`, and
  `clearSavedViews()`
- `focus()`, `scrollToRow(rowId)`, and `scrollToColumn(columnId)`
- `pinRow(rowId, position?)` and `unpinRow(rowId)` when row pinning is enabled
- `exportCsv(options?)`

Scroll commands return `false` when the requested rendered element is not
currently available, including a virtual row outside the active window.

`resetColumnLayout({ clearPersistence: true })` and
`resetState({ clearPersistence: true })` remove the previous persisted
preference payload before restoring initial/default state. If that transition
changes a persisted slice, the new defaults become the next persisted value.
`clearPersistedState()` removes the payload without changing table state.

### URL state

`useDataTableUrlState` remains isolated in `data-table-pro/url-state`, so
applications that do not use URL synchronization do not need the optional
`nuqs` peer:

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
  migrate: ({ version, state }, targetVersion) =>
    migratePeopleUrlState(version, state, targetVersion),
});

<DataTable
  toolbarQueryValue={url.toolbarQueryValue}
  onToolbarQueryValueChange={url.setToolbarQueryValue}
  pageIndex={url.pageIndex}
  pageSize={url.pageSize}
  onPageIndexChange={url.setPageIndex}
  onPageSizeChange={url.setPageSize}
  sorting={url.sorting}
  onSortingChange={url.setSorting}
  columnFilters={url.columnFilters}
  onColumnFiltersChange={url.setColumnFilters}
  columnVisibility={url.columnVisibility}
  onColumnVisibilityChange={url.setColumnVisibility}
  density={url.density}
  onDensityChange={url.setDensity}
  columnOrder={url.columnOrder}
  onColumnOrderChange={url.setColumnOrder}
  columnPinning={url.columnPinning}
  onColumnPinningChange={url.setColumnPinning}
/>;
```

Query, pagination, sorting, view mode, and hidden-row visibility retain their
existing URL keys and behavior. Enhanced slices are disabled by default and
use these keys:

| Slice | Query-key suffix |
| --- | --- |
| schema version | `v` |
| `columnFilters` | `filters` |
| `columnVisibility` | `visibility` |
| `density` | `density` |
| `columnOrder` | `columns` |
| `columnPinning` | `pinning` |
| `grouping` | `grouping` |
| `rowSelection` | `selection` |

Every suffix is prefixed by `keyPrefix`. Enhanced parameters whose schema
version does not match are discarded unless `migrate(payload, targetVersion)`
returns validated replacement state. Invalid JSON or invalid slice fields are
also ignored. `rowSelection` is never read or written without the explicit
`"rowSelection"` opt-in.

The hook returns direct values and TanStack-compatible setters for every
enhanced slice, a `tableState` object for slices currently supported by
`DataTableState`, and `clearEnhancedState()`. Grouping is returned separately
for server-owned state and forward compatibility; first-class table grouping
is scheduled for Phase 2.

### Basic content props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | `undefined` | Additional content rendered below the table or card view. |
| `title` | `string` | `undefined` | Toolbar title. |
| `description` | `string` | `undefined` | Toolbar description text. |
| `className` | `string` | `undefined` | Outer layout wrapper class. |
| `tableClassName` | `string` | `undefined` | Applied to the `<table>` element in table mode. |
| `tableContainerClassName` | `string` | `undefined` | Applied to the scroll container in table or card mode. |
| `cardGridClassName` | `string` | responsive auto-fit grid | Applied to the card grid wrapper in card mode. Use named container variants for explicit density, such as `grid-cols-1 @min-[640px]/data-table:grid-cols-2 @min-[1280px]/data-table:grid-cols-3`. |
| `cardClassName` | `string` | `undefined` | Applied to each card item wrapper in card mode. |
| `flexGrow` | `boolean` | `true` | Fills the remaining height of a constrained flex parent. |
| `showToolbar` | `boolean` | `true` | Controls the package toolbar region. |
| `showFooter` | `boolean` | `true` | Controls the pagination/record-count footer when infinite loading is not active. |

### Layout requirements

`DataTable` defaults to `flexGrow={true}`. For full-height table or card views, place it inside a constrained flex content region:

```tsx
<main className="flex h-full min-h-0 flex-col">
  <section className="flex min-h-0 flex-1 flex-col">
    <DataTable flexGrow />
  </section>
</main>
```

The library applies the internal constrained flex chain itself:

- root: `flex h-full min-h-0 flex-1 flex-col`
- toolbar/header: `shrink-0`
- central table/card content: `flex min-h-0 flex-1 flex-col`
- scroll area/viewport wrappers: `min-h-0 flex-1`
- footer: `shrink-0`

One parent requirement remains unavoidable: the nearest containing layout must establish a constrained height boundary and `min-h-0` chain. Without that, neither table mode nor card mode can infer available height.

### Toolbar query props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `toolbarQueryValue` | `string` | `""` | Controlled toolbar query string. |
| `onToolbarQueryValueChange` | `(value: string) => void` | `undefined` | Called after the debounce window. The query filters local rows by default unless manual filtering is enabled. |
| `toolbarQueryPlaceholder` | `string` | `"Search rows..."` | Toolbar input placeholder. |
| `toolbarQueryDebounceMs` | `number` | `250` | Debounce delay for `onToolbarQueryValueChange`. |
| `manualFiltering` | `boolean` | `false` | Disables built-in client filtering for toolbar query and column filters. |
| `enableToolbarQueryFiltering` | `boolean` | `true` | Opts out of built-in toolbar-query filtering while keeping the input. |
| `globalFilterFn` | `FilterFnOption<TData>` | built-in normalized contains match | TanStack global-filter function used by the client-side toolbar query. |
| `columnFilters` | `ColumnFiltersState` | internal state | Controlled TanStack column filter state. |
| `onColumnFiltersChange` | `(filters: ColumnFiltersState) => void` | `undefined` | Column filter callback. |
| `enableColumnFilters` | `boolean` | enabled when column meta filters exist | Renders toolbar filter controls declared by `column.meta.filter`. |
| `customToolbar` | `React.ReactNode` | `undefined` | Optional secondary toolbar row rendered below the main toolbar. |
| `compactToolbar` | `React.ReactNode` | `undefined` | Optional mobile compact-toolbar content rendered inline with the collapsed toolbar control strip. Use this for icon-only filter/action controls in narrow container widths. |

Column metadata supports seven built-in filter controls: `text`, `select`,
`multi`, `faceted`, `boolean`, `numberRange`, and `dateRange`. Range controls store plain
`{ from, to }` objects so controlled state, URL state, and server requests stay
serializable. Numeric range bounds are inclusive and accept `min`, `max`, and
`step`; date bounds are inclusive `YYYY-MM-DD` values. Boolean controls accept
optional `trueLabel` and `falseLabel` overrides. Text filters accept an
`operator` of `contains` (the default), `equals`, `startsWith`, or `endsWith`.

`faceted` is a multi-select filter. Without supplied options it reads
TanStack's faceted unique-value map and displays local option counts. Set
`faceting.options` when the server owns facet results; its optional `count`
is displayed unchanged. `faceting.searchable` defaults to `true`.

```tsx
meta: {
  filter: {
    type: "faceted",
    faceting: {
      options: [{ label: "Active", value: "active", count: 42 }],
      searchable: true,
    },
  },
}
```

### Grouping and aggregation

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `grouping` | `GroupingState` | internal state | Controlled TanStack grouping state. |
| `onGroupingChange` | `(grouping: GroupingState) => void` | `undefined` | Receives grouping updates. |
| `manualGrouping` | `boolean` | `false` | Skips the local grouped row model for server-grouped data. |
| `enableGrouping` | `boolean` | `false` | Adds accessible group/ungroup controls and a removable grouping bar. |
| `groupedColumnMode` | `false \| "reorder" \| "remove"` | `"reorder"` | Placement of grouped columns. |
| `aggregationFns` | `Record<string, AggregationFn<TData>>` | `undefined` | Named aggregation functions for column definitions. |

Use native TanStack `enableGrouping`, `aggregationFn`, and `aggregatedCell`
on a `DataTableColumnDef`. Grouped cells toggle descendants, aggregated cells
use `aggregatedCell` when present, and placeholder cells render empty.

```tsx
const columns = [
  {
    accessorKey: "active",
    meta: {
      filter: {
        type: "boolean",
        trueLabel: "Active",
        falseLabel: "Inactive",
      },
    },
  },
  {
    accessorKey: "score",
    meta: { filter: { type: "numberRange", min: 0, max: 100, step: 1 } },
  },
  {
    accessorKey: "createdAt",
    meta: { filter: { type: "dateRange", min: "2020-01-01" } },
  },
] satisfies Array<DataTableColumnDef<Row, unknown>>;
```

Built-in toolbar controls automatically compact in narrow container widths:

- the search input collapses to a search button and can expand inline on demand
- built-in toolbar actions collapse to icon-first controls
- `compactToolbar` is the package-level hook for consumer-defined mobile filter/action content

`compactToolbar` behavior:

- it renders inline inside the main toolbar control row until the container reaches the package large breakpoint (1024px)
- `customToolbar` renders as the separate desktop toolbar row only from the package large breakpoint (1024px) upward
- if `compactToolbar` is omitted but `customToolbar` is provided, the package reuses `customToolbar` in the compact row as a fallback
- the intended use is icon-only or very compact controls; the package does not automatically convert arbitrary desktop JSX into mobile icon buttons

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

In that setup:

- large/wide containers show the normal search input and the separate `customToolbar` row
- small/medium containers keep the built-in compact toolbar strip plus the `compactToolbar` icons on the same line
- the search field reduces to a search icon and expands inline when activated

Removed in `2.0.1`:

- `searchValue`
- `onSearchValueChange`
- `searchPlaceholder`
- `searchDebounceMs`

### Sorting props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sorting` | `SortingState` | internal state | Controlled sorting state. |
| `onSortingChange` | `(sorting: SortingState) => void` | `undefined` | Sorting change callback. |
| `manualSorting` | `boolean` | `false` | Disables client-side sorting row model. |

### Interactive grid accessibility

The default table view uses native HTML table semantics and ordinary browser
tab order. Opt in when the table is a keyboard-navigable data workspace:

```tsx
<DataTable
  {...props}
  accessibility={{ mode: "grid", pageSize: 10 }}
  // or simply: interactiveGrid
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `accessibility` | `DataTableAccessibilityOptions` | `undefined` | Use `{ mode: "grid" }` for ARIA grid semantics. `pageSize` supplies the PageUp/PageDown step when the viewport has no measurable layout. |
| `interactiveGrid` | `boolean \| DataTableInteractiveGridOptions` | `false` | Shorthand for grid mode; the object form accepts `pageSize`. |

Grid mode applies `grid`, `rowgroup`, `row`, `columnheader`, and `gridcell`
roles while retaining the native table elements. It exposes `aria-rowcount` and
`aria-colcount`; a supplied `totalRowCount` is used for server-backed or
virtualized data. Mounted rows and cells receive their corresponding
`aria-rowindex` and `aria-colindex`, and exactly one cell has roving
`tabindex="0"`. Arrow keys, Home/End,
Ctrl/Cmd+Home/End, and PageUp/PageDown move that cell. Buttons, checkboxes,
links, and edit inputs keep their own keyboard behavior; Escape returns focus
from an interactive descendant to its grid cell.

### Pagination props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rowsPerPageOptions` | `Array<number>` | `[10, 20, 50, 100]` | Footer page-size options. |
| `totalRowCount` | `number` | derived | Total rows for manual pagination or display. |
| `hasNextPage` | `boolean` | `false` | Enables the next-page control when manual pagination has no known `totalRowCount` or `pageCount`. |
| `pageIndex` | `number` | internal state | Controlled zero-based page index. |
| `pageSize` | `number` | internal state | Controlled page size. |
| `onPageIndexChange` | `(pageIndex: number) => void` | `undefined` | Page-change callback. |
| `onPageSizeChange` | `(pageSize: number) => void` | `undefined` | Page-size callback. |
| `pageCount` | `number` | derived for client data | Known total page count in manual mode. Omit with `totalRowCount` to use unknown-total pagination. |
| `manualPagination` | `boolean` | `false` | Disables client-side pagination row model. |

### Selection props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rowSelection` | `Record<string, boolean>` | internal state | Controlled selection state keyed by row ID. |
| `onRowSelectionChange` | `(rowSelection: Record<string, boolean>) => void` | `undefined` | Selection change callback. |
| `enableRowSelection` | `boolean` | `false` | Enables checkbox selection column and card selection affordances. |
| `enableMultiRowSelection` | `boolean \| ((row: TData) => boolean)` | `true` | Enables multi-select globally or for individual rows. Set `false` for radio-like single selection. |
| `enableSubRowSelection` | `boolean \| ((row: TData) => boolean)` | `true` | Controls whether selecting a parent cascades to its sub-rows. |
| `getRowCanSelect` | `(row: TData) => boolean` | all rows | Disables selection for individual rows. |
| `rowSelectionSelectAllScope` | `"page" \| "filtered"` | `"page"` | Selects the current page or every loaded row in the filtered client row model. Server-wide selection remains application-owned. |
| `selectionActions` | `Array<DataTableSelectionAction<TData>>` | `[]` | Toolbar actions shown when row IDs are selected. The callback receives `{ rows, rowIds }`; `rows` contains loaded records while `rowIds` preserves selections across manual/server pages. |

Selection state is keyed by stable row ID and is not discarded merely because
a server page is no longer loaded. Use `rowIds` in a selection action for
server-owned bulk operations; the accompanying `rows` array intentionally
contains only records available to the current client. In manual pagination,
`"filtered"` select-all can only select loaded records—it does not imply an
unbounded server query.

### Row and toolbar actions

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `toolbarActions` | `Array<DataTableToolbarAction<TData>>` | `[]` | Toolbar action buttons. |
| `rowActions` | `Array<DataTableRowAction<TData>>` | `[]` | Per-row dropdown actions. |
| `onRowClick` | `(context: { row: TData; rowId: string }) => void \| Promise<void>` | `undefined` | Row click handler for table and card modes. |
| `onActionError` | `(context: DataTableActionErrorContext<TData>) => void` | `undefined` | Receives rejected or thrown built-in action callbacks with their source, optional action key, and optional row. |
| `stripedRows` | `boolean` | `false` | Applies virtualization-safe alternate shading to displayed table rows. |
| `getRowClassName` | `(row: TData, context: DataTableRowClassNameContext<TData>) => string \| undefined` | `undefined` | Row-level styling hook with displayed index and selection/editing/loading state. Existing one-argument callbacks remain compatible. |

When `onRowClick` is present, table rows are focusable and activate on Enter or
Space. They retain native `<tr>`/row semantics rather than using
`role="button"`, because a row can also contain checkboxes, links, and action
buttons. Activation originating from those interactive descendants does not
also invoke the row callback. Card mode uses its corresponding card
interaction semantics.

### Expansion, view, and card props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `viewMode` | `"table" \| "card"` | `"table"` | Controlled view mode. |
| `onViewModeChange` | `(viewMode: DataTableViewMode) => void` | `undefined` | View-mode change callback. |
| `enableViewToggle` | `boolean` | `false` | Shows the toolbar view switcher when `cardRenderer` is present. |
| `cardRenderer` | `(props: DataTableCardRendererProps<TData>) => React.ReactNode` | `undefined` | Required for card mode rendering. |
| `cardSizing` | `"fixed" \| "content" \| "fluid"` | `"fixed"` | Selects capped fixed tracks, renderer-sized wrapping items, or responsive stretched tracks. |
| `cardGridClassName` | `string` | responsive auto-fit grid | Supported grid slot for card mode. Prefer this over app CSS selectors against internal scroll/card wrappers. |
| `cardClassName` | `string` | `undefined` | Supported item slot for card mode card wrappers. |
| `expanded` | `ExpandedState` | internal state | Controlled tree expansion state. |
| `onExpandedChange` | `(expanded: ExpandedState) => void` | `undefined` | Tree expansion state callback. |
| `getSubRows` | `(row, index) => Array<TData> \| undefined` | `undefined` | Resolves hierarchical child rows. |
| `manualExpanding` | `boolean` | `false` | Keeps expansion state controlled by the host, for example while children are loaded remotely. |
| `paginateExpandedRows` | `boolean` | TanStack default | Controls whether expanded descendants participate in pagination. |
| `filterFromLeafRows` | `boolean` | `false` | Retains a parent when one of its descendants matches filtering. |
| `maxLeafRowFilterDepth` | `number` | TanStack default | Caps descendant traversal during leaf-row filtering. |
| `getRowCanExpand` | `(row: TData) => boolean` | child rows only | Optional tree or detail-panel expansion gate. |
| `detailPanel` | `DataTableDetailPanel<TData>` | `undefined` | Independently controlled application detail panel rendered beneath a row or in cards. |
| `renderExpandedRow` | `(props: DataTableExpandedRowProps<TData>) => React.ReactNode` | `undefined` | Deprecated compatibility bridge for `detailPanel={{ render }}`; existing usage retains its previous `expanded` state behavior. |

Tree rows receive an accessible expand/collapse button and `data-tree-depth`.
Nested first data cells are indented by depth. Use `detailPanel` when a table
also has `getSubRows`; it deliberately has separate `expanded` state so opening
application details does not expand or collapse the row's children. Card
renderers receive `depth`, `canExpandSubRows`, `isSubRowsExpanded`, and
`toggleSubRowsExpanded`, and the built-in card overlay provides tree and detail
toggles. When deprecated `renderExpandedRow` is combined with `getSubRows`, it
is treated as an independently controlled detail panel instead of being
discarded.

### Empty and loading props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `emptyState` | `React.ReactNode \| ((context: DataTableEmptyStateContext<TData>) => React.ReactNode)` | built-in empty state | Custom empty state for both table and card modes. |
| `isLoading` | `boolean` | `false` | Renders initial skeleton rows or cards when `data` is empty and loading. |
| `loadingRowCount` | `number` | `min(5, pageSize)` | Number of synthetic skeleton rows or cards to render for initial loading. |
| `getRowLoadingState` | `(row: TData, index: number) => boolean \| DataTableRowLoadingState` | `undefined` | Per-row loading and skeleton override hook for real rows that already exist. |

### Hidden row props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hiddenRows` | `DataTableHiddenRowsConfig<TData>` | `undefined` | Hides rows unless the toolbar toggle is enabled. |
| `showHiddenRows` | `boolean` | `false` | Controlled hidden-row visibility state. |
| `onShowHiddenRowsChange` | `(showHiddenRows: boolean) => void` | `undefined` | Hidden-row toggle callback. |

### Infinite scroll props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `infiniteScroll` | `DataTableInfiniteScroll` | `undefined` | Enables sentinel-based load-more behavior and hides the pagination footer. Only one load request runs at a time; failures are reported through `onActionError`. |

### Virtualization props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `virtualization` | `boolean \| DataTableVirtualizationConfig` | `false` | Enables table-row virtualization. Object form configures row estimates/overscan and independently enables card virtualization. |

```ts
type DataTableVirtualizationConfig = {
  enabled?: boolean;
  estimateRowHeight?: number;
  fallbackRowCount?: number;
  overscan?: number;
  card?: {
    enabled?: boolean;
    estimateCardHeight?: number;
    fallbackCardCount?: number;
    overscan?: number;
    lanes?: number | "auto";
  };
};
```

`virtualization={true}` enables table-row virtualization with a 48px estimate
and overscan of 8. Card virtualization is opt-in through
`virtualization.card.enabled`; its defaults are a 280px estimate, overscan of
4, and automatic lanes. Until a measurable viewport exists, rendering is
capped at 20 table rows or 12 cards so SSR and first paint remain useful
without mounting the complete dataset. Override those caps with
`fallbackRowCount` and `fallbackCardCount`.

Rendered virtual table rows and card lanes are measured after mount, so wrapped
cells and variable-height cards correct their estimates while scrolling. Stable,
unique `getRowId` values are required: they are virtual item keys and let the
virtualizer retain the scroll anchor when measurements change. Treat `data`,
row objects, column definitions, and `getRowId` as immutable/memoized inputs.
Development builds warn about common identity churn and duplicate row ids.

Column virtualization is intentionally not available in 4.3. The table panel
preserves native table layout, grouped headers, pinned/resized columns, detail
rows, and accessibility semantics; slicing only body columns would break those
contracts. Use the included 20/100/500-column benchmark to establish whether
pagination, responsive visibility, or server projection is the appropriate
wide-table strategy for an application.

Import behavior:

- a base adapter dynamically loads the virtual panels only after
  virtualization is enabled; its fallback uses the same bounded initial rows
- a `/virtual` adapter includes TanStack Virtual in its static graph and avoids
  the first-use async boundary
- switching between the fallback and loaded panel does not remount the parent
  table state

### Inline editing props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `editableRows` | `DataTableEditableRowsConfig<TData>` | `undefined` | Enables row edit mode, built-in draft state, and save handling. |

Column meta can customize editing with `renderEditCell`, `parseEditValue`, and
`formatEditValue`. A custom editor receives
`DataTableCellEditRenderProps<TData, TValue>` with the TanStack cell, original
row, current value, draft value, and `setDraftValue`. Numeric columns use
number inputs, date columns use datetime inputs, and boolean drafts use
checkboxes by default.

### Column visibility, sizing, ordering, pinning, and preferences props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columnVisibility` | `VisibilityState` | internal state | Controlled column visibility. |
| `onColumnVisibilityChange` | `(visibility: VisibilityState) => void` | `undefined` | Column visibility callback. |
| `columnOrder` | `ColumnOrderState` | internal state | Controlled column order. |
| `onColumnOrderChange` | `(order: ColumnOrderState) => void` | `undefined` | Column order callback. |
| `enableColumnReordering` | `boolean` | `false` | Enables header drag and keyboard column reordering. |
| `columnGroupHeaderHeight` | `CSSProperties["height"]` | `undefined` | Default height for shared column-group headers; a group `headerHeight` overrides it. |
| `columnPinning` | `ColumnPinningState` | internal state seeded from `meta.fixed` | Controlled column pinning. |
| `onColumnPinningChange` | `(pinning: ColumnPinningState) => void` | `undefined` | Column pinning callback. |
| `enableColumnPinning` | `boolean` | `false` | Adds pin/unpin controls to the table options menu. |
| `rowPinning` | `RowPinningState` | internal state | Controlled `{ top, bottom }` row-id lists. |
| `onRowPinningChange` | `(pinning: RowPinningState) => void` | `undefined` | Reports row-pinning changes. |
| `enableRowPinning` | `boolean \| (row) => boolean` | `false` | Adds top, bottom, and unpin actions to row menus; a predicate receives the original row. |
| `keepPinnedRows` | `boolean` | `true` | Keeps supplied pinned rows visible when client filtering or pagination would otherwise hide them. |
| `columnPrefsKey` | `string` | `undefined` | Compatibility shorthand for versioned persistence of uncontrolled visibility, sizing, order, pinning, and density in `localStorage`. |
| `persistence` | `DataTablePersistenceConfig` | `undefined` | Versioned persistence configuration. Takes precedence over `columnPrefsKey` and supports selected slices, custom storage/serialization, migration, debouncing, and error reporting. |
| `savedViews` | `DataTableSavedViewsConfig` | `undefined` | Versioned storage and lifecycle callbacks for named state snapshots managed through `apiRef`. |
| `enableColumnResizing` | `boolean` | `false` | Enables resize handles on resizable columns. |
| `columnResizeMode` | `"onChange" \| "onEnd"` | `"onEnd"` | TanStack Table resize mode. `onEnd` avoids rebuilding every visible row on each pointer movement. |
| `columnSizing` | `ColumnSizingState` | internal state | Controlled column sizing state. |
| `onColumnSizingChange` | `(sizing: ColumnSizingState) => void` | `undefined` | Controlled sizing callback. |
| `layoutMode` | `"fill" \| "fit"` | `"fill"` | `fill` stretches the table to the container; `fit` sizes to content width. |
| `stickyHeader` | `boolean` | `true` | Makes the table header sticky inside the scroll area. |

Pinned regions are rendered in table view only. Card view keeps pinned rows in
its ordinary card order, and server/manual pagination can render a pinned row
only when that record is included in the supplied `data` window.

The default persistence envelope is:

```ts
type DataTablePersistencePayload = {
  version: string | number;
  state: DataTableColumnPrefs;
};
```

`persistence.version` defaults to `1`, `debounceMs` defaults to `100`, and
`slices` defaults to all column-preference slices. A payload with a different
version is ignored unless `migrate(payload, targetVersion)` returns a new
preference state. Legacy raw `columnPrefsKey` objects are treated as
pre-versioned data, validated, and upgraded on the next write.

Persistence errors are best-effort and do not break rendering.
`onError({ error, operation })` reports `"read"`, `"write"`, `"serialize"`,
`"deserialize"`, `"migrate"`, or `"remove"`.

Named saved views use a separate
`data-table-pro:saved-views:${savedViews.key}` payload. By default a saved view
captures sorting, filtering, column visibility/order/pinning/sizing, density,
view mode, hidden-row visibility, and the global query. Pagination, row
selection, and expansion are intentionally transient unless included in
`savedViews.slices`.

`savedViews` supports `version`, `slices`, `storage`, `serialize`,
`deserialize`, `migrate`, and `onError` equivalents. `onChange(views,
operation)` receives `"create"`, `"rename"`, `"delete"`, or `"clear"`;
`onApply(view)` runs after the selected snapshot is restored. Host projects can
present these commands themselves, or opt into the compact built-in controls
with `toolbarDataOperations={{ savedViews: true }}`.

### Export, density, labels, and summary props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `csvExport` | `boolean \| DataTableCsvExportOptions<TData>` | `false` | Adds a CSV toolbar action. Defaults to filtered/sorted rows, visible data columns, CRLF line endings, and formula neutralization. |
| `density` | `"compact" \| "comfortable" \| "spacious"` | internal state | Controlled row density. |
| `onDensityChange` | `(density: DataTableDensity) => void` | `undefined` | Density change callback. |
| `enableDensityToggle` | `boolean` | `false` | Adds density controls to the table options menu. |
| `toolbarDataOperations` | `boolean \| DataTableToolbarDataOperations` | `false` | Opts into enhanced table-options controls. `true` enables searchable column management, reset layout, and saved-view UI; choose individual `columnChooser`, `resetLayout`, or `savedViews` flags to limit it. |
| `labels` | `Partial<DataTableLabels>` | English defaults | Overrides built-in UI labels. |
| `summaryRows` | `Array<DataTableSummaryRow<TData>>` | `[]` | Renders aggregate/footer rows aligned to visible columns. |
| `dir` | `"ltr" \| "rtl"` | `"ltr"` | Direction used for logical pinned column offsets. |

`DataTableCsvExportOptions<TData>` supports:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | `"filtered" \| "page" \| "selected" \| "all"` | `"filtered"` | Chooses filtered/sorted rows, the current page, selected filtered rows, or all loaded rows in source order. |
| `filename` | `string` | `"data-table.csv"` | Download filename. |
| `includeHeaders` | `boolean` | `true` | Includes visible column headers. |
| `columns` | `Array<string>` | visible data columns | Restricts export to the listed visible column IDs. |
| `lineEnding` | `"\n" \| "\r\n"` | `"\r\n"` | CSV row separator. |
| `escapeFormulaValues` | `boolean` | `true` | Prefixes formula-like string values with an apostrophe to reduce spreadsheet injection risk. |
| `getCellValue` | cell-value callback | `undefined` | Overrides an exported cell value. |
| `onExport` | async export callback | browser download | Receives `{ csv, filename, rows, scope }` for server- or app-owned delivery. Rejections flow to `onActionError`. |

### Cell overflow defaults

`DataTable` now applies a library-level overflow policy to body-cell content by default:

- primitive text-like cells default to truncation with ellipsis
- custom rendered cells default to clipped content inside the cell bounds
- all cell-content wrappers apply `min-width: 0` and `max-width: 100%` so flex/grid children can shrink without expanding the column or table

Use `column.meta.overflow` to override the default per column or per row:

```ts
type DataTableCellOverflow = "truncate" | "clip" | "wrap" | "visible";
```

Examples:

```tsx
const columns: Array<DataTableColumnDef<Row>> = [
  {
    accessorKey: "name",
    header: "Name",
    // default primitive behavior is already "truncate"
  },
  {
    accessorKey: "summary",
    header: "Summary",
    meta: {
      overflow: "wrap",
    },
  },
  {
    accessorKey: "preview",
    header: "Preview",
    cell: ({ row }) => <PreviewCard row={row.original} />,
    // default custom-renderer behavior is already "clip"
  },
  {
    accessorKey: "overlayTrigger",
    header: "Overlay",
    meta: {
      overflow: "visible",
    },
    cell: () => <DatePickerTrigger />,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      overflow: ({ row }) => (row.isExpanded ? "wrap" : "truncate"),
    },
  },
];
```

Notes:

- use `"truncate"` for single-line text with ellipsis
- use `"clip"` when a custom renderer should stay bounded to the cell without wrapping
- use `"wrap"` for multi-line body text
- use `"visible"` only when visual overflow is intentional
- overlay-style content such as menus, popovers, tooltips, and date pickers should render through a portal when possible; otherwise prefer `"visible"` for that column

### Toolbar presentation props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `toolbarVisibility` | `DataTableToolbarVisibility` | all enabled | Selectively hides parts of the toolbar. |

When `toolbarDataOperations.columnChooser` is enabled, the Columns section
adds search, bulk show/hide, accessible move-earlier/move-later controls, and
pin actions (when `enableColumnPinning` is also enabled). Active toolbar and
column filters are shown as removable chips with a count. `resetLayout` uses
the same initial layout as `apiRef.current.resetColumnLayout()`.

### Drag-and-drop props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dragAndDrop` | `DataTableDragAndDropConfig<TData>` | `undefined` | Enables container and row drag-drop integration hooks. |

### File upload props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fileUpload` | `DataTableFileUploadConfig` | `undefined` | Adds hidden file input support and exposes `openFileDialog` to toolbar actions. |
