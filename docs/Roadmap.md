# Modernization Roadmap

This is the implementation plan that follows the 3.0.8 project audit. It is a
living plan, not a statement that unreleased APIs are already available.

Baseline:

- package version: 3.0.8
- React: 19.2
- TanStack Table: 8.21
- TanStack Virtual: 3.13
- adapters: shadcn, HeroUI, and The Gridcn
- validation: 164 tests plus lint, package/demo typechecks, and package/demo
  builds

## Goals

1. Fix the correctness, accessibility, and lifecycle risks found in the audit.
2. Support the important TanStack Table features that the wrapper does not
   currently expose.
3. Add the quality-of-life features users expect from a modern data grid
   without turning the default table into a large enterprise-grid bundle.
4. Make optional features independently importable and measurable.
5. Preserve 3.x compatibility while preparing one documented 4.0 cleanup.

## Non-goals

- Reimplement every AG Grid or MUI X enterprise feature.
- Put pivoting, charts, XLSX generation, or drag-and-drop engines in the base
  bundle.
- Hide TanStack state behind a second incompatible state model.
- Change adapter theme tokens or host-owned design-system decisions.

## Audit issue register

| ID | Priority | Finding | Planned resolution |
| --- | --- | --- | --- |
| COR-01 | P0 | `globalFilterFn` is public but the current toolbar query pre-filters `data` while the TanStack `globalFilter` value remains empty, so a supplied global filter function is not applied to toolbar search. | Use TanStack's global-filter pipeline and add client/manual/custom-filter contract tests in 3.0.9. |
| COR-02 | P0 | Toolbar search only walks top-level column definitions, passes `0` to every `accessorFn`, and serializes object values during each scan. Nested columns and index-aware accessors can therefore produce incomplete results. | Build a memoized searchable-column model, preserve row indexes, support nested leaf columns, and allow an explicit search accessor. |
| COR-03 | P0 | Page-reset logic tracks column filters but not the local toolbar query. A filtered table can briefly remain on an invalid/high page and depend on later clamping. | Reset pagination transactionally when any effective filter changes. |
| COR-04 | P0 | CSV export uses filtered rows but not the sorted row model, has no explicit current-page/selected/all scope, and does not guard spreadsheet formula prefixes. | Define export scopes and ordering, add formula-injection protection, and keep a server-owned export callback. |
| COR-05 | P0 | Pagination callbacks can report both index and size even when only one changed. Manual pagination also derives totals from the loaded page when neither `rowCount` nor `pageCount` is supplied. | Move through one pagination state transition and add an explicit known/unknown-total server contract. |
| COR-06 | P1 | Column preferences trust unversioned JSON and the persistence effect receives a new object every render, causing unnecessary storage writes. | Add a versioned schema, validation, migration/reset hooks, memoization, and debounced writes. |
| COR-07 | P1 | Async toolbar, row, selection, edit, upload, and infinite-load actions have no shared pending/error contract. Rejections can become unhandled and repeat loads are consumer-dependent. | Add action state, error callbacks/rendering, request locks, and retry affordances. |
| PERF-01 | P1 | The package-owned shared runtime is about 209.7 KB raw/38.5 KB gzip, and every main adapter reaches the same core chunk. The core also imports virtualization even when it is disabled. | Split base, virtual, URL-state, adapter-authoring, and optional export capabilities; enforce bundle budgets. |
| PERF-02 | P1 | Row virtualization uses a fixed estimate without measuring rendered rows. Expanded rows, wrapped cells, and variable-height content can drift. There is no column virtualization. | Add dynamic measurement and an opt-in two-axis virtual grid implementation. |
| PERF-03 | P1 | Toolbar filtering performs row-by-column normalization on every query change. | Cache normalized searchable values by data/column identity, allow deferred filtering, and benchmark 10k/50k/100k rows. |
| PERF-04 | P2 | The demo currently emits one 535.7 KB minified/157.1 KB gzip JavaScript chunk warning. | Lazy-load adapter and feature workbenches and keep demo chunking separate from package budgets. |
| A11Y-01 | P0 | Interactive rows replace native row semantics with `role="button"`. Resize handles are pointer-only, and pinning controls contain nested interactive elements inside menu items. | Define native-table and interactive-grid modes, preserve valid semantics, and make resizing/pinning keyboard operable. |
| A11Y-02 | P1 | There is no roving cell focus, arrow-key navigation, virtual row/column ARIA metadata, or automated accessibility suite. | Add a grid-navigation model, `aria-rowcount`/indexes for virtual/server data, axe tests, and browser keyboard tests. |
| I18N-01 | P1 | Several selection, view-toggle, filter, and card labels remain hard-coded rather than flowing through `DataTableLabels`. | Complete the label catalog and add an alternate-locale regression fixture. |
| API-01 | P1 | State is controlled through many separate props and column sizing cannot be controlled. There is no unified initial state, state callback, or public table API ref. | Add `initialState`, `state`, `onStateChange`, controlled column sizing, and a typed API ref during 3.x. |
| API-02 | P1 | Detail panels use TanStack expansion state, but true hierarchical sub-rows are not supported. This makes the meaning of “expanded” ambiguous. | Separate `detailPanel` from tree expansion and add `getSubRows`/manual expanding. |
| API-03 | P1 | The `advanced` entrypoint exposes implementation hooks and panels as a supported surface, making internal refactors expensive. | Introduce a narrow stable adapter-authoring entrypoint and mark raw internals as unstable before 4.0. |
| QA-01 | P1 | All 164 interaction cases live in one 1,800-line test file and mostly use jsdom. There are no visual, real-layout, accessibility, SSR, or consumer-install tests. | Split tests by feature and add Playwright, screenshot, axe, SSR, and packed-package fixtures. |
| QA-02 | P1 | CI builds committed `dist` but does not fail when the generated output is stale. There are no bundle, coverage, or public-type/API budgets. | Add clean-tree distribution checks, bundle limits, coverage thresholds, and API/type snapshots. |
| QA-03 | P2 | API documentation is maintained manually and can drift from `DataTableProps` and labels. Dependency updates are also manual. | Generate prop/type reference sections, link examples to tests, and add scheduled dependency update/compatibility checks. |

