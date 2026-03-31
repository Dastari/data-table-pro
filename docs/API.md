# API Reference

This document describes the public API exported by `data-table-pro`.

## Package Entry Points

### Main module

```ts
import {
  DataTable,
  useDataTableUrlState,
  type DataTableProps,
  type DataTableColumnDef,
} from "data-table-pro";
```

### Host stylesheet requirements

`data-table-pro` exports a stylesheet entrypoint for Tailwind v4 package scanning:

```css
@import "data-table-pro/styles.css";
```

The host application must still provide the existing global Tailwind + shadcn stylesheet used by the rest of the app.

At minimum, the host stylesheet must:

- import the app's Tailwind and shadcn layers
- define the theme tokens used by the shared UI primitives
- include the table container-query helpers

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

The table root also includes the named Tailwind container class `@container/data-table`. That allows any descendant inside the table to use Tailwind container-query variants directly in `className` strings, for example `@sm/data-table:*`, `@3xl/data-table:*`, or arbitrary thresholds like `@min-[48rem]/data-table:*`.

Tailwind container-query sizes are not the same as viewport breakpoint names. For example, `@md` is `28rem` for container queries, while the table's built-in `hideOn: "md"` behavior uses `48rem`. If you want Tailwind container-query behavior to line up with `hideOn`, prefer `@3xl/data-table:*` or `@min-[48rem]/data-table:*`.

Use `meta.hideOn` for the built-in column visibility behavior driven by container width. Use Tailwind container-query variants in `headerClassName`, `cellClassName`, `responsiveClassName`, row classes, or custom cell/header content when you need custom conditional styling inside the table.

## Exports

### Runtime exports

- `DataTable`
- `useDataTableUrlState`

### Type exports

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

| Prop       | Type                                    | Description                                                         |
| ---------- | --------------------------------------- | ------------------------------------------------------------------- |
| `columns`  | `Array<DataTableColumnDef<TData, any>>` | Column definitions passed to TanStack Table.                        |
| `data`     | `Array<TData>`                          | Row data.                                                           |
| `getRowId` | `(row: TData, index: number) => string` | Stable row identifier used for selection, editing, and row actions. |

### Basic content props

| Prop                      | Type              | Default     | Description                                               |
| ------------------------- | ----------------- | ----------- | --------------------------------------------------------- |
| `children`                | `React.ReactNode` | `undefined` | Additional content rendered below the table or card view. |
| `title`                   | `string`          | `undefined` | Toolbar title.                                            |
| `description`             | `string`          | `undefined` | Toolbar description text.                                 |
| `className`               | `string`          | `undefined` | Outer layout wrapper class.                               |
| `tableClassName`          | `string`          | `undefined` | Applied to the `<table>` element in table mode.           |
| `tableContainerClassName` | `string`          | `undefined` | Applied to the scroll container in table or card mode.    |

### Search props

| Prop                  | Type                      | Default            | Description                               |
| --------------------- | ------------------------- | ------------------ | ----------------------------------------- |
| `searchValue`         | `string`                  | `""`               | Controlled search string.                 |
| `onSearchValueChange` | `(value: string) => void` | `undefined`        | Called after the debounce window.         |
| `searchPlaceholder`   | `string`                  | `"Search rows..."` | Search input placeholder.                 |
| `searchDebounceMs`    | `number`                  | `250`              | Debounce delay for `onSearchValueChange`. |
| `customToolbar`       | `React.ReactNode`         | `undefined`        | Optional secondary toolbar row rendered below the main toolbar. |

### Sorting props

| Prop              | Type                              | Default        | Description                             |
| ----------------- | --------------------------------- | -------------- | --------------------------------------- |
| `sorting`         | `SortingState`                    | internal state | Controlled sorting state.               |
| `onSortingChange` | `(sorting: SortingState) => void` | `undefined`    | Sorting change callback.                |
| `manualSorting`   | `boolean`                         | `false`        | Disables client-side sorting row model. |

### Pagination props

| Prop                 | Type                          | Default             | Description                                  |
| -------------------- | ----------------------------- | ------------------- | -------------------------------------------- |
| `rowsPerPageOptions` | `Array<number>`               | `[10, 20, 50, 100]` | Footer page-size options.                    |
| `totalRowCount`      | `number`                      | derived             | Total rows for manual pagination or display. |
| `pageIndex`          | `number`                      | internal state      | Controlled zero-based page index.            |
| `pageSize`           | `number`                      | internal state      | Controlled page size.                        |
| `onPageIndexChange`  | `(pageIndex: number) => void` | `undefined`         | Page-change callback.                        |
| `onPageSizeChange`   | `(pageSize: number) => void`  | `undefined`         | Page-size callback.                          |
| `pageCount`          | `number`                      | derived             | Total page count in manual mode.             |
| `manualPagination`   | `boolean`                     | `false`             | Disables client-side pagination row model.   |

