# Changelog

## 5.3.0 - 2026-08-31

Version 5.3 adds a native known-total infinite-scroll footer and strengthens
the documented stable-row-identity contract without removing any public API.

### Changed

- Show the native total-record count as a count-only footer during infinite
  scrolling when `totalRowCount` is supplied, while continuing to suppress
  pagination controls.

### Documentation

- Use stable module-scope `getRowId` functions throughout the README examples,
  matching the identity guidance for row state and virtualization.

### Validation

- Cover controlled `manualSorting` together with `infiniteScroll`, including
  server-order preservation, sorting callbacks, and sentinel observation.
- 327 unit/integration tests across the shadcn, HeroUI, and The Gridcn
  adapters, plus lint, package/demo typechecks and builds, public API snapshot,
  packed-consumer build, and bundle budgets.

## 5.2.1 - 2026-08-13

Version 5.2.1 aligns the shadcn data-table search surface with the semantic
input background token without changing the public API.

### Changed

- Use the shadcn `bg-input` surface for data-table search input groups while
  keeping neighboring toolbar controls on `bg-card`.

### Validation

- 321 unit/integration tests
- lint, package/demo typechecks and builds, public API snapshot, and bundle
  budgets
- 12 Chromium accessibility/layout checks across all adapters and themes

## 5.2.0 - 2026-08-13

Version 5.2 corrects fill-layout column classification so preferred widths can
grow before the table adds its internal spacer. It does not remove or rename
any public API.

### Fixed

- Treat a column's configured `size` as its preferred width in
  `layoutMode="fill"`, allowing the last currently rendered growable data
  column to consume unused table width.
- Add the internal `__spacer__` column only when every currently rendered data
  column is growth-locked by `maxSize` constraints or by controlled/user
  sizing. This prevents a spacer from appearing beside a column that can fill
  the available space.

### Compatibility

- To keep a configured data column fixed in fill layout, constrain its growth
  with `maxSize` (commonly `minSize`, `size`, and `maxSize` set to the same
  value). A `size` without a locking `maxSize` remains a preferred width.

### Validation

- 321 unit/integration tests, including standard and virtual table coverage
  based on the reported Open Ports column configuration
- 12 Chromium browser behavior/accessibility checks, including growable-column
  fill and fixed-column spacer/overflow regressions
- lint, package/demo typechecks and builds, public API snapshot,
  packed-consumer build, and bundle budgets

## 5.1.0 - 2026-08-13

Version 5.1 fixes fill-layout spacer rendering without changing the public API,
TanStack v9 integration, or persisted table state.

### Fixed

- Render the internal fill-layout spacer with the same header and row borders
  and backgrounds as neighboring cells, keeping the grid visually continuous
  through a right-pinned actions column.
- Apply the continuous grid styling to ordinary rows, virtual rows, and summary
  rows while preserving the spacer's inert accessibility semantics.

### Compatibility

- No consumer migration or configuration change is required.
- Existing column widths, horizontal overflow, right-pinned actions, keyboard
  navigation, and the reserved `__spacer__` behavior remain unchanged.

### Validation

- 318 unit/integration tests, including static, virtual, adapter, and summary
  spacer coverage
- Chromium fill/overflow layout regression with computed border and background
  comparisons
- lint, typecheck, package build, packed-consumer build, public API snapshot,
  and bundle budgets

## 5.0.0 - 2026-08-13

Version 5 upgrades the package's TanStack-facing API to TanStack React Table
v9. Existing `DataTable` props, entrypoints, persisted state, saved views, and
URL-state formats remain supported unless called out below.

### Breaking changes

- `DataTableColumnDef` now follows TanStack Table v9. Rename the column option
  `sortingFn` to `sortFn`.
- Values in the `aggregationFns` registry are now context-based
  `DataTableAggregationFn` definitions with an `aggregate` method instead of
  v8 callables.
- `apiRef.current.getTable()` returns a v9 table instance. Read its state from
  `table.store.state`, use `getPrePaginatedRowModel()`, and use v9's logical
  `start` / `end` pinning state and method families.
- Row, cell, column, and header methods are prototype methods in v9. Keep them
  bound to their instance instead of destructuring, spreading, or passing them
  as bare callbacks.
