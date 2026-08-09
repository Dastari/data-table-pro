import * as React from "react";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PaginationState } from "@tanstack/react-table";
import {
  type DataTableDataSourceResponse,
  type UseDataTableDataSourceResult,
  useDataTableDataSource,
} from "./use-data-table-data-source";

type User = { id: string };

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useDataTableDataSource", () => {
  it("sends a typed offset request and returns manual table props", async () => {
    const onGlobalFilterChange = vi.fn();
    const onGroupingChange = vi.fn();
    const source = vi.fn(() => ({
      aggregates: { salary: 120_000 },
      metadata: { revision: "users-v2" },
      rows: [{ id: "ada" }],
      rowIds: ["ada"],
      rowCount: 31,
    }));
    let result: UseDataTableDataSourceResult<User> | undefined;

    function Harness() {
      result = useDataTableDataSource({
        columnFilters: [{ id: "role", value: "admin" }],
        globalFilter: "ada",
        grouping: ["department"],
        aggregations: { salary: "sum" },
        expansionPath: ["engineering"],
        mode: "offset",
        onGlobalFilterChange,
        onGroupingChange,
        pagination: { pageIndex: 1, pageSize: 10 },
        query: { organizationId: "org_1" },
        sorting: [{ desc: true, id: "createdAt" }],
        source,
      });
      return null;
    }

    render(<Harness />);

    await waitFor(() => expect(result?.isSuccess).toBe(true));
    expect(source).toHaveBeenCalledWith(
      expect.objectContaining({
        columnFilters: [{ id: "role", value: "admin" }],
        globalFilter: "ada",
        grouping: ["department"],
        aggregations: { salary: "sum" },
        expansionPath: ["engineering"],
        limit: 10,
        mode: "offset",
        offset: 10,
        query: { organizationId: "org_1" },
        sorting: [{ desc: true, id: "createdAt" }],
      }),
    );
    expect(result?.tableProps).toMatchObject({
      data: [{ id: "ada" }],
      manualFiltering: true,
      manualGrouping: true,
      manualPagination: true,
      manualSorting: true,
      pageIndex: 1,
      pageSize: 10,
      grouping: ["department"],
      toolbarQueryValue: "ada",
      totalRowCount: 31,
    });
    result?.tableProps.onToolbarQueryValueChange?.("grace");
    result?.tableProps.onGroupingChange?.(["role"]);
    expect(onGlobalFilterChange).toHaveBeenCalledWith("grace");
    expect(onGroupingChange).toHaveBeenCalledWith(["role"]);
    expect(result?.tableProps.hasNextPage).toBe(true);
    expect(result?.aggregates).toEqual({ salary: 120_000 });
    expect(result?.metadata).toEqual({ revision: "users-v2" });
    expect(result?.rowIds).toEqual(["ada"]);
  });

  it("cancels superseded work and ignores a late response", async () => {
    const first = deferred<DataTableDataSourceResponse<User>>();
    const second = deferred<DataTableDataSourceResponse<User>>();
    const source = vi
      .fn()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    let result: UseDataTableDataSourceResult<User> | undefined;

    function Harness({ pagination }: { pagination: PaginationState }) {
      result = useDataTableDataSource({
        columnFilters: [],
        mode: "offset",
        pagination,
        sorting: [],
        source,
      });
      return null;
    }

    const view = render(<Harness pagination={{ pageIndex: 0, pageSize: 10 }} />);
    await waitFor(() => expect(source).toHaveBeenCalledTimes(1));
    const firstRequest = source.mock.calls[0]?.[0] as { signal: AbortSignal };

    view.rerender(<Harness pagination={{ pageIndex: 1, pageSize: 10 }} />);
    await waitFor(() => expect(source).toHaveBeenCalledTimes(2));
    expect(firstRequest.signal.aborted).toBe(true);

    await act(async () => {
      second.resolve({ rows: [{ id: "second" }] });
      await second.promise;
    });
    await act(async () => {
      first.resolve({ rows: [{ id: "first" }] });
      await first.promise;
    });

    expect(result?.data).toEqual([{ id: "second" }]);
  });

  it("clears the fetching state when disabled during an active request", async () => {
    const pending = deferred<DataTableDataSourceResponse<User>>();
    const source = vi.fn((_request: { signal: AbortSignal }) => pending.promise);
    let result: UseDataTableDataSourceResult<User> | undefined;

    function Harness({ enabled }: { enabled: boolean }) {
      result = useDataTableDataSource({
        columnFilters: [],
        enabled,
        mode: "offset",
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [],
        source,
      });
      return null;
    }

    const view = render(<Harness enabled />);
    await waitFor(() => expect(result?.isFetching).toBe(true));
    const request = source.mock.calls[0]?.[0] as { signal: AbortSignal };

    view.rerender(<Harness enabled={false} />);

    await waitFor(() => expect(result?.isFetching).toBe(false));
    expect(result?.isLoading).toBe(false);
    expect(request.signal.aborted).toBe(true);
  });

  it("deduplicates an in-flight refresh and serves a fresh cached request", async () => {
    const pending = deferred<DataTableDataSourceResponse<User>>();
    const source = vi
      .fn()
      .mockResolvedValueOnce({ rows: [{ id: "initial" }] })
      .mockImplementationOnce(() => pending.promise);
    let result: UseDataTableDataSourceResult<User> | undefined;

    function Harness() {
      result = useDataTableDataSource({
        cache: 10_000,
        columnFilters: [],
        mode: "offset",
        pagination: { pageIndex: 0, pageSize: 10 },
        sorting: [],
        source,
      });
      return null;
    }

    render(<Harness />);
    await waitFor(() => expect(result?.isSuccess).toBe(true));
    expect(source).toHaveBeenCalledTimes(1);

    await act(async () => {
      const one = result?.refresh();
      const two = result?.refresh();
      expect(one).toBe(two);
      pending.resolve({ rows: [{ id: "fresh" }] });
      await one;
    });
    expect(source).toHaveBeenCalledTimes(2);
    expect(result?.data).toEqual([{ id: "fresh" }]);
  });

  it("reuses a fresh cache entry until it is invalidated", async () => {
    const source = vi
      .fn()
      .mockResolvedValueOnce({ rows: [{ id: "first" }] })
      .mockResolvedValueOnce({ rows: [{ id: "second" }] })
      .mockResolvedValueOnce({ rows: [{ id: "after-invalidation" }] });
    let result: UseDataTableDataSourceResult<User> | undefined;

    function Harness({ pageIndex }: { pageIndex: number }) {
      result = useDataTableDataSource({
        cache: 10_000,
        columnFilters: [],
        mode: "offset",
        pagination: { pageIndex, pageSize: 10 },
        sorting: [],
        source,
      });
      return null;
    }

    const view = render(<Harness pageIndex={0} />);
    await waitFor(() => expect(result?.data).toEqual([{ id: "first" }]));
    view.rerender(<Harness pageIndex={1} />);
    await waitFor(() => expect(result?.data).toEqual([{ id: "second" }]));
    view.rerender(<Harness pageIndex={0} />);
    await waitFor(() => expect(result?.data).toEqual([{ id: "first" }]));
    expect(source).toHaveBeenCalledTimes(2);

    act(() => result?.invalidate());
    await act(async () => {
      await result?.refresh();
    });
    expect(source).toHaveBeenCalledTimes(3);
    expect(result?.data).toEqual([{ id: "after-invalidation" }]);
  });

  it("retries a failed request before reporting success", async () => {
    const source = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce({ rows: [{ id: "recovered" }] });
    let result: UseDataTableDataSourceResult<User> | undefined;

    function Harness() {
      result = useDataTableDataSource({
        columnFilters: [],
        mode: "cursor",
        pagination: { pageIndex: 0, pageSize: 10 },
        retry: { attempts: 1, delay: 0 },
        sorting: [],
        source,
      });
      return null;
    }

    render(<Harness />);
    await waitFor(() => expect(result?.data).toEqual([{ id: "recovered" }]));
    expect(source).toHaveBeenCalledTimes(2);
    expect(result?.isError).toBe(false);
  });
});

function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve;
  });
  return { promise, resolve };
}
