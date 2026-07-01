# API Reference

This document describes the public API exported by `data-table-pro`.

## Package Entry Points

Adapter entrypoints export the table component and public types. Dedicated subpaths expose the URL-state hook and types directly.

### Shadcn default

```ts
import {
  DataTable,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro";

import { useDataTableUrlState } from "data-table-pro/url-state";
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

- `DataTable`
- `data-table-pro/url-state` exports `useDataTableUrlState`

## Type Exports

These are exported from the adapter entrypoints and from `data-table-pro/types`.

- `DataTableAlign`
- `DataTableCardRendererProps`
- `DataTableColumnDef`
- `DataTableColumnFixed`
- `DataTableColumnMeta`
- `DataTableColumnType`
- `DataTableColumnVisibilityOption`
- `DataTableContainerBreakpoint`
- `DataTableDragAndDropConfig`
- `DataTableEditableRowsConfig`
- `DataTableEmptyStateContext`
- `DataTableFileUploadConfig`
- `DataTableHiddenRowsConfig`
- `DataTableInfiniteScroll`
- `DataTableLoadingState`
- `DataTableProps`
- `DataTableRowAction`
- `DataTableRowLoadingState`
- `DataTableSelectionAction`
- `DataTableToolbarAction`
- `DataTableToolbarVisibility`
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

### Basic content props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | `undefined` | Additional content rendered below the table or card view. |
| `title` | `string` | `undefined` | Toolbar title. |
| `description` | `string` | `undefined` | Toolbar description text. |
| `className` | `string` | `undefined` | Outer layout wrapper class. |
| `tableClassName` | `string` | `undefined` | Applied to the `<table>` element in table mode. |
| `tableContainerClassName` | `string` | `undefined` | Applied to the scroll container in table or card mode. |
| `cardGridClassName` | `string` | responsive auto-fit grid | Applied to the card grid wrapper in card mode. Use this for explicit card density such as `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`. |
| `cardClassName` | `string` | `undefined` | Applied to each card item wrapper in card mode. |

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
| `onToolbarQueryValueChange` | `(value: string) => void` | `undefined` | Called after the debounce window. This updates the toolbar input state only; row filtering remains consumer-owned. |
| `toolbarQueryPlaceholder` | `string` | `"Search rows..."` | Toolbar input placeholder. |
| `toolbarQueryDebounceMs` | `number` | `250` | Debounce delay for `onToolbarQueryValueChange`. |
| `customToolbar` | `React.ReactNode` | `undefined` | Optional secondary toolbar row rendered below the main toolbar. |
| `compactToolbar` | `React.ReactNode` | `undefined` | Optional mobile compact-toolbar content rendered inline with the collapsed toolbar control strip. Use this for icon-only filter/action controls in narrow container widths. |

Built-in toolbar controls automatically compact in narrow container widths:

- the search input collapses to a search button and can expand inline on demand
- built-in toolbar actions collapse to icon-first controls
- `compactToolbar` is the package-level hook for consumer-defined mobile filter/action content

`compactToolbar` behavior:

- it renders inline inside the main toolbar control row until the container reaches the large (`@lg`) breakpoint
- `customToolbar` renders as the separate desktop toolbar row only from the large (`@lg`) breakpoint upward
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

### Pagination props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rowsPerPageOptions` | `Array<number>` | `[10, 20, 50, 100]` | Footer page-size options. |
| `totalRowCount` | `number` | derived | Total rows for manual pagination or display. |
| `pageIndex` | `number` | internal state | Controlled zero-based page index. |
| `pageSize` | `number` | internal state | Controlled page size. |
| `onPageIndexChange` | `(pageIndex: number) => void` | `undefined` | Page-change callback. |
| `onPageSizeChange` | `(pageSize: number) => void` | `undefined` | Page-size callback. |
| `pageCount` | `number` | derived | Total page count in manual mode. |
| `manualPagination` | `boolean` | `false` | Disables client-side pagination row model. |

### Selection props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rowSelection` | `Record<string, boolean>` | internal state | Controlled selection state keyed by row ID. |
| `onRowSelectionChange` | `(rowSelection: Record<string, boolean>) => void` | `undefined` | Selection change callback. |
| `enableRowSelection` | `boolean` | `false` | Enables checkbox selection column and card selection affordances. |
| `selectionActions` | `Array<DataTableSelectionAction<TData>>` | `[]` | Toolbar actions shown when rows are selected. |

### Row and toolbar actions

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `toolbarActions` | `Array<DataTableToolbarAction<TData>>` | `[]` | Toolbar action buttons. |
| `rowActions` | `Array<DataTableRowAction<TData>>` | `[]` | Per-row dropdown actions. |
| `onRowClick` | `(context: { row: TData; rowId: string }) => void \| Promise<void>` | `undefined` | Row click handler for table and card modes. |
| `getRowClassName` | `(row: TData) => string \| undefined` | `undefined` | Row-level styling hook. |

### View-mode props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `viewMode` | `"table" \| "card"` | `"table"` | Controlled view mode. |
| `onViewModeChange` | `(viewMode: DataTableViewMode) => void` | `undefined` | View-mode change callback. |
| `enableViewToggle` | `boolean` | `false` | Shows the toolbar view switcher when `cardRenderer` is present. |
| `cardRenderer` | `(props: DataTableCardRendererProps<TData>) => React.ReactNode` | `undefined` | Required for card mode rendering. |
| `cardGridClassName` | `string` | responsive auto-fit grid | Supported grid slot for card mode. Prefer this over app CSS selectors against internal scroll/card wrappers. |
| `cardClassName` | `string` | `undefined` | Supported item slot for card mode card wrappers. |

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
| `infiniteScroll` | `DataTableInfiniteScroll` | `undefined` | Enables sentinel-based load-more behavior and hides the pagination footer. |

### Virtualization props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `virtualization` | `boolean \| DataTableVirtualizationConfig` | `undefined` | Enables opt-in row virtualization in table mode. Use `{ estimateRowHeight, overscan }` to tune the virtual row window. |

Virtualization is intentionally disabled until the table scroll viewport has a measurable height, so collapsed or server-like test environments still render rows instead of a blank virtual window. Card mode does not virtualize.

### Inline editing props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `editableRows` | `DataTableEditableRowsConfig<TData>` | `undefined` | Enables row edit mode, built-in draft state, and save handling. |

### Column visibility and sizing props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columnVisibility` | `VisibilityState` | internal state | Controlled column visibility. |
| `onColumnVisibilityChange` | `(visibility: VisibilityState) => void` | `undefined` | Column visibility callback. |
| `enableColumnResizing` | `boolean` | `false` | Enables resize handles on resizable columns. |
| `columnResizeMode` | `"onChange" \| "onEnd"` | `"onChange"` | TanStack Table resize mode. |
| `layoutMode` | `"fill" \| "fit"` | `"fill"` | `fill` stretches the table to the container; `fit` sizes to content width. |
| `stickyHeader` | `boolean` | `true` | Makes the table header sticky inside the scroll area. |

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

### Drag-and-drop props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `dragAndDrop` | `DataTableDragAndDropConfig<TData>` | `undefined` | Enables container and row drag-drop integration hooks. |

### File upload props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fileUpload` | `DataTableFileUploadConfig` | `undefined` | Adds hidden file input support and exposes `openFileDialog` to toolbar actions. |
