import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
import type { DataTableApi, DataTableColumnDef } from "../types";

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

  it("selects a pointer-dragged rectangle and exposes ARIA styling hooks", () => {
    const onCellSelectionChange = vi.fn();
    render(
      <ShadcnDataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        enableCellSelection
        onCellSelectionChange={onCellSelectionChange}
      />,
    );

    const cells = screen.getAllByRole("gridcell");
    fireEvent.pointerDown(cells[0], { button: 0 });
    fireEvent.pointerEnter(cells[3], { buttons: 1 });
    fireEvent.pointerUp(window);
    expect(cells.slice(0, 4).every((cell) => cell.getAttribute("aria-selected") === "true")).toBe(true);
    expect(cells[3].getAttribute("data-dtp-cell-selected")).toBe("true");
    expect(onCellSelectionChange).toHaveBeenLastCalledWith({
      anchor: { rowId: "ada", columnId: "name" },
      focus: { rowId: "grace", columnId: "age" },
    });
  });

  it("extends a range with Shift+navigation and copies only its cells", async () => {
    const onCopy = vi.fn();
    const apiRef = React.createRef<DataTableApi<Person>>();
    const { container } = render(
      <ShadcnDataTable
        apiRef={apiRef}
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        enableCellSelection
        clipboard={{ copy: { onCopy } }}
      />,
    );
    const cells = screen.getAllByRole("gridcell");
    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: "ArrowRight", shiftKey: true });
    await waitFor(() => expect(cells[0].getAttribute("aria-selected")).toBe("true"));
    expect(cells[1].getAttribute("aria-selected")).toBe("true");
    expect(apiRef.current?.getCellSelection()).toEqual({
      anchor: { rowId: "ada", columnId: "name" },
      focus: { rowId: "ada", columnId: "age" },
    });
    const root = container.querySelector<HTMLElement>('[data-dtp-slot="data-table-root"]');
    fireEvent.keyDown(root!, { ctrlKey: true, key: "c" });
    await waitFor(() => expect(onCopy).toHaveBeenCalled());
    const copyContext = onCopy.mock.calls[0]?.[0] as { text: string };
    expect(copyContext.text).toBe("Ada\t36");
    apiRef.current?.clearCellSelection();
    await waitFor(() => expect(apiRef.current?.getCellSelection()).toBeNull());
  });

  it("keeps controlled selection and delegates undo/redo to the application", () => {
    const onCellSelectionChange = vi.fn();
    const undo = vi.fn();
    const redo = vi.fn();
    const selection = {
      anchor: { rowId: "grace", columnId: "age" },
      focus: { rowId: "grace", columnId: "age" },
    };
    const { container } = render(
      <ShadcnDataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        cellSelection={selection}
        onCellSelectionChange={onCellSelectionChange}
        gridCommands={{ undo, redo }}
      />,
    );
    const cells = screen.getAllByRole("gridcell");
    expect(cells[3].getAttribute("aria-selected")).toBe("true");
    fireEvent.pointerDown(cells[0], { button: 0 });
    expect(onCellSelectionChange).toHaveBeenCalledWith({
      anchor: { rowId: "ada", columnId: "name" },
      focus: { rowId: "ada", columnId: "name" },
    });
    const root = container.querySelector<HTMLElement>('[data-dtp-slot="data-table-root"]');
    fireEvent.keyDown(root!, { ctrlKey: true, key: "z" });
    fireEvent.keyDown(root!, { ctrlKey: true, shiftKey: true, key: "z" });
    expect(undo).toHaveBeenCalledWith(expect.objectContaining({ cellSelection: selection }));
    expect(redo).toHaveBeenCalledWith(expect.objectContaining({ cellSelection: selection }));
  });

  it("keeps imperative copy disabled when clipboard.copy is false", async () => {
    const apiRef = React.createRef<DataTableApi<Person>>();
    render(
      <ShadcnDataTable
        apiRef={apiRef}
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        cellSelection={{
          anchor: { rowId: "ada", columnId: "name" },
          focus: { rowId: "ada", columnId: "name" },
        }}
        clipboard={{ copy: false }}
      />,
    );
    await expect(apiRef.current?.copyToClipboard()).resolves.toBeUndefined();
  });

  it("copies an expanded tree range in displayed parent-to-child order", async () => {
    type TreePerson = Person & { children?: Array<TreePerson> };
    const treeColumns: Array<DataTableColumnDef<TreePerson, unknown>> = [
      { accessorKey: "name", header: "Name" },
    ];
    const treeData: Array<TreePerson> = [
      {
        id: "parent",
        name: "Parent",
        age: 1,
        children: [{ id: "child", name: "Child", age: 2 }],
      },
    ];
    const apiRef = React.createRef<DataTableApi<TreePerson>>();
    const onCopy = vi.fn();
    render(
      <ShadcnDataTable
        apiRef={apiRef}
        columns={treeColumns}
        data={treeData}
        getRowId={(row) => row.id}
        getSubRows={(row) => row.children}
        initialState={{ expanded: { parent: true } }}
        interactiveGrid
        cellSelection={{
          anchor: { rowId: "parent", columnId: "name" },
          focus: { rowId: "child", columnId: "name" },
        }}
      />,
    );
    await apiRef.current?.copyToClipboard({ scope: "cellSelection", onCopy });
    const copyContext = onCopy.mock.calls[0]?.[0] as { text: string };
    expect(copyContext.text).toBe("Parent\nChild");
  });

  it("ignores utility-cell pointers and filters utility bounds from range copy", async () => {
    const onCellSelectionChange = vi.fn();
    const onCopy = vi.fn();
    const apiRef = React.createRef<DataTableApi<Person>>();
    render(
      <ShadcnDataTable
        apiRef={apiRef}
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        interactiveGrid
        enableCellSelection
        enableRowSelection
        onCellSelectionChange={onCellSelectionChange}
      />,
    );
    const cells = screen.getAllByRole("gridcell");
    fireEvent.pointerDown(cells[0], { button: 0 });
    expect(onCellSelectionChange).not.toHaveBeenCalled();
    apiRef.current?.setCellSelection({
      anchor: { rowId: "ada", columnId: "__select__" },
      focus: { rowId: "ada", columnId: "name" },
    });
    await waitFor(() =>
      expect(apiRef.current?.getCellSelection()).toEqual({
        anchor: { rowId: "ada", columnId: "__select__" },
        focus: { rowId: "ada", columnId: "name" },
      }),
    );
    await apiRef.current?.copyToClipboard({ scope: "cellSelection", onCopy });
    const copyContext = onCopy.mock.calls[0]?.[0] as { text: string };
    expect(copyContext.text).toBe("Ada");
  });
});
