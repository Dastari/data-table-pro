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
import { DataTable as ShadcnDataTable } from "../../index";
import { DataTable as HeroDataTable } from "../../entries/heroui";
import { DataTable as GridDataTable } from "../../entries/thegridcn";
import type { DataTableColumnDef, DataTableProps } from "../../index";
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
            searchDebounceMs={100}
            {...props}
          />
        </TooltipProvider>,
      );
    }

    it("debounces user-entered search changes", () => {
      vi.useFakeTimers();
      const onSearchValueChange = vi.fn();

      renderTable({ onSearchValueChange });

      fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
        target: { value: "Ada" },
      });

      act(() => {
        vi.advanceTimersByTime(99);
      });

      expect(onSearchValueChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(onSearchValueChange).toHaveBeenCalledTimes(1);
      expect(onSearchValueChange).toHaveBeenLastCalledWith("Ada");
    });

    it("does not loop for controlled parents that create a fresh callback each render", () => {
      vi.useFakeTimers();
      const onSearchValueChange = vi.fn();

      function ControlledHarness() {
        const [tableState, setTableState] = React.useState({
          searchValue: "",
        });

        return (
          <TooltipProvider>
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(row, _index) => row.id}
              searchValue={tableState.searchValue}
              searchDebounceMs={100}
              onSearchValueChange={(value) => {
                onSearchValueChange(value);
                setTableState((current) => ({
                  ...current,
                  searchValue: value,
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

      expect(onSearchValueChange).toHaveBeenCalledTimes(1);
      expect(onSearchValueChange).toHaveBeenLastCalledWith("Ada");

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onSearchValueChange).toHaveBeenCalledTimes(1);
    });

    it("does not echo controlled prop updates back through the debounced callback", () => {
      vi.useFakeTimers();
      const onSearchValueChange = vi.fn();

      const view = renderTable({
        searchValue: "",
        onSearchValueChange,
      });

      view.rerender(
        <TooltipProvider>
          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row, _index) => row.id}
            searchValue="Ada"
            searchDebounceMs={100}
            onSearchValueChange={onSearchValueChange}
          />
        </TooltipProvider>,
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onSearchValueChange).not.toHaveBeenCalled();
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
