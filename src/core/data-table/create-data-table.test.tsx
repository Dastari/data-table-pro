import * as React from "react";
import { act } from "react";
import { IconDownload } from "../icons";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createDataTable } from "./create-data-table";
import * as RootEntry from "../../index";
import { DataTable as ShadcnDataTable } from "../../index";
import * as HeroEntry from "../../entries/heroui";
import { DataTable as HeroDataTable } from "../../entries/heroui";
import * as GridEntry from "../../entries/thegridcn";
import { DataTable as GridDataTable } from "../../entries/thegridcn";
import { useDataTableUrlState as useDataTableUrlStateEntry } from "../../entries/url-state";
import type {
  DataTableColumnDef,
  DataTableColumnGroupDef,
  DataTableProps,
} from "../../index";
import type {
  DataTableEmptyStateContext,
  DataTableProps as DataTablePropsFromEntry,
} from "../../entries/types";
import { shadcnUiKit } from "../../adapters/shadcn";
import { heroUiKit } from "../../adapters/heroui";
import { theGridcnUiKit } from "../../adapters/thegridcn";

type TestRow = {
  id: string;
  name: string;
};

const columns: Array<DataTableColumnDef<TestRow, unknown>> = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

const rows: Array<TestRow> = [{ id: "1", name: "Ada" }];
const forbiddenNonShadcnTokens = [
  "border-border",
  "bg-card",
  "bg-muted",
  "text-muted-foreground",
  "bg-input",
  "bg-background",
  "text-card-foreground",
  "border-input",
] as const;

const _typecheckPropsEntry: DataTablePropsFromEntry<TestRow> = {
  columns,
  data: rows,
  getRowId: (row) => row.id,
};

void _typecheckPropsEntry;

function expectNoForbiddenNonShadcnTokens(markup: string) {
  for (const token of forbiddenNonShadcnTokens) {
    expect(markup).not.toContain(token);
  }
}

class ResizeObserverMock {
  observe() {}

  disconnect() {}

  unobserve() {}
}

class IntersectionObserverMock {
  observe() {}

  disconnect() {}

  unobserve() {}

  takeRecords() {
    return [];
  }
}

const suites = [
  {
    name: "shadcn",
    DataTable: ShadcnDataTable,
    TooltipProvider: shadcnUiKit.TooltipProvider ?? React.Fragment,
  },
  {
    name: "heroui",
    DataTable: HeroDataTable,
    TooltipProvider: heroUiKit.TooltipProvider ?? React.Fragment,
  },
  {
    name: "thegridcn",
    DataTable: GridDataTable,
    TooltipProvider: theGridcnUiKit.TooltipProvider ?? React.Fragment,
  },
] as const;