- TanStack's `getIsSomeRowsSelected()` and
  `getIsSomePageRowsSelected()` now mean at least one selected row, including
  the all-selected case. Combine them with the matching `getIsAll*` predicate
  when computing an indeterminate state.
- Table row data must be a record or array; primitive row values are no longer
  supported.
- Consumers that import raw TanStack `Table`, `Row`, `Column`, `Cell`,
  `Header`, or `ColumnDef` types must supply v9's leading feature generic.
  Project-owned `DataTable*` types already contain that generic.

The wrapper's `apiRef.current.getState()` method and public/persisted
`columnPinning: { left, right }` contract are unchanged. See
[`docs/Migration.md`](./docs/Migration.md) for before/after examples and the
full compatibility boundary.

### TanStack Table v9 migration

- Upgraded `@tanstack/react-table` to v9.1.2 without using the deprecated
  `useLegacyTable` bridge.
- Added one explicit project feature registry for filtering, faceting,
  grouping/aggregation, sorting, pagination, expansion, visibility, ordering,
  sizing/resizing, selection, and row/column pinning.
- Moved optional row models and function registries into v9 feature slots and
  replaced `useReactTable` with `useTable`.
- Contained v9's feature generic behind project-owned types so adapter and
  consumer code does not need to repeat the registry type.
- Preserved the wrapper's physical `left` / `right` column-pinning state at
  props, persistence, URL state, saved views, and API snapshots while adapting
  it to v9's internal `start` / `end` regions.
- Added coverage for v9 context-based custom aggregation definitions.

### Validation

- 318 unit/integration tests and 11 browser accessibility/layout tests
- lint, package/demo typechecks and builds, public API snapshot,
  packed-consumer build, bundle budgets, frozen install, and dependency audit

## 4.5.1 - 2026-08-12

Version 4.5.1 refreshes the development and runtime dependencies without
changing the public API.

### Maintenance

- Updated pnpm, React Virtual, Playwright, React type definitions, ESLint,
  jsdom, shadcn, TypeScript ESLint, and Vite dependencies.
- Synchronized the pnpm version used by local development and CI.
- Kept TanStack React Table on the compatible v8 release line; v9 requires a
  separate API migration.

### Validation

- 317 unit/integration tests and 11 browser accessibility/layout tests
- lint, package/demo typechecks and builds, public API snapshot,
  packed-consumer build, bundle budgets, and dependency audit

## 4.5.0 - 2026-08-11

Version 4.5.0 improves fixed-region scrolling and fill-layout sizing without
removing or renaming any public prop, type, or package entrypoint.

### Features

- Added `scrollbarVisibility` for controlling automatic, persistent,
  scroll-only, or hover-only data-table and card scrollbars. Use `"always"`
  for data tables that must keep both scrollbars visible.

### Fixes

- Fixed the horizontal and vertical scrollbars and their corner to stack above
  fixed left/right columns and top/bottom-pinned rows when both axes overflow.
- Fixed `layoutMode="fill"` to preserve every currently visible fixed-width
  data column and place an internal inert flexible spacer before right-pinned
  actions. Spacer presence now follows controlled and responsive
  column-visibility changes, including grouped columns.
- Preserved horizontal overflow when visible fixed-width columns exceed the
  viewport instead of compressing those columns, in both standard and virtual
  table adapters.

### Compatibility

- Consumers do not need to define, order, pin, render, export, or navigate an
  `__spacer__` column. The reserved column is created and managed internally.
- A genuine flexible visible data column continues to consume unused width and
  prevents the internal spacer from being added.

### Validation

- 317 unit/integration tests across the shadcn, HeroUI, The Gridcn, and virtual
  adapters
- lint, package/demo typechecks, deterministic package/demo builds, public API
  snapshot, packed-consumer build, bundle budgets, and dependency audit
- browser regressions for dual-axis scrollbar stacking, fixed left/right
  columns, a bottom-pinned row, fill-space allocation, and overflow retention

## 4.4.0 - 2026-08-09

Version 4.4.0 completes the core Phase 2–4 modernization work with additive,
opt-in APIs. It removes no public prop, type, or package entrypoint.

### Features

- Added local faceted option counts, searchable faceted multi-select filters,
  server-supplied facet options, and automatically derived numeric facet
  bounds when range limits are not configured.
