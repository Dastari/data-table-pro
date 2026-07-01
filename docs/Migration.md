# Migration Guide

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
