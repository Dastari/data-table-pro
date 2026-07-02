# Changelog

## 3.0.6

### Features

- Added `cardSizing?: "fixed" | "content" | "fluid"` to `DataTable`.
- `cardSizing="content"` renders the card layout as a wrapping flex row with fit-content card items, so narrow media cards and wider collection cards can keep their renderer-defined width.
- `cardSizing="fluid"` restores full-width responsive card tracks for consumers that want stretched cards.
- `cardGridClassName` and `cardClassName` remain available as low-level layout overrides.
- Added demo coverage for content-sized narrow media cards and a wider collection card.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`

## 3.0.5

### Notes

- Version bump release for GitHub consumers.
- No functional source changes from `3.0.4`.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`

## 3.0.4

### Fixes

- Changed the default card view grid from stretching `1fr` tracks to start-aligned tracks capped at `18rem`.
- Removed default card item `w-full` and renderer child `w-full` forcing so narrow custom cards keep their intended width.
- Preserved opt-in stretched layouts through `cardGridClassName`, `cardClassName`, and renderer-owned width classes.
- Added demo coverage for one to three narrow cards in a wide container.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`

## 3.0.3

### Fixes

- Fixed the select-all header checkbox not reflecting row selection until an unrelated layout change; the memoized header cell now re-renders when page selection state changes.
- Fixed icon-only toolbar actions rendering taller than wide at `@md` container widths; trailing icon-only actions stay 28px squares to match the options and view-toggle buttons, and primary icon-only actions scale to a 32px square.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test src/core/data-table/create-data-table.test.tsx`
- `pnpm build`

## 3.0.2

### Fixes

- Fixed selection and expansion utility columns when the first data column is pinned left with `column.meta.fixed` or column pinning.
- Fixed the actions utility column when data columns are pinned or reordered, keeping it at the trailing edge.
- Internally applies utility columns to TanStack column pinning state so DOM order, `colgroup` sizing, sticky offsets, headers, and body cells stay aligned.
- Strips stale utility IDs out of consumer/persisted pinning before re-applying them in the required internal positions.

### Validation

- `pnpm test src/core/data-table/create-data-table.test.tsx`

## 3.0.1

### Fixes

- Fixed oversized table header sort icons after the Tabler icon dependency was replaced with local SVG components.
- Added default `width` and `height` attributes to local SVG icons so unclassed icons cannot render at browser fallback SVG dimensions.
- Explicitly constrained sorted and unsorted header sort indicators to `size-4`.
- Kept selection, expansion, and actions utility columns outside data-column ordering so selection stays at the leading edge and actions stay at the trailing edge.
- Fixed utility column layout math so checkbox, expansion, and actions columns consistently use the fixed 50px utility width.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`

## 3.0.0

This is the v3 major release line. It includes the full v3 remediation work after the last documented v2 release (`2.0.5`): package cleanup, React 19.2 compatibility, built-in filtering, accessibility fixes, performance-oriented internals, pro-table features, and card virtualization. This project is distributed from GitHub refs such as `github:Dastari/data-table-pro#v3.0.0`; it is not published to npm.

### Breaking changes

- The package is ESM-only.
  - Removed CommonJS output from the build.
  - Removed the `main` package field.
  - Removed every `exports.*.require` condition.
  - Replace `require("data-table-pro")` with ESM imports such as `import { DataTable } from "data-table-pro"`.
- React peer dependencies are now `react@^19.2.0` and `react-dom@^19.2.0`.
  - This matches the library's use of React 19.2 APIs.
- `nuqs` moved from a hard dependency to an optional peer dependency.
  - Only consumers importing `data-table-pro/url-state` need `nuqs`.
  - Consumers that use URL state must keep a compatible `nuqs` setup in the app.
- `@tabler/icons-react` was removed from runtime dependencies.
  - The table now uses local icon components.
  - Apps that were accidentally relying on `data-table-pro` to install Tabler icons must add their own icon dependency.
