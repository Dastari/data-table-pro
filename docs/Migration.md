# Migration Guide

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
(`^22.22.2`, `^24.15.0`, or `>=26`) and pnpm 11.17.0. CI uses Node.js
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

## Planned 5.0 migration

Version 4.0.0 intentionally removes no public API. The modernization roadmap
defines the following possible 5.0 changes so consumers can adopt their 4.x
replacements before anything is removed:

| Current 4.x API | Planned 5.0 API | Compatibility path |
| --- | --- | --- |
| `toolbarQueryValue`, `onToolbarQueryValueChange`, `toolbarQueryDebounceMs` | `globalFilter`, `onGlobalFilterChange`, `globalFilterDebounceMs` | Both names will work during a 4.x deprecation window before any removal. |
| Split `pageIndex`/`pageSize` props and callbacks | Unified pagination state and `onPaginationChange` | Unified state is additive in 4.x. |
| `renderExpandedRow` and `getRowCanExpand` for detail content | `detailPanel={{ render, getCanExpand }}` | The explicit detail-panel API will ship before tree expansion takes ownership of expanded-row semantics. |
| `columnPrefsKey` | Versioned `persistence` configuration | `columnPrefsKey` remains a 4.x compatibility shorthand. |
| `virtualization` on the base component | Dedicated virtual adapter entrypoints | Both entry styles coexist in 4.x; base imports load virtual panels on demand. |
| Broad `data-table-pro/advanced` imports | Stable `data-table-pro/adapter` contracts | The stable factory entrypoint is available; advanced remains supported through 4.x. |

Any 5.0 removal is gated on:

- at least one stable 4.x release containing every replacement
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
