import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "../../index";
import type { DataTableColumnDef } from "../types";

type RowData = { id: string; name: string; role: string };

const columns: Array<DataTableColumnDef<RowData, unknown>> = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

const rows: Array<RowData> = [
  { id: "1", name: "Ada", role: "Admin" },
  { id: "2", name: "Grace", role: "Editor" },
];

function openTableOptions() {
  fireEvent.pointerDown(screen.getByRole("button", { name: "Show table options" }));
}

describe("DataTable toolbar data operations", () => {
  it("renders the enhanced searchable column chooser and layout controls only when opted in", async () => {
    const onColumnOrderChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        enableColumnPinning
        onColumnOrderChange={onColumnOrderChange}
        toolbarDataOperations={{ columnChooser: true, resetLayout: true }}
      />,
    );

    openTableOptions();
    expect(await screen.findByLabelText("Search columns")).toBeTruthy();
    expect(screen.getByText("Show all columns")).toBeTruthy();
    expect(screen.getByText("Hide all columns")).toBeTruthy();
    expect(screen.getByText("Reset column layout")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Search columns"), {
      target: { value: "Role" },
    });
    expect(screen.getByRole("menuitem", { name: "Move Role earlier" })).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: "Move Name earlier" })).toBeNull();
    fireEvent.click(screen.getByRole("menuitem", { name: "Move Role earlier" }));
    expect(onColumnOrderChange).toHaveBeenCalledWith(["role", "name"]);
  });

  it("creates, applies, renames, and deletes saved views from the opted-in menu", async () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };
    const onApply = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        savedViews={{ key: "toolbar-views", storage, onApply }}
        toolbarDataOperations={{ savedViews: true }}
      />,
    );

    openTableOptions();
    fireEvent.change(await screen.findByLabelText("View name"), {
      target: { value: "Operations" },
    });
    fireEvent.click(screen.getByRole("menuitem", { name: "Create saved view" }));
    expect(screen.getByRole("menuitem", { name: "Operations" })).toBeTruthy();

    fireEvent.click(screen.getByRole("menuitem", { name: "Operations" }));
    expect(onApply).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("menuitem", { name: "Rename saved view Operations" }));
    const inputs = screen.getAllByLabelText("View name");
    fireEvent.change(inputs.at(-1)!, { target: { value: "Ops" } });
    fireEvent.click(screen.getByRole("menuitem", { name: "Save view" }));
    expect(screen.getByRole("menuitem", { name: "Delete saved view Ops" })).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete saved view Ops" }));
    expect(screen.queryByRole("menuitem", { name: "Ops" })).toBeNull();
  });

  it("shows removable active filter chips only with toolbar operations enabled", async () => {
    const onColumnFiltersChange = vi.fn();
    render(
      <DataTable
        columns={[
          {
            accessorKey: "role",
            header: "Role",
            meta: { filter: { type: "text" } },
          },
        ]}
        data={rows}
        getRowId={(row) => row.id}
        columnFilters={[{ id: "role", value: "Admin" }]}
        onColumnFiltersChange={onColumnFiltersChange}
        toolbarDataOperations
      />,
    );

    expect(await screen.findByLabelText("Filters: 1")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Clear filters: Role"));
    expect(onColumnFiltersChange).toHaveBeenCalledWith([]);
  });
});