- Added controlled and manual grouping, grouped-column modes, built-in and
  custom aggregation functions, grouped/aggregated/placeholder rendering,
  accessible group/ungroup controls, and a reorderable grouping bar.
- Expanded `data-table-pro/data-source` requests with global filtering,
  grouping, aggregation, and expansion paths, and results with stable row IDs,
  aggregates, facets, and metadata. The generated `tableProps` now wires the
  corresponding manual table contracts.
- Added opt-in ARIA grid semantics with one roving cell tab stop, complete
  arrow/Home/End/Page navigation, virtual/server row and column metadata, and
  focus restoration from interactive descendants.
- Added controlled or uncontrolled rectangular cell-range selection through
  pointer drag and Shift+keyboard navigation, selection styling/ARIA state,
  imperative selection commands, app-owned undo/redo command hooks, and
  suppression of native text dragging while a pointer range is active.
- Added formula-safe TSV/CSV clipboard copy, selected-range copy, opt-in parsed
  paste callbacks, and flattened expanded-row ordering.
- Added asynchronous row validation, field/general errors, dirty and pending
  states, Enter/Escape commit policy, optimistic updates, rollback, and save
  lifecycle callbacks to row editing.
- Added opt-in toolbar data operations: a searchable column chooser, bulk
  visibility, group-safe reordering, pinning, layout reset, active-filter
  chips/counts, and create/apply/rename/delete controls for named saved views.
- Added opt-in viewport-driven automatic page sizing, explicit
  empty/error/retry state handling, and print/fullscreen toolbar controls and
  API commands.

### Performance and accessibility

- Cached normalized search values by immutable row/column identity and
  deferred only client-owned filtering, leaving controlled server callbacks
  immediate.
- Dynamically measured variable-height virtual table rows and retained stable
  row keys and scroll anchors.
- Added development diagnostics for actual array-wrapper identity churn and a
  reproducible 1k–100k row / 20–500 column benchmark matrix.
- Moved clipboard handling, enhanced toolbar operations, automatic page-size
  observation, and error overlays behind first-use chunks. Default tables do
  not request those opt-in implementations.
- Added real-browser interactive-grid navigation and pointer range-selection
  coverage alongside the existing adapter/theme screenshots and axe audits.
- Pinned patched transitive releases of brace-expansion, fast-uri, Hono,
  js-yaml, and nanoid after newly published advisories; `pnpm audit` reports no
  known vulnerabilities.

### Compatibility

- No public prop, type, package entrypoint, default semantic mode, or default
  toolbar behavior was removed or changed.
- `DataTableState.grouping` is optional so existing complete state object
  literals remain source-compatible. All new behaviors are disabled unless
  their corresponding prop or controlled state is supplied.
- `DataTableApi.copyToClipboard()` already returned a promise; loading its
  implementation asynchronously does not change that contract.
- Column virtualization remains intentionally deferred. A partial body-only
  implementation would break native grouped headers, pinned/resized columns,
  detail rows, and screen-reader geometry; the wide-column benchmark remains
  the supported decision tool for responsive visibility/server projection.
- A standalone per-cell commit model, built-in runtime filter-operator builder,
  and XLSX plugin remain optional future work. Existing row editing exposes
  per-cell editors and app-owned validation/commit hooks.

### Validation

- 310 unit/integration tests with enforced coverage
- lint and package/demo typechecks
- deterministic package build and public API snapshot
- packed-consumer and demo production builds
- clean `pnpm audit`
- base, adapter, URL-state, data-source, demo JavaScript, and CSS budgets
- browser keyboard/range tests plus six adapter/theme screenshot and axe cases
- The measured base static graph is 46.1 KiB gzip. The ceiling moves from
  42 KiB to 48 KiB to cover the grouping, grid-navigation, range-selection,
  editing, and state coordination that must remain in the shared runtime while
  retaining 1.9 KiB of regression headroom. Clipboard (2.04 KB minified),
  toolbar operations (4.60 KB), auto sizing (1.34 KB), error overlays
  (1.01 KB), virtualization, and the data source remain separately loaded or
  independently importable.

## 4.3.0 - 2026-08-09

### Features

- Added boolean, numeric-range, and date-range column filters with inclusive
  client filtering, serializable values, operators, bounds, steps, and
  localized labels.
