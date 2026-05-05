# API Reference

This document describes the public API exported by `data-table-pro`.

## Package Entry Points

All entrypoints export the same runtime and type API.

### Shadcn default

```ts
import {
  DataTable,
  useDataTableUrlState,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro";
```

### HeroUI

```ts
import {
  DataTable,
  useDataTableUrlState,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro/heroui";
```

### The Gridcn

```ts
import {
  DataTable,
  useDataTableUrlState,
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

### Additional The Gridcn requirement

The Gridcn consumers must also import a host-managed The Gridcn theme or token stylesheet.

## Runtime Exports

- `DataTable`
- `useDataTableUrlState`

## Type Exports

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

### Search props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `searchValue` | `string` | `""` | Controlled search string. |
| `onSearchValueChange` | `(value: string) => void` | `undefined` | Called after the debounce window. |
| `searchPlaceholder` | `string` | `"Search rows..."` | Search input placeholder. |
| `searchDebounceMs` | `number` | `250` | Debounce delay for `onSearchValueChange`. |
| `customToolbar` | `React.ReactNode` | `undefined` | Optional secondary toolbar row rendered below the main toolbar. |

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