- Toolbar search now filters client-side rows by default.
  - For server-side filtering, set `manualFiltering`.
  - For a display-only toolbar query input, set `enableToolbarQueryFiltering={false}`.
- Column filter metadata now renders built-in toolbar filter controls by default when filters are enabled.
  - Disable table-owned filtering with `manualFiltering`.
  - Disable toolbar filter UI by omitting `column.meta.filter` or setting `enableColumnFilters={false}`.
- `viewMode`, `showHiddenRows`, and `density` now use the same controlled/uncontrolled model as sorting, selection, visibility, filters, pinning, expansion, and column order.
  - Passing only a callback no longer means the table is inert; the table keeps local state when the value prop is omitted.
- `column.meta.fixed` is now treated as initial/static pinning input.
  - Use `columnPinning` and `onColumnPinningChange` for fully controlled pin state.
- URL sort state now writes the full TanStack `SortingState` array.
  - Old single-column URL sort values still decode as a fallback.
  - Multi-sort URLs now use a JSON-encoded array in the existing sort query key.
- The public package surface is now explicit.
  - Stable adapter entrypoints remain `data-table-pro`, `data-table-pro/heroui`, and `data-table-pro/thegridcn`.
  - `useDataTableUrlState` remains in `data-table-pro/url-state`.
  - Public types remain in `data-table-pro/types`.
  - Extracted composition helpers are exported only from `data-table-pro/advanced`.
  - Deep imports from source files, generated chunks, or `dist/chunk-*` files are unsupported.
- GitHub installs now use committed `dist/` output.
  - The package no longer relies on an install-time `prepare` script.
  - This avoids pnpm supply-chain build-script allowlist requirements in consuming apps.
- `data-table-pro/styles.css` now has a TypeScript declaration for side-effect CSS imports.

### New public APIs

- Added `data-table-pro/advanced` for adapter authors and advanced composition users.
  - Runtime exports: `createDataTable`, `primitiveUiKit`, `useControllableState`, `useStableCallback`, `useColumnLayout`, `useDataTableState`, `useDataTableInstance`, `useDataTableColumns`, `useRowEditing`, `DataTableHeaderCell`, `DataTableBodyRow`, `DataTableCardPanel`, `DataTableTablePanel`, `DataTableToolbarSection`, and `DataTableFooterSection`.
  - Type exports: `DataTableUiKit`, `DataTableUiClassNames`, `DataTableColumnLayout`, `DataTableRowsToRender`, and all public `DataTable*` types.
- Added client filtering props:
  - `manualFiltering`
  - `enableToolbarQueryFiltering`
  - `globalFilterFn`
  - `columnFilters`
  - `onColumnFiltersChange`
  - `enableColumnFilters`
- Added toolbar-chip column filters through `column.meta.filter`:
  - `type: "text"`
  - `type: "select"`
  - `type: "multi"`
  - `options`
  - `getOptionValue`
- Added row expansion:
  - `expanded`
  - `onExpandedChange`
  - `getRowCanExpand`
  - `renderExpandedRow`
- Added column reordering:
  - `columnOrder`
  - `onColumnOrderChange`
  - `enableColumnReordering`
- Added controlled column pinning:
  - `columnPinning`
  - `onColumnPinningChange`
  - `enableColumnPinning`
- Added CSV export:
  - `csvExport`
  - `DataTableCsvExportOptions`
- Added density controls:
  - `density`
  - `onDensityChange`
  - `enableDensityToggle`
- Added persisted column preferences:
  - `columnPrefsKey`
  - persists uncontrolled visibility, sizing, order, pinning, and density to `localStorage`
- Added i18n labels:
  - `labels`
  - `DataTableLabels`
- Added summary rows:
  - `summaryRows`
  - `DataTableSummaryRow`
- Added RTL layout support:
  - `dir`
  - pinned columns now use logical inline offsets internally.
