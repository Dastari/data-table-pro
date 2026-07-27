# Migration Guide

## Unreleased clickable-row semantic correction

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

## Adopt versioned persistence during 3.x

`columnPrefsKey` remains functional. It now reads legacy raw preference objects
and upgrades them to a validated, versioned envelope on the next write.

Applications that need schema changes, custom storage, or explicit persisted
slices can move additively:

```tsx
// Before and still supported
<DataTable columnPrefsKey="people" />

// Additive 3.x replacement
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

When both props are supplied, `persistence` takes precedence. No 4.0 removal is
active yet.

## Adopt unified state during 3.x

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

During 3.x, a legacy controlled prop takes precedence over its matching unified
slice. For example, `pageIndex`/`pageSize` override `state.pagination`, and
`sorting` overrides `state.sorting`. Development builds warn when both are
present so migrations can remove conflicts deliberately.

Column sizing can now be controlled with `columnSizing` and
`onColumnSizingChange`. `apiRef` provides snapshot/restore and reset commands
without requiring imports from `data-table-pro/advanced`.

## Adopt expanded URL state during 3.x

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

## Planned 4.0 migration

No 4.0 breaking change is active in 3.0.9. The modernization roadmap defines
the following planned changes so consumers can adopt their 3.x replacements
before anything is removed:

| Current 3.x API | Planned 4.0 API | Compatibility path |
| --- | --- | --- |
| `toolbarQueryValue`, `onToolbarQueryValueChange`, `toolbarQueryDebounceMs` | `globalFilter`, `onGlobalFilterChange`, `globalFilterDebounceMs` | Both names will work during the 3.x deprecation window. |
| Split `pageIndex`/`pageSize` props and callbacks | Unified pagination state and `onPaginationChange` | Unified state will be additive in 3.x. |
| `renderExpandedRow` and `getRowCanExpand` for detail content | `detailPanel={{ render, getCanExpand }}` | The explicit detail-panel API will ship before tree expansion takes ownership of expanded-row semantics. |
| `columnPrefsKey` | Versioned `persistence` configuration | `columnPrefsKey` will remain a 3.x shorthand. |
| `virtualization` on the base component | Dedicated virtual adapter entrypoints | Both entry styles will coexist in 3.x. |
| Broad `data-table-pro/advanced` imports | Stable `data-table-pro/adapter` contracts | An export mapping and codemod will be published before removal. |

The 4.0 release is gated on:

- at least one stable 3.x release containing every replacement
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
5. `column.meta.filter` now renders built-in toolbar filters for text, select, and multi-select filter controls.
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