### Selection props

| Prop                   | Type                                              | Default        | Description                                                       |
| ---------------------- | ------------------------------------------------- | -------------- | ----------------------------------------------------------------- |
| `rowSelection`         | `Record<string, boolean>`                         | internal state | Controlled selection state keyed by row ID.                       |
| `onRowSelectionChange` | `(rowSelection: Record<string, boolean>) => void` | `undefined`    | Selection change callback.                                        |
| `enableRowSelection`   | `boolean`                                         | `false`        | Enables checkbox selection column and card selection affordances. |
| `selectionActions`     | `Array<DataTableSelectionAction<TData>>`          | `[]`           | Toolbar actions shown when rows are selected.                     |

### Row and toolbar actions

| Prop              | Type                                                                | Default     | Description                                 |
| ----------------- | ------------------------------------------------------------------- | ----------- | ------------------------------------------- |
| `toolbarActions`  | `Array<DataTableToolbarAction<TData>>`                              | `[]`        | Toolbar action buttons.                     |
| `rowActions`      | `Array<DataTableRowAction<TData>>`                                  | `[]`        | Per-row dropdown actions.                   |
| `onRowClick`      | `(context: { row: TData; rowId: string }) => void \| Promise<void>` | `undefined` | Row click handler for table and card modes. |
| `getRowClassName` | `(row: TData) => string \| undefined`                               | `undefined` | Row-level styling hook.                     |

### View-mode props

| Prop               | Type                                                            | Default     | Description                                                     |
| ------------------ | --------------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `viewMode`         | `"table" \| "card"`                                             | `"table"`   | Controlled view mode.                                           |
| `onViewModeChange` | `(viewMode: DataTableViewMode) => void`                         | `undefined` | View-mode change callback.                                      |
| `enableViewToggle` | `boolean`                                                       | `false`     | Shows the toolbar view switcher when `cardRenderer` is present. |
| `cardRenderer`     | `(props: DataTableCardRendererProps<TData>) => React.ReactNode` | `undefined` | Required for card mode rendering.                               |

### Empty and loading props

| Prop                 | Type                                                                                   | Default              | Description                                       |
| -------------------- | -------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------- |
| `emptyState`         | `React.ReactNode \| ((context: DataTableEmptyStateContext<TData>) => React.ReactNode)` | built-in empty state | Custom empty state for both table and card modes. |
| `getRowLoadingState` | `(row: TData, index: number) => boolean \| DataTableRowLoadingState`                   | `undefined`          | Per-row loading and skeleton override hook.       |

### Hidden row props

| Prop                     | Type                                | Default     | Description                                      |
| ------------------------ | ----------------------------------- | ----------- | ------------------------------------------------ |
| `hiddenRows`             | `DataTableHiddenRowsConfig<TData>`  | `undefined` | Hides rows unless the toolbar toggle is enabled. |
| `showHiddenRows`         | `boolean`                           | `false`     | Controlled hidden-row visibility state.          |
| `onShowHiddenRowsChange` | `(showHiddenRows: boolean) => void` | `undefined` | Hidden-row toggle callback.                      |

### Infinite scroll props

| Prop             | Type                      | Default     | Description                                                                |
| ---------------- | ------------------------- | ----------- | -------------------------------------------------------------------------- |
| `infiniteScroll` | `DataTableInfiniteScroll` | `undefined` | Enables sentinel-based load-more behavior and hides the pagination footer. |

### Inline editing props

| Prop           | Type                                 | Default     | Description                                                     |
| -------------- | ------------------------------------ | ----------- | --------------------------------------------------------------- |
| `editableRows` | `DataTableEditableRowsConfig<TData>` | `undefined` | Enables row edit mode, built-in draft state, and save handling. |

### Column visibility and sizing props

