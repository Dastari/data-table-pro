import * as React from "react";
import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DataTableApi, DataTableColumnDef } from "../types";
import { DataTable } from "../../index";

type RowData = {
  id: string;
  team: string;
  score: number;
};

const rows: Array<RowData> = [
  { id: "1", team: "Design", score: 2 },
  { id: "2", team: "Design", score: 3 },
  { id: "3", team: "Engineering", score: 7 },
];

const columns: Array<DataTableColumnDef<RowData, unknown>> = [
  {
    accessorKey: "team",
    header: "Team",
    enableGrouping: true,
    meta: { filter: { type: "faceted" } },
  },
  {
    accessorKey: "score",
    header: "Score",
    aggregationFn: "sum",
  },
];

describe("DataTable grouping and faceting", () => {
  it("creates grouped rows, aggregates values, and preserves grouping in the API state", () => {
    const apiRef = React.createRef<DataTableApi<RowData>>();

    render(
      <DataTable
        apiRef={apiRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        initialState={{ grouping: ["team"] }}
      />,
    );

    expect(apiRef.current?.getState().grouping).toEqual(["team"]);
    expect(apiRef.current?.getTable()?.getRowModel().rows).toHaveLength(2);
    expect(screen.getByText("(2)")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();

    act(() => {
      apiRef.current?.restore({ grouping: [] });
    });
    expect(apiRef.current?.getTable()?.getRowModel().rows).toHaveLength(3);
  });

  it("uses local facet counts and lets server-provided options replace them", () => {
    const localRef = React.createRef<DataTableApi<RowData>>();
    const { container, rerender } = render(
      <DataTable
        apiRef={localRef}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />,
    );

    expect(localRef.current?.getTable()?.getColumn("team")?.getFacetedUniqueValues().get("Design")).toBe(2);

    rerender(
      <DataTable
        apiRef={localRef}
        columns={[
          {
            ...columns[0],
            meta: {
              filter: {
                type: "faceted",
                faceting: {
                  options: [{ label: "Remote", value: "remote", count: 12 }],
                },
              },
            },
          },
          columns[1],
        ]}
        data={rows}
        getRowId={(row) => row.id}
      />,
    );

    expect(
      container.querySelector('[data-dtp-slot="data-table-toolbar-filters"]'),
    ).toBeTruthy();
    const filters = container.querySelector(
      '[data-dtp-slot="data-table-toolbar-filters"]',
    );
    fireEvent.pointerDown(filters?.querySelector("button") as HTMLElement);
    expect(screen.getByText("Remote")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    const facetSearch = screen.getByRole("textbox", {
      name: "Search Team options",
    });
    fireEvent.change(facetSearch, { target: { value: "missing" } });
    expect(screen.queryByText("Remote")).toBeNull();
  });

  it("derives local numeric facet bounds when range bounds are not configured", () => {
    const apiRef = React.createRef<DataTableApi<RowData>>();
    render(
      <DataTable
        apiRef={apiRef}
        columns={[
          columns[0],
          {
            ...columns[1],
            meta: { filter: { type: "numberRange" } },
          },
        ]}
        data={rows}
        getRowId={(row) => row.id}
      />,
    );

    expect(
      apiRef.current
        ?.getTable()
        ?.getColumn("score")
        ?.getFacetedMinMaxValues(),
    ).toEqual([2, 7]);
    expect(screen.getByLabelText("Score: From").getAttribute("min")).toBe("2");
    expect(screen.getByLabelText("Score: To").getAttribute("max")).toBe("7");
  });

  it("reorders grouped columns from the accessible grouping bar", () => {
    const apiRef = React.createRef<DataTableApi<RowData>>();
    render(
      <DataTable
        apiRef={apiRef}
        columns={columns.map((column) => ({ ...column, enableGrouping: true }))}
        data={rows}
        enableGrouping
        getRowId={(row) => row.id}
        initialState={{ grouping: ["team", "score"] }}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Move Score grouping earlier" }),
    );
    expect(apiRef.current?.getState().grouping).toEqual(["score", "team"]);
  });
});
