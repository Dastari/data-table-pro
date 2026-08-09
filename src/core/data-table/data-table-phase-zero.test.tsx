import * as React from "react";
import type { FilterFn } from "@tanstack/react-table";
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
import { DataTable, type DataTableColumnDef } from "../../index";

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
const getRowId = (row: TestRow) => row.id;

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

describe("DataTable phase-zero contracts", () => {
  it("associates table titles and descriptions with the native table", () => {
    render(
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "Ada" }]}
        description="Current engineering employees"
        getRowId={(row) => row.id}
        title="Employees"
      />,
    );

    const table = screen.getByRole("table", { name: "Employees" });
    const descriptionId = table.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId!)?.textContent).toBe(
      "Current engineering employees",
    );
  });

  it("applies a custom globalFilterFn to the toolbar query", () => {
    const globalFilterFn = vi.fn<FilterFn<TestRow>>(
      (row, _columnId, filterValue) =>
        row.original.name
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase()),
    );

    render(
      <DataTable
        columns={columns}
        data={[
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ]}
        getRowId={(row) => row.id}
        globalFilterFn={globalFilterFn}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
      target: { value: "gr" },
    });

    expect(screen.queryByText("Ada")).toBeNull();
    expect(screen.getByText("Grace")).not.toBeNull();
    expect(globalFilterFn).toHaveBeenCalled();
  });

  it("caches normalized built-in search values across query changes", () => {
    const getAccessorValue = vi.fn((row: TestRow) => row.name);
    const searchColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
      {
        id: "name",
        accessorFn: getAccessorValue,
        header: "Name",
      },
    ];

    render(
      <DataTable
        columns={searchColumns}
        data={[
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ]}
        getRowId={(row) => row.id}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
      target: { value: "ada" },
    });
    expect(screen.getByText("Ada")).not.toBeNull();
    expect(getAccessorValue).toHaveBeenCalledTimes(2);

    fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
      target: { value: "ad" },
    });
    expect(screen.getByText("Ada")).not.toBeNull();
    expect(getAccessorValue).toHaveBeenCalledTimes(2);
  });

  it("warns in development when row identity cannot safely anchor table state", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <DataTable
        columns={columns}
        data={[
          { id: "duplicate", name: "Ada" },
          { id: "duplicate", name: "Grace" },
        ]}
        getRowId={(row) => row.id}
      />,
    );

    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("Duplicate row id \"duplicate\""),
    );
  });

  it("does not mistake genuinely changed rows for array identity churn", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const firstRows = [{ id: "1", name: "Ada" }];
    const { rerender } = render(
      <DataTable columns={columns} data={firstRows} getRowId={getRowId} />,
    );

    rerender(
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "Ada Lovelace" }]}
        getRowId={getRowId}
      />,
    );

    expect(warning).not.toHaveBeenCalledWith(
      expect.stringContaining("data array identity changed"),
    );
  });

  it("searches nested leaf columns with the real row index", () => {
    type NestedRow = {
      id: string;
      profile: {
        name: string;
      };
    };
    const nestedColumns: Array<DataTableColumnDef<NestedRow, unknown>> = [
      {
        id: "identity",
        header: "Identity",
        columns: [
          {
            id: "displayName",
            header: "Name",
            accessorFn: (row, index) => `${index}:${row.profile.name}`,
          },
        ],
      },
    ];

    render(
      <DataTable
        columns={nestedColumns}
        data={[
          { id: "1", profile: { name: "Ada" } },
          { id: "2", profile: { name: "Grace" } },
        ]}
        getRowId={(row) => row.id}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
      target: { value: "1:Grace" },
    });

    expect(screen.queryByText("0:Ada")).toBeNull();
    expect(screen.getByText("1:Grace")).not.toBeNull();
  });

  it("resets a still-valid controlled page when the toolbar query changes", async () => {
    const onPageIndexChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
          { id: "3", name: "Alan" },
          { id: "4", name: "Linus" },
        ]}
        getRowId={(row) => row.id}
        pageIndex={1}
        pageSize={2}
        onPageIndexChange={onPageIndexChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search rows..."), {
      target: { value: "a" },
    });

    await waitFor(() => {
      expect(onPageIndexChange).toHaveBeenCalledWith(0);
    });
  });

  it("supports explicit unknown-total manual pagination", () => {
    const onPageIndexChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[{ id: "3", name: "Linus" }]}
        getRowId={(row) => row.id}
        manualPagination
        pageIndex={2}
        pageSize={1}
        hasNextPage
        onPageIndexChange={onPageIndexChange}
        labels={{
          pageStatusUnknown: (pageIndex) => `Result page ${pageIndex + 1}`,
        }}
      />,
    );

    expect(screen.getByText("Result page 3")).not.toBeNull();
    expect(screen.queryByLabelText(/Total records:/)).toBeNull();

    fireEvent.click(screen.getByRole("link", { name: "Next page" }));

    expect(onPageIndexChange).toHaveBeenCalledWith(3);
  });

  it("exports filtered rows in sort order and neutralizes string formulas", async () => {
    type ExportRow = TestRow & {
      code: string;
    };
    const exportColumns: Array<DataTableColumnDef<ExportRow, unknown>> = [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "code",
        header: "Code",
      },
    ];
    const onExport = vi.fn();

    render(
      <DataTable
        columns={exportColumns}
        data={[
          { id: "1", name: "Ada", code: "=1+1" },
          { id: "2", name: "Grace", code: "safe" },
        ]}
        getRowId={(row) => row.id}
        sorting={[{ id: "name", desc: true }]}
        csvExport={{
          scope: "filtered",
          onExport,
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

    await waitFor(() => {
      expect(onExport).toHaveBeenCalledTimes(1);
    });

    const context = onExport.mock.calls[0]?.[0] as
      | { csv: string; rows: Array<ExportRow>; scope: string }
      | undefined;

    expect(context?.csv).toBe("Name,Code\r\nGrace,safe\r\nAda,'=1+1");
    expect(context?.rows.map((row) => row.id)).toEqual(["2", "1"]);
    expect(context?.scope).toBe("filtered");
  });

  it("exports only selected rows when selected scope is requested", async () => {
    const onExport = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[
          { id: "1", name: "Ada" },
          { id: "2", name: "Grace" },
        ]}
        getRowId={(row) => row.id}
        enableRowSelection
        csvExport={{
          scope: "selected",
          onExport,
        }}
      />,
    );

    fireEvent.click(
      screen.getAllByRole("checkbox", { name: "Select row" })[1],
    );
    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

    await waitFor(() => {
      expect(onExport).toHaveBeenCalledTimes(1);
    });

    const context = onExport.mock.calls[0]?.[0] as
      | { csv: string; rows: Array<TestRow> }
      | undefined;

    expect(context?.csv).toContain("Grace");
    expect(context?.csv).not.toContain("Ada");
    expect(context?.rows.map((row) => row.id)).toEqual(["2"]);
  });

  it("escapes CSV punctuation and dates while excluding hidden columns", async () => {
    type CsvRow = {
      id: string;
      name: string;
      createdAt: Date;
      secret: string;
    };
    const onExport = vi.fn();

    render(
      <DataTable
        columns={[
          { accessorKey: "name", header: "Name" },
          { accessorKey: "createdAt", header: "Created" },
          { accessorKey: "secret", header: "Secret" },
        ]}
        data={[
          {
            id: "1",
            name: 'Ada, "Countess"\nLovelace',
            createdAt: new Date("1843-01-01T00:00:00.000Z"),
            secret: "hidden",
          },
        ]}
        getRowId={(row: CsvRow) => row.id}
        columnVisibility={{ secret: false }}
        csvExport={{ onExport }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

    await waitFor(() => {
      expect(onExport).toHaveBeenCalledTimes(1);
    });
    const context = onExport.mock.calls[0]?.[0] as
      | { csv: string }
      | undefined;
    expect(context?.csv).toBe(
      'Name,Created\r\n"Ada, ""Countess""\nLovelace",1843-01-01T00:00:00.000Z',
    );
    expect(context?.csv).not.toContain("Secret");
    expect(context?.csv).not.toContain("hidden");
  });

  it("supports current-page and all-loaded CSV scopes", async () => {
    const rows = [
      { id: "1", name: "Ada" },
      { id: "2", name: "Grace" },
      { id: "3", name: "Linus" },
    ];
    const onPageExport = vi.fn();
    const pageTable = render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        pageIndex={1}
        pageSize={1}
        csvExport={{ scope: "page", onExport: onPageExport }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
    await waitFor(() => {
      expect(onPageExport).toHaveBeenCalledTimes(1);
    });
    const pageContext = onPageExport.mock.calls[0]?.[0] as
      | { rows: Array<TestRow> }
      | undefined;
    expect(pageContext?.rows).toEqual([rows[1]]);

    pageTable.unmount();

    const onAllExport = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        toolbarQueryValue="Grace"
        csvExport={{
          scope: "all",
          escapeFormulaValues: false,
          onExport: onAllExport,
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
    await waitFor(() => {
      expect(onAllExport).toHaveBeenCalledTimes(1);
    });
    const allContext = onAllExport.mock.calls[0]?.[0] as
      | { rows: Array<TestRow> }
      | undefined;
    expect(allContext?.rows).toEqual(rows);
  });

  it("reports rejected toolbar actions instead of leaving an unhandled rejection", async () => {
    const error = new Error("Refresh failed");
    const onActionError = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "Ada" }]}
        getRowId={(row) => row.id}
        toolbarActions={[
          {
            key: "refresh",
            label: "Refresh",
            onClick: () => Promise.reject(error),
          },
        ]}
        onActionError={onActionError}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));

    await waitFor(() => {
      expect(onActionError).toHaveBeenCalledWith({
        actionKey: "refresh",
        error,
        source: "toolbarAction",
      });
    });
  });

  it("reports rejected row clicks and row actions with row context", async () => {
    const rowClickError = new Error("Open failed");
    const rowActionError = new Error("Delete failed");
    const onActionError = vi.fn();
    const row = { id: "1", name: "Ada" };

    render(
      <DataTable
        columns={columns}
        data={[row]}
        getRowId={(item) => item.id}
        onRowClick={() => Promise.reject(rowClickError)}
        rowActions={[
          {
            key: "delete",
            label: "Delete",
            onClick: () => Promise.reject(rowActionError),
          },
        ]}
        onActionError={onActionError}
      />,
    );

    fireEvent.click(screen.getByRole("row", { name: /Ada/ }));
    fireEvent.pointerDown(screen.getByRole("button", { name: "Row actions" }));
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(onActionError).toHaveBeenCalledWith({
        error: rowClickError,
        row,
        source: "rowClick",
      });
      expect(onActionError).toHaveBeenCalledWith({
        actionKey: "delete",
        error: rowActionError,
        row,
        source: "rowAction",
      });
    });
  });

  it("reports rejected selection, edit, and file-upload actions", async () => {
    const selectionError = new Error("Archive failed");
    const editError = new Error("Save failed");
    const uploadError = new Error("Upload failed");
    const onActionError = vi.fn();
    const row = { id: "1", name: "Ada" };
    const { container } = render(
      <DataTable
        columns={columns}
        data={[row]}
        getRowId={(item) => item.id}
        enableRowSelection
        selectionActions={[
          {
            key: "archive",
            label: "Archive",
            onClick: () => Promise.reject(selectionError),
          },
        ]}
        editableRows={{
          onSaveRow: () => Promise.reject(editError),
        }}
        fileUpload={{
          onFilesSelected: () => Promise.reject(uploadError),
        }}
        onActionError={onActionError}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Select row" }));
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    fireEvent.pointerDown(screen.getByRole("button", { name: "Row actions" }));
    fireEvent.click(screen.getByText("Edit row"));
    const editInput = container.querySelector("tbody input:not([type=checkbox])");
    expect(editInput).not.toBeNull();
    fireEvent.change(editInput!, {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).not.toBeNull();
    fireEvent.change(fileInput!, {
      target: {
        files: [new File(["data"], "rows.csv", { type: "text/csv" })],
      },
    });

    await waitFor(() => {
      expect(onActionError).toHaveBeenCalledWith({
        actionKey: "archive",
        error: selectionError,
        source: "selectionAction",
      });
      expect(onActionError).toHaveBeenCalledWith({
        error: editError,
        row,
        source: "edit",
      });
      expect(onActionError).toHaveBeenCalledWith({
        error: uploadError,
        source: "fileUpload",
      });
    });
  });

  it("reports rejected CSV export callbacks through toolbar action errors", async () => {
    const error = new Error("Export failed");
    const onActionError = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "Ada" }]}
        getRowId={(row) => row.id}
        csvExport={{
          onExport: () => Promise.reject(error),
        }}
        onActionError={onActionError}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

    await waitFor(() => {
      expect(onActionError).toHaveBeenCalledWith({
        actionKey: "__csv_export__",
        error,
        source: "toolbarAction",
      });
    });
  });

  it("uses the label catalog for selection, views, filters, and pagination", () => {
    const { container } = render(
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Name",
            meta: {
              filter: {
                type: "select",
                options: ["Ada"],
              },
            },
          },
        ]}
        data={[{ id: "1", name: "Ada" }]}
        getRowId={(row) => row.id}
        enableRowSelection
        enableViewToggle
        cardRenderer={({ row }) => <div>{row.name}</div>}
        labels={{
          selectAllVisibleRows: "Select translated rows",
          selectRow: "Select translated row",
          selectCardRow: (rowId) => `Select translated card ${rowId}`,
          switchToTableView: "Use translated table",
          switchToCardView: "Use translated cards",
          allFilterOptions: "All translated options",
          pagination: "Translated pagination",
          recordsPerPage: "Translated records per page",
          nextPage: "Translated next page",
        }}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Select translated rows" })).not.toBeNull();
    expect(screen.getByRole("checkbox", { name: "Select translated row" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Use translated table" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Use translated cards" })).not.toBeNull();
    expect(screen.getByRole("navigation", { name: "Translated pagination" })).not.toBeNull();
    expect(
      screen.getByRole("combobox", { name: "Translated records per page" }),
    ).not.toBeNull();
    expect(screen.getByRole("link", { name: "Translated next page" })).not.toBeNull();

    const filterControls = container.querySelector(
      '[data-dtp-slot="data-table-toolbar-filters"]',
    );
    const filterButton = filterControls?.querySelector("button");
    expect(filterButton).not.toBeNull();
    fireEvent.pointerDown(filterButton!);
    expect(screen.getByText("All translated options")).not.toBeNull();
    fireEvent.click(screen.getByText("All translated options"));

    fireEvent.click(
      screen.getByRole("button", { name: "Use translated cards" }),
    );
    expect(
      screen.getByRole("checkbox", { name: "Select translated card 1" }),
    ).not.toBeNull();
  });
});