| Prop                       | Type                                    | Default        | Description                                                                |
| -------------------------- | --------------------------------------- | -------------- | -------------------------------------------------------------------------- |
| `columnVisibility`         | `VisibilityState`                       | internal state | Controlled column visibility.                                              |
| `onColumnVisibilityChange` | `(visibility: VisibilityState) => void` | `undefined`    | Column visibility callback.                                                |
| `enableColumnResizing`     | `boolean`                               | `false`        | Enables resize handles on resizable columns.                               |
| `columnResizeMode`         | `"onChange" \| "onEnd"`                 | `"onChange"`   | TanStack Table resize mode.                                                |
| `layoutMode`               | `"fill" \| "fit"`                       | `"fill"`       | `fill` stretches the table to the container; `fit` sizes to content width. |
| `stickyHeader`             | `boolean`                               | `true`         | Makes the table header sticky inside the scroll area.                      |

### Toolbar presentation props

| Prop                | Type                         | Default     | Description                             |
| ------------------- | ---------------------------- | ----------- | --------------------------------------- |
| `toolbarVisibility` | `DataTableToolbarVisibility` | all enabled | Selectively hides parts of the toolbar. |

`customToolbar` renders in its own second toolbar row under the main toolbar, using a `flex-row` layout with shared toolbar spacing.

### Drag-and-drop props

| Prop          | Type                                | Default     | Description                                            |
| ------------- | ----------------------------------- | ----------- | ------------------------------------------------------ |
| `dragAndDrop` | `DataTableDragAndDropConfig<TData>` | `undefined` | Enables container and row drag-drop integration hooks. |

### File upload props

| Prop         | Type                        | Default     | Description                                                                     |
| ------------ | --------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `fileUpload` | `DataTableFileUploadConfig` | `undefined` | Adds hidden file input support and exposes `openFileDialog` to toolbar actions. |

### Runtime behavior notes

- Search, sorting, pagination, row selection, and column visibility can be controlled or left uncontrolled.
- Card mode only renders when `viewMode === "card"` and `cardRenderer` is provided. Otherwise the component falls back to table mode.
- When `infiniteScroll.enabled` is true, the pagination footer is hidden and TanStack pagination row-modeling is disabled.
- When `editableRows` is supplied, the table injects a trailing actions column with row editing controls.
- When `enableRowSelection` is true, the table injects a leading selection column.
- Column `meta.hideOn` uses container queries rather than viewport breakpoints.

## `useDataTableUrlState`

Hook signature:

```ts
function useDataTableUrlState(options: {
  keyPrefix: string;
  defaultPageSize?: number;
  defaultSort?: { id: string; desc?: boolean };
  defaultViewMode?: DataTableViewMode;
}): {
  searchValue: string;
  setSearchValue: (value: string) => void;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  viewMode: DataTableViewMode;
  setViewMode: (viewMode: DataTableViewMode) => void;
  showHiddenRows: boolean;
  setShowHiddenRows: (showHiddenRows: boolean) => void;
};
```

### Options

| Option            | Type                             | Default     | Description                            |
| ----------------- | -------------------------------- | ----------- | -------------------------------------- |
| `keyPrefix`       | `string`                         | required    | Prefix used for all query-string keys. |
| `defaultPageSize` | `number`                         | `20`        | Default page size.                     |
| `defaultSort`     | `{ id: string; desc?: boolean }` | `undefined` | Default first sort entry.              |
| `defaultViewMode` | `DataTableViewMode`              | `"table"`   | Default table or card mode.            |

### Query-string keys

The hook stores state through `nuqs` with the following suffixes:

- `${keyPrefix}q`
- `${keyPrefix}page`
- `${keyPrefix}size`
- `${keyPrefix}sort`
- `${keyPrefix}order`
- `${keyPrefix}view`
- `${keyPrefix}showHidden`

### Behavior notes

- `pageIndex` is exposed as zero-based, but the URL stores `page` as one-based.
- `setSearchValue`, `setSorting`, and `setPageSize` reset the current page back to the first page.
- `setSorting([])` clears both `sort` and `order`.
- The hook assumes a `nuqs` provider is present in the host application.

## Type Reference

### `DataTableColumnDef<TData, TValue = unknown>`

TanStack `ColumnDef` with a `meta` field typed as `DataTableColumnMeta<TData, TValue>`.

### `DataTableColumnMeta<TData, TValue>`

