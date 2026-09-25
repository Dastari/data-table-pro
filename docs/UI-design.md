# Table design explorations

Run `corepack pnpm demo` and open `http://localhost:5173/?gallery=1`.
The existing feature workbench remains at `/`. Gallery links preserve the
adapter, theme and preset in the URL.

[Browse the browser renders](./ui-renders/index.html).

| Example | Intent | Enabled features |
| --- | --- | --- |
| Minimal | Embedded overview | Six rows, four columns; toolbar, sorting, selection, resize handles and footer off |
| Everyday | Working project list | Search, filters, sorting, selection, density, column visibility, flex resizing, pagination |
| Power user | Dense operational workspace | Everyday features plus grouped headers, grouping controls, column pinning/reordering, row pinning, details, editing, row actions, summary, CSV, clipboard copy, interactive cell selection, print and fullscreen |

The gallery also switches selection, resizing, live/release resize mode,
pagination, stripes, virtualization, loading, empty state and RTL independently.
The full feature workbench covers additional host integrations such as file
uploads, drag hooks, infinite loading, hidden rows and card renderers. Mutually
exclusive modes are separate examples rather than a single “everything on” table.

## Design decisions

- **Borderless footer:** count on the leading side; page size and navigation
  together on the trailing side. Controls wrap in narrow containers. Known-total
  infinite scrolling uses the same unboxed, leading-aligned count. Labels and
  unknown-total behavior retain their existing contracts.
- **Clear hierarchy:** subdued shadcn headers, visible field borders, shorter
  resize dividers and more deliberate example-cell typography. HeroUI keeps
  its rounded surfaces and native style tokens; Gridcn keeps monospace type,
  compact corners and its accent color.
- **Theme ownership:** Gridcn now uses the semantic tokens supplied by its
  [published themes](https://thegridcn.com/tokens/tron.json), including `--card`,
  `--border`, `--primary` and `--muted-foreground`. Consumers must supply these
  tokens as documented in the adapter setup. Hardcoded black/cyan surfaces no
  longer override light themes. A light cyan palette in the gallery is a host
  theme example, not an additional upstream Gridcn release.
- **Flex resizing:** a gesture snapshots actual rendered leaf widths before
  starting TanStack resizing. Widths through the dragged edge become explicit,
  preventing earlier columns from growing under the pointer. Later columns
  remain eligible to absorb space. Updates are batched before the resize
  handler reads its baseline. The hit target stays inside the header, including
  the final column. Home/double-click removes that column's sizing override,
  restoring its configured width/fill eligibility. Reset layout clears all
  user sizing. Controlled consumers should accept the supplied sizing state.

## Dependency audit — September 25, 2026

Versions verified against npm's `latest` tag and upstream documentation.

| Component dependency | Before | Now |
| --- | --- | --- |
| React / React DOM (demo and validation) | 19.2.8 | 19.3.0 |
| shadcn CLI and stylesheet | 4.17.0 | 4.21.0 |
| HeroUI styles (NextUI's successor) | 3.2.2 | 3.2.6 |
| TanStack React Table | 9.1.2 | 9.2.4 |
| TanStack React Virtual | 3.14.9 | 3.14.13 |
| tailwind-merge | 3.6.0 | 3.7.0 |
| Radix UI | 1.6.7 | 1.6.7 (current) |
| Tailwind CSS | 4.3.3 | 4.3.3 (current) |

React peer support remains `^19.2.8`; development and the packed-consumer
fixture use current React 19.3.0 and matching types. The two demo routes are
loaded separately. React 19.3 increases the loaded demo graph to about 191 KiB
gzip; the demo-only budget moves from 190 to 195 KiB. Library budgets remain
unchanged, and the checker follows lazy routes through their adapter imports.

The adapters remain the repository's shared Radix primitives with ecosystem
styling. HeroUI's React component package is not a dependency of this adapter;
its current stylesheet is. Shadcn and Gridcn are source-distributed components,
not independently versioned runtime dependencies. Updating shadcn's CLI does
not replace the repository's customized primitives or migrate them to Base UI.
Gridcn currently identifies itself as v0.1.0 and its latest published changelog
entry uses shadcn 4.18; this repo uses the newer 4.21 CLI.

References: [shadcn changelog](https://ui.shadcn.com/docs/changelog),
[HeroUI releases](https://heroui.com/en/docs/react/releases),
[Gridcn changelog](https://thegridcn.com/changelog).

## Reproduce the renders

With the demo running on port 4173:

```sh
corepack pnpm demo --host 0.0.0.0 --port 4173
# In a second terminal:
node scripts/render-gallery.mjs
```

Set `PLAYWRIGHT_BASE_URL` to use another port. Install Playwright Chromium and
its system dependencies if needed. Output is 18 desktop PNGs (three presets ×
three adapters × two themes), three mobile PNGs, and an HTML contact sheet in
`docs/ui-renders/`. Advanced captures show a selected row and expanded details.

Browser regression tests cover all 18 combinations, accessibility, mobile
page overflow, footer geometry, feature toggles, search/selection/pagination,
LTR/RTL live and release resizing, keyboard sizing/reset, trailing flex
allocation and grouped-header resizing.
