# Changelog

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