- Added editing value hooks:
  - `column.meta.parseEditValue`
  - `column.meta.formatEditValue`
  - `column.meta.renderEditCell`

### Card virtualization

- `virtualization` now supports both table rows and card rows.
- Table mode remains enabled with `virtualization={true}` or `virtualization={{ enabled: true }}`.
- Card mode is enabled with:

```tsx
<DataTable
  viewMode="card"
  cardRenderer={renderCard}
  virtualization={{
    card: {
      enabled: true,
      estimateCardHeight: 280,
      overscan: 4,
      lanes: "auto",
    },
  }}
/>
```

- `virtualization.card.lanes` accepts a positive number or `"auto"`.
  - `"auto"` derives the lane count from the card viewport width.
  - Numeric lanes are clamped to at least `1`.
- Before the scroll viewport is measurable, card mode renders the full card set instead of rendering a blank viewport.

### Fixes and hardening

- Fixed default/custom cell detection so TanStack default cells no longer suppress library formatting.
- Restored primitive cell truncation, custom-cell clipping, date formatting, and muted null/empty fallbacks.
- Added regression tests for cell fallback behavior, date formatting, and overflow policy.
- Added `aria-sort` to sortable headers.
- Made clickable table rows and cards keyboard-reachable with Enter/Space activation.
- Added shift-click range selection.
- Improved inline editing type preservation for numbers, booleans, dates, and datetimes where inferable.
- Added CI at `.github/workflows/ci.yml`.

### Performance and architecture

- Split the former monolithic factory into focused modules for state, layout, editing, table instance creation, column construction, toolbar features, rows, headers, and render panels.
- Memoized table body rows and added regression coverage so editing input changes rerender only the active editing row.
- Centralized column layout calculation in `useColumnLayout`.
- Quantized responsive container width state to breakpoint buckets.
- Stabilized render callbacks with latest-ref helpers instead of using `React.useEffectEvent` for render-time handlers.
- Kept `React.useEffectEvent` scoped to effect-internal callback usage.

### v2 to v3 migration

1. Pin the GitHub dependency to the release tag:

```json
{
  "dependencies": {
    "data-table-pro": "github:Dastari/data-table-pro#v3.0.0"
  }
}
```

2. Ensure the app uses React 19.2:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

3. Replace CommonJS imports:

```ts
// Before
const { DataTable } = require("data-table-pro");

// After
import { DataTable } from "data-table-pro";
```

4. Keep existing adapter imports unless changing UI kits:

```ts
import { DataTable } from "data-table-pro";
import { DataTable as HeroDataTable } from "data-table-pro/heroui";
import { DataTable as GridcnDataTable } from "data-table-pro/thegridcn";
```

5. Keep URL state on the dedicated subpath and install `nuqs` only when using it:

```ts
import { useDataTableUrlState } from "data-table-pro/url-state";
```

6. Audit every server-filtered table. Add `manualFiltering` when row filtering is owned by the app or API:

```tsx
<DataTable
  toolbarQueryValue={query}
  onToolbarQueryValueChange={setQuery}
  manualFiltering
/>
```

7. For display-only toolbar search, keep the input but disable table-owned query filtering:

```tsx
<DataTable enableToolbarQueryFiltering={false} />
```

8. Move custom filter toolbar code to column metadata where possible:

```tsx
const columns = [
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
] satisfies Array<DataTableColumnDef<Row>>;
```

9. If a table previously controlled `viewMode` or `showHiddenRows`, keep passing both the value and callback. If the app only needs local state, pass only `enableViewToggle` or `hiddenRows`; the table now manages the value.

10. If the app persisted only the first sort in URLs, no code change is required for compatibility, but new URLs will encode the full sorting array.

11. If the app depends on column pinning, use the new controlled props:

```tsx
<DataTable
  columnPinning={columnPinning}
  onColumnPinningChange={setColumnPinning}
  enableColumnPinning
/>
```

12. If the app deep-imported internals, replace those imports with `data-table-pro/advanced` or remove them:

