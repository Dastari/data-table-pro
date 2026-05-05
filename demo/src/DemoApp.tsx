import * as React from "react";
import {
  IconArchive,
  IconBell,
  IconBriefcase,
  IconDownload,
  IconEdit,
  IconFileUpload,
  IconRefresh,
  IconSparkles,
  IconStar,
  IconUserCheck,
} from "@tabler/icons-react";
import { DataTable as ShadcnDataTable } from "data-table-pro";
import { DataTable as HeroDataTable } from "data-table-pro/heroui";
import { DataTable as GridDataTable } from "data-table-pro/thegridcn";
import { heroUiKit } from "../../src/adapters/heroui";
import { shadcnUiKit } from "../../src/adapters/shadcn";
import { theGridcnUiKit } from "../../src/adapters/thegridcn";
import type {
  DataTableCardRendererProps,
  DataTableColumnDef,
  DataTableProps,
  DataTableViewMode,
} from "data-table-pro";
import type { SortingState, VisibilityState } from "@tanstack/react-table";

type AdapterKey = "shadcn" | "heroui" | "thegridcn";
type DemoDataTable = <TData>(
  props: DataTableProps<TData>,
) => React.ReactElement;
type DemoTooltipProvider = React.ComponentType<{ children?: React.ReactNode }>;

type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  location: string;
  status: "active" | "review" | "paused" | "archived";
  priority: "low" | "medium" | "high";
  score: number;
  budget: number;
  startDate: string;
  lastActivity: string;
  manager: string;
};

const adapters: Record<
  AdapterKey,
  {
    label: string;
    DataTable: DemoDataTable;
    TooltipProvider: DemoTooltipProvider;
  }
> = {
  shadcn: {
    label: "shadcn",
    DataTable: ShadcnDataTable,
    TooltipProvider: resolveTooltipProvider(shadcnUiKit.TooltipProvider),
  },
  heroui: {
    label: "HeroUI",
    DataTable: HeroDataTable,
    TooltipProvider: resolveTooltipProvider(heroUiKit.TooltipProvider),
  },
  thegridcn: {
    label: "The Gridcn",
    DataTable: GridDataTable,
    TooltipProvider: resolveTooltipProvider(theGridcnUiKit.TooltipProvider),
  },
};

const departments = ["Platform", "Design", "Revenue", "Support", "Ops"];
const roles = [
  "Engineer",
  "Designer",
  "Analyst",
  "Program Lead",
  "Specialist",
];
const locations = ["Hobart", "Sydney", "Melbourne", "Remote", "Auckland"];
const managers = ["Ada", "Grace", "Linus", "Margaret", "Radia"];
const firstNames = [
  "Avery",
  "Blair",
  "Casey",
  "Devon",
  "Emery",
  "Finley",
  "Harper",
  "Jordan",
  "Morgan",
  "Quinn",
  "Reese",
  "Sage",
];
const lastNames = [
  "Stone",
  "Reed",
  "Vale",
  "Quinn",
  "Lane",
  "Hart",
  "Brooks",
  "Hayes",
  "Marlow",
  "Nolan",
  "Pierce",
  "Wren",
];
const statuses: Array<Employee["status"]> = [
  "active",
  "review",
  "paused",
  "archived",
];
const priorities: Array<Employee["priority"]> = ["low", "medium", "high"];

