# Performance benchmark harness

Run the browser harness with `pnpm bench`. It starts the benchmark Vite page,
uses Playwright Chromium, and prints one JSON record per scenario. It is a
measurement tool, not a pass/fail CI performance threshold: hardware and
browser versions materially affect the numbers.

The fixture covers these row/column scales:

| Scenario | Rows | Columns | Interaction |
| --- | ---: | ---: | --- |
| `rows-1k` | 1,000 | 20 | client search and virtual scroll |
| `rows-10k` | 10,000 | 20 | client search and virtual scroll |
| `rows-50k` | 50,000 | 20 | client search and virtual scroll |
| `rows-100k` | 100,000 | 20 | client search and virtual scroll |
| `columns-20` | 1,000 | 20 | horizontal layout baseline |
| `columns-100` | 1,000 | 100 | horizontal layout stress |
| `columns-500` | 1,000 | 500 | wide-table constraint evidence |

Each JSON record includes first-render time, search-settle time, DOM node
count, heap when Chromium exposes it, long-task count/duration, and a sampled
scroll-frame interval. Repeat each scenario several times and compare medians
on the same machine/browser. Use `?scenario=columns-500` in the benchmark page
to inspect a scenario manually.

The harness intentionally measures full native table columns. Column
virtualization is not implemented because a body-only slice would violate this
package's grouped-header, pinning, resizing, detail-row, and accessibility
contracts. For very wide production datasets, prefer responsive column
visibility, server projection, or a narrower table view until a correct
two-axis design can be introduced.
