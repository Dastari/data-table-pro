import * as React from "react";
import type {
  ColumnFiltersState,
  GroupingState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import type { DataTableProps } from "../types";

/** The supported server pagination strategies. */
export type DataTableDataSourceMode = "offset" | "cursor";

/**
 * The serializable portion of a request. It is also passed to `getRequestKey`
 * so applications can define cache identity for domain-specific query values.
 */
export type DataTableDataSourceQuery<TQuery = undefined, TCursor = string> = {
  mode: DataTableDataSourceMode;
  pagination: PaginationState;
  /** `pageIndex * pageSize`; useful for offset-based backends. */
  offset: number;
  /** The requested number of rows. */
  limit: number;
  /** The cursor for a cursor-based backend. `null` represents the first page. */
  cursor: TCursor | null;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  /** Server-owned global filter value, normally the table toolbar query. */
  globalFilter?: string;
  /** Server-owned row grouping state. */
  grouping?: GroupingState;
  /** Requested aggregate functions keyed by result/column identifier. */
  aggregations?: Record<string, string>;
  /** Stable ancestor/group identifiers for lazy child or group loading. */
  expansionPath?: Array<string>;
  /** Application-owned request parameters, such as a tenant or parent ID. */
  query: TQuery | undefined;
};

/** A server request with an AbortSignal that is cancelled when superseded. */
export type DataTableDataSourceRequest<TQuery = undefined, TCursor = string> =
  DataTableDataSourceQuery<TQuery, TCursor> & {
    signal: AbortSignal;
  };

/** A normalized server result for offset and cursor pagination. */
export type DataTableDataSourceResponse<
  TData,
  TCursor = string,
  TFacets = unknown,
> = {
  rows: Array<TData>;
  /** Total matching rows, when the backend can provide it. */
  rowCount?: number;
  /** The cursor to use for the following page. `null` means no following page. */
  nextCursor?: TCursor | null;
  /** Backend-provided facet/count metadata for filter UIs. */
  facets?: TFacets;
  /** Stable row identifiers in response order when IDs are server-projected. */
  rowIds?: Array<string>;
  /** Backend-provided aggregate values keyed by result/column identifier. */
  aggregates?: Record<string, unknown>;
  /** Application-owned response metadata such as revision or timing data. */
  metadata?: Record<string, unknown>;
};

export type DataTableDataSource<
  TData,
  TQuery = undefined,
  TCursor = string,
  TFacets = unknown,
> = (
  request: DataTableDataSourceRequest<TQuery, TCursor>,
) =>
  | DataTableDataSourceResponse<TData, TCursor, TFacets>
  | Promise<DataTableDataSourceResponse<TData, TCursor, TFacets>>;

export type DataTableDataSourceRetryOptions =
  | number
  | {
      /** Number of retries after the initial attempt. Defaults to 0. */
      attempts?: number;
      /** Delay before every retry. Defaults to 250ms. */
      delay?: number | ((context: { attempt: number; error: unknown }) => number);
      shouldRetry?: (context: { attempt: number; error: unknown }) => boolean;
    };

export type DataTableDataSourceCacheOptions =
  | false
  | number
  | {
      /** Freshness lifetime in milliseconds. Defaults to 30 seconds. */
      staleTime?: number;
      /** Maximum cached results per hook instance. Defaults to 50. */
      maxEntries?: number;
    };

export type UseDataTableDataSourceOptions<
  TData,
  TQuery = undefined,
  TCursor = string,
  TFacets = unknown,
> = Omit<
  DataTableDataSourceQuery<TQuery, TCursor>,
  "cursor" | "limit" | "offset" | "query"
> & {
  cursor?: TCursor | null;
  query?: TQuery;
  source: DataTableDataSource<TData, TQuery, TCursor, TFacets>;
  enabled?: boolean;
  /** Retain the prior result while a changed query is loading. Defaults to true. */
  keepPreviousData?: boolean;
  cache?: DataTableDataSourceCacheOptions;
  retry?: DataTableDataSourceRetryOptions;
  /** Override request/cache identity when `query` contains non-serializable values. */
  getRequestKey?: (query: DataTableDataSourceQuery<TQuery, TCursor>) => string;
  initialData?: Array<TData>;
  onSuccess?: (
    response: DataTableDataSourceResponse<TData, TCursor, TFacets>,
    request: DataTableDataSourceRequest<TQuery, TCursor>,
  ) => void;
  onError?: (
    error: unknown,
    request: DataTableDataSourceRequest<TQuery, TCursor>,
  ) => void;
  onPageIndexChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  onGlobalFilterChange?: (globalFilter: string) => void;
  onGroupingChange?: (grouping: GroupingState) => void;
};

export type DataTableDataSourceTableProps<TData> = Pick<
  DataTableProps<TData>,
  | "columnFilters"
  | "data"
  | "hasNextPage"
  | "isLoading"
  | "manualFiltering"
  | "manualPagination"
  | "manualSorting"
  | "onColumnFiltersChange"
  | "onPageIndexChange"
  | "onPageSizeChange"
  | "onSortingChange"
  | "pageIndex"
  | "pageSize"
  | "sorting"
  | "totalRowCount"
>;

export type UseDataTableDataSourceResult<TData, TCursor = string, TFacets = unknown> = {
  aggregates: Record<string, unknown> | undefined;
  data: Array<TData>;
  error: unknown;
  facets: TFacets | undefined;
  isError: boolean;
  /** True while the first result for the active query is loading. */
  isLoading: boolean;
  /** True while any request for the active query is in flight. */
  isFetching: boolean;
  isSuccess: boolean;
  nextCursor: TCursor | null | undefined;
  metadata: Record<string, unknown> | undefined;
  rowIds: Array<string> | undefined;
  rowCount: number | undefined;
  /** Starts a network request, bypassing a fresh cache entry. */
  refresh: () => Promise<DataTableDataSourceResponse<TData, TCursor, TFacets> | undefined>;
  /** Removes one cached request, or every cached request when omitted. */
  invalidate: (requestKey?: string) => void;
  /** Spread these into `DataTable` for manual paging, sorting, and filtering. */
  tableProps: DataTableDataSourceTableProps<TData>;
};

type CachedResponse<TData, TCursor, TFacets> = {
  response: DataTableDataSourceResponse<TData, TCursor, TFacets>;
  updatedAt: number;
};

type ActiveRequest<TData, TQuery, TCursor, TFacets> = {
  controller: AbortController;
  id: number;
  key: string;
  promise: Promise<DataTableDataSourceResponse<TData, TCursor, TFacets> | undefined>;
  request: DataTableDataSourceRequest<TQuery, TCursor>;
};

type SourceState<TData, TCursor, TFacets> = {
  aggregates: Record<string, unknown> | undefined;
  data: Array<TData>;
  error: unknown;
  facets: TFacets | undefined;
  isFetching: boolean;
  metadata: Record<string, unknown> | undefined;
  nextCursor: TCursor | null | undefined;
  responseKey: string | null;
  rowCount: number | undefined;
  rowIds: Array<string> | undefined;
  status: "idle" | "loading" | "success" | "error";
};

const DEFAULT_STALE_TIME = 30_000;
const DEFAULT_MAX_CACHE_ENTRIES = 50;

/**
 * Fetches controlled, server-side table data with cancellation, retry, stale
 * response protection, per-hook caching, and manual DataTable props.
 */
export function useDataTableDataSource<
  TData,
  TQuery = undefined,
  TCursor = string,
  TFacets = unknown,
>(
  options: UseDataTableDataSourceOptions<TData, TQuery, TCursor, TFacets>,
): UseDataTableDataSourceResult<TData, TCursor, TFacets> {
  const {
    aggregations,
    columnFilters,
    cursor,
    enabled = true,
    expansionPath,
    getRequestKey,
    globalFilter,
    grouping,
    initialData = [],
    mode,
    pagination,
    query,
    sorting,
  } = options;
  const latestOptionsRef = React.useRef(options);
  React.useEffect(() => {
    latestOptionsRef.current = options;
  }, [options]);
  const cacheRef = React.useRef(
    new Map<string, CachedResponse<TData, TCursor, TFacets>>(),
  );
  const activeRequestRef = React.useRef<
    ActiveRequest<TData, TQuery, TCursor, TFacets> | undefined
  >(undefined);
  const requestIdRef = React.useRef(0);
  const mountedRef = React.useRef(true);
  const [state, setState] = React.useState<SourceState<TData, TCursor, TFacets>>(
    () => ({
      aggregates: undefined,
      data: initialData,
      error: null,
      facets: undefined,
      isFetching: false,
      metadata: undefined,
      nextCursor: undefined,
      responseKey: null,
      rowCount: undefined,
      rowIds: undefined,
      status: initialData.length > 0 ? "success" : "idle",
    }),
  );

  const requestQuery = React.useMemo<DataTableDataSourceQuery<TQuery, TCursor>>(
    () => ({
      aggregations,
      columnFilters,
      cursor: cursor ?? null,
      expansionPath,
      globalFilter,
      grouping,
      limit: pagination.pageSize,
      mode,
      offset: pagination.pageIndex * pagination.pageSize,
      pagination: { ...pagination },
      query,
      sorting,
    }),
    [
      aggregations,
      columnFilters,
      cursor,
      expansionPath,
      globalFilter,
      grouping,
      mode,
      pagination,
      query,
      sorting,
    ],
  );
  const requestKey = getRequestKey
    ? getRequestKey(requestQuery)
    : stableSerialize(requestQuery);

  const runRequest = React.useCallback(
    (
      force: boolean,
    ): Promise<DataTableDataSourceResponse<TData, TCursor, TFacets> | undefined> => {
      const currentOptions = latestOptionsRef.current;
      const currentQuery: DataTableDataSourceQuery<TQuery, TCursor> = {
        aggregations: currentOptions.aggregations,
        columnFilters: currentOptions.columnFilters,
        cursor: currentOptions.cursor ?? null,
        expansionPath: currentOptions.expansionPath,
        globalFilter: currentOptions.globalFilter,
        grouping: currentOptions.grouping,
        limit: currentOptions.pagination.pageSize,
        mode: currentOptions.mode,
        offset:
          currentOptions.pagination.pageIndex * currentOptions.pagination.pageSize,
        pagination: { ...currentOptions.pagination },
        query: currentOptions.query,
        sorting: currentOptions.sorting,
      };
      const currentKey = currentOptions.getRequestKey
        ? currentOptions.getRequestKey(currentQuery)
        : stableSerialize(currentQuery);
      const activeRequest = activeRequestRef.current;

      if (activeRequest?.key === currentKey) {
        return activeRequest.promise;
      }
      if (activeRequest) {
        activeRequest.controller.abort();
        activeRequestRef.current = undefined;
      }

      const cacheSettings = resolveCacheSettings(currentOptions.cache);
      const cached = cacheRef.current.get(currentKey);
      if (!force && cached && cacheSettings && isCacheFresh(cached, cacheSettings)) {
        if (mountedRef.current) {
          setState({
            aggregates: cached.response.aggregates,
            data: cached.response.rows,
            error: null,
            facets: cached.response.facets,
            isFetching: false,
            metadata: cached.response.metadata,
            nextCursor: cached.response.nextCursor,
            responseKey: currentKey,
            rowCount: cached.response.rowCount,
            rowIds: cached.response.rowIds,
            status: "success",
          });
        }
        return Promise.resolve(cached.response);
      }

      const controller = new AbortController();
      const id = ++requestIdRef.current;
      const request: DataTableDataSourceRequest<TQuery, TCursor> = {
        ...currentQuery,
        signal: controller.signal,
      };
      if (mountedRef.current) {
        setState((previous) => ({
          ...previous,
          data: currentOptions.keepPreviousData === false ? [] : previous.data,
          error: null,
          isFetching: true,
          status: previous.responseKey === currentKey ? previous.status : "loading",
        }));
      }

      const promise = fetchWithRetry(
        currentOptions.source,
        request,
        currentOptions.retry,
      )
        .then((response) => {
          if (activeRequestRef.current?.id !== id) {
            return response;
          }
          const resolvedCacheSettings = resolveCacheSettings(currentOptions.cache);
          if (resolvedCacheSettings) {
            cacheResponse(cacheRef.current, currentKey, response, resolvedCacheSettings);
          }
          if (mountedRef.current) {
            setState({
              aggregates: response.aggregates,
              data: response.rows,
              error: null,
              facets: response.facets,
              isFetching: false,
              metadata: response.metadata,
              nextCursor: response.nextCursor,
              responseKey: currentKey,
              rowCount: response.rowCount,
              rowIds: response.rowIds,
              status: "success",
            });
          }
          currentOptions.onSuccess?.(response, request);
          return response;
        })
        .catch((error: unknown) => {
          if (isAbort(error, controller.signal) || activeRequestRef.current?.id !== id) {
            return undefined;
          }
          if (mountedRef.current) {
            setState((previous) => ({
              ...previous,
              error,
              isFetching: false,
              status: "error",
            }));
          }
          currentOptions.onError?.(error, request);
          return undefined;
        })
        .finally(() => {
          if (activeRequestRef.current?.id === id) {
            activeRequestRef.current = undefined;
          }
        });

      activeRequestRef.current = { controller, id, key: currentKey, promise, request };
      return promise;
    },
    [],
  );

  React.useEffect(() => {
    mountedRef.current = true;
    if (!enabled) {
      activeRequestRef.current?.controller.abort();
      activeRequestRef.current = undefined;
      return;
    }
    void runRequest(false);
  }, [enabled, requestKey, runRequest]);

  React.useEffect(
    () => () => {
      mountedRef.current = false;
      activeRequestRef.current?.controller.abort();
      activeRequestRef.current = undefined;
    },
    [],
  );

  const refresh = React.useCallback(() => runRequest(true), [runRequest]);
  const invalidate = React.useCallback((key?: string) => {
    if (key === undefined) {
      cacheRef.current.clear();
      return;
    }
    cacheRef.current.delete(key);
  }, []);

  const hasNextPage =
    state.nextCursor !== undefined
      ? state.nextCursor !== null
      : state.rowCount === undefined
        ? undefined
        : pagination.pageIndex + 1 < Math.ceil(state.rowCount / pagination.pageSize);
  const tableProps = React.useMemo<DataTableDataSourceTableProps<TData>>(
    () => ({
      columnFilters,
      data: state.data,
      hasNextPage,
      isLoading: enabled && state.status === "loading",
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      onColumnFiltersChange: options.onColumnFiltersChange,
      onPageIndexChange: options.onPageIndexChange,
      onPageSizeChange: options.onPageSizeChange,
      onSortingChange: options.onSortingChange,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      totalRowCount: state.rowCount,
    }),
    [
      columnFilters,
      enabled,
      hasNextPage,
      options.onColumnFiltersChange,
      options.onPageIndexChange,
      options.onPageSizeChange,
      options.onSortingChange,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      state.data,
      state.rowCount,
      state.status,
    ],
  );

  return {
    aggregates: state.aggregates,
    data: state.data,
    error: state.error,
    facets: state.facets,
    invalidate,
    isError: state.status === "error",
    isFetching: enabled && state.isFetching,
    isLoading: enabled && state.status === "loading",
    isSuccess: state.status === "success",
    metadata: state.metadata,
    nextCursor: state.nextCursor,
    refresh,
    rowCount: state.rowCount,
    rowIds: state.rowIds,
    tableProps,
  };
}

function resolveCacheSettings(
  cache: DataTableDataSourceCacheOptions | undefined,
): { staleTime: number; maxEntries: number } | undefined {
  if (cache === false) {
    return undefined;
  }
  if (typeof cache === "number") {
    return { maxEntries: DEFAULT_MAX_CACHE_ENTRIES, staleTime: Math.max(0, cache) };
  }
  return {
    maxEntries: Math.max(1, cache?.maxEntries ?? DEFAULT_MAX_CACHE_ENTRIES),
    staleTime: Math.max(0, cache?.staleTime ?? DEFAULT_STALE_TIME),
  };
}

function isCacheFresh<TData, TCursor, TFacets>(
  cached: CachedResponse<TData, TCursor, TFacets>,
  settings: { staleTime: number },
) {
  return Date.now() - cached.updatedAt <= settings.staleTime;
}

function cacheResponse<TData, TCursor, TFacets>(
  cache: Map<string, CachedResponse<TData, TCursor, TFacets>>,
  key: string,
  response: DataTableDataSourceResponse<TData, TCursor, TFacets>,
  settings: { maxEntries: number },
) {
  cache.delete(key);
  cache.set(key, { response, updatedAt: Date.now() });
  while (cache.size > settings.maxEntries) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) {
      return;
    }
    cache.delete(oldestKey);
  }
}

