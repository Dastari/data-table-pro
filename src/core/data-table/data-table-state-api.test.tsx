import * as React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { Updater } from "@tanstack/react-table";
import {
  DataTable,
  type DataTableApi,
  type DataTableColumnDef,
  type DataTableState,
} from "../../index";

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
const rows: Array<TestRow> = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Grace" },
];

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

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DataTable unified state API", () => {
  it("uses initial state for uncontrolled pagination, density, and filtering", () => {
    const pageView = render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        initialState={{
          pagination: { pageIndex: 1, pageSize: 1 },
          density: "compact",
        }}
      />,
    );

    expect(screen.queryByText("Ada")).toBeNull();
    expect(screen.getByText("Grace")).not.toBeNull();
    expect(
      pageView.container.querySelector('[data-dtp-slot="data-table-root"]')
        ?.getAttribute("data-density"),
    ).toBe("compact");

    pageView.unmount();

    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        initialState={{ globalFilter: "Grace" }}
      />,
    );
    expect(screen.queryByText("Ada")).toBeNull();
    expect(screen.getByText("Grace")).not.toBeNull();
  });

  it("supports unified controlled state with legacy-prop precedence", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const state: Partial<DataTableState> = {
      sorting: [{ id: "name", desc: true }],
      pagination: { pageIndex: 0, pageSize: 1 },
    };
    const controlled = render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        state={state}
      />,
    );

    expect(screen.queryByText("Ada")).toBeNull();
    expect(screen.getByText("Grace")).not.toBeNull();
    controlled.unmount();

    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        state={{ pagination: { pageIndex: 1, pageSize: 1 } }}
        pageIndex={0}
        pageSize={1}
      />,
    );
    expect(screen.getByText("Ada")).not.toBeNull();
    expect(screen.queryByText("Grace")).toBeNull();
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining(
        "state.pagination and its legacy controlled prop",
      ),
    );
  });

  it("emits TanStack-compatible full-state updaters", () => {
    const onStateChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        pageSize={1}
        enableViewToggle
        cardRenderer={({ row }) => <div>{row.name}</div>}
        onStateChange={onStateChange}
      />,
    );

    fireEvent.click(screen.getByRole("link", { name: "Next page" }));
    const paginationState = applyStateUpdater(
      onStateChange.mock.calls.at(-1)?.[0] as Updater<DataTableState>,
      createState(),
    );
    expect(paginationState.pagination).toEqual({
      pageIndex: 1,
      pageSize: 1,
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Switch to card view" }),
    );
    const cardState = applyStateUpdater(
      onStateChange.mock.calls.at(-1)?.[0] as Updater<DataTableState>,
      paginationState,
    );
    expect(cardState.viewMode).toBe("card");
  });

  it("accepts controlled column sizing and reports resize changes", () => {
    const onColumnSizingChange = vi.fn();
    const { container } = render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        columnSizing={{ name: 220 }}
        onColumnSizingChange={onColumnSizingChange}
        enableColumnResizing
        layoutMode="fit"
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Name" }).style.width,
    ).toBe("220px");

    const resizeHandle = container.querySelector(".cursor-col-resize");
    expect(resizeHandle).not.toBeNull();
    fireEvent.mouseDown(resizeHandle!, { clientX: 220 });
    fireEvent.mouseMove(document, { clientX: 260 });
    fireEvent.mouseUp(document);

    expect(onColumnSizingChange).toHaveBeenCalled();
  });

  it("exposes typed inspection, snapshot, restore, reset, focus, scroll, and export commands", async () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    const onExport = vi.fn();
    const { container } = render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />,
    );

    expect(apiRef.current?.getTable()?.getRowModel().rows).toHaveLength(2);
    const snapshot = apiRef.current?.snapshot();
    expect(snapshot?.sorting).toEqual([]);
    expect(snapshot?.sorting).not.toBe(
      apiRef.current?.getTable()?.getState().sorting,
    );

    act(() => {
      apiRef.current?.restore({
        sorting: [{ id: "name", desc: true }],
        columnVisibility: { name: false },
      });
    });
    expect(apiRef.current?.getState().sorting).toEqual([
      { id: "name", desc: true },
    ]);
    expect(apiRef.current?.getState().columnVisibility).toEqual({
      name: false,
    });

    act(() => {
      apiRef.current?.resetColumnLayout();
    });
    expect(apiRef.current?.getState().columnVisibility).toEqual({});

    act(() => {
      apiRef.current?.focus();
    });
    expect(document.activeElement).toBe(
      container.querySelector('[data-dtp-slot="data-table-root"]'),
    );
    expect(apiRef.current?.scrollToRow("1")).toBe(true);
    expect(apiRef.current?.scrollToColumn("name")).toBe(true);
    expect(apiRef.current?.scrollToRow("missing")).toBe(false);

    await act(async () => {
      await apiRef.current?.exportCsv({ onExport });
    });
    expect(onExport).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: "filtered",
        rows: [rows[1], rows[0]],
      }),
    );

    act(() => {
      apiRef.current?.resetState();
    });
    expect(apiRef.current?.getState().sorting).toEqual([]);
  });
});

function createState(): DataTableState {
  return {
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 10 },
    rowSelection: {},
    columnVisibility: {},
    columnFilters: [],
    expanded: {},
    columnOrder: [],
    columnPinning: {},
    columnSizing: {},
    density: "comfortable",
    viewMode: "table",
    showHiddenRows: false,
    globalFilter: "",
  };
}

function applyStateUpdater(
  updater: Updater<DataTableState>,
  current: DataTableState,
) {
  return typeof updater === "function" ? updater(current) : updater;
}