- Added the optional `data-table-pro/data-source` entrypoint with typed offset
  and cursor requests, manual-table props, cancellation, stale-response
  protection, in-flight deduplication, cache policies, retry, refresh, and
  invalidation.
- Added true hierarchical rows through `getSubRows`, manual expansion,
  expanded-row pagination policy, leaf-first/depth-limited filtering, tree
  indentation, accessible expand controls, and card-renderer tree context.
- Added independent `detailPanel` state while retaining
  `renderExpandedRow` as a deprecated compatibility bridge.
- Added controlled/uncontrolled row pinning, top/bottom regions, per-row pin
  predicates, filtering/pagination visibility policy, row-menu actions,
  imperative API methods, persistence, saved views, and styling slots.
- Added explicit single/multi/sub-row selection policies, per-row
  selectability, page/filtered select-all scope, and cross-page selected IDs
  for manual/server data.
- Added package-owned container-responsive toolbar primitives and filter
  layouts, using the table's allocated inline size rather than viewport media
  queries.

### Column groups

- Groups now remain intact during pointer and keyboard reordering by default;
  `freeReordering` explicitly opts both boundaries into cross-group moves.
- Added group descriptions, table-wide and per-group header heights, and
  group-specific class and inline-style hooks.

### Fixes

- Kept utility controls, striped-row indexes, detail rows, nested selections,
  and expanded child IDs coherent when tree expansion and row pinning are
  enabled together.
- Prevented a disabled data-source hook from reporting an obsolete active
  request as fetching.
- Quantized JavaScript container-width observation to the same fixed
  breakpoints used by the package CSS container queries.

### Compatibility

- No public prop or existing entrypoint was removed.
- Card view keeps ordinary card ordering when row pinning is configured;
  separate pinned regions are a table-view feature.
- Server/manual tables must include a pinned record in the current `data`
  window for it to render.

### Validation

- 281 unit/integration tests
- lint, package/demo typechecks, coverage, deterministic build, public API
  snapshot, packed-consumer build, demo build, and bundle budgets
- The measured base graph is 39.3 KiB gzip, up from 33.7 KiB for the added
  filter, tree/detail, selection, grouping, and row-pinning runtime. The base
  CI ceiling is now 42 KiB; the 2.0 KiB data-source entry has its own 3 KiB
  ceiling and neither graph statically imports TanStack Virtual.

## 4.2.0 - 2026-08-08

### Features

- Added first-class nested column groups with multi-row shared headings,
  visible-leaf spans, nested custom renderers, group class/inline-style hooks,
  proportional group resizing, and semantic `colgroup`/`col` header scopes.

### Fixes

- Made visibility controls, column filters, responsive hiding, ordering,
  pinning, sizing, editing defaults, card-title detection, and custom-cell
  handling resolve nested leaf definitions instead of assuming every
  top-level definition is a data column.
- Prevented placeholder and group headings from being individually reordered,
  while retaining leaf reordering and group splitting behavior.

## 4.1.0 - 2026-07-29

### Fixes

- Restored far-right alignment for the toolbar's options, view, selection, and
  trailing action controls at desktop container widths.

### Validation

- Real-browser layout coverage now asserts that the toolbar's end controls
  remain aligned to the right edge across every adapter and theme.

## 4.0.0 - 2026-07-27

Version 4.0.0 is a compatibility-first major release. It packages the
correctness, state, persistence, quality, dependency, and code-splitting work
delivered after 3.0.9 without removing an existing public prop, type, or
entrypoint. The previously proposed API-removal milestone is deferred to
5.0.0 so every replacement can ship and mature first.

### Features

- Added eager virtual adapter entrypoints at `data-table-pro/virtual`,
  `data-table-pro/heroui/virtual`, and
  `data-table-pro/thegridcn/virtual`.
- Added stable adapter-authoring entrypoints at `data-table-pro/adapter` and
  `data-table-pro/adapter/virtual`.
- Kept the base-entry `virtualization` prop source-compatible while moving its
  virtual row/card panels behind on-demand chunks.

- Added the additive `persistence` configuration with versioned payloads,
  selected state slices, custom storage, serialization/deserialization,
  migration, debounce, and error hooks.