async function fetchWithRetry<TData, TQuery, TCursor, TFacets>(
  source: DataTableDataSource<TData, TQuery, TCursor, TFacets>,
  request: DataTableDataSourceRequest<TQuery, TCursor>,
  retry: DataTableDataSourceRetryOptions | undefined,
) {
  const settings = resolveRetrySettings(retry);
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await source(request);
    } catch (error) {
      if (
        isAbort(error, request.signal) ||
        attempt >= settings.attempts ||
        !settings.shouldRetry({ attempt: attempt + 1, error })
      ) {
        throw error;
      }
      await waitForRetry(settings.delay({ attempt: attempt + 1, error }), request.signal);
    }
  }
}

function resolveRetrySettings(retry: DataTableDataSourceRetryOptions | undefined) {
  if (typeof retry === "number") {
    return {
      attempts: Math.max(0, retry),
      delay: () => 250,
      shouldRetry: () => true,
    };
  }
  return {
    attempts: Math.max(0, retry?.attempts ?? 0),
    delay: (context: { attempt: number; error: unknown }) => {
      const value = typeof retry?.delay === "function" ? retry.delay(context) : (retry?.delay ?? 250);
      return Math.max(0, value);
    },
    shouldRetry: retry?.shouldRetry ?? (() => true),
  };
}

function waitForRetry(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, delay);
    const onAbort = () => {
      globalThis.clearTimeout(timeout);
      reject(new DOMException("Request aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function isAbort(error: unknown, signal: AbortSignal) {
  return (
    signal.aborted ||
    (error instanceof DOMException && error.name === "AbortError") ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "AbortError")
  );
}

function stableSerialize(value: unknown): string {
  const seen = new WeakSet<object>();
  return JSON.stringify(value, (_key, nested: unknown) => {
    if (typeof nested === "bigint") {
      return `bigint:${nested.toString()}`;
    }
    if (nested instanceof Date) {
      return `date:${nested.toISOString()}`;
    }
    if (typeof nested === "function" || typeof nested === "symbol") {
      return String(nested);
    }
    if (typeof nested === "object" && nested !== null && !Array.isArray(nested)) {
      if (seen.has(nested)) {
        return "[Circular]";
      }
      seen.add(nested);
      return Object.fromEntries(
        Object.entries(nested).sort(([left], [right]) => left.localeCompare(right)),
      );
    }
    return nested;
  });
}