| Field                 | Type                                                                  | Description                                            |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| `type`                | `"text" \| "numeric" \| "date"`                                       | Influences alignment and default date rendering.       |
| `fixed`               | `"left" \| "right"`                                                   | Pins the column to the left or right edge.             |
| `cardTitle`           | `boolean`                                                             | Semantic marker for card layouts.                      |
| `hideOn`              | `DataTableContainerBreakpoint \| Array<DataTableContainerBreakpoint>` | Hides the column below the specified container widths. |
| `align`               | `"start" \| "center" \| "end"`                                        | Overrides default alignment.                           |
| `headerClassName`     | `string`                                                              | Header cell class.                                     |
| `cellClassName`       | `string \| ((args) => string \| undefined)`                           | Per-cell class or computed class.                      |
| `responsiveClassName` | `string`                                                              | Extra class applied in responsive layouts.             |
| `skeleton`            | `(context) => React.ReactNode`                                        | Custom loading skeleton renderer.                      |
| `renderEditCell`      | `(props) => React.ReactNode`                                          | Custom editor renderer for inline editing.             |

### `DataTableToolbarAction<TData>`

Toolbar button for all rows.

| Field       | Type                                                                | Description                                                               |
| ----------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `key`       | `string`                                                            | Stable action key.                                                        |
| `label`     | `string`                                                            | Visible or accessible label.                                              |
| `icon`      | `React.ComponentType<{ className?: string }>`                       | Optional icon component.                                                  |
| `iconOnly`  | `boolean`                                                           | Renders the button as icon-only with tooltip text.                        |
| `placement` | `"primary" \| "trailing"`                                           | Controls whether the action appears before or after the utility controls. |
| `onClick`   | `(context) => void \| Promise<void>`                                | Receives all visible rows and optional `openFileDialog`.                  |
| `variant`   | `"default" \| "secondary" \| "outline" \| "ghost" \| "destructive"` | Button variant.                                                           |
| `disabled`  | `boolean`                                                           | Static disabled state.                                                    |

### `DataTableSelectionAction<TData>`

Toolbar action shown only when one or more rows are selected.

| Field      | Type                                                                | Description                         |
| ---------- | ------------------------------------------------------------------- | ----------------------------------- |
| `key`      | `string`                                                            | Stable action key.                  |
| `label`    | `string`                                                            | Accessible label.                   |
| `icon`     | `React.ComponentType<{ className?: string }>`                       | Optional icon component.            |
| `iconOnly` | `boolean`                                                           | Icon-only button with tooltip text. |
| `onClick`  | `(context) => void \| Promise<void>`                                | Receives the selected rows.         |
| `variant`  | `"default" \| "secondary" \| "outline" \| "ghost" \| "destructive"` | Button variant.                     |
| `disabled` | `boolean \| ((rows) => boolean)`                                    | Static or computed disabled state.  |

### `DataTableRowAction<TData>`

Per-row dropdown action.

| Field      | Type                                          | Description                            |
| ---------- | --------------------------------------------- | -------------------------------------- |
| `key`      | `string`                                      | Stable action key.                     |
| `label`    | `string \| ((row) => string)`                 | Static or row-derived label.           |
| `icon`     | `React.ComponentType<{ className?: string }>` | Optional icon component.               |
| `onClick`  | `(row) => void \| Promise<void>`              | Action callback for the row.           |
| `variant`  | `"default" \| "secondary" \| "destructive"`   | Visual intent.                         |
| `hidden`   | `(row) => boolean`                            | Hides the action for specific rows.    |
| `disabled` | `(row) => boolean`                            | Disables the action for specific rows. |

### `DataTableCardRendererProps<TData>`

Props passed to `cardRenderer`.

| Field              | Type                               | Description                                |
| ------------------ | ---------------------------------- | ------------------------------------------ |
| `row`              | `TData`                            | Original row object.                       |
| `rowId`            | `string`                           | Resolved row ID.                           |
| `isSelected`       | `boolean`                          | Current selection state.                   |
| `onSelectedChange` | `(nextValue: boolean) => void`     | Selection setter.                          |
| `actions`          | `Array<DataTableRowAction<TData>>` | Row actions available to the card.         |
| `isEditing`        | `boolean`                          | Whether the row is currently being edited. |
| `startEditing`     | `() => void`                       | Enters edit mode for the row.              |
| `cancelEditing`    | `() => void`                       | Exits edit mode for the row.               |

### `DataTableEditableRowsConfig<TData>`