## Capability comparison

The table already has a strong application-table baseline. The following
matrix separates complete support from features that are only partially
exposed by the wrapper.

| Capability | 3.0.8 | Target |
| --- | --- | --- |
| Sorting and multi-sort | Supported | Keep; add complete controlled/initial-state and server request contracts. |
| Client/manual pagination | Supported | Add unified state, cursor/unknown-total server mode, and automatic page-size option. |
| Global filtering | Partial | Route through TanStack, support fuzzy/custom functions, searchable-column policies, and server mode. |
| Column filtering | Text/select/multi | Add boolean, numeric/date range, faceted autocomplete, filter operators, and server facets. |
| Column faceting | Missing | Support unique values, counts, min/max values, and async server-provided facets. |
| Column visibility/order/pinning/sizing | Supported | Add controlled sizing, keyboard-safe controls, presets, reset, and stronger grouped-column behavior. |
| Header/column groups | Incidental TanStack rendering | Make nested definitions first-class across search, sizing, visibility, export, and tests. |
| Row selection | Multi-row and shift range | Add single/multi/sub-row policies, selectability predicates, cross-page selection, and select-all scope. |
| Detail panels | Supported through expansion state | Move to an explicit detail-panel contract so tree expansion is independent. |
| Tree/sub-row expansion | Missing | Add `getSubRows`, manual expansion, leaf-first filtering, depth controls, and expanded-row pagination policy. |
| Grouping and aggregation | Missing | Add controlled/manual grouping, grouped-column modes, aggregate renderers/functions, and toolbar UI. |
| Row pinning | Missing | Add controlled top/bottom pinning, visibility policy, actions, and persisted state. |
| Row virtualization | Fixed-height estimate | Add dynamic measurement, scroll-to-row, stable keys, SSR initial rect, and variable-height coverage. |
| Column virtualization | Missing | Add an optional two-axis virtual grid for very wide datasets. |
| Card virtualization | Supported | Add measured masonry/lanes, stable resize behavior, and performance coverage. |
| Editing | Basic row editing | Add cell/row modes, validation, errors, pending state, commit/cancel keyboard flow, and optimistic hooks. |
| Drag and drop | Native event hooks; column reorder | Add accessible/touch-capable optional row and column reorder integrations. |
| State persistence | Column preferences in local storage | Add versioned full-state snapshots, migrations, reset, storage adapters, and saved views. |
| URL state | Query/page/sort/view/hidden rows | Add filters, grouping, visibility, density, pinning, and schema/version handling. |
| Export | CSV | Add explicit scopes/order/formatters, clipboard, print, and optional XLSX plugin. |
| Accessibility | Basic labels and selected keyboard actions | Add native/grid modes, full keyboard navigation, focus restoration, virtual ARIA metadata, and automated audits. |
| Server data | Manual flags and infinite callback | Add a typed request/result data-source contract with cancellation, stale-request protection, and lazy loading. |