```ts
// Before, unsupported
import { useColumnLayout } from "data-table-pro/dist/chunk-DFFGAKKZ.js";

// After
import { useColumnLayout } from "data-table-pro/advanced";
```

13. If jumping from v2.0.0 or earlier, also apply the v2.0.1 toolbar-query migration:
  - `searchValue` -> `toolbarQueryValue`
  - `onSearchValueChange` -> `onToolbarQueryValueChange`
  - `searchPlaceholder` -> `toolbarQueryPlaceholder`
  - `searchDebounceMs` -> `toolbarQueryDebounceMs`
  - custom empty-state context `searchValue` -> `toolbarQueryValue`

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`
- GitHub Actions CI on `main`
- Scratch GitHub install check with `pnpm add github:Dastari/data-table-pro#main`

## 2.0.5

This release adds a library-level cell overflow policy so consumers do not have to hand-style truncation and clipping on every table.

### Library changes

- Added a default overflow policy in the core body-cell render path.
- Primitive/accessor cells now default to safe single-line truncation with ellipsis.
- Custom rendered cells now default to bounded clipping so they stay inside the cell by default.
- Added per-column and per-row overflow control through `column.meta.overflow`:
  - `"truncate"`
  - `"clip"`
  - `"wrap"`
  - `"visible"`
- Exported `DataTableCellOverflow` from the public type surface.
- Added bounded inner cell wrappers with `min-width: 0` and `max-width: 100%` so flex/grid children can shrink without expanding the column, row, table, or viewport unexpectedly.

### Documentation

- Documented the overflow policy and override API in `README.md` and `docs/API.md`.
- Added examples for truncation, clipping, wrapping, and visible overflow behavior.

### Validation

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

## 2.0.1

This release finalizes the library-hardening work and completes the major API cleanup.

### Breaking changes

- Removed `useDataTableUrlState` from the `data-table-pro`, `data-table-pro/heroui`, and `data-table-pro/thegridcn` entrypoints.
- `useDataTableUrlState` must now be imported from `data-table-pro/url-state`.
- Removed the legacy toolbar query prop names:
  - `searchValue`
  - `onSearchValueChange`
  - `searchPlaceholder`
  - `searchDebounceMs`
- `DataTable` now accepts only:
  - `toolbarQueryValue`
  - `onToolbarQueryValueChange`
  - `toolbarQueryPlaceholder`
  - `toolbarQueryDebounceMs`
- Custom empty-state render functions now receive `toolbarQueryValue` instead of `searchValue`.
- `useDataTableUrlState` now returns:
  - `toolbarQueryValue`
  - `setToolbarQueryValue`
  instead of `searchValue` and `setSearchValue`.

### Library changes

- Split adapter styling from neutral internal primitives so non-shadcn adapters do not inherit shadcn token assumptions.
- Rebuilt the shadcn, HeroUI, and The Gridcn adapters on top of the shared primitive layer.
- Removed duplicate internal source trees under `src/adapters/shadcn/ui/*` and `src/components/data-table/*`.
- Added dedicated package subpath exports:
  - `data-table-pro/url-state`
  - `data-table-pro/types`
- Tightened card-mode accessibility and keyboard behavior.
- Strengthened package-level regression coverage for adapter boundaries, toolbar query behavior, and subpath exports.

### Consumer upgrade checklist

1. Change `useDataTableUrlState` imports to `data-table-pro/url-state`.
2. Rename `searchValue` to `toolbarQueryValue`.
3. Rename `onSearchValueChange` to `onToolbarQueryValueChange`.
4. Rename `searchPlaceholder` to `toolbarQueryPlaceholder`.
5. Rename `searchDebounceMs` to `toolbarQueryDebounceMs`.
6. Update custom empty-state render functions to read `toolbarQueryValue`.
7. If you consume the URL-state hook return value, rename `setSearchValue` to `setToolbarQueryValue`.

### Validation

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
