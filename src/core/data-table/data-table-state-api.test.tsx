import * as React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
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
  type DataTablePersistenceStorage,
  type DataTableState,
} from "../../index";
import { useDataTableAutoPageSize } from "./use-data-table-auto-page-size";

type TestRow = {
  id: string;
  name: string;
  children?: Array<TestRow>;
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

class MemoryStorage implements DataTablePersistenceStorage {
  values = new Map<string, string>();
  getItem = vi.fn((key: string) => this.values.get(key) ?? null);
  setItem = vi.fn((key: string, value: string) => {
    this.values.set(key, value);
  });
  removeItem = vi.fn((key: string) => {
    this.values.delete(key);
  });
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

  it("derives an opt-in controlled page size from the scroll viewport", async () => {
    const clientHeight = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientHeight",
    );
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      get: function getClientHeight(this: HTMLElement) {
        return this.getAttribute("data-slot") === "scroll-area-viewport"
          ? 100
          : 0;
      },
    });
    const onPageIndexChange = vi.fn();
    const onPageSizeChange = vi.fn();

    try {
      render(
        <DataTable
          autoPageSize={{ estimateRowHeight: 20 }}
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          onPageIndexChange={onPageIndexChange}
          onPageSizeChange={onPageSizeChange}
          pageIndex={1}
          pageSize={10}
        />,
      );

      await waitFor(() => {
        expect(onPageIndexChange).toHaveBeenCalledWith(0);
        expect(onPageSizeChange).toHaveBeenCalledWith(5);
      });
    } finally {
      frame.mockRestore();
      if (clientHeight) {
        Object.defineProperty(HTMLElement.prototype, "clientHeight", clientHeight);
      } else {
        delete (HTMLElement.prototype as { clientHeight?: number }).clientHeight;
      }
    }
  });

  it("does not recursively grow a content-sized auto page", () => {
    const onPageSizeChange = vi.fn();
    const frame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0);
        return 1;
      });

    function Harness() {
      const [element, setElement] = React.useState<HTMLDivElement | null>(null);
      const [pageSize, setPageSize] = React.useState(1);
      const [height, setHeight] = React.useState(100);
      const setViewport = React.useCallback((node: HTMLDivElement | null) => {
        if (!node) return;
        Object.defineProperty(node, "clientHeight", {
          configurable: true,
          get: () => height,
        });
        setElement(node);
      }, [height]);
      useDataTableAutoPageSize({
        config: { estimateRowHeight: 20 },
        currentPageSize: pageSize,
        enabled: true,
        onPageSizeChange: (nextPageSize) => {
          onPageSizeChange(nextPageSize);
          setPageSize(nextPageSize);
          setHeight(200);
        },
        viewportElement: element,
        viewportHeight: height,
      });
      return <div ref={setViewport} />;
    }

    try {
      render(<Harness />);
      expect(onPageSizeChange).toHaveBeenCalledTimes(1);
      expect(onPageSizeChange).toHaveBeenCalledWith(5);
    } finally {
      frame.mockRestore();
    }
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
    render(
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

    const resizeHandle = screen.getByRole("separator", {
      name: "Resize Name",
    });
    expect(resizeHandle.getAttribute("aria-valuenow")).toBe("220");
    fireEvent.keyDown(resizeHandle, { key: "ArrowRight" });
    expect(onColumnSizingChange).toHaveBeenCalledWith({ name: 230 });

    fireEvent.mouseDown(resizeHandle, { clientX: 220 });
    fireEvent.mouseMove(document, { clientX: 260 });
    fireEvent.mouseUp(document);

    expect(onColumnSizingChange).toHaveBeenCalled();
  });

  it("renders top and bottom pinned rows and exposes row pin actions", () => {
    const onRowPinningChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableRowPinning
        onRowPinningChange={onRowPinningChange}
      />,
    );

    fireEvent.pointerDown(
      screen.getAllByRole("button", { name: "Row actions" })[0],
    );
    fireEvent.click(screen.getByText("Pin row to top"));

    expect(onRowPinningChange).toHaveBeenCalledWith({
      top: ["1"],
      bottom: [],
    });
    expect(
      screen.getByText("Ada").closest('[data-dtp-slot="data-table-pinned-row"]')
        ?.getAttribute("data-row-pinned"),
    ).toBe("top");

    fireEvent.pointerDown(
      screen.getAllByRole("button", { name: "Row actions" })[0],
    );
    fireEvent.click(screen.getByText("Unpin row"));
    expect(onRowPinningChange).toHaveBeenLastCalledWith({
      top: [],
      bottom: [],
    });
  });

  it("supports controlled row pinning, API methods, saved views, and persistence", () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    const storage = new MemoryStorage();
    render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableRowPinning
        persistence={{ key: "row-pinning", debounceMs: 0, storage }}
        savedViews={{ key: "row-pinning", storage }}
      />,
    );

    act(() => {
      expect(apiRef.current?.pinRow("2", "bottom")).toBe(true);
    });
    expect(apiRef.current?.getState().rowPinning).toEqual({
      top: [],
      bottom: ["2"],
    });
    expect(apiRef.current?.createSavedView("Pinned")).toBeDefined();
    expect(apiRef.current?.unpinRow("2")).toBe(true);
    expect(apiRef.current?.applySavedView(apiRef.current.getSavedViews()[0]!.id)).toBe(
      true,
    );
    expect(apiRef.current?.getState().rowPinning).toEqual({
      top: [],
      bottom: ["2"],
    });

    const persisted = JSON.parse(
      storage.values.get("data-table-pro:column-prefs:row-pinning") ?? "{}",
    ) as { state?: { rowPinning?: unknown } };
    expect(persisted.state?.rowPinning).toEqual({ top: [], bottom: ["2"] });
  });

  it("honors keepPinnedRows when filters exclude a pinned row", () => {
    const view = render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        rowPinning={{ top: ["1"], bottom: [] }}
        toolbarQueryValue="Grace"
        keepPinnedRows={false}
      />,
    );

    expect(screen.queryByText("Ada")).toBeNull();
    expect(screen.getByText("Grace")).not.toBeNull();

    view.rerender(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        rowPinning={{ top: ["1"], bottom: [] }}
        toolbarQueryValue="Grace"
        keepPinnedRows
      />,
    );

    expect(screen.getByText("Ada")).not.toBeNull();
    expect(screen.getByText("Grace")).not.toBeNull();
  });

  it("pins nested rows resolved through getSubRows", () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={[
          {
            id: "parent",
            name: "Parent",
            children: [{ id: "child", name: "Child" }],
          },
        ]}
        getRowId={(row) => row.id}
        getSubRows={(row) => row.children}
        initialState={{ expanded: { parent: true } }}
        enableRowPinning
      />,
    );

    act(() => {
      expect(apiRef.current?.pinRow("child", "top")).toBe(true);
    });

    expect(
      screen.getByText("Child").closest('[data-dtp-slot="data-table-pinned-row"]')
        ?.getAttribute("data-row-pinned"),
    ).toBe("top");
  });

  it("copies delimited rows, handles opt-in paste, print, and fullscreen APIs", async () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    const onCopy = vi.fn();
    const onPaste = vi.fn();
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    const { container } = render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        clipboard={{
          copy: { onCopy, scope: "all" },
          paste: { onPaste },
        }}
      />,
    );
    const root = container.querySelector<HTMLElement>(
      '[data-dtp-slot="data-table-root"]',
    );
    expect(root).not.toBeNull();

    fireEvent.keyDown(root!, { ctrlKey: true, key: "c" });
    await waitFor(() => expect(onCopy).toHaveBeenCalled());
    const copyContext = onCopy.mock.calls[0]?.[0] as { text: string };
    expect(copyContext.text).toBe("Name\nAda\nGrace");

    fireEvent.paste(root!, {
      clipboardData: {
        getData: () => 'Ada\t"Admin\nOwner"',
      },
    });
    await waitFor(() => {
      expect(onPaste).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Ada\t"Admin\nOwner"',
          values: [["Ada", "Admin\nOwner"]],
        }),
      );
    });

    expect(apiRef.current?.print()).toBe(true);
    expect(print).toHaveBeenCalled();

    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(root, "requestFullscreen", {
      configurable: true,
      value: requestFullscreen,
    });
    await expect(apiRef.current?.toggleFullscreen()).resolves.toBe(true);
    expect(requestFullscreen).toHaveBeenCalled();
  });

  it("renders opt-in print/fullscreen toolbar controls and an error retry overlay", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    const retry = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
      configurable: true,
      value: requestFullscreen,
    });

    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enablePrint
        enableFullscreen
        stateOverlay={{ error: new Error("Offline"), onRetry: retry }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Print table" }));
    expect(print).toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Enter fullscreen" }),
    );
    await waitFor(() => expect(requestFullscreen).toHaveBeenCalled());

    expect(await screen.findByRole("alert")).not.toBeNull();
    fireEvent.click(await screen.findByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalled();
  });

  it("does not render an error overlay for a null data-source error", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        stateOverlay={{ error: null }}
      />,
    );

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("validates edits and rolls back failed optimistic saves", async () => {
    const saveError = new Error("save failed");
    const rollback = vi.fn();
    const onSaveRow = vi.fn().mockRejectedValue(saveError);
    const onSaveError = vi.fn();
    const onActionError = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        editableRows={{
          onOptimisticUpdate: () => rollback,
          onSaveError,
          onSaveRow,
          validateRow: (_row, draft) =>
            draft.name ? undefined : { name: "Name is required" },
        }}
        onActionError={onActionError}
      />,
    );

    fireEvent.pointerDown(
      screen.getAllByRole("button", { name: "Row actions" })[0],
    );
    fireEvent.click(screen.getByText("Edit row"));
    const input = screen.getByDisplayValue("Ada");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Name is required",
    );
    expect(onSaveRow).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "Ada Lovelace" } });
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => expect(onSaveError).toHaveBeenCalled());
    expect(onSaveError).toHaveBeenCalledWith(
      saveError,
      rows[0],
      expect.objectContaining({ name: "Ada Lovelace" }),
    );
    expect(rollback).toHaveBeenCalled();
    expect(onActionError).toHaveBeenCalledWith(
      expect.objectContaining({ error: saveError, source: "edit" }),
    );
  });

  it("configures resizing and keyboard reordering for RTL", () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    const onColumnOrderChange = vi.fn();
    const rtlColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "id", header: "Identifier" },
    ];
    const { container } = render(
      <DataTable
        apiRef={apiRef}
        columns={rtlColumns}
        data={rows}
        dir="rtl"
        enableColumnReordering
        enableColumnResizing
        getRowId={(row) => row.id}
        onColumnOrderChange={onColumnOrderChange}
      />,
    );

    expect(apiRef.current?.getTable()?.options.columnResizeDirection).toBe(
      "rtl",
    );
    const resizeHandle = container.querySelector(".cursor-col-resize");
    expect(resizeHandle?.className).toContain("rtl:left-0");

    fireEvent.keyDown(screen.getByRole("columnheader", { name: "Name" }), {
      altKey: true,
      key: "ArrowLeft",
    });
    expect(onColumnOrderChange).toHaveBeenLastCalledWith([
      "id",
      "name",
    ]);
  });

  it("accepts non-serializable controlled filter values", () => {
    const circularFilter: Record<string, unknown> = {};
    circularFilter.self = circularFilter;

    expect(() =>
      render(
        <DataTable
          columns={columns}
          columnFilters={[
            { id: "name", value: circularFilter },
            { id: "name", value: 1n },
          ]}
          data={rows}
          getRowId={(row) => row.id}
          manualFiltering
        />,
      ),
    ).not.toThrow();
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

  it("creates, applies, renames, deletes, and clears validated saved views", () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    const storage = new MemoryStorage();
    const onChange = vi.fn();
    const onApply = vi.fn();
    render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        savedViews={{
          key: "people",
          version: 2,
          storage,
          onChange,
          onApply,
        }}
      />,
    );

    act(() => {
      apiRef.current?.restore({
        sorting: [{ id: "name", desc: true }],
        grouping: ["name"],
        columnVisibility: { name: false },
        pagination: { pageIndex: 1, pageSize: 1 },
        rowSelection: { "1": true },
      });
    });
    let savedView: ReturnType<
      NonNullable<typeof apiRef.current>["createSavedView"]
    >;
    act(() => {
      savedView = apiRef.current?.createSavedView("  My view  ");
    });

    expect(savedView?.name).toBe("My view");
    expect(savedView?.state.sorting).toEqual([{ id: "name", desc: true }]);
    expect(savedView?.state.grouping).toEqual(["name"]);
    expect(savedView?.state.columnVisibility).toEqual({ name: false });
    expect(savedView?.state.pagination).toBeUndefined();
    expect(savedView?.state.rowSelection).toBeUndefined();
    expect(onChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: savedView?.id, name: "My view" }),
      ]),
      "create",
    );

    act(() => {
      apiRef.current?.restore({
        sorting: [],
        grouping: [],
        columnVisibility: {},
      });
    });
    act(() => {
      expect(apiRef.current?.applySavedView(savedView?.id ?? "")).toBe(true);
    });
    expect(apiRef.current?.getState().sorting).toEqual([
      { id: "name", desc: true },
    ]);
    expect(apiRef.current?.getState().grouping).toEqual(["name"]);
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ id: savedView?.id }),
    );

    let renamedView: typeof savedView;
    act(() => {
      renamedView = apiRef.current?.renameSavedView(
        savedView?.id ?? "",
        "Renamed",
      );
    });
    expect(renamedView?.name).toBe("Renamed");
    expect(apiRef.current?.getSavedViews()).toHaveLength(1);

    act(() => {
      expect(apiRef.current?.deleteSavedView(savedView?.id ?? "")).toBe(true);
    });
    expect(apiRef.current?.getSavedViews()).toEqual([]);

    act(() => {
      apiRef.current?.createSavedView("One");
      apiRef.current?.createSavedView("Two");
    });
    expect(apiRef.current?.getSavedViews()).toHaveLength(2);
    act(() => {
      expect(apiRef.current?.clearSavedViews()).toBe(true);
    });
    expect(apiRef.current?.getSavedViews()).toEqual([]);
  });

  it("clears persisted preferences directly and during reset commands", () => {
    const apiRef = React.createRef<DataTableApi<TestRow>>();
    const storage = new MemoryStorage();
    render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        persistence={{
          key: "people",
          storage,
          debounceMs: 0,
        }}
      />,
    );
    const key = "data-table-pro:column-prefs:people";
    expect(storage.values.has(key)).toBe(true);

    act(() => {
      expect(apiRef.current?.clearPersistedState()).toBe(true);
    });
    expect(storage.values.has(key)).toBe(false);

    act(() => {
      apiRef.current?.restore({ density: "compact" });
    });
    expect(storage.values.has(key)).toBe(true);
    act(() => {
      apiRef.current?.resetState({ clearPersistence: true });
    });
    const persisted = JSON.parse(storage.values.get(key) ?? "") as {
      state: { density?: string };
    };
    expect(persisted.state.density).toBe("comfortable");
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
    grouping: [],
    columnOrder: [],
    columnPinning: {},
    rowPinning: { top: [], bottom: [] },
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