| Field              | Type                                          | Description                                        |
| ------------------ | --------------------------------------------- | -------------------------------------------------- |
| `canEditRow`       | `(row) => boolean`                            | Optional edit guard per row.                       |
| `getInitialValues` | `(row) => Record<string, unknown>`            | Custom draft initializer.                          |
| `onSaveRow`        | `(row, draftValues) => void \| Promise<void>` | Save callback invoked by the built-in save action. |

### `DataTableInfiniteScroll`

| Field           | Type                          | Description                                   |
| --------------- | ----------------------------- | --------------------------------------------- |
| `enabled`       | `boolean`                     | Enables the intersection observer.            |
| `hasMore`       | `boolean`                     | Prevents additional loads when false.         |
| `isLoadingMore` | `boolean`                     | Suppresses repeated load triggers while true. |
| `onLoadMore`    | `() => void \| Promise<void>` | Load-more callback.                           |

### `DataTableHiddenRowsConfig<TData>`

| Field         | Type               | Description                        |
| ------------- | ------------------ | ---------------------------------- |
| `getIsHidden` | `(row) => boolean` | Returns whether a row is hidden.   |
| `label`       | `string`           | Label shown in the toolbar toggle. |

### `DataTableEmptyStateContext<TData>`

| Field         | Type           | Description                                            |
| ------------- | -------------- | ------------------------------------------------------ |
| `rows`        | `Array<TData>` | The currently visible rows after hidden-row filtering. |
| `searchValue` | `string`       | Current search string.                                 |

### `DataTableDragAndDropConfig<TData>`

| Field             | Type                                     | Description                                 |
| ----------------- | ---------------------------------------- | ------------------------------------------- |
| `isDragging`      | `boolean`                                | Enables drag-over styling on the container. |
| `onDragEnter`     | `React.DragEventHandler<HTMLDivElement>` | Container drag enter handler.               |
| `onDragOver`      | `React.DragEventHandler<HTMLDivElement>` | Container drag over handler.                |
| `onDragLeave`     | `React.DragEventHandler<HTMLDivElement>` | Container drag leave handler.               |
| `onDrop`          | `React.DragEventHandler<HTMLDivElement>` | Container drop handler.                     |
| `getRowDraggable` | `(row) => boolean`                       | Enables dragging for specific rows.         |
| `onRowDragStart`  | `(context) => void`                      | Row drag start callback.                    |
| `onRowDragEnd`    | `(context) => void`                      | Row drag end callback.                      |

### `DataTableFileUploadConfig`

| Field             | Type                               | Description                                           |
| ----------------- | ---------------------------------- | ----------------------------------------------------- |
| `accept`          | `string`                           | Native file input `accept` attribute.                 |
| `disabled`        | `boolean`                          | Disables the hidden input and upload-trigger actions. |
| `multiple`        | `boolean`                          | Allows multi-file selection. Defaults to `true`.      |
| `onFilesSelected` | `(files) => void \| Promise<void>` | Receives the selected `FileList` or `Array<File>`.    |

### `DataTableToolbarVisibility`

| Field             | Type      | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| `title`           | `boolean` | Shows or hides the title/description block.             |
| `search`          | `boolean` | Shows or hides search input.                            |
| `actions`         | `boolean` | Shows or hides primary toolbar actions.                 |
| `trailingActions` | `boolean` | Reserved visibility field for trailing toolbar actions. |
| `viewToggle`      | `boolean` | Shows or hides the table/card switcher.                 |

### `DataTableColumnVisibilityOption`

Represents an entry in the built-in column visibility menu.

| Field     | Type      | Description                        |
| --------- | --------- | ---------------------------------- |
| `id`      | `string`  | Column ID.                         |
| `label`   | `string`  | Human-readable label.              |
| `visible` | `boolean` | Current visibility state.          |
| `canHide` | `boolean` | Whether the column can be toggled. |

### Simple enums and aliases

| Export                         | Value(s)                                |
| ------------------------------ | --------------------------------------- |
| `DataTableViewMode`            | `"table" \| "card"`                     |
| `DataTableAlign`               | `"start" \| "center" \| "end"`          |
| `DataTableColumnType`          | `"text" \| "numeric" \| "date"`         |
| `DataTableColumnFixed`         | `"left" \| "right"`                     |
| `DataTableContainerBreakpoint` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl"` |

### `DataTableRowLoadingState`

| Field       | Type              | Description                            |
| ----------- | ----------------- | -------------------------------------- |
| `isLoading` | `boolean`         | Whether the row is in a loading state. |
| `skeleton`  | `React.ReactNode` | Optional row-level skeleton override.  |