TanStack Table features that must become first-class are faceting,
grouping/aggregation, row pinning, true sub-row expansion, fully controlled
state, and the remaining selection/filter options. TanStack Virtual work
includes dynamic measurement and column virtualization. Modern-grid features
such as saved views, keyboard cell navigation, clipboard, richer editing, and
typed server data are wrapper capabilities rather than TanStack core features.

## Release plan

### Phase 0: correctness and safety (3.0.9)

Scope:

- Resolve COR-01 through COR-05.
- Route toolbar query through TanStack global filtering.
- Add nested-leaf and index-aware search behavior.
- Reset page state in the same filter transition.
- Correct export ordering/scope and neutralize spreadsheet formula values by
  default, with an explicit opt-out for trusted data.
- Add pagination known-total and unknown-total tests.
- Lock infinite-load requests until the current promise settles.
- Move every visible hard-coded string into `DataTableLabels`.

Acceptance gates:

- Existing 3.x props remain source-compatible.
- Custom `globalFilterFn` has an end-to-end test.
- Search/filter/pagination combinations are tested in client and manual modes.
- CSV fixtures cover commas, quotes, new lines, dates, formulas, sorting,
  selected rows, and hidden columns.
- No unhandled promise rejection is produced by a built-in async workflow.

### Phase 1: state, persistence, and quality foundation (3.1)

State/API:

- Add additive `initialState`, `state`, and `onStateChange` APIs based on
  TanStack state shapes.
- Add controlled `columnSizing` and `onColumnSizingChange`.
- Add a typed `apiRef` with read-only table access plus focus, scroll, export,
  reset, snapshot, and restore methods.
- Define precedence when both a unified state slice and a legacy controlled
  prop are present; conflicting definitions should warn in development.
- Replace stale-closure-prone controlled-state transitions with transactional
  updater handling.

Persistence/QoL:

- Replace `columnPrefsKey` internals with a versioned persistence adapter while
  keeping the prop as a compatibility shorthand.
- Persist only opted-in slices and support `storage`, `serialize`, `migrate`,
  `debounceMs`, and `onError`.
- Add named saved views with create, apply, rename, and delete hooks.
- Add reset-column-layout and reset-all-state commands.
- Expand URL-state support to filters, visibility, density, order, pinning,
  grouping, and selection only when explicitly enabled.

Quality:

- Split the monolithic test suite into adapter, state, filtering, pagination,
  selection, editing, virtualization, export, and accessibility suites.
- Add browser layout/visual tests for all three adapters and light/dark themes.
- Add axe checks, SSR render/hydration checks, and a packed-package consumer
  fixture.
- Add `build && git diff --exit-code -- dist`, coverage thresholds, and public
  type/API snapshots to CI.

### Phase 2: TanStack feature parity (3.2)

Filtering and faceting:

- Add `boolean`, `numberRange`, `dateRange`, and `faceted` filter definitions.
- Wire `getFacetedRowModel`, `getFacetedUniqueValues`, and
  `getFacetedMinMaxValues` only when needed.
- Support option counts, search within facet values, async/server facet data,
  filter operators, and opt-in fuzzy ranking.

Grouping and aggregation:

- Add `grouping`, `onGroupingChange`, `manualGrouping`,
  `groupedColumnMode`, `aggregationFns`, and the grouped row model.
- Add group/ungroup controls to column menus and a reorderable grouping bar.
- Render grouped, aggregated, and placeholder cells correctly.
- Support built-in TanStack aggregations and typed custom aggregations.
- Define interaction with sorting, filtering, pagination, selection, pinned
  columns, summary rows, export, and server mode.

Trees and expansion:

- Add `getSubRows`, `manualExpanding`, `paginateExpandedRows`,
  `filterFromLeafRows`, and `maxLeafRowFilterDepth`.
- Introduce `detailPanel` as a separate application-detail surface.
- Add tree indentation, accessible expand controls, lazy child loading, and
  parent/child selection policies.

Row pinning and selection:

- Add controlled `rowPinning`, top/bottom rendering, `keepPinnedRows`, and row
  actions.
- Add `enableMultiRowSelection`, `enableSubRowSelection`, row selectability
  predicates, selected-row scope, and cross-page/manual-data semantics.