- Kept `columnPrefsKey` as a compatibility shorthand and automatically reads its legacy
  unversioned payload before upgrading it on the next write.
- Added unified `initialState`, partial controlled `state`, and
  TanStack-compatible `onStateChange` APIs with documented legacy-prop
  precedence and development warnings for conflicts.
- Added controlled `columnSizing` and `onColumnSizingChange`.
- Added a typed `apiRef` for table inspection, state snapshots/restoration,
  reset commands, focus, row/column scrolling, and programmatic CSV export.
- Expanded `useDataTableUrlState` with opt-in column filters, visibility,
  density, column order, pinning, grouping, and row selection. Enhanced URL
  slices carry a schema version and can be migrated or safely discarded.
- Added versioned named saved views with selected state slices, validation,
  custom storage/codecs, migration/error callbacks, and create, apply, rename,
  delete, list, and clear commands through `apiRef`.
- Added `clearPersistedState()` and optional
  `{ clearPersistence: true }` handling to state/layout reset commands.

### Fixes

- Validated persisted visibility, sizing, order, pinning, and density values
  before applying them.
- Debounced persistence writes and skipped writes when the serialized payload
  has not changed.
- Made consecutive controlled/uncontrolled updater functions resolve
  transactionally from the latest reported value instead of a stale render
  closure.
- Kept row selection out of URLs unless its slice is explicitly enabled and
  kept transient pagination, selection, and expansion out of saved views
  unless consumers opt into those slices.
- Preserved native table-row semantics for clickable rows instead of assigning
  `role="button"` to rows that can contain checkboxes, links, or action
  controls. Enter and Space activation remains supported on the focusable row.
- Corrected low-contrast demo status and priority badges across light and dark
  adapter themes.

### Quality

- Updated every direct npm dependency to its latest registry release,
  including ESLint 10, TypeScript 7, jsdom 30, pnpm 11, React 19.2.8, Vite
  8.1.5, Tailwind CSS 4.3.3, HeroUI styles 3.2.2, Radix UI 1.6.7, and Vitest
  4.1.10.
- Added the TypeScript team's supported side-by-side compiler setup:
  TypeScript 7 runs `tsc`, while `@typescript/typescript6` supplies the
  programmatic API still required by typescript-eslint and tsup.
- Migrated TypeScript path mappings away from the removed `baseUrl` option and
  updated ESLint 10 rule handling without changing controlled search behavior.
- Updated checkout, setup-node, and setup-pnpm to their latest GitHub Actions
  majors and raised the CI development runtime to Node.js 22.22.2.
- Added pnpm 11 build-script policy for esbuild and supply-chain exceptions for
  newly released direct dependencies selected by this update.
- Refreshed the complete transitive graph and pinned patched esbuild and Hono
  server releases where upstream tool ranges still selected vulnerable
  versions. `pnpm audit` now reports no known vulnerabilities.
- Added Playwright layout and screenshot coverage for shadcn, HeroUI, and The
  Gridcn in light and dark themes, including checkbox-clearance assertions.
- Added scoped axe accessibility audits for every adapter/theme browser case.
- Added SSR rendering and hydration coverage for all three adapters.
- Added a packed-tarball consumer fixture that typechecks and builds imports
  from every adapter plus the URL-state, types, and stylesheet entrypoints.
- Added enforced V8 coverage thresholds and a reviewable public declaration/API
  snapshot.
- Added demo typechecking, generated-`dist` drift detection, and package-content
  verification to CI. CI now runs the coverage, API, packed-consumer, and
  browser quality gates as well.
- Reconciled the README, API reference, adapter guide, migration guide,
  roadmap, and generated declaration-reference workflow with all features
  delivered after 3.0.9. The API inventory now includes card sizing, custom
  edit-render props, and the complete virtualization configuration.
- Corrected stale roadmap baselines and the migration-guide structure.
- Minified package JavaScript with source maps, lazy-loaded demo adapters, and
  added numeric CI bundle budgets plus static import-boundary checks.
- Reduced demo initial JavaScript from the 157.1 KiB gzip audit baseline to
  64.9 KiB gzip. The measured base static graph is 33.7 KiB gzip with no
  TanStack Virtual import; the CI budget is 35 KiB rather than the roadmap's
  provisional 30 KiB to leave a small source-attributed regression margin.