describe("DataTable adapter providers", () => {
  it("renders the HeroUI entry without a host TooltipProvider", () => {
    expect(() => {
      render(
        <HeroDataTable
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
        />,
      );
    }).not.toThrow();
  });

  it("uses HeroUI table container classes instead of shadcn token classes", () => {
    const { container } = render(
      <HeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />,
    );
    const scrollArea = container.querySelector('[data-slot="scroll-area"]');

    expect(scrollArea?.className).toContain("border-separator");
    expect(scrollArea?.className).toContain("bg-surface");
    expect(scrollArea?.className).not.toContain("border-border");
    expect(scrollArea?.className).not.toContain("bg-card");
  });

  it("keeps HeroUI output free of shadcn token aliases across table and card mode", () => {
    const tableView = render(
      <HeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableRowSelection
        rowActions={[
          {
            key: "open",
            label: "Open",
            onClick: vi.fn(),
          },
        ]}
      />,
    );

    expectNoForbiddenNonShadcnTokens(tableView.container.innerHTML);

    tableView.unmount();

    const cardView = render(
      <HeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        viewMode="card"
        enableRowSelection
        rowActions={[
          {
            key: "open",
            label: "Open",
            onClick: vi.fn(),
          },
        ]}
        cardRenderer={({ row }) => <div>{row.name}</div>}
      />,
    );

    expectNoForbiddenNonShadcnTokens(cardView.container.innerHTML);
  });

  it("uses a transparent HeroUI scroll area in card mode", () => {
    const { container } = render(
      <HeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        viewMode="card"
        cardRenderer={({ row }) => <div>{row.name}</div>}
      />,
    );
    const scrollArea = container.querySelector('[data-slot="scroll-area"]');

    expect(scrollArea?.className).toContain("bg-transparent");
    expect(scrollArea?.className).not.toContain("bg-surface");
  });

  it("keeps The Gridcn output free of shadcn token aliases", () => {
    const { container } = render(
      <GridDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableRowSelection
        rowActions={[
          {
            key: "open",
            label: "Open",
            onClick: vi.fn(),
          },
        ]}
      />,
    );

    expectNoForbiddenNonShadcnTokens(container.innerHTML);
  });

  it("exposes the URL-state hook from the dedicated subpath entry", () => {
    expect(typeof useDataTableUrlStateEntry).toBe("function");
  });

  it("does not expose the URL-state hook from component entrypoints anymore", () => {
    expect("useDataTableUrlState" in RootEntry).toBe(false);
    expect("useDataTableUrlState" in HeroEntry).toBe(false);
    expect("useDataTableUrlState" in GridEntry).toBe(false);
  });

  it("applies toolbarCompactIconButton class overrides to compact toolbar controls", () => {
    const CustomDataTable = createDataTable({
      ...shadcnUiKit,
      classNames: {
        ...shadcnUiKit.classNames,
        toolbarCompactIconButton: "toolbar-compact-size-8",
      },
    });

    render(
      <CustomDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        toolbarActions={[
          {
            key: "refresh",
            label: "Refresh",
            icon: IconDownload,
            iconOnly: true,
            placement: "trailing",
            onClick: vi.fn(),
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Search table" }).className,
    ).toContain("toolbar-compact-size-8");
    expect(
      screen.getByRole("button", { name: "Show table options" }).className,
    ).toContain("toolbar-compact-size-8");
    expect(
      screen.getByRole("button", { name: "Refresh" }).className,
    ).toContain("toolbar-compact-size-8");
  });

  it("uses the shadcn table background for controls", () => {
    render(
      <ShadcnDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableRowSelection
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search rows...");
    const searchGroup = searchInput.closest('[data-slot="input-group"]');
    const optionsButton = screen.getByRole("button", {
      name: "Show table options",
    });
    const rowCheckbox = screen.getByRole("checkbox", { name: "Select row" });

    expect(searchGroup?.className).toContain("border-input");
    expect(searchGroup?.className).toContain("bg-card");
    expect(searchGroup?.className).not.toContain("border-border");
    expect(searchGroup?.className).not.toContain("bg-input");
    expect(searchGroup?.className).not.toContain("bg-background");
    expect(optionsButton.className).toContain("border-input");
    expect(optionsButton.className).toContain("bg-card");
    expect(optionsButton.className).not.toContain("border-border");
    expect(optionsButton.className).not.toContain("bg-input");
    expect(optionsButton.className).not.toContain("bg-background");
    expect(rowCheckbox.className).toContain("bg-card");
  });

  it.each([
    ["shadcn", ShadcnDataTable],
    ["HeroUI", HeroDataTable],
    ["The Gridcn", GridDataTable],
  ])("renders an unboxed total-records label for %s", (_name, DataTable) => {
    render(
      <DataTable columns={columns} data={rows} getRowId={(row) => row.id} />,
    );

    const totalRecords = screen.getByLabelText("Total records: 1");

    expect(totalRecords.className).not.toMatch(/\bborder(?:-\S+)?\b/);
    expect(totalRecords.className).not.toMatch(/\bbg-\S+/);
    expect(totalRecords.className).not.toContain("rounded");
  });

  it("clips complete HeroUI card renderers with absolute overlays", () => {
    const { container } = render(
      <HeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        flexGrow
        viewMode="card"
        cardGridClassName="grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        cardRenderer={({ row }) => (
          <div
            data-testid="poster-card"
            className="relative aspect-[2/3] overflow-hidden"
          >
            <div
              data-testid="poster-overlay"
              className="absolute right-0 bottom-0 left-0 bg-black/50"
            >
              {row.name}
            </div>
          </div>
        )}
      />,
    );
    const item = container.querySelector(
      '[data-dtp-slot="data-table-card-item"]',
    );
    const renderer = container.querySelector(
      '[data-dtp-slot="data-table-card-renderer"]',
    );

    expect(item?.className).toContain("overflow-hidden");
    expect(item?.className).toContain("bg-transparent");
    expect(item?.className).toContain("p-0");
    expect(item?.className).not.toContain("bg-surface");
    expect(renderer?.className).toContain("overflow-hidden");
    expect(renderer?.className).toContain("rounded-[inherit]");
    expect(renderer?.className).not.toContain("[&>*]:w-full");
    expect(renderer?.className).toContain("[&>*]:min-w-0");
    expect(screen.getByTestId("poster-card").className).toContain(
      "aspect-[2/3]",
    );
    expect(screen.getByTestId("poster-overlay").className).toContain(
      "absolute",
    );
  });
});

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

for (const suite of suites) {
  describe(`DataTable (${suite.name})`, () => {
    const DataTable = suite.DataTable;
    const TooltipProvider = suite.TooltipProvider;

    function renderTable(props: Partial<DataTableProps<TestRow>> = {}) {
      return render(
        <TooltipProvider>
          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row, _index) => row.id}
            toolbarQueryDebounceMs={100}
            {...props}
          />
        </TooltipProvider>,
      );
    }

    it("debounces user-entered toolbar query changes", () => {
      vi.useFakeTimers();
      const onToolbarQueryValueChange = vi.fn();

      renderTable({ onToolbarQueryValueChange });

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Ada" },
      });

      act(() => {
        vi.advanceTimersByTime(99);
      });

      expect(onToolbarQueryValueChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(onToolbarQueryValueChange).toHaveBeenCalledTimes(1);
      expect(onToolbarQueryValueChange).toHaveBeenCalledWith("Ada");
    });

    it("does not loop for controlled parents that create a fresh callback each render", () => {
      vi.useFakeTimers();
      const onToolbarQueryValueChange = vi.fn();

      function ControlledHarness() {
        const [tableState, setTableState] = React.useState({
          toolbarQueryValue: "",
        });

        return (
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(row, _index) => row.id}
              toolbarQueryValue={tableState.toolbarQueryValue}
              toolbarQueryDebounceMs={100}
              onToolbarQueryValueChange={(value) => {
                onToolbarQueryValueChange(value);
                setTableState((current) => ({
                  ...current,
                  toolbarQueryValue: value,
                }));
              }}
            />
          </TooltipProvider>
        );
      }

      render(<ControlledHarness />);

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Ada" },
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(onToolbarQueryValueChange).toHaveBeenCalledTimes(1);
      expect(onToolbarQueryValueChange).toHaveBeenLastCalledWith("Ada");

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onToolbarQueryValueChange).toHaveBeenCalledTimes(1);
    });

    it("does not echo controlled prop updates back through the debounced callback", () => {
      vi.useFakeTimers();
      const onToolbarQueryValueChange = vi.fn();

      const view = renderTable({
        toolbarQueryValue: "",
        onToolbarQueryValueChange,
      });

      view.rerender(
        <TooltipProvider>
          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row, _index) => row.id}
            toolbarQueryValue="Ada"
            toolbarQueryDebounceMs={100}
            onToolbarQueryValueChange={onToolbarQueryValueChange}
          />
        </TooltipProvider>,
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onToolbarQueryValueChange).not.toHaveBeenCalled();
    });

    it("renders synthetic table skeleton rows instead of the empty state", () => {
      const loadingColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
        {
          accessorKey: "name",
          header: "Name",
          meta: {
            skeleton: () => <span>Loading name cell</span>,
          },
        },
      ];

      renderTable({
        columns: loadingColumns,
        data: [],
        isLoading: true,
        loadingRowCount: 2,
      });

      expect(screen.queryByText("No rows yet")).toBeNull();
      expect(screen.getAllByText("Loading name cell")).toHaveLength(2);
    });

    it("passes the current toolbar query value to empty-state render functions", () => {
      const emptyState = vi.fn(
        ({ toolbarQueryValue }: DataTableEmptyStateContext<TestRow>) => (
          <div>No matches for {toolbarQueryValue}</div>
        ),
      );

      renderTable({
        data: [],
        emptyState,
      });

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Ada" },
      });

      expect(screen.getByText("No matches for Ada")).not.toBeNull();
      expect(emptyState).toHaveBeenLastCalledWith({
        rows: [],
        toolbarQueryValue: "Ada",
      });
    });

    it("filters client-side rows with uncontrolled toolbar search by default", () => {
      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
      });

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Grace" },
      });

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
    });

    it("can opt out of toolbar-query client filtering", () => {
      renderTable({
        enableToolbarQueryFiltering: false,
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
      });

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Grace" },
      });

      expect(screen.getByText("Ada")).not.toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
    });

    it("renders toolbar column filters from column meta", () => {
      type FilterRow = TestRow & { status: string };
      const filterColumns: Array<DataTableColumnDef<FilterRow, unknown>> = [
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "status",
          header: "Status",
          meta: {
            filter: {
              type: "text",
            },
          },
        },
      ];

      render(
        <TooltipProvider>
          <DataTable
            columns={filterColumns}
            data={[
              { id: "1", name: "Ada", status: "active" },
              { id: "2", name: "Grace", status: "paused" },
            ]}
            getRowId={(row) => row.id}
            toolbarQueryDebounceMs={100}
          />
        </TooltipProvider>,
      );

      fireEvent.change(screen.getByLabelText("Filters: Status"), {
        target: { value: "paused" },
      });

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
    });

    it("applies configured text filter operators", () => {
      type FilterRow = TestRow & { status: string };
      const filterColumns: Array<DataTableColumnDef<FilterRow, unknown>> = [
        { accessorKey: "name", header: "Name" },
        {
          accessorKey: "status",
          header: "Status",
          meta: {
            filter: {
              type: "text",
              operator: "startsWith",
            },
          },
        },
      ];

      render(
        <TooltipProvider>
          <DataTable
            columns={filterColumns}
            data={[
              { id: "1", name: "Ada", status: "active" },
              { id: "2", name: "Grace", status: "inactive" },
            ]}
            getRowId={(row) => row.id}
          />
        </TooltipProvider>,
      );

      fireEvent.change(screen.getByLabelText("Filters: Status"), {
        target: { value: "act" },
      });

      expect(screen.getByText("Ada")).not.toBeNull();
      expect(screen.queryByText("Grace")).toBeNull();
    });

    it("filters numeric and date columns with serializable range values", () => {
      type FilterRow = TestRow & {
        age: number;
        joinedAt: string;
      };
      const filterColumns: Array<DataTableColumnDef<FilterRow, unknown>> = [
        { accessorKey: "name", header: "Name" },
        {
          accessorKey: "age",
          header: "Age",
          meta: { filter: { type: "numberRange", min: 0, step: 1 } },
        },
        {
          accessorKey: "joinedAt",
          header: "Joined",
          meta: { filter: { type: "dateRange" } },
        },
      ];

      render(
        <TooltipProvider>
          <DataTable
            columns={filterColumns}
            data={[
              { id: "1", name: "Ada", age: 24, joinedAt: "2023-06-01" },
              { id: "2", name: "Grace", age: 36, joinedAt: "2024-02-15" },
              { id: "3", name: "Linus", age: 52, joinedAt: "2025-01-10" },
            ]}
            getRowId={(row) => row.id}
          />
        </TooltipProvider>,
      );

      fireEvent.change(screen.getByLabelText("Age: From"), {
        target: { value: "30" },
      });
      fireEvent.change(screen.getByLabelText("Age: To"), {
        target: { value: "40" },
      });

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
      expect(screen.queryByText("Linus")).toBeNull();

      fireEvent.change(screen.getByLabelText("Age: From"), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText("Age: To"), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByLabelText("Joined: From"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.change(screen.getByLabelText("Joined: To"), {
        target: { value: "2024-12-31" },
      });

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
      expect(screen.queryByText("Linus")).toBeNull();
    });

    it("renders localized boolean filters and filters false values", () => {
      type FilterRow = TestRow & { active: boolean };
      const filterColumns: Array<DataTableColumnDef<FilterRow, unknown>> = [
        { accessorKey: "name", header: "Name" },
        {
          accessorKey: "active",
          header: "Active",
          meta: {
            filter: {
              type: "boolean",
              trueLabel: "Enabled",
              falseLabel: "Disabled",
            },
          },
        },
      ];

      const { container } = render(
        <TooltipProvider>
          <DataTable
            columns={filterColumns}
            data={[
              { id: "1", name: "Ada", active: true },
              { id: "2", name: "Grace", active: false },
            ]}
            getRowId={(row) => row.id}
          />
        </TooltipProvider>,
      );

      const filterButton = container.querySelector(
        '[data-dtp-slot="data-table-toolbar-filters"] button',
      );
      fireEvent.pointerDown(filterButton!);
      fireEvent.click(screen.getByText("Disabled"));

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
      expect(screen.getByRole("button", { name: "Active: Disabled" })).not.toBeNull();
    });

    it("renders expanded table detail rows", () => {
      renderTable({
        renderExpandedRow: ({ row }) => <div>Details for {row.name}</div>,
      });

      fireEvent.click(screen.getByRole("button", { name: "Expand row" }));

      expect(screen.getByText("Details for Ada")).not.toBeNull();
    });

    it("exports filtered visible rows to CSV", async () => {
      const onExport = vi.fn();

      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
        csvExport: {
          onExport,
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Grace" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

      await waitFor(() => {
        expect(onExport).toHaveBeenCalledTimes(1);
      });
      const exportContext = onExport.mock.calls[0]?.[0] as
        | { csv: string }
        | undefined;
      expect(exportContext?.csv).toContain("Name");
      expect(exportContext?.csv).toContain("Grace");
      expect(exportContext?.csv).not.toContain("Ada");
    });

    it("supports density changes from the table options menu", () => {
      const { container } = renderTable({
        enableDensityToggle: true,
      });

      fireEvent.pointerDown(
        screen.getByRole("button", { name: "Show table options" }),
      );
      fireEvent.click(screen.getByText("Compact"));

      expect(
        container
          .querySelector('[data-dtp-slot="data-table-root"]')
          ?.getAttribute("data-density"),
      ).toBe("compact");
    });

    it("supports virtualization-safe striped rows and row styling context", () => {
      const getRowClassName = vi.fn(
        (_row: TestRow, context: { rowIndex: number }) =>
          context.rowIndex === 1 ? "second-row" : undefined,
      );
      const { container } = renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
        getRowClassName,
        pageSize: 2,
        stripedRows: true,
      });

      const root = container.querySelector(
        '[data-dtp-slot="data-table-root"]',
      );
      const firstRow = container.querySelector('tr[data-row-id="1"]');
      const secondRow = container.querySelector('tr[data-row-id="2"]');
      expect(root?.getAttribute("data-dtp-striped-rows")).toBe("true");
      expect(firstRow?.getAttribute("data-row-parity")).toBe("odd");
      expect(secondRow?.getAttribute("data-row-parity")).toBe("even");
      expect(secondRow?.className).toContain("second-row");
      expect(
        getRowClassName.mock.calls.some(
          ([, context]) => context.rowIndex === 1,
        ),
      ).toBe(true);
    });

    it("activates clickable table rows with the keyboard", () => {
      const onRowClick = vi.fn();
      renderTable({ onRowClick });
      const row = screen.getByText("Ada").closest("tr");
      if (!row) {
        throw new Error("Expected a clickable table row");
      }

      expect(row.getAttribute("role")).toBeNull();
      expect(row.getAttribute("tabindex")).toBe("0");
      fireEvent.keyDown(row, { key: "Enter" });
      fireEvent.keyDown(row, { key: " " });

      expect(onRowClick).toHaveBeenCalledTimes(2);
    });

    it("does not activate rows from consumer interactive cell content", () => {
      const onRowClick = vi.fn();
      const onButtonClick = vi.fn();
      renderTable({
        columns: [
          {
            accessorKey: "name",
            header: "Name",
            cell: () => (
              <button type="button" onClick={onButtonClick}>
                Open profile
              </button>
            ),
          },
        ],
        onRowClick,
      });

      fireEvent.click(screen.getByRole("button", { name: "Open profile" }));
      expect(onButtonClick).toHaveBeenCalledOnce();
      expect(onRowClick).not.toHaveBeenCalled();
    });

    it("does not re-render sibling rows while typing in an edit input", () => {
      const renderCounts = new Map<string, number>([
        ["1", 0],
        ["2", 0],
      ]);
      const countRender = (rowId: string) => {
        renderCounts.set(rowId, (renderCounts.get(rowId) ?? 0) + 1);
      };
      const editRows: Array<TestRow> = [
        { id: "1", name: "Ada" },
        { id: "2", name: "Grace" },
      ];
      const editColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ row }) => {
            countRender(row.original.id);
            return row.original.name;
          },
          meta: {
            renderEditCell: ({ row, draftValue, setDraftValue }) => {
              countRender(row.id);
              return (
                <input
                  aria-label={`Edit ${row.id}`}
                  value={typeof draftValue === "string" ? draftValue : ""}
                  onChange={(event) => {
                    setDraftValue(event.currentTarget.value);
                  }}
                />
              );
            },
          },
        },
      ];

      renderTable({
        columns: editColumns,
        data: editRows,
        editableRows: {
          onSaveRow: vi.fn(),
        },
      });

      fireEvent.pointerDown(
        screen.getAllByRole("button", { name: "Row actions" })[0],
      );
      fireEvent.click(screen.getByText("Edit row"));
      renderCounts.set("1", 0);
      renderCounts.set("2", 0);

      fireEvent.change(screen.getByLabelText("Edit 1"), {
        target: { value: "Ada Lovelace" },
      });

      expect(renderCounts.get("1")).toBeGreaterThan(0);
      expect(renderCounts.get("2")).toBe(0);
    });

    it("renders nested column groups and keeps leaf-column features working", () => {
      type GroupedRow = TestRow & { email: string; status: string };
      const identityGroup: DataTableColumnGroupDef<GroupedRow> = {
        id: "identity",
        header: "Identity",
        description: "Name and email contact details",
        headerClassName: "identity-group-heading",
        headerStyle: { color: "rgb(4, 5, 6)" },
        headerHeight: 44,
        meta: {
          align: "center",
          headerClassName: "custom-group-heading",
          headerStyle: { backgroundColor: "rgb(1, 2, 3)" },
        },
        columns: [
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "email",
            header: "Email",
          },
        ],
      };
      const groupedColumns: Array<
        DataTableColumnDef<GroupedRow, unknown>
      > = [
        {
          id: "person",
          header: () => <span>Person</span>,
          columns: [
            identityGroup,
            {
              accessorKey: "status",
              header: "Status",
              meta: {
                filter: { type: "text" },
              },
            },
          ],
        },
      ];

      render(
        <TooltipProvider>
          <DataTable
            columns={groupedColumns}
            data={[
              {
                id: "1",
                name: "Ada",
                email: "ada@example.com",
                status: "active",
              },
              {
                id: "2",
                name: "Grace",
                email: "grace@example.com",
                status: "paused",
              },
            ]}
            getRowId={(row) => row.id}
            columnVisibility={{ email: false }}
            enableColumnReordering
            enableColumnResizing
            columnGroupHeaderHeight={36}
            toolbarQueryDebounceMs={100}
          />
        </TooltipProvider>,
      );

      const personHeader = screen.getByRole("columnheader", {
        name: "Person",
      });
      const identityHeader = screen.getByRole("columnheader", {
        name: "Identity",
      });
      const nameHeader = screen.getByRole("columnheader", { name: "Name" });

      expect(personHeader.getAttribute("colspan")).toBe("2");
      expect(personHeader.getAttribute("scope")).toBe("colgroup");
      expect(identityHeader.getAttribute("colspan")).toBe("1");
      expect(identityHeader.getAttribute("scope")).toBe("colgroup");
      expect(identityHeader.className).toContain("custom-group-heading");
      expect(identityHeader.className).toContain("identity-group-heading");
      expect(identityHeader.style.backgroundColor).toBe("rgb(1, 2, 3)");
      expect(identityHeader.style.color).toBe("rgb(4, 5, 6)");
      expect(identityHeader.style.height).toBe("44px");
      expect(identityHeader.getAttribute("title")).toBe(
        "Name and email contact details",
      );
      expect(identityHeader.getAttribute("aria-description")).toBe(
        "Name and email contact details",
      );
      expect(personHeader.style.height).toBe("36px");
      expect(identityHeader.getAttribute("tabindex")).toBeNull();
      expect(nameHeader.getAttribute("scope")).toBe("col");
      expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();

      fireEvent.change(screen.getByLabelText("Filters: Status"), {
        target: { value: "paused" },
      });

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();

      fireEvent.pointerDown(
        screen.getByRole("button", { name: "Show table options" }),
      );

      expect(
        screen.queryByRole("menuitemcheckbox", { name: "Person" }),
      ).toBeNull();
      expect(
        screen.queryByRole("menuitemcheckbox", { name: "Identity" }),
      ).toBeNull();
      expect(
        screen.getByRole("menuitemcheckbox", { name: "Name" }),
      ).not.toBeNull();
      expect(
        screen.getByRole("menuitemcheckbox", { name: "Email" }),
      ).not.toBeNull();
      expect(
        screen.getByRole("menuitemcheckbox", { name: "Status" }),
      ).not.toBeNull();
    });

    it("supports keyboard column reordering", () => {
      const onColumnOrderChange = vi.fn();

      renderTable({
        enableColumnReordering: true,
        onColumnOrderChange,
        columns: [
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            id: "role",
            header: "Role",
            accessorFn: () => "Admin",
          },
        ],
      });

      fireEvent.keyDown(screen.getByRole("columnheader", { name: "Name" }), {
        key: "ArrowRight",
        altKey: true,
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith(["role", "name"]);
    });

    it("keeps locked group leaves together for pointer and keyboard reordering", () => {
      const onColumnOrderChange = vi.fn();
      const groupedColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
        {
          id: "identity",
          header: "Identity",
          columns: [
            { id: "name", header: "Name", accessorFn: (row) => row.name },
            { id: "email", header: "Email", accessorFn: (row) => row.name },
          ],
        } as DataTableColumnGroupDef<TestRow>,
        {
          id: "work",
          header: "Work",
          columns: [
            { id: "role", header: "Role", accessorFn: (row) => row.name },
          ],
        } as DataTableColumnGroupDef<TestRow>,
      ];

      renderTable({
        columns: groupedColumns,
        enableColumnReordering: true,
        onColumnOrderChange,
      });

      const nameHeader = screen.getByRole("columnheader", { name: "Name" });
      const roleHeader = screen.getByRole("columnheader", { name: "Role" });
      fireEvent.dragStart(nameHeader, {
        dataTransfer: { effectAllowed: "none" },
      });
      fireEvent.drop(roleHeader, { dataTransfer: {} });

      expect(onColumnOrderChange).not.toHaveBeenCalled();

      fireEvent.keyDown(nameHeader, {
        key: "ArrowRight",
        altKey: true,
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith([
        "email",
        "name",
        "role",
      ]);
    });

    it("permits crossing group boundaries only when both groups opt in", () => {
      const onColumnOrderChange = vi.fn();
      const groupedColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
        {
          id: "identity",
          header: "Identity",
          freeReordering: true,
          columns: [
            { id: "name", header: "Name", accessorFn: (row) => row.name },
          ],
        } as DataTableColumnGroupDef<TestRow>,
        {
          id: "work",
          header: "Work",
          freeReordering: true,
          columns: [
            { id: "role", header: "Role", accessorFn: (row) => row.name },
          ],
        } as DataTableColumnGroupDef<TestRow>,
      ];

      renderTable({
        columns: groupedColumns,
        enableColumnReordering: true,
        onColumnOrderChange,
      });

      fireEvent.keyDown(screen.getByRole("columnheader", { name: "Name" }), {
        key: "ArrowRight",
        altKey: true,
      });

      expect(onColumnOrderChange).toHaveBeenCalledWith(["role", "name"]);

      onColumnOrderChange.mockClear();
      const nameHeader = screen.getByRole("columnheader", { name: "Name" });
      const roleHeader = screen.getByRole("columnheader", { name: "Role" });
      fireEvent.dragStart(roleHeader, {
        dataTransfer: { effectAllowed: "none" },
      });
      fireEvent.drop(nameHeader, { dataTransfer: {} });

      expect(onColumnOrderChange).toHaveBeenCalledWith(["name", "role"]);
    });

    it("keeps header sort icons constrained to normal icon size", () => {
      renderTable();

      const sortButton = screen.getByRole("button", { name: "Name" });
      const unsortedIcon = sortButton.querySelector("svg");

      expect(unsortedIcon?.getAttribute("class")).toContain("size-4");
      expect(unsortedIcon?.getAttribute("width")).toBe("1em");
      expect(unsortedIcon?.getAttribute("height")).toBe("1em");

      fireEvent.click(sortButton);

      const sortedIcon = sortButton.querySelector("svg");
      expect(sortedIcon?.getAttribute("class")).toContain("size-4");
      expect(sortedIcon?.getAttribute("width")).toBe("1em");
      expect(sortedIcon?.getAttribute("height")).toBe("1em");
    });

    it("keeps utility columns pinned to fixed edge widths with data column order", () => {
      renderTable({
        enableRowSelection: true,
        rowActions: [
          {
            key: "open",
            label: "Open",
            onClick: vi.fn(),
          },
        ],
        columnOrder: ["name"],
      });

      const headers = screen.getAllByRole("columnheader");
      const firstHeader = headers[0];
      const lastHeader = headers.at(-1);

      expect(firstHeader?.querySelector('[role="checkbox"]')).not.toBeNull();
      expect(firstHeader?.style.width).toBe("50px");
      expect(firstHeader?.style.minWidth).toBe("50px");
      expect(firstHeader?.style.maxWidth).toBe("50px");
      expect(lastHeader?.textContent).toContain("Actions");
      expect(lastHeader?.style.width).toBe("50px");
      expect(lastHeader?.style.minWidth).toBe("50px");
      expect(lastHeader?.style.maxWidth).toBe("50px");
    });

    it("adds vertical margin directly to table selection checkboxes", () => {
      renderTable({ enableRowSelection: true });

      const selectAll = screen.getByRole("checkbox", {
        name: "Select all visible rows",
      });
      const selectRow = screen.getByRole("checkbox", { name: "Select row" });

      expect(selectAll.className).toContain("my-0.5");
      expect(selectRow.className).toContain("my-0.5");
      expect(selectAll.parentElement?.className).not.toContain("py-1");
      expect(selectRow.parentElement?.className).not.toContain("py-1");
    });

    it("renders utility columns outside fixed data columns", () => {
      renderTable({
        columns: [
          {
            accessorKey: "name",
            header: "Record",
            meta: { fixed: "left" },
          },
          {
            id: "role",
            header: "Type",
            accessorFn: () => "Admin",
            size: 140,
          },
        ],
        enableRowSelection: true,
        rowActions: [
          {
            key: "open",
            label: "Open",
            onClick: vi.fn(),
          },
        ],
      });

      const headers = screen.getAllByRole("columnheader");
      const selectionHeader = headers[0];
      const recordHeader = headers[1];
      const actionsHeader = headers.at(-1);

      expect(selectionHeader?.querySelector('[role="checkbox"]')).not.toBeNull();
      expect(selectionHeader?.style.width).toBe("50px");
      expect(selectionHeader?.style.minWidth).toBe("50px");
      expect(selectionHeader?.style.maxWidth).toBe("50px");
      expect(recordHeader?.textContent).toContain("Record");
      expect(recordHeader?.style.left).toBe("50px");
      expect(actionsHeader?.textContent).toContain("Actions");
      expect(actionsHeader?.style.width).toBe("50px");
      expect(actionsHeader?.style.minWidth).toBe("50px");
      expect(actionsHeader?.style.maxWidth).toBe("50px");
    });

    it("reflects row selection in the select-all header checkbox", () => {
      renderTable({ enableRowSelection: true });

      const getSelectAll = () =>
        screen.getByRole("checkbox", { name: "Select all visible rows" });

      expect(getSelectAll().getAttribute("aria-checked")).toBe("false");

      fireEvent.click(screen.getByRole("checkbox", { name: "Select row" }));

      expect(getSelectAll().getAttribute("aria-checked")).toBe("true");

      fireEvent.click(getSelectAll());

      expect(getSelectAll().getAttribute("aria-checked")).toBe("false");
    });

    it("supports single-row selection mode", () => {
      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
        enableRowSelection: true,
        enableMultiRowSelection: false,
      });

      const rowCheckboxes = screen.getAllByRole("checkbox", {
        name: "Select row",
      });
      expect(
        screen.queryByRole("checkbox", { name: "Select all visible rows" }),
      ).toBeNull();
      fireEvent.click(rowCheckboxes[0]);
      fireEvent.click(
        screen.getAllByRole("checkbox", { name: "Select row" })[1],
      );

      const updatedCheckboxes = screen.getAllByRole("checkbox", {
        name: "Select row",
      });
      expect(updatedCheckboxes[0]?.getAttribute("aria-checked")).toBe("false");
      expect(updatedCheckboxes[1]?.getAttribute("aria-checked")).toBe("true");
    });

    it("disables selection for rows rejected by the selectability predicate", () => {
      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
        enableRowSelection: true,
        getRowCanSelect: (row) => row.name !== "Grace",
      });

      const rowCheckboxes = screen.getAllByRole("checkbox", {
        name: "Select row",
      });
      expect(rowCheckboxes[0]?.hasAttribute("disabled")).toBe(false);
      expect(rowCheckboxes[1]?.hasAttribute("disabled")).toBe(true);
    });

    it("can select every loaded filtered row across client pages", () => {
      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
          { id: "3", name: "Linus" },
        ],
        enableRowSelection: true,
        pageSize: 1,
        rowSelectionSelectAllScope: "filtered",
        rowsPerPageOptions: [1],
      });

      fireEvent.click(
        screen.getByRole("checkbox", { name: "Select all filtered rows" }),
      );

      expect(screen.getByText("3 records selected")).not.toBeNull();
    });

    it("keeps icon-only toolbar actions square", () => {
      renderTable({
        toolbarActions: [
          {
            key: "refresh",
            label: "Refresh",
            icon: IconDownload,
            iconOnly: true,
            placement: "trailing",
            onClick: vi.fn(),
          },
          {
            key: "export",
            label: "Export",
            icon: IconDownload,
            iconOnly: true,
            onClick: vi.fn(),
          },
        ],
      });

      const trailingButton = screen.getByRole("button", { name: "Refresh" });
      expect(trailingButton.className).toContain("size-7");
      expect(trailingButton.className).not.toContain("w-fit");
      expect(trailingButton.className).not.toContain("h-8");

      const primaryButton = screen.getByRole("button", { name: "Export" });
      expect(primaryButton.className).toContain("size-7");
      expect(primaryButton.className).toContain("@min-[768px]/data-table:size-8");
      expect(primaryButton.className).not.toContain("w-fit");
    });

    it("supports pinning columns from table options", () => {
      const onColumnPinningChange = vi.fn();

      renderTable({
        enableColumnPinning: true,
        onColumnPinningChange,
      });

      fireEvent.pointerDown(
        screen.getByRole("button", { name: "Show table options" }),
      );
      fireEvent.click(screen.getByRole("button", { name: "Pin left: Name" }));

      expect(onColumnPinningChange).toHaveBeenCalledWith({
        left: ["name"],
        right: [],
      });
    });

    it("defaults primitive cells to truncation-safe overflow wrappers", () => {
      const longToken = "SUPERCALIFRAGILISTICEXPIALIDOCIOUS-UNBROKEN-TOKEN";
      const longSentence =
        "This is a very long sentence that should stay on one line and truncate by default.";
      type OverflowRow = TestRow & { details: string };
      const overflowColumns: Array<DataTableColumnDef<OverflowRow, unknown>> = [
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "details",
          header: "Details",
        },
      ];
      const overflowRows: Array<OverflowRow> = [
        { id: "1", name: longToken, details: longSentence },
      ];

      render(
        <TooltipProvider>
          <DataTable
            columns={overflowColumns}
            data={overflowRows}
            getRowId={(row) => row.id}
            toolbarQueryDebounceMs={100}
          />
        </TooltipProvider>,
      );

      const tokenWrapper = screen
        .getByText(longToken)
        .closest('[data-dtp-slot="data-table-cell-content"]');
      const sentenceWrapper = screen
        .getByText(longSentence)
        .closest('[data-dtp-slot="data-table-cell-content"]');

      expect(tokenWrapper?.getAttribute("data-dtp-overflow")).toBe("truncate");
      expect(tokenWrapper?.className).toContain("overflow-hidden");
      expect(tokenWrapper?.className).toContain("text-ellipsis");
      expect(tokenWrapper?.className).toContain("whitespace-nowrap");
      expect(sentenceWrapper?.getAttribute("data-dtp-overflow")).toBe(
        "truncate",
      );
      expect(sentenceWrapper?.className).toContain("overflow-hidden");
      expect(sentenceWrapper?.className).toContain("text-ellipsis");
      expect(sentenceWrapper?.className).toContain("whitespace-nowrap");
    });

    it("defaults custom cell renderers to clipped wrappers", () => {
      renderTable({
        columns: [
          {
            accessorKey: "name",
            header: "Name",
            cell: () => (
              <div className="flex min-w-0">
                <div>Very wide custom content</div>
              </div>
            ),
          },
        ],
      });

      const wrapper = screen
        .getByText("Very wide custom content")
        .closest('[data-dtp-slot="data-table-cell-content"]');

      expect(wrapper?.getAttribute("data-dtp-overflow")).toBe("clip");
      expect(wrapper?.className).toContain("overflow-hidden");
      expect(wrapper?.className).toContain("whitespace-nowrap");
      expect(wrapper?.className).toContain("[&>*]:max-w-full");
      expect(wrapper?.className).toContain("[&>*]:min-w-0");
    });

    it("supports wrapping and visible overflow overrides", () => {
      type OverflowModeRow = TestRow & {
        wrapValue: string;
        visibleValue: string;
        conditionalValue: string;
      };
      const overflowModeColumns: Array<
        DataTableColumnDef<OverflowModeRow, unknown>
      > = [
        {
          accessorKey: "wrapValue",
          header: "Wrap",
          meta: {
            overflow: "wrap",
          },
        },
        {
          accessorKey: "visibleValue",
          header: "Visible",
          meta: {
            overflow: "visible",
          },
        },
        {
          accessorKey: "conditionalValue",
          header: "Conditional",
          meta: {
            overflow: ({ row }) => (row.id === "1" ? "wrap" : "truncate"),
          },
        },
      ];
      const overflowModeRows: Array<OverflowModeRow> = [
        {
          id: "1",
          name: "Ada",
          wrapValue:
            "This wrapped value should be allowed to break onto multiple lines.",
          visibleValue: "Visible overflow content",
          conditionalValue: "Conditional wrap content",
        },
      ];

      render(
        <TooltipProvider>
          <DataTable
            columns={overflowModeColumns}
            data={overflowModeRows}
            getRowId={(row) => row.id}
            toolbarQueryDebounceMs={100}
          />
        </TooltipProvider>,
      );

      const wrapWrapper = screen
        .getByText(
          "This wrapped value should be allowed to break onto multiple lines.",
        )
        .closest('[data-dtp-slot="data-table-cell-content"]');
      const visibleWrapper = screen
        .getByText("Visible overflow content")
        .closest('[data-dtp-slot="data-table-cell-content"]');
      const conditionalWrapper = screen
        .getByText("Conditional wrap content")
        .closest('[data-dtp-slot="data-table-cell-content"]');

      expect(wrapWrapper?.getAttribute("data-dtp-overflow")).toBe("wrap");
      expect(wrapWrapper?.className).toContain("whitespace-normal");
      expect(wrapWrapper?.className).toContain("break-words");
      expect(visibleWrapper?.getAttribute("data-dtp-overflow")).toBe(
        "visible",
      );
      expect(visibleWrapper?.className).toContain("overflow-visible");
      expect(conditionalWrapper?.getAttribute("data-dtp-overflow")).toBe(
        "wrap",
      );
    });

    it("renders skeleton cards while initially loading with no rows", () => {
      const cardRenderer = vi.fn(() => <div>Rendered card</div>);
      const { container } = renderTable({
        data: [],
        isLoading: true,
        loadingRowCount: 3,
        viewMode: "card",
        cardRenderer,
      });

      expect(screen.queryByText("No rows yet")).toBeNull();
      expect(cardRenderer).not.toHaveBeenCalled();
      expect(container.querySelectorAll("[data-slot='card']")).toHaveLength(3);
      expect(
        container.querySelectorAll("[data-slot='skeleton']").length,
      ).toBeGreaterThan(0);
    });

    it("renders card rows with card virtualization before viewport discovery", () => {
      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        virtualization: {
          card: {
            enabled: true,
            estimateCardHeight: 180,
            lanes: 2,
          },
        },
      });

      expect(screen.getByText("Ada")).toBeTruthy();
      expect(screen.getByText("Grace")).toBeTruthy();
    });

    it("uses a constrained flex chain for flexGrow table mode", () => {
      const { container } = render(
        <div className="flex h-96 min-h-0 flex-col">
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(row) => row.id}
              flexGrow
            />
          </TooltipProvider>
        </div>,
      );

      const root = container.querySelector(
        '[data-dtp-slot="data-table-root"]',
      );
      const layout = container.querySelector(
        '[data-dtp-slot="data-table-layout"]',
      );
      const toolbar = container.querySelector(
        '[data-dtp-slot="data-table-toolbar"]',
      );
      const content = container.querySelector(
        '[data-dtp-slot="data-table-content"]',
      );
      const tableShell = container.querySelector(
        '[data-dtp-slot="data-table-table-shell"]',
      );
      const scrollArea = container.querySelector('[data-slot="scroll-area"]');
      const footer = container.querySelector(
        '[data-dtp-slot="data-table-footer"]',
      );

      expect(root?.className).toContain("h-full");
      expect(root?.className).toContain("min-h-0");
      expect(root?.className).toContain("flex-1");
      expect(layout?.className).toContain("min-h-0");
      expect(layout?.className).toContain("flex-1");
      expect(toolbar?.className).toContain("shrink-0");
      expect(content?.className).toContain("min-h-0");
      expect(content?.className).toContain("flex-1");
      expect(tableShell?.className).toContain("min-h-0");
      expect(tableShell?.className).toContain("flex-1");
      expect(scrollArea?.className).toContain("min-h-0");
      expect(scrollArea?.className).toContain("flex-1");
      expect(footer?.className).toContain("shrink-0");
    });

    it("uses a constrained flex chain for flexGrow card mode", () => {
      const { container } = render(
        <div className="flex h-96 min-h-0 flex-col">
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(row) => row.id}
              flexGrow
              viewMode="card"
              cardRenderer={({ row }) => <div>{row.name}</div>}
            />
          </TooltipProvider>
        </div>,
      );

      const content = container.querySelector(
        '[data-dtp-slot="data-table-content"]',
      );
      const cardShell = container.querySelector(
        '[data-dtp-slot="data-table-card-shell"]',
      );
      const cardViewport = container.querySelector(
        '[data-dtp-slot="data-table-card-viewport"]',
      );
      const scrollArea = container.querySelector('[data-slot="scroll-area"]');
      const footer = container.querySelector(
        '[data-dtp-slot="data-table-footer"]',
      );

      expect(content?.className).toContain("min-h-0");
      expect(content?.className).toContain("flex-1");
      expect(cardShell?.className).toContain("min-h-0");
      expect(cardShell?.className).toContain("flex-1");
      expect(scrollArea?.className).toContain("min-h-0");
      expect(scrollArea?.className).toContain("flex-1");
      expect(cardViewport?.className).toContain("min-h-0");
      expect(cardViewport?.className).toContain("flex-1");
      expect(footer?.className).toContain("shrink-0");
    });

    it("applies supported card grid classes for dense card layouts", () => {
      const { container } = renderTable({
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        cardGridClassName:
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
      });

      const grid = container.querySelector(
        '[data-dtp-slot="data-table-card-grid"]',
      );
      const card = container.querySelector(
        '[data-dtp-slot="data-table-card-item"]',
      );

      expect(grid?.className).toContain("grid");
      expect(grid?.className).toContain("grid-cols-2");
      expect(grid?.className).toContain("sm:grid-cols-3");
      expect(grid?.className).toContain("md:grid-cols-4");
      expect(grid?.className).toContain("lg:grid-cols-5");
      expect(grid?.className).toContain("xl:grid-cols-6");
      expect(card?.className).toContain("min-w-0");
      expect(card?.className).not.toContain("min-w-72");
      expect(card?.className).not.toContain("basis-72");
    });

    it("uses start-aligned fixed-width card tracks by default", () => {
      const { container } = renderTable({
        viewMode: "card",
        cardRenderer: ({ row }) => (
          <div data-testid="narrow-card" className="w-48">
            {row.name}
          </div>
        ),
      });

      const grid = container.querySelector(
        '[data-dtp-slot="data-table-card-grid"]',
      );
      const card = container.querySelector(
        '[data-dtp-slot="data-table-card-item"]',
      );
      const renderer = container.querySelector(
        '[data-dtp-slot="data-table-card-renderer"]',
      );
      const customCard = screen.getByTestId("narrow-card");

      expect(grid?.className).toContain(
        "grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),18rem))]",
      );
      expect(grid?.className).toContain("justify-start");
      expect(grid?.className).not.toContain("auto-fit");
      expect(grid?.className).not.toContain("1fr");
      expect(card?.className).toContain("max-w-full");
      expect(card?.className.split(/\s+/)).not.toContain("w-full");
      expect(renderer?.className).toContain("max-w-full");
      expect(renderer?.className).not.toContain("[&>*]:w-full");
      expect(customCard.className).toContain("w-48");
    });

    it("supports content-sized cards without layout class overrides", () => {
      const { container } = renderTable({
        data: [
          { id: "media", name: "Media card" },
          { id: "collection", name: "Collection card" },
        ],
        viewMode: "card",
        cardSizing: "content",
        cardRenderer: ({ row }) => (
          <div
            data-testid={`${row.id}-card`}
            className={row.id === "media" ? "w-48" : "w-96"}
          >
            {row.name}
          </div>
        ),
      });

      const grid = container.querySelector(
        '[data-dtp-slot="data-table-card-grid"]',
      );
      const cards = Array.from(
        container.querySelectorAll('[data-dtp-slot="data-table-card-item"]'),
      );
      const renderer = container.querySelector(
        '[data-dtp-slot="data-table-card-renderer"]',
      );

      expect(grid?.className.split(/\s+/)).toContain("flex");
      expect(grid?.className).toContain("flex-wrap");
      expect(grid?.className).toContain("justify-start");
      expect(grid?.className).not.toContain("grid-cols");
      expect(cards).toHaveLength(2);
      for (const card of cards) {
        expect(card.className.split(/\s+/)).toContain("w-fit");
        expect(card.className).toContain("max-w-full");
        expect(card.className.split(/\s+/)).not.toContain("w-full");
      }
      expect(renderer?.className.split(/\s+/)).toContain("w-fit");
      expect(renderer?.className).not.toContain("flex-1");
      expect(renderer?.className).not.toContain("[&>*]:w-full");
      expect(screen.getByTestId("media-card").className).toContain("w-48");
      expect(screen.getByTestId("collection-card").className).toContain(
        "w-96",
      );
    });

    it("supports fluid card sizing for full-width grid tracks", () => {
      const { container } = renderTable({
        viewMode: "card",
        cardSizing: "fluid",
        cardRenderer: ({ row }) => (
          <div data-testid="fluid-card">{row.name}</div>
        ),
      });

      const grid = container.querySelector(
        '[data-dtp-slot="data-table-card-grid"]',
      );
      const card = container.querySelector(
        '[data-dtp-slot="data-table-card-item"]',
      );
      const renderer = container.querySelector(
        '[data-dtp-slot="data-table-card-renderer"]',
      );

      expect(grid?.className.split(/\s+/)).toContain("grid");
      expect(grid?.className).toContain(
        "grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))]",
      );
      expect(card?.className.split(/\s+/)).toContain("w-full");
      expect(renderer?.className.split(/\s+/)).toContain("w-full");
      expect(renderer?.className).toContain("flex-1");
      expect(renderer?.className).toContain("[&>*]:w-full");
    });

    it("applies supported card grid classes for wide card layouts", () => {
      const { container } = renderTable({
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        cardGridClassName: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
      });

      const grid = container.querySelector(
        '[data-dtp-slot="data-table-card-grid"]',
      );

      expect(grid?.className).toContain("grid-cols-1");
      expect(grid?.className).toContain("sm:grid-cols-2");
      expect(grid?.className).toContain("xl:grid-cols-3");
    });

    it("allows explicit card classes to opt into stretched card layouts", () => {
      const { container } = render(
        <div className="flex h-96 min-h-0 flex-col">
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(row) => row.id}
              flexGrow
              viewMode="card"
              cardGridClassName="grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              cardClassName="w-full"
              cardRenderer={({ row }) => (
                <div data-testid="aspect-card" className="aspect-2/3 w-full">
                  {row.name}
                </div>
              )}
            />
          </TooltipProvider>
        </div>,
      );

      const item = container.querySelector(
        '[data-dtp-slot="data-table-card-item"]',
      );
      const renderer = container.querySelector(
        '[data-dtp-slot="data-table-card-renderer"]',
      );
      const customCard = screen.getByTestId("aspect-card");

      expect(item?.className).toContain("w-full");
      expect(item?.className).toContain("min-w-0");
      expect(item?.className).toContain("overflow-hidden");
      expect(item?.className).toContain("p-0");
      expect(renderer?.className).toContain("max-w-full");
      expect(renderer?.className).toContain("min-w-0");
      expect(renderer?.className).toContain("flex-1");
      expect(renderer?.className).toContain("overflow-hidden");
      expect(renderer?.className).toContain("rounded-[inherit]");
      expect(renderer?.className).not.toContain("[&>*]:w-full");
      expect(customCard.className).toContain("aspect-2/3");
      expect(customCard.className).toContain("w-full");
    });

    it("adds an accessible name to card selection controls and cleans false selections", () => {
      const onRowSelectionChange = vi.fn();

      const { container } = renderTable({
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        enableRowSelection: true,
        rowSelection: { "1": true },
        onRowSelectionChange,
      });

      fireEvent.click(screen.getByRole("checkbox", { name: "Select row 1" }));

      const cardGrid = container.querySelector(
        '[data-dtp-slot="data-table-card-grid"]',
      );
      const cardItems = container.querySelectorAll(
        '[data-dtp-slot="data-table-card-item"]',
      );

      expect(cardGrid?.getAttribute("role")).toBe("list");
      expect(Array.from(cardItems, (item) => item.getAttribute("role"))).toEqual(
        ["listitem"],
      );
      expect(onRowSelectionChange).toHaveBeenCalledWith({});
    });

    it("enforces single selection in card mode", () => {
      const { container } = renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ],
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        enableRowSelection: true,
        enableMultiRowSelection: false,
      });

      fireEvent.click(screen.getByRole("checkbox", { name: "Select row 1" }));
      fireEvent.click(screen.getByRole("checkbox", { name: "Select row 2" }));

      const cardItems = container.querySelectorAll(
        '[data-dtp-slot="data-table-card-item"]',
      );
      expect(cardItems[0]?.getAttribute("data-state")).toBeNull();
      expect(cardItems[1]?.getAttribute("data-state")).toBe("selected");
    });

    it("marks the active view-toggle button as pressed", () => {
      renderTable({
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        enableViewToggle: true,
        onViewModeChange: vi.fn(),
      });

      expect(
        screen
          .getByRole("button", { name: "Switch to table view" })
          .getAttribute("aria-pressed"),
      ).toBe("false");
      expect(
        screen
          .getByRole("button", { name: "Switch to card view" })
          .getAttribute("aria-pressed"),
      ).toBe("true");
    });

    it("supports keyboard activation for clickable cards without moving button semantics to the list item", () => {
      const onRowClick = vi.fn();
      const { container } = renderTable({
        viewMode: "card",
        cardRenderer: ({ row }) => <div>{row.name}</div>,
        onRowClick,
      });

      const cardItem = container.querySelector(
        '[data-dtp-slot="data-table-card-item"]',
      );
      const renderer = container.querySelector(
        '[data-dtp-slot="data-table-card-renderer"]',
      );

      expect(cardItem?.getAttribute("role")).toBe("listitem");
      expect(renderer?.getAttribute("role")).toBe("button");
      expect(renderer?.getAttribute("data-dtp-slot")).toBe(
        "data-table-card-renderer",
      );

      if (!renderer) {
        throw new Error("Expected card renderer to be present");
      }

      fireEvent.keyDown(renderer, { key: "Enter" });
      fireEvent.keyDown(renderer, { key: " " });

      expect(onRowClick).toHaveBeenCalledTimes(2);
      expect(onRowClick).toHaveBeenNthCalledWith(1, {
        row: rows[0],
        rowId: "1",
      });
    });

    it("still renders the empty state when there are no rows and loading is false", () => {
      renderTable({
        data: [],
      });

      expect(screen.getByText("No rows yet")).not.toBeNull();
    });

    it("shows the total record count in the footer", () => {
      renderTable({
        totalRowCount: 42,
      });

      expect(screen.getByLabelText("Total records: 42")).not.toBeNull();
    });

    it("prefers the provided total row count over the current page row count", () => {
      renderTable({
        data: rows.slice(0, 1),
        manualPagination: true,
        totalRowCount: 42,
        pageCount: 5,
        pageIndex: 0,
        pageSize: 10,
      });

      expect(screen.getByLabelText("Total records: 42")).not.toBeNull();
    });

    it("automatically paginates local data when manual pagination is disabled", () => {
      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
          { id: "3", name: "Linus" },
        ],
        rowsPerPageOptions: [2, 3],
      });

      expect(screen.getByText("Ada")).not.toBeNull();
      expect(screen.getByText("Grace")).not.toBeNull();
      expect(screen.queryByText("Linus")).toBeNull();

      fireEvent.click(screen.getByLabelText("Next page"));

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.queryByText("Grace")).toBeNull();
      expect(screen.getByText("Linus")).not.toBeNull();
    });

    it("uses controlled page state for local automatic pagination", () => {
      function ControlledPaginationTable() {
        const [pageIndex, setPageIndex] = React.useState(0);

        return (
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={[
                { id: "1", name: "Ada" },
                { id: "2", name: "Grace" },
                { id: "3", name: "Linus" },
              ]}
              getRowId={(row) => row.id}
              rowsPerPageOptions={[2, 3]}
              pageIndex={pageIndex}
              pageSize={2}
              onPageIndexChange={setPageIndex}
            />
          </TooltipProvider>
        );
      }

      render(<ControlledPaginationTable />);

      expect(screen.getByText("Ada")).not.toBeNull();
      expect(screen.queryByText("Linus")).toBeNull();

      fireEvent.click(screen.getByLabelText("Next page"));

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Linus")).not.toBeNull();
    });

    it("does not reset controlled pagination when inline visibility config changes identity", () => {
      function ControlledPaginationTable() {
        const [pageIndex, setPageIndex] = React.useState(0);

        return (
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={[
                { id: "1", name: "Ada" },
                { id: "2", name: "Grace" },
                { id: "3", name: "Linus" },
              ]}
              getRowId={(row) => row.id}
              hiddenRows={{
                getIsHidden: () => false,
                label: "hidden rows",
              }}
              rowsPerPageOptions={[2, 3]}
              pageIndex={pageIndex}
              pageSize={2}
              onPageIndexChange={setPageIndex}
            />
          </TooltipProvider>
        );
      }

      render(<ControlledPaginationTable />);

      fireEvent.click(screen.getByLabelText("Next page"));

      expect(screen.queryByText("Ada")).toBeNull();
      expect(screen.getByText("Linus")).not.toBeNull();
      expect(screen.getByText("Page 2 of 2")).not.toBeNull();
    });

    it("clamps a controlled page index when local data shrinks", async () => {
      const onPageIndexChange = vi.fn();

      renderTable({
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
          { id: "3", name: "Linus" },
        ],
        pageIndex: 5,
        pageSize: 2,
        onPageIndexChange,
      });

      await waitFor(() => {
        expect(onPageIndexChange).toHaveBeenCalledWith(1);
      });
    });

    it("caps table rows while a virtual viewport is being discovered", () => {
      renderTable({
        data: Array.from({ length: 50 }, (_, index) => ({
          id: String(index + 1),
          name: `Row ${index + 1}`,
        })),
        pageSize: 50,
        rowsPerPageOptions: [50],
        virtualization: true,
      });

      expect(screen.getByText("Row 1")).not.toBeNull();
      expect(screen.getByText("Row 20")).not.toBeNull();
      expect(screen.queryByText("Row 21")).toBeNull();
      expect(screen.queryByText("Row 50")).toBeNull();
    });

    it("uses the last fixed data column as the fill column before actions", () => {
      renderTable({
        columns: [
          {
            accessorKey: "name",
            header: "Name",
            size: 120,
          },
          {
            id: "role",
            header: "Role",
            accessorFn: () => "Admin",
            size: 160,
          },
        ],
        rowActions: [
          {
            key: "open",
            label: "Open",
            onClick: vi.fn(),
          },
        ],
      });

      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(3);
      expect(headers[2]?.textContent).toContain("Actions");
      expect(
        screen.getByRole("columnheader", { name: "Name" }).style.width,
      ).toBe("120px");
      expect(
        screen.getByRole("columnheader", { name: "Role" }).style.width,
      ).toBe("");
      expect(
        screen.getByRole("columnheader", { name: "Role" }).style.minWidth,
      ).toBe("160px");
    });

    it("shows the selected record count in the toolbar", () => {
      renderTable({
        enableRowSelection: true,
        rowSelection: { "1": true },
        selectionActions: [
          {
            key: "archive",
            label: "Archive",
            onClick: vi.fn(),
          },
        ],
      });

      expect(screen.getByText("1 record selected")).not.toBeNull();
    });

    it("passes retained server-page row ids to selection actions", () => {
      const onArchive = vi.fn();

      renderTable({
        enableRowSelection: true,
        rowSelection: { remote: true },
        selectionActions: [
          {
            key: "archive",
            label: "Archive",
            onClick: onArchive,
          },
        ],
      });

      fireEvent.click(screen.getByRole("button", { name: "Archive" }));

      expect(onArchive).toHaveBeenCalledWith({ rows: [], rowIds: ["remote"] });
      expect(screen.getByText("1 record selected")).not.toBeNull();
    });

    it("supports shift-click range row selection", () => {
      const onRowSelectionChange = vi.fn();

      renderTable({
        enableRowSelection: true,
        data: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
          { id: "3", name: "Linus" },
        ],
        rowSelection: {},
        onRowSelectionChange,
        rowsPerPageOptions: [3],
        pageSize: 3,
      });

      const rowCheckboxes = screen.getAllByRole("checkbox", {
        name: "Select row",
      });
      fireEvent.click(rowCheckboxes[0]);
      fireEvent.click(rowCheckboxes[2], { shiftKey: true });

      expect(onRowSelectionChange).toHaveBeenLastCalledWith({
        "1": true,
        "2": true,
        "3": true,
      });
    });

    if (suite.name === "shadcn") {
      it("uses the table card background for non-primary controls", () => {
        const { container } = renderTable({
          toolbarActions: [
            {
              key: "export",
              label: "Export",
              icon: IconDownload,
              onClick: vi.fn(),
            },
          ],
        });

        const searchGroup = container.querySelector('[data-slot="input-group"]');
        const pageSizeTrigger = container.querySelector(
          '[data-slot="select-trigger"]',
        );

        expect(searchGroup?.className).toContain("border-input");
        expect(searchGroup?.className).toContain("bg-card");
        expect(pageSizeTrigger?.className).toContain("border-input");
        expect(pageSizeTrigger?.className).toContain("bg-card");
        expect(
          screen.getByRole("button", { name: "Search table" }).className,
        ).toContain("border-input");
        expect(
          screen.getByRole("button", { name: "Search table" }).className,
        ).toContain("bg-card");
        expect(screen.getByRole("button", { name: "Export" }).className).toContain(
          "border-input",
        );
        expect(screen.getByRole("button", { name: "Export" }).className).toContain(
          "bg-card",
        );
      });
    }

    it("renders a compact search trigger and opens the compact search row", () => {
      const { container } = renderTable();

      expect(
        screen.getByRole("button", { name: "Search table" }),
      ).not.toBeNull();
      expect(
        container.querySelector('[data-dtp-slot="data-table-toolbar-compact-search"]'),
      ).toBeNull();

      fireEvent.click(screen.getByRole("button", { name: "Search table" }));

      expect(
        container.querySelector('[data-dtp-slot="data-table-toolbar-compact-search"]'),
      ).not.toBeNull();
    });

    it("renders compact toolbar content in the mobile control row and customToolbar in the desktop row", () => {
      const { container } = renderTable({
        compactToolbar: <button type="button">Compact Filters</button>,
        customToolbar: <button type="button">Desktop Filters</button>,
      });

      expect(
        container.querySelector('[data-dtp-slot="data-table-toolbar-compact-custom"]')
          ?.textContent,
      ).toContain("Compact Filters");
      expect(
        container.querySelector('[data-dtp-slot="data-table-toolbar-desktop-custom"]')
          ?.textContent,
      ).toContain("Desktop Filters");
      expect(
        container.querySelector('[data-dtp-slot="data-table-toolbar-compact-custom"]')
          ?.className,
      ).toContain("@min-[1024px]/data-table:hidden");
      expect(
        container.querySelector('[data-dtp-slot="data-table-toolbar-desktop-custom"]')
          ?.className,
      ).toContain("@min-[1024px]/data-table:flex");
    });
  });
}