export function DemoApp() {
  const [adapter, setAdapter] = React.useState<AdapterKey>("shadcn");
  const [rows, setRows] = React.useState(() => generateEmployees(96));
  const [searchValue, setSearchValue] = React.useState("");
  const [department, setDepartment] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [priority, setPriority] = React.useState("all");
  const [minimumScore, setMinimumScore] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<DataTableViewMode>("table");
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "score", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [showHiddenRows, setShowHiddenRows] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showRowLoading, setShowRowLoading] = React.useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = React.useState(false);
  const [useVirtualization, setUseVirtualization] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(24);
  const [notice, setNotice] = React.useState("Ready");

  const DataTable = adapters[adapter].DataTable;
  const TooltipProvider = adapters[adapter].TooltipProvider;

  React.useEffect(() => {
    const root = document.documentElement;

    root.dataset.demoAdapter = adapter;
    root.dataset.theme = adapter === "thegridcn" ? "dark" : "light";
    root.classList.toggle("dark", adapter === "thegridcn");
    root.classList.toggle("heroui", adapter === "heroui");

    return () => {
      delete root.dataset.demoAdapter;
      delete root.dataset.theme;
      root.classList.remove("dark", "heroui");
    };
  }, [adapter]);

  const columns = React.useMemo<Array<DataTableColumnDef<Employee>>>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        size: 220,
        minSize: 160,
        meta: {
          fixed: "left",
          cardTitle: true,
          skeleton: () => <div className="h-4 w-36 rounded bg-muted" />,
          renderEditCell: ({ draftValue, setDraftValue }) => (
            <input
              className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
              value={String(draftValue ?? "")}
              onChange={(event) => setDraftValue(event.target.value)}
            />
          ),
        },
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 160,
        meta: {
          hideOn: "sm",
          renderEditCell: ({ draftValue, setDraftValue }) => (
            <select
              className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
              value={String(draftValue ?? departments[0])}
              onChange={(event) => setDraftValue(event.target.value)}
            >
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          ),
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 160,
        meta: {
          hideOn: "md",
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 130,
        meta: {
          hideOn: "lg",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 130,
        cell: ({ getValue }) => {
          const value = getValue<Employee["status"]>();
          return <StatusBadge status={value} />;
        },
        meta: {
          renderEditCell: ({ draftValue, setDraftValue }) => (
            <select
              className="h-8 w-full rounded-lg border border-border bg-background px-2 text-sm"
              value={String(draftValue ?? "active")}
              onChange={(event) => setDraftValue(event.target.value)}
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          ),
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 120,
        cell: ({ getValue }) => {
          const value = getValue<Employee["priority"]>();
          return <PriorityBadge priority={value} />;
        },
      },
      {
        accessorKey: "score",
        header: "Score",
        size: 110,
        meta: {
          type: "numeric",
          align: "end",
          skeleton: () => <div className="ml-auto h-4 w-12 rounded bg-muted" />,
        },
      },
      {
        accessorKey: "budget",
        header: "Budget",
        size: 130,
        cell: ({ getValue }) => formatCurrency(getValue<number>()),
        meta: {
          type: "numeric",
          align: "end",
          hideOn: "xl",
        },
      },
      {
        accessorKey: "lastActivity",
        header: "Last activity",
        size: 180,
        meta: {
          type: "date",
          hideOn: "2xl",
        },
      },
      {
        accessorKey: "manager",
        header: "Manager",
        size: 140,
        meta: {
          hideOn: "lg",
        },
      },
    ];
  }, []);

  const filteredRows = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return rows.filter((row) => {
      if (department !== "all" && row.department !== department) {
        return false;
      }
      if (status !== "all" && row.status !== status) {
        return false;
      }
      if (priority !== "all" && row.priority !== priority) {
        return false;
      }
      if (row.score < minimumScore) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [
        row.name,
        row.department,
        row.role,
        row.location,
        row.status,
        row.priority,
        row.manager,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [department, minimumScore, priority, rows, searchValue, status]);

  const tableRows = useInfiniteScroll
    ? filteredRows.slice(0, visibleCount)
    : filteredRows;
  const selectedRows = rows.filter((row) => rowSelection[row.id]);
  const hiddenRowsConfig = React.useMemo(
    () => ({
      label: "archived rows",
      getIsHidden: (row: Employee) => row.status === "archived",
    }),
    [],
  );

  React.useEffect(() => {
    setPageIndex(0);
    setVisibleCount(24);
  }, [department, minimumScore, priority, searchValue, status]);

  function refreshRows() {
    setIsLoading(true);
    setNotice("Refreshing generated rows");
    window.setTimeout(() => {
      setRows(generateEmployees(96));
      setRowSelection({});
      setIsLoading(false);
      setNotice("Generated a fresh dataset");
    }, 500);
  }

  function updateRows(ids: Array<string>, patch: Partial<Employee>) {
    const idSet = new Set(ids);
    setRows((current) =>
      current.map((row) => (idSet.has(row.id) ? { ...row, ...patch } : row)),
    );
  }

  return (
    <main
      className={demoShellClass(adapter)}
      data-demo-adapter={adapter}
      data-theme={adapter === "thegridcn" ? "dark" : "light"}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col gap-4">
        <header className="demo-panel shrink-0 flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              data-table-pro adapter demo
            </h1>
            <p className="text-sm text-muted-foreground">{notice}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(adapters).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={buttonClass(adapter === key)}
                onClick={() => setAdapter(key as AdapterKey)}
              >
                {value.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex min-h-0 grow flex-col">
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={tableRows}
              getRowId={(row) => row.id}
              title={`${adapters[adapter].label} employees`}
              description={`${filteredRows.length} matching rows, ${selectedRows.length} selected`}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              searchPlaceholder="Search name, role, status, manager..."
              rowsPerPageOptions={[5, 10, 20, 50]}
              totalRowCount={filteredRows.length}
              sorting={sorting}
              onSortingChange={setSorting}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageIndexChange={setPageIndex}
              onPageSizeChange={(nextSize) => {
                setPageSize(nextSize);
                setPageIndex(0);
              }}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              enableRowSelection
              toolbarActions={[
                {
                  key: "refresh",
                  label: "Refresh",
                  icon: IconRefresh,
                  onClick: refreshRows,
                  variant: "outline",
                },
                {
                  key: "upload",
                  label: "Upload CSV",
                  icon: IconFileUpload,
                  onClick: ({ openFileDialog }) => openFileDialog?.(),
                  variant: "secondary",
                },
                {
                  key: "export",
                  label: "Export",
                  icon: IconDownload,
                  placement: "trailing",
                  onClick: ({ rows: currentRows }) => {
                    setNotice(`Prepared ${currentRows.length} rows for export`);
                  },
                },
              ]}
              selectionActions={[
                {
                  key: "promote",
                  label: "Mark high priority",
                  icon: IconStar,
                  onClick: ({ rows: selected }) => {
                    updateRows(
                      selected.map((row) => row.id),
                      { priority: "high" },
                    );
                    setNotice(`Updated ${selected.length} selected rows`);
                  },
                },
                {
                  key: "archive",
                  label: "Archive",
                  icon: IconArchive,
                  variant: "destructive",
                  onClick: ({ rows: selected }) => {
                    updateRows(
                      selected.map((row) => row.id),
                      { status: "archived" },
                    );
                    setRowSelection({});
                    setNotice(`Archived ${selected.length} selected rows`);
                  },
                },
              ]}
              rowActions={[
                {
                  key: "review",
                  label: "Send to review",
                  icon: IconBell,
                  onClick: (row) => {
                    updateRows([row.id], { status: "review" });
                    setNotice(`${row.name} moved to review`);
                  },
                  hidden: (row) => row.status === "archived",
                },
                {
                  key: "activate",
                  label: "Activate",
                  icon: IconUserCheck,
                  onClick: (row) => {
                    updateRows([row.id], { status: "active" });
                    setNotice(`${row.name} activated`);
                  },
                  disabled: (row) => row.status === "active",
                },
                {
                  key: "archive",
                  label: (row) => `Archive ${row.name}`,
                  icon: IconArchive,
                  variant: "destructive",
                  onClick: (row) => {
                    updateRows([row.id], { status: "archived" });
                    setNotice(`${row.name} archived`);
                  },
                },
              ]}
              cardRenderer={(props) => <EmployeeCard {...props} />}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              enableViewToggle
              emptyState={({ searchValue: query }) => (
                <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
                    <IconBriefcase className="size-5" />
                  </div>
                  <div className="text-sm font-medium">
                    No matching employees
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {query
                      ? `Search "${query}" has no matches.`
                      : "Filters are too narrow."}
                  </div>
                </div>
              )}
              isLoading={isLoading}
              loadingRowCount={8}
              getRowLoadingState={(row) =>
                showRowLoading && row.status === "review"
                  ? {
                      isLoading: true,
                      skeleton: <span>Reviewing</span>,
                    }
                  : false
              }
              hiddenRows={hiddenRowsConfig}
              showHiddenRows={showHiddenRows}
              onShowHiddenRowsChange={setShowHiddenRows}
              infiniteScroll={
                useInfiniteScroll
                  ? {
                      enabled: true,
                      hasMore: visibleCount < filteredRows.length,
                      onLoadMore: () => {
                        setVisibleCount((current) =>
                          Math.min(current + 16, filteredRows.length),
                        );
                      },
                    }
                  : undefined
              }
              editableRows={{
                canEditRow: (row) => row.status !== "archived",
                onSaveRow: (row, draftValues) => {
                  setRows((current) =>
                    current.map((item) =>
                      item.id === row.id
                        ? {
                            ...item,
                            ...normaliseDraftValues(draftValues),
                          }
                        : item,
                    ),
                  );
                  setNotice(`${row.name} saved`);
                },
              }}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              enableColumnResizing
              columnResizeMode="onChange"
              layoutMode="fill"
              stickyHeader
              className="h-full min-h-0"
              tableContainerClassName="min-h-0"
              getRowClassName={(row) =>
                row.priority === "high" ? "bg-accent/35" : undefined
              }
              onRowClick={({ row }) => setNotice(`Opened ${row.name}`)}
              dragAndDrop={{
                getRowDraggable: (row) => row.priority === "high",
                onRowDragStart: ({ row }) => setNotice(`Dragging ${row.name}`),
                onRowDragEnd: ({ row }) => setNotice(`Dropped ${row.name}`),
              }}
              fileUpload={{
                accept: ".csv",
                multiple: false,
                onFilesSelected: (files) => {
                  const file = Array.isArray(files) ? files[0] : files.item(0);
                  setNotice(
                    file ? `Selected ${file.name}` : "No file selected",
                  );
                },
              }}
              virtualization={
                useVirtualization
                  ? {
                      enabled: true,
                      estimateRowHeight: 51,
                      overscan: 8,
                    }
                  : undefined
              }
              customToolbar={
                <div className="flex w-full flex-col gap-3">
                  <div className="demo-filter-row grid gap-3 md:grid-cols-[repeat(5,minmax(0,1fr))]">
                    <FilterSelect
                      label="Department"
                      value={department}
                      onChange={setDepartment}
                      options={["all", ...departments]}
                    />
                    <FilterSelect
                      label="Status"
                      value={status}
                      onChange={setStatus}
                      options={["all", ...statuses]}
                    />
                    <FilterSelect
                      label="Priority"
                      value={priority}
                      onChange={setPriority}
                      options={["all", ...priorities]}
                    />
                    <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
                      Minimum score
                      <input
                        type="number"
                        min={0}
                        max={100}
                        className="demo-native-control h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
                        value={minimumScore}
                        onChange={(event) =>
                          setMinimumScore(Number(event.target.value))
                        }
                      />
                    </label>
                    <div className="flex items-end gap-2">
                      <button
                        type="button"
                        className={buttonClass(false)}
                        onClick={() => {
                          setDepartment("all");
                          setStatus("all");
                          setPriority("all");
                          setMinimumScore(0);
                          setSearchValue("");
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                  </div>
                  <div className="flex w-full flex-wrap items-center gap-2">
                    <ToggleControl
                      label="Infinite"
                      checked={useInfiniteScroll}
                      onChange={setUseInfiniteScroll}
                    />
                    <ToggleControl
                      label="Row loading"
                      checked={showRowLoading}
                      onChange={setShowRowLoading}
                    />
                    <ToggleControl
                      label="Virtual rows"
                      checked={useVirtualization}
                      onChange={setUseVirtualization}
                    />
                    <button
                      type="button"
                      className={buttonClass(false)}
                      onClick={() => {
                        setRows((current) =>
                          current.map((row, index) =>
                            index % 7 === 0
                              ? { ...row, status: "review" }
                              : row,
                          ),
                        );
                        setNotice("Custom action marked every seventh row");
                      }}
                    >
                      <IconSparkles className="size-4" />
                      Custom action
                    </button>
                    <button
                      type="button"
                      className={buttonClass(false)}
                      onClick={() => {
                        setColumnVisibility((current) => ({
                          ...current,
                          budget: !current.budget,
                          manager: !current.manager,
                        }));
                      }}
                    >
                      Toggle budget/manager
                    </button>
                  </div>
                </div>
              }
            />
          </TooltipProvider>
        </div>
      </div>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <select
        className="demo-native-control h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {startCase(item)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="demo-native-toggle inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function EmployeeCard({
  row,
  isSelected,
  onSelectedChange,
  startEditing,
}: DataTableCardRendererProps<Employee>) {
  return (
    <div className="flex min-h-52 w-full flex-col justify-between gap-4 p-5 pt-16">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">{row.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.role} in {row.department}
            </div>
          </div>
          <StatusBadge status={row.status} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Metric label="Score" value={String(row.score)} />
          <Metric label="Budget" value={formatCurrency(row.budget)} />
          <Metric label="Priority" value={startCase(row.priority)} />
          <Metric label="Manager" value={row.manager} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(event) => onSelectedChange(event.target.checked)}
          />
          Selected
        </label>
        <button
          type="button"
          className={buttonClass(false)}
          onClick={startEditing}
        >
          <IconEdit className="size-4" />
          Edit
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="demo-metric rounded-lg border border-border bg-background/70 p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="truncate text-sm font-medium">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Employee["status"] }) {
  const className =
    status === "active"
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
      : status === "review"
        ? "border-amber-500/25 bg-amber-500/10 text-amber-700"
        : status === "paused"
          ? "border-sky-500/25 bg-sky-500/10 text-sky-700"
          : "border-slate-500/25 bg-slate-500/10 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {startCase(status)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Employee["priority"] }) {
  const className =
    priority === "high"
      ? "bg-rose-500/10 text-rose-700"
      : priority === "medium"
        ? "bg-amber-500/10 text-amber-700"
        : "bg-emerald-500/10 text-emerald-700";

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {startCase(priority)}
    </span>
  );
}

function buttonClass(active: boolean) {
  return [
    "demo-native-button inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-input text-foreground hover:bg-muted",
  ].join(" ");
}

function demoShellClass(adapter: AdapterKey) {
  return [
    "demo-shell flex h-dvh min-h-0 p-4 md:p-6",
    adapter === "thegridcn" ? "dark font-mono" : undefined,
    adapter === "heroui" ? "heroui" : undefined,
  ]
    .filter(Boolean)
    .join(" ");
}

function resolveTooltipProvider(
  Provider: React.ElementType | undefined,
): DemoTooltipProvider {
  return (Provider ?? React.Fragment) as DemoTooltipProvider;
}

function generateEmployees(count: number): Array<Employee> {
  return Array.from({ length: count }, (_, index) => {
    const department = departments[index % departments.length];
    const role = roles[(index * 3) % roles.length];
    const status = statuses[(index * 5) % statuses.length];
    const score = 42 + ((index * 17) % 59);
    const startDate = new Date(2022, index % 12, (index % 24) + 1);
    const lastActivity = new Date(2026, 3, 1 + (index % 28), 8 + (index % 8));

    return {
      id: `emp-${String(index + 1).padStart(3, "0")}`,
      name: `${firstNames[index % firstNames.length]} ${
        lastNames[(index * 7) % lastNames.length]
      } ${String(index + 1).padStart(2, "0")}`,
      department,
      role,
      location: locations[(index * 7) % locations.length],
      status,
      priority: priorities[(index * 11) % priorities.length],
      score,
      budget: 65000 + ((index * 9350) % 185000),
      startDate: startDate.toISOString().slice(0, 10),
      lastActivity: lastActivity.toISOString(),
      manager: managers[(index * 13) % managers.length],
    };
  });
}

function normaliseDraftValues(values: Record<string, unknown>): Partial<Employee> {
  return {
    name: typeof values.name === "string" ? values.name : undefined,
    department:
      typeof values.department === "string" ? values.department : undefined,
    status: isStatus(values.status) ? values.status : undefined,
  };
}

function isStatus(value: unknown): value is Employee["status"] {
  return typeof value === "string" && statuses.includes(value as Employee["status"]);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function startCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