### Compatibility

- No public prop, type, or package entrypoint was removed.
- Existing base adapter imports and `virtualization` props remain supported.
  Consumers that always virtualize can switch to a matching `/virtual` import
  to load that code eagerly; otherwise it is downloaded only on first use.
- Peer minimums are now React/React DOM 19.2.8, optional `nuqs` 2.9.2, and
  optional `@heroui/styles` 3.2.2.
- Repository development now requires a jsdom 30-supported Node.js release
  (`^22.22.2`, `^24.15.0`, or `>=26`) and pnpm 11.17.0. This does not raise
  the runtime Node.js requirement of the packaged table code.
- Clickable table rows no longer render as `tr[role="button"]`. Consumers that
  used this undocumented DOM selector should target their own row class from
  `getRowClassName` or the table row associated with their rendered content.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm demo:typecheck`
- `pnpm test:coverage` (211 tests)
- deterministic `pnpm build` and committed `dist`
- `pnpm api:check`
- `pnpm test:consumer`
- `pnpm demo:build`
- `pnpm bundle:check`
- `pnpm test:browser` across all adapters in light and dark themes

## 3.0.9

### Fixes

- Routed toolbar search through TanStack Table's global-filter pipeline so
  custom `globalFilterFn` implementations are honored.
- Added correct nested-leaf and index-aware accessor search behavior.
- Reset client pagination when the effective toolbar or column filter changes,
  including controlled pages that remain numerically valid.
- Stopped unchanged pagination slices from emitting duplicate callbacks.
- Stopped manual pagination without `totalRowCount` or `pageCount` from
  presenting the currently loaded page as the complete dataset.
- Added an in-flight lock to infinite loading and routed rejected loads through
  the shared action-error callback.

### Features

- Added `hasNextPage` for manual pagination with an unknown total.
- Added CSV export scopes for filtered/sorted rows, the current page, selected
  rows, and all loaded rows.
- Added CRLF line endings and spreadsheet-formula neutralization to CSV export
  by default, with `lineEnding` and `escapeFormulaValues` overrides.
- Added `onActionError` with typed source, action, and row context for toolbar,
  selection, row, row-click, edit, upload, export, and infinite-load failures.
- Completed the `DataTableLabels` catalog for selection, card selection, view
  switching, filter options, records-per-page, and pagination controls.

### Documentation

- Added a phased modernization roadmap covering audit fixes, performance and
  code splitting, TanStack feature parity, modern-grid quality-of-life work,
  delivery gates, and deferred optional capabilities.
- Added the original breaking-change register and migration guarantees; the
  compatibility-first 4.0 release later retargeted those removals to 5.0.
- Documented the 3.0.9 behavior corrections, CSV safety controls,
  unknown-total pagination, action errors, and compatibility expectations.

### Compatibility

- No public prop or entrypoint was removed.
- Toolbar queries now invoke `globalFilterFn`; applications that intentionally
  used a display-only query should continue to set
  `enableToolbarQueryFiltering={false}` or `manualFiltering`.
- CSV output now uses CRLF by default and neutralizes formula-like string
  values. Set `lineEnding: "\n"` and/or `escapeFormulaValues: false` only when
  the previous output contract is required and the data is trusted.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm demo:typecheck`
- `pnpm test` (179 tests)
- `pnpm build`
- `pnpm demo:build`

## 3.0.8

### Fixes

- Changed shadcn inputs, selects, checkboxes, and outline controls to use the table container's `bg-card` background while retaining host theme tokens and variant-specific button colors.
- Applied a two-pixel top and bottom margin directly to table selection checkboxes so their ring is not clipped by header or body cell boundaries.
- Updated styling regression coverage for the shared card-background contract.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm demo:typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`

## 3.0.7

### Fixes

- Restored host shadcn theme tokens for inputs, selects, checkboxes, and non-primary buttons instead of forcing `bg-input` and `border-border`.
- Removed the background, border, and rounded container treatment from the footer's total-records label across all adapters.
- Added vertical breathing room around table selection checkboxes so their rings are not clipped by row boundaries.
- Added regression coverage for host-themed shadcn controls, the unboxed total-records label, and checkbox spacing.

### Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm demo:typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm demo:build`

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