Every feature must work in shadcn, HeroUI, and The Gridcn adapters before it is
considered shipped.

### Phase 3: performance and package architecture (3.3)

Measure first:

- Add reproducible React Profiler and browser benchmarks for 1k, 10k, 50k,
  and 100k rows; 20, 100, and 500 columns; client filtering/sorting/grouping;
  selection; editing; scrolling; and rerender isolation.
- Record scripting time, commit time, heap, DOM node count, long tasks, and
  dropped frames.
- Publish benchmark fixtures and compare every performance PR to the baseline.

Runtime work:

- Cache searchable values by data/column identity and expose a custom indexing
  hook for expensive domain data.
- Use deferred transitions for client filtering without delaying controlled
  server callbacks.
- Dynamically measure variable-height table/card rows and preserve scroll
  position across expansion, editing, and responsive changes.
- Add optional column virtualization and a two-axis virtual layout.
- Document immutable row/column identity requirements and warn in development
  for common unstable inputs.
- Profile memo comparators and remove memoization whose comparison cost exceeds
  its render savings.

Package/code splitting:

- Keep `data-table-pro` as the small non-virtual shadcn entry.
- Add adapter-specific virtual entrypoints such as
  `data-table-pro/virtual`, `data-table-pro/heroui/virtual`, and
  `data-table-pro/thegridcn/virtual`.
- Move adapter-authoring APIs to `data-table-pro/adapter`.
- Keep URL state independent and move optional XLSX/drag engines to their own
  entrypoints.
- Avoid a shared chunk that makes base consumers load virtual, adapter-author,
  or optional export code.
- Lazy-load demo adapters and large feature workbenches.

Initial budgets:

| Artifact | Budget |
| --- | --- |
| Base shadcn package-owned runtime | <= 30 KiB gzip |
| HeroUI/The Gridcn adapter delta | <= 6 KiB gzip each |
| URL-state entry | <= 5 KiB gzip, excluding peer dependency |
| Base entry imports TanStack Virtual | No |
| Demo initial JavaScript | <= 100 KiB gzip |

Budgets may be adjusted once source-map-based attribution is in CI, but any
increase must be explained in the changelog.

### Phase 4: modern-grid quality of life (3.4)

Accessibility and navigation:

- Preserve a native `table` mode for reading/browsing.
- Add an explicit interactive `grid` mode with roving tab index, arrow keys,
  Home/End, Page Up/Down, Ctrl/Cmd+Home/End, focus restoration, and announced
  sort/filter/edit state.
- Make column resizing, reordering, pinning, grouping, and row selection
  keyboard and touch operable.
- Add correct ARIA indexes/counts for virtualized and server-backed rows.

Editing and clipboard:

- Add cell and row edit modes, sync/async validation, field errors, dirty
  tracking, pending state, optimistic save hooks, and cancel/commit policy.
- Add single-cell and range selection as an opt-in feature.
- Add copy as tab-separated values and opt-in paste through column parsers and
  edit validation.
- Add undo/redo hooks without imposing an internal application data store.

Toolbar and data operations:

- Add searchable column chooser, bulk show/hide, reorder, pin, reset, and
  saved-view controls.
- Add filter chips, active-filter count, operator builder, and one-command
  clear/reset.
- Add export scopes for current page, all loaded, filtered/sorted, selected,
  and server-provided exports.
- Add print support and an optional XLSX entrypoint; do not put XLSX in the
  base bundle.
- Add auto page size, scroll-to-row, scroll-to-column, full-screen hook, and
  empty/error/retry overlays.

Server data source:

- Add a typed request containing pagination/cursor, sorting, global/column
  filters, grouping, aggregation, expansion path, and abort signal.
- Add a typed response containing rows, stable IDs, known/unknown totals,
  facets, aggregates, and next cursor.
- Cancel stale requests, prevent races, cache by request identity, and support
  lazy child/group loading.
- Keep direct `data` plus manual flags supported for simple consumers.

### Phase 5: 4.0 API cleanup

4.0 removes only APIs that received a documented 3.x replacement and
deprecation period. It should not combine unrelated visual redesign work with
the migration.

Planned breaking changes:

| 3.x API | 4.0 API | 3.x migration bridge |
| --- | --- | --- |
| `toolbarQueryValue`, `onToolbarQueryValueChange`, `toolbarQueryDebounceMs` | `globalFilter`, `onGlobalFilterChange`, `globalFilterDebounceMs` | Add aliases in 3.1; old names remain functional and deprecated. |
| `pageIndex`, `pageSize`, `onPageIndexChange`, `onPageSizeChange` | `state.pagination`/`pagination` and `onPaginationChange` | Add the unified state API in 3.1 and document precedence. |
| `renderExpandedRow`, `getRowCanExpand` for detail UI | `detailPanel={{ render, getCanExpand }}` | Add `detailPanel` in 3.2; reserve expansion props for tree rows. |
| `columnPrefsKey` | `persistence={{ key, version, slices, ... }}` | Treat the old prop as persistence shorthand through 3.x. |
| `virtualization` on the base component | Virtual adapter entrypoints/components | Ship both paths in 3.3; provide an import codemod and runtime-equivalent examples. |
| Broad `data-table-pro/advanced` internals | Stable `data-table-pro/adapter` plus explicitly unstable internals | Export stable adapter contracts in 3.1 and publish an advanced-import mapping. |
| Resolved-value-only controlled callbacks | TanStack-compatible updater callbacks through unified state | Keep legacy callbacks until 4.0 and provide adapters for common `setState` usage. |

Migration requirements:

- Publish a complete `3.x -> 4.0` guide before the first 4.0 prerelease.
- Provide before/after examples and a codemod for renamed props/imports.
- Test migration fixtures for all three adapters, URL state, manual server
  pagination, virtualization, detail panels, and persisted preferences.
- Detect conflicting old/new props in development.
- Version persisted and URL state so old payloads are migrated or safely
  discarded instead of partially applied.
- Do not remove a deprecated API until its replacement has shipped in at least
  one stable 3.x release.

## Deferred and optional capabilities

The following can be valuable but should not delay the core roadmap:

- Pivoting and pivot-generated columns.
- Integrated charts.
- XLSX formulas, styling, images, and multi-sheet workbooks.
- AI-generated grid operations.

If implemented, pivoting/charts/XLSX must be optional entrypoints with separate
bundle budgets. For applications needing full enterprise analytics before
then, AG Grid or MUI X Premium remains a more appropriate choice.

## Delivery rules

Every phase must include:

- API/types and controlled/uncontrolled contract tests.
- Real-browser interaction tests for layout-dependent behavior.
- Visual coverage for three adapters, light/dark themes, compact/comfortable/
  spacious density, LTR/RTL, and narrow/wide containers.
- Accessibility checks and keyboard tests for new interactive controls.
- Client, manual server, empty, loading, error, and large-data cases.
- Bundle and performance comparisons where runtime code changes.
- Updated README, API reference, demo examples, changelog, and migration guide.
- Committed `dist` output only after all source checks pass.

Release order is deliberate:

1. Correct filtering/state semantics before adding grouping and trees.
2. Establish full-state and persistence contracts before saved views.
3. Establish accessible focus/navigation before cell range selection.
4. Split optional runtime capabilities before adding column virtualization or
   XLSX.
5. Ship deprecation bridges before 4.0 removes anything.

## Reference set

Official documentation used for the feature comparison:

- [TanStack Table feature guide](https://tanstack.com/table/latest/docs/guide/features)
- [TanStack Table React examples](https://tanstack.com/table/latest/docs/framework/react/examples)
- [TanStack grouping APIs](https://tanstack.com/table/latest/docs/api/features/grouping)
- [TanStack column faceting guide](https://tanstack.com/table/latest/docs/guide/column-faceting)
- [TanStack expanding guide](https://tanstack.com/table/latest/docs/guide/expanding)
- [TanStack row pinning APIs](https://tanstack.com/table/latest/docs/api/features/row-pinning)
- [TanStack Virtual virtualizer API](https://tanstack.com/virtual/latest/docs/api/virtualizer)
- [MUI X Data Grid feature showcase](https://mui.com/x/react-data-grid/features/)
- [MUI X Data Grid state](https://mui.com/x/react-data-grid/state/)
- [MUI X Data Grid accessibility](https://mui.com/x/react-data-grid/accessibility/)
- [AG Grid key features](https://www.ag-grid.com/react-data-grid/key-features/)
- [AG Grid server-side row model](https://www.ag-grid.com/react-data-grid/server-side-model/)
- [AG Grid accessibility](https://www.ag-grid.com/react-data-grid/accessibility/)
- [AG Grid clipboard](https://www.ag-grid.com/react-data-grid/clipboard/)
