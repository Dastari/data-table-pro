import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { DataTable as ShadcnDataTable } from "../../index";
import { DataTable as HeroDataTable } from "../../entries/heroui";
import { DataTable as GridcnDataTable } from "../../entries/thegridcn";
import type { DataTableColumnDef } from "../types";

type Person = { id: string; name: string; age: number };

const data: Array<Person> = [
  { id: "ada", name: "Ada", age: 36 },
  { id: "grace", name: "Grace", age: 37 },
  { id: "lin", name: "Lin", age: 38 },
];
const columns: Array<DataTableColumnDef<Person, unknown>> = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

afterEach(cleanup);

describe("interactive grid accessibility", () => {
  it.each([
    ["shadcn", ShadcnDataTable],
    ["heroui", HeroDataTable],
    ["thegridcn", GridcnDataTable],
  ] as const)("exposes valid grid metadata through the %s adapter", (_, DataTable) => {
    render(
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        totalRowCount={12}
      />,
    );

    const grid = screen.getByRole("grid");
    expect(grid.getAttribute("aria-colcount")).toBe("2");
    // Header row + server-reported data rows.
    expect(grid.getAttribute("aria-rowcount")).toBe("13");
    expect(screen.getByRole("columnheader", { name: "Name" }).getAttribute("aria-colindex")).toBe("1");
    const firstRow = screen.getByRole("row", { name: /Ada 36/ });
    expect(firstRow.getAttribute("aria-rowindex")).toBe("2");
    expect(screen.getAllByRole("gridcell")[0].getAttribute("aria-colindex")).toBe("1");
  });

  it("keeps native table behavior unless grid mode is explicitly requested", () => {
    const { container } = render(
      <ShadcnDataTable columns={columns} data={data} getRowId={(row) => row.id} />,
    );
    expect(container.querySelector('[role="grid"]')).toBeNull();
    expect(container.querySelector('[role="gridcell"]')).toBeNull();
  });

  it("keeps full server counts and absolute indexes when virtual rows are bounded", () => {
    render(
      <ShadcnDataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        totalRowCount={200}
        manualPagination
        pageIndex={2}
        pageSize={25}
        virtualization={{ enabled: true, fallbackRowCount: 1 }}
      />,
    );

    const grid = screen.getByRole("grid");
    expect(grid.getAttribute("aria-rowcount")).toBe("201");
    // Header row + the page offset (50) + the first mounted row.
    expect(screen.getByRole("row", { name: /Ada 36/ }).getAttribute("aria-rowindex")).toBe("52");
  });

  it("moves one roving tab stop with arrows, paging, and Home/End", async () => {
    render(
      <ShadcnDataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        accessibility={{ mode: "grid", pageSize: 2 }}
      />,
    );

    const cells = screen.getAllByRole("gridcell");
    expect(cells.filter((cell) => cell.getAttribute("tabindex") === "0")).toHaveLength(1);
    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: "ArrowRight" });
    await waitFor(() => expect(document.activeElement).toBe(screen.getAllByRole("gridcell")[1]));
    fireEvent.keyDown(screen.getAllByRole("gridcell")[1], { key: "PageDown" });
    await waitFor(() => expect(document.activeElement).toBe(screen.getAllByRole("gridcell")[5]));
    fireEvent.keyDown(screen.getAllByRole("gridcell")[5], { key: "Home" });
    await waitFor(() => expect(document.activeElement).toBe(screen.getAllByRole("gridcell")[4]));
    fireEvent.keyDown(screen.getAllByRole("gridcell")[4], { key: "End", ctrlKey: true });
    await waitFor(() => expect(document.activeElement).toBe(screen.getAllByRole("gridcell")[5]));
  });

  it("does not consume keys from a selection checkbox or sort button", () => {
    render(
      <ShadcnDataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        enableRowSelection
      />,
    );

    const checkbox = screen.getAllByRole("checkbox")[1];
    checkbox.focus();
    const checkboxEvent = createEvent.keyDown(checkbox, { key: " " });
    fireEvent(checkbox, checkboxEvent);
    expect(checkboxEvent.defaultPrevented).toBe(false);
    const sort = screen.getByRole("button", { name: "Name" });
    const sortEvent = createEvent.keyDown(sort, { key: "Enter" });
    fireEvent(sort, sortEvent);
    expect(sortEvent.defaultPrevented).toBe(false);
  });
});
