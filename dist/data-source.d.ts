import { PaginationState, SortingState, ColumnFiltersState, GroupingState } from '@tanstack/react-table';
import { D as DataTableProps } from './types-BGNR6Ymh.js';
import 'react';

/** The supported server pagination strategies. */
type DataTableDataSourceMode = "offset" | "cursor";
/**
 * The serializable portion of a request. It is also passed to `getRequestKey`
 * so applications can define cache identity for domain-specific query values.
 */
type DataTableDataSourceQuery<TQuery = undefined, TCursor = string> = {
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
type DataTableDataSourceRequest<TQuery = undefined, TCursor = string> = DataTableDataSourceQuery<TQuery, TCursor> & {
    signal: AbortSignal;
};
/** A normalized server result for offset and cursor pagination. */
type DataTableDataSourceResponse<TData, TCursor = string, TFacets = unknown> = {
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
type DataTableDataSource<TData, TQuery = undefined, TCursor = string, TFacets = unknown> = (request: DataTableDataSourceRequest<TQuery, TCursor>) => DataTableDataSourceResponse<TData, TCursor, TFacets> | Promise<DataTableDataSourceResponse<TData, TCursor, TFacets>>;
type DataTableDataSourceRetryOptions = number | {
    /** Number of retries after the initial attempt. Defaults to 0. */
    attempts?: number;
    /** Delay before every retry. Defaults to 250ms. */
    delay?: number | ((context: {
        attempt: number;
        error: unknown;
    }) => number);
    shouldRetry?: (context: {
        attempt: number;
        error: unknown;
    }) => boolean;
};
type DataTableDataSourceCacheOptions = false | number | {
    /** Freshness lifetime in milliseconds. Defaults to 30 seconds. */
    staleTime?: number;
    /** Maximum cached results per hook instance. Defaults to 50. */
    maxEntries?: number;
};
type UseDataTableDataSourceOptions<TData, TQuery = undefined, TCursor = string, TFacets = unknown> = Omit<DataTableDataSourceQuery<TQuery, TCursor>, "cursor" | "limit" | "offset" | "query"> & {
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
    onSuccess?: (response: DataTableDataSourceResponse<TData, TCursor, TFacets>, request: DataTableDataSourceRequest<TQuery, TCursor>) => void;
    onError?: (error: unknown, request: DataTableDataSourceRequest<TQuery, TCursor>) => void;
    onPageIndexChange?: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSortingChange?: (sorting: SortingState) => void;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    onGlobalFilterChange?: (globalFilter: string) => void;
    onGroupingChange?: (grouping: GroupingState) => void;
};
type DataTableDataSourceTableProps<TData> = Pick<DataTableProps<TData>, "columnFilters" | "data" | "hasNextPage" | "isLoading" | "manualFiltering" | "manualGrouping" | "manualPagination" | "manualSorting" | "onColumnFiltersChange" | "onGroupingChange" | "onPageIndexChange" | "onPageSizeChange" | "onSortingChange" | "pageIndex" | "pageSize" | "sorting" | "grouping" | "toolbarQueryValue" | "onToolbarQueryValueChange" | "totalRowCount">;
type UseDataTableDataSourceResult<TData, TCursor = string, TFacets = unknown> = {
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
/**
 * Fetches controlled, server-side table data with cancellation, retry, stale
 * response protection, per-hook caching, and manual DataTable props.
 */
declare function useDataTableDataSource<TData, TQuery = undefined, TCursor = string, TFacets = unknown>(options: UseDataTableDataSourceOptions<TData, TQuery, TCursor, TFacets>): UseDataTableDataSourceResult<TData, TCursor, TFacets>;

export { type DataTableDataSource, type DataTableDataSourceCacheOptions, type DataTableDataSourceMode, type DataTableDataSourceQuery, type DataTableDataSourceRequest, type DataTableDataSourceResponse, type DataTableDataSourceRetryOptions, type DataTableDataSourceTableProps, type UseDataTableDataSourceOptions, type UseDataTableDataSourceResult, useDataTableDataSource };
