import * as React from "react";
import type { DataTableColumnDef, DataTableProps } from "data-table-pro";

type Adapter = "shadcn" | "heroui" | "thegridcn";
type Preset = "minimal" | "workspace" | "advanced";
type Project = {
  id: string;
  name: string;
  code: string;
  owner: string;
  team: string;
  status: string;
  budget: number;
  progress: number;
};
type TableComponent = <T>(props: DataTableProps<T>) => React.ReactElement;
const adapters = {
  shadcn: {
    label: "shadcn/ui",
    Table: React.lazy(() => import("./demo-adapters/shadcn")) as TableComponent,
  },
  heroui: {
    label: "HeroUI",
    Table: React.lazy(() => import("./demo-adapters/heroui")) as TableComponent,
  },
  thegridcn: {
    label: "The Gridcn",
    Table: React.lazy(
      () => import("./demo-adapters/thegridcn"),
    ) as TableComponent,
  },
};
const names = [
  "Website redesign",
  "Customer insights",
  "Design system",
  "Mobile experience",
  "Analytics platform",
  "Brand refresh",
  "Developer portal",
  "Onboarding flow",
];
const owners = [
  "Olivia Rhye",
  "Phoenix Baker",
  "Lana Steiner",
  "Demi Wilkinson",
  "Drew Cano",
  "Natali Craig",
  "Orlando Diggs",
  "Andi Lane",
];
const rows: Project[] = Array.from({ length: 48 }, (_, i) => ({
  id: `project-${i}`,
  name: names[i % 8],
  code: `PRJ-${String(1040 + i)}`,
  owner: owners[i % 8],
  team: ["Design", "Product", "Engineering"][i % 3],
  status: ["In progress", "In review", "Completed", "In progress", "Planned"][
    i % 5
  ],
  budget: 12000 + ((i * 3750) % 40000),
  progress: [68, 92, 100, 42, 12, 76, 35, 88][i % 8],
}));
const getRowId = (row: Project) => row.id;
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const columns: DataTableColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
    size: 260,
    minSize: 190,
    cell: ({ row }) => (
      <div className="gallery-project">
        <span className="gallery-project-icon" aria-hidden="true">
          {row.original.name.slice(0, 1)}
        </span>
        <span>
          <strong>{row.original.name}</strong>
          <small>{row.original.code}</small>
        </span>
      </div>
    ),
    meta: { cardTitle: true },
  },
  {
    accessorKey: "owner",
    header: "Project lead",
    size: 205,
    minSize: 165,
    cell: ({ getValue }) => (
      <span className="gallery-owner">
        <span className="gallery-avatar" aria-hidden="true">
          {getValue<string>()
            .split(" ")
            .map((x) => x[0])
            .join("")}
        </span>
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 155,
    minSize: 145,
    cell: ({ getValue }) => (
      <span className="gallery-status" data-status={getValue<string>()}>
        <i />
        {getValue<string>()}
      </span>
    ),
    meta: {
      filter: {
        type: "multi",
        options: ["In progress", "In review", "Completed", "Planned"],
      },
    },
  },
  {
    accessorKey: "team",
    header: "Team",
    size: 145,
    minSize: 120,
    meta: {
      filter: { type: "multi", options: ["Design", "Product", "Engineering"] },
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    size: 120,
    minSize: 100,
    cell: ({ getValue }) => (
      <span className="gallery-number">{money(getValue<number>())}</span>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    size: 160,
    minSize: 140,
    cell: ({ getValue }) => (
      <span className="gallery-progress">
        <span>
          <i style={{ width: `${getValue<number>()}%` }} />
        </span>
        <small>{getValue<number>()}%</small>
      </span>
    ),
  },
];
const minimalColumns = columns
  .filter((column) =>
    ["name", "status", "team", "budget"].includes(
      String("accessorKey" in column ? column.accessorKey : ""),
    ),
  )
  .map((column) => ({ ...column, enableSorting: false }));
const advancedColumns: DataTableColumnDef<Project>[] = [
  {
    id: "project-info",
    header: "Project information",
    columns: columns.slice(0, 2),
  },
  { id: "delivery", header: "Delivery", columns: columns.slice(2, 4) },
  { id: "investment", header: "Investment", columns: columns.slice(4) },
];
const presetInfo = {
  minimal: {
    label: "Minimal",
    description:
      "Just the data. A quiet, compact table for an overview or an embedded panel.",
  },
  workspace: {
    label: "Everyday",
    description:
      "A working project list. Search, filter, select and resize without overwhelming the data.",
  },
  advanced: {
    label: "Power user",
    description:
      "A full workspace with grouping, inline editing, details, export and keyboard cell selection.",
  },
};
export function Gallery() {
  const params = new URLSearchParams(window.location.search);
  const [adapter, setAdapter] = React.useState<Adapter>(() =>
    (params.get("adapter") ?? "") in adapters
      ? (params.get("adapter") as Adapter)
      : "shadcn",
  );
  const [theme, setTheme] = React.useState(
    params.get("theme") === "dark" ? "dark" : "light",
  );
  const [preset, setPreset] = React.useState<Preset>(() =>
    (params.get("preset") ?? "") in presetInfo
      ? (params.get("preset") as Preset)
      : "workspace",
  );
  const [data, setData] = React.useState(rows);
  const [notice, setNotice] = React.useState("");
  const [options, setOptions] = React.useState({
    selection: true,
    resizing: true,
    resizeOnEnd: false,
    footer: true,
    striped: false,
    virtual: false,
    loading: false,
    empty: false,
    rtl: false,
  });
  const Table = adapters[adapter].Table;
  const simple = preset === "minimal";
  const advanced = preset === "advanced";
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.demoAdapter = adapter;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("heroui", adapter === "heroui");
    const query = new URLSearchParams({ gallery: "1", adapter, theme, preset });
    window.history.replaceState(null, "", `?${query}`);
  }, [adapter, theme, preset]);
  return (
    <main className="gallery" data-demo-adapter={adapter} data-theme={theme}>
      <header className="gallery-nav">
        <a className="gallery-brand" href="?gallery=1">
          <span aria-hidden="true">▦</span> data-table-pro{" "}
          <small>DESIGN LAB</small>
        </a>
        <a href="?">Feature workbench ↗</a>
      </header>
      <div className="gallery-main">
        <div className="gallery-intro">
          <div>
            <p className="gallery-eyebrow">COMPONENT EXPLORATIONS / 01</p>
            <h1>
              A little less interface.
              <br />A lot more clarity.
            </h1>
            <p>
              One table engine. Three native design languages.
              <br />
              Find the right balance for your next workspace.
            </p>
          </div>
          <div className="gallery-edition">
            <span className="gallery-live" /> Interactive previews
            <span>LIGHT & DARK · RESPONSIVE</span>
          </div>
        </div>
        <section className="gallery-controls" aria-label="Preview settings">
          <div>
            <span className="gallery-control-label">Ecosystem</span>
            <div className="gallery-segment">
              {Object.entries(adapters).map(([key, item]) => (
                <button
                  key={key}
                  aria-pressed={adapter === key}
                  onClick={() => setAdapter(key as Adapter)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="gallery-control-label">Appearance</span>
            <div className="gallery-segment">
              {["light", "dark"].map((value) => (
                <button
                  key={value}
                  aria-pressed={theme === value}
                  onClick={() => setTheme(value)}
                >
                  {value === "light" ? "☀ Light" : "◐ Dark"}
                </button>
              ))}
            </div>
          </div>
        </section>
        <div
          className="gallery-presets"
          role="group"
          aria-label="Example complexity"
        >
          {Object.entries(presetInfo).map(([key, info], index) => (
            <button
              key={key}
              aria-pressed={preset === key}
              onClick={() => setPreset(key as Preset)}
            >
              <span>0{index + 1}</span>
              <strong>{info.label}</strong>
              <small>
                {key === "minimal"
                  ? "Essentials only"
                  : key === "workspace"
                    ? "Room to work"
                    : "Everything within reach"}
              </small>
              <b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>
        <section className="gallery-preview" aria-label="Table preview">
          <div className="gallery-preview-heading">
            <div>
              <span className="gallery-eyebrow">
                {presetInfo[preset].label} / {adapters[adapter].label}
              </span>
              <h2>
                Project overview <span>{simple ? "06" : "48"}</span>
              </h2>
              <p>{presetInfo[preset].description}</p>
            </div>
            <span className="gallery-preview-tag">LIVE PREVIEW</span>
          </div>
          <div
            className="gallery-table"
            data-gallery-table
            style={options.virtual ? { height: 680 } : undefined}
          >
            <React.Suspense fallback={<p>Loading table…</p>}>
              <Table
                key={`${adapter}-${preset}`}
                columns={
                  simple ? minimalColumns : advanced ? advancedColumns : columns
                }
                data={options.empty ? [] : simple ? data.slice(0, 6) : data}
                getRowId={getRowId}
                flexGrow={options.virtual}
                pageSize={simple ? 6 : 8}
                rowsPerPageOptions={[8, 16, 24, 48]}
                showToolbar={!simple}
                showFooter={!simple && options.footer}
                enableRowSelection={!simple && options.selection}
                enableColumnResizing={!simple && options.resizing}
                columnResizeMode={options.resizeOnEnd ? "onEnd" : "onChange"}
                layoutMode="fill"
                enableColumnFilters={!simple}
                enableDensityToggle={!simple}
                enableColumnPinning={advanced}
                enableColumnReordering={advanced}
                enableGrouping={advanced}
                enableRowPinning={advanced}
                interactiveGrid={advanced}
                enableCellSelection={advanced}
                enablePrint={advanced}
                enableFullscreen={advanced}
                csvExport={advanced}
                clipboard={advanced ? { copy: true } : undefined}
                enableViewToggle={advanced}
                isLoading={options.loading}
                loadingRowCount={6}
                virtualization={options.virtual}
                dir={options.rtl ? "rtl" : "ltr"}
                toolbarQueryPlaceholder="Search projects…"
                labels={{
                  recordsPerPage: "Rows per page",
                  totalRecords: (count) => `${count} projects`,
                }}
                renderExpandedRow={
                  advanced
                    ? ({ row }) => (
                        <div className="gallery-detail">
                          <strong>{row.name}</strong>
                          <p>
                            Owned by {row.owner} · {row.team} ·{" "}
                            {money(row.budget)} approved budget
                          </p>
                        </div>
                      )
                    : undefined
                }
                editableRows={
                  advanced
                    ? {
                        onSaveRow: (row, draft) => {
                          setData((current) =>
                            current.map((item) =>
                              item.id === row.id ? { ...item, ...draft } : item,
                            ),
                          );
                          setNotice(`${row.name} saved`);
                        },
                      }
                    : undefined
                }
                rowActions={
                  advanced
                    ? [
                        {
                          key: "complete",
                          label: "Mark complete",
                          onClick: (row) => {
                            setData((current) =>
                              current.map((item) =>
                                item.id === row.id
                                  ? {
                                      ...item,
                                      status: "Completed",
                                      progress: 100,
                                    }
                                  : item,
                              ),
                            );
                            setNotice(`${row.name} completed`);
                          },
                        },
                      ]
                    : undefined
                }
                summaryRows={
                  advanced
                    ? [
                        {
                          key: "total",
                          cells: {
                            name: "Portfolio budget",
                            budget: ({ rows: current }) =>
                              money(
                                current.reduce(
                                  (total, row) => total + row.budget,
                                  0,
                                ),
                              ),
                          },
                        },
                      ]
                    : undefined
                }
                getRowClassName={
                  options.striped
                    ? (_, context) =>
                        context.rowIndex % 2 ? "bg-primary/5" : undefined
                    : undefined
                }
              />
            </React.Suspense>
          </div>
          <div className="gallery-preview-note">
            <span>
              <span className="gallery-live" />{" "}
              {simple
                ? "All optional controls off"
                : "Try dragging a column edge · Double-click to reset"}
            </span>
            <span>
              {theme === "light" ? "Light" : "Dark"} / {adapters[adapter].label}
            </span>
          </div>
        </section>
        <details className="gallery-options">
          <summary>
            Fine-tune this example <span>Features, states & layout</span>
          </summary>
          <div>
            {Object.entries(options).map(([key, value]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={value}
                  disabled={
                    simple && ["selection", "resizing", "footer"].includes(key)
                  }
                  onChange={(event) =>
                    setOptions((current) => ({
                      ...current,
                      [key]: event.target.checked,
                    }))
                  }
                />
                {
                  {
                    selection: "Row selection",
                    resizing: "Column resizing",
                    resizeOnEnd: "Resize on release",
                    footer: "Pagination footer",
                    striped: "Striped rows",
                    virtual: "Virtual rows",
                    loading: "Loading state",
                    empty: "Empty state",
                    rtl: "Right to left",
                  }[key]
                }
              </label>
            ))}
          </div>
        </details>
        <div className="gallery-notes">
          <article>
            <span>01 / STRUCTURE</span>
            <h3>Give the data room.</h3>
            <p>
              A single table surface, softer dividers and clear type hierarchy
              keep dense information easy to scan.
            </p>
          </article>
          <article>
            <span>02 / NAVIGATION</span>
            <h3>A footer that stays quiet.</h3>
            <p>
              Record counts sit on the left. Page size and navigation live
              together on the right, without another bordered box.
            </p>
          </article>
          <article>
            <span>03 / PERSONALITY</span>
            <h3>Native to your stack.</h3>
            <p>
              Neutral shadcn, soft HeroUI, or the technical Gridcn aesthetic.
              Every example uses the actual table adapter.
            </p>
          </article>
        </div>
        <p role="status" className="gallery-notice">
          {notice}
        </p>
        <footer className="gallery-bottom">
          <span>data-table-pro / design explorations</span>
          <span>Built to make the details feel right.</span>
        </footer>
      </div>
    </main>
  );
}
