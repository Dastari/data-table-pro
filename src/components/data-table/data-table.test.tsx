import * as React from "react";
import { act } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";
import type { DataTableColumnDef, DataTableProps } from "./types";
import { TooltipProvider } from "../ui/tooltip";

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

function renderTable(
  props: Partial<DataTableProps<TestRow>> = {},
) {
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

describe("DataTable search debounce", () => {
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
});
