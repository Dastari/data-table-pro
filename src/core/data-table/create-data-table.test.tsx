import * as React from "react";
import { act } from "react";
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
import * as RootEntry from "../../index";
import { DataTable as ShadcnDataTable } from "../../index";
import * as HeroEntry from "../../entries/heroui";
import { DataTable as HeroDataTable } from "../../entries/heroui";
import * as GridEntry from "../../entries/thegridcn";
import { DataTable as GridDataTable } from "../../entries/thegridcn";
import { useDataTableUrlState as useDataTableUrlStateEntry } from "../../entries/url-state";
import type { DataTableColumnDef, DataTableProps } from "../../index";
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
    expect(renderer?.className).toContain("[&>*]:w-full");
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
      expect(card?.className).toContain("w-full");
      expect(card?.className).not.toContain("min-w-72");
      expect(card?.className).not.toContain("basis-72");
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

    it("gives aspect-ratio custom card renderers the grid cell width", () => {
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
              cardRenderer={({ row }) => (
                <div data-testid="aspect-card" className="aspect-2/3">
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
      expect(renderer?.className).toContain("w-full");
      expect(renderer?.className).toContain("min-w-0");
      expect(renderer?.className).toContain("flex-1");
      expect(renderer?.className).toContain("overflow-hidden");
      expect(renderer?.className).toContain("rounded-[inherit]");
      expect(renderer?.className).toContain("[&>*]:w-full");
      expect(customCard.className).toContain("aspect-2/3");
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

      fireEvent.click(screen.getByLabelText("Go to next page"));

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

      fireEvent.click(screen.getByLabelText("Go to next page"));

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

      fireEvent.click(screen.getByLabelText("Go to next page"));

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

    it("renders table rows when virtualization is enabled before viewport discovery", () => {
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
      expect(screen.getByText("Row 50")).not.toBeNull();
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
  });
}
