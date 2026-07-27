import * as React from "react";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFnOption,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Table as TanStackTable,
  VisibilityState,
} from "@tanstack/react-table";
import type { DataTableProps } from "../types";
import {
  dataTableGlobalFilterFn,
  getColumnId,
  isUtilityColumnId,
  moveColumnInOrder,
} from "./data-table-utils";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";
import { useDataTablePaginationClamp } from "./use-data-table-pagination-clamp";

export function useDataTableInstance<TData>({
  autoResetPageIndex,
  columnResizeMode,
  currentColumnFilters,
  currentColumnOrder,
  currentColumnPinning,
  currentColumnSizing,
  currentExpanded,
  currentPagination,
  currentRowSelection,
  currentSorting,
  defaultColumn,
  effectiveColumnVisibility,
  enableColumnResizing,
  enableRowSelection,
  getRowCanExpand,
  globalFilterFn,
  globalFilterValue,
  hasNextPage,
  handleColumnFiltersChange,
  handleColumnOrderChange,
  handleColumnPinningChange,
  handleColumnVisibilityChange,
  handleExpandedChange,
  infiniteScroll,
  manualFiltering,
  manualPagination,
  manualSorting,
  onActionError,
  onPageIndexChange,
  onPageSizeChange,
  pageCount,
  pageIndex,
  pageSize,
  renderExpandedRow,
  setCurrentRowSelection,
  setCurrentSorting,
  setLocalColumnSizing,
  setLocalPagination,
  shouldRenderInitialLoading,
  tableColumns,
  tableData,
  tableGetRowId,
  tableRef,
  totalRowCount,
}: {
  autoResetPageIndex: boolean;
  columnResizeMode: DataTableProps<TData>["columnResizeMode"];
  currentColumnFilters: ColumnFiltersState;
  currentColumnOrder: ColumnOrderState;
  currentColumnPinning: ColumnPinningState;
  currentColumnSizing: ColumnSizingState;
  currentExpanded: ExpandedState;
  currentPagination: PaginationState;
  currentRowSelection: Record<string, boolean>;
  currentSorting: SortingState;
  currentViewMode: "table" | "card";
  defaultColumn: Partial<ColumnDef<TData, unknown>>;
  effectiveColumnVisibility: VisibilityState;
  enableColumnResizing: boolean;
  enableRowSelection: boolean;
  getRowCanExpand: DataTableProps<TData>["getRowCanExpand"];
  globalFilterFn: FilterFnOption<TData> | undefined;
  globalFilterValue: string;
  hasNextPage?: DataTableProps<TData>["hasNextPage"];
  handleColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  handleColumnOrderChange: OnChangeFn<ColumnOrderState>;
  handleColumnPinningChange: OnChangeFn<ColumnPinningState>;
  handleColumnVisibilityChange: OnChangeFn<VisibilityState>;
  handleExpandedChange: OnChangeFn<ExpandedState>;
  infiniteScroll: DataTableProps<TData>["infiniteScroll"];
  manualFiltering: boolean;
  manualPagination: boolean;
  manualSorting: boolean;
  onActionError?: DataTableProps<TData>["onActionError"];
  onPageIndexChange: DataTableProps<TData>["onPageIndexChange"];
  onPageSizeChange: DataTableProps<TData>["onPageSizeChange"];
  pageCount: DataTableProps<TData>["pageCount"];
  pageIndex: DataTableProps<TData>["pageIndex"];
  pageSize: DataTableProps<TData>["pageSize"];
  renderExpandedRow: DataTableProps<TData>["renderExpandedRow"];
  setCurrentRowSelection: OnChangeFn<Record<string, boolean>>;
  setCurrentSorting: OnChangeFn<SortingState>;
  setLocalColumnSizing: OnChangeFn<ColumnSizingState>;
  setLocalPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  shouldRenderInitialLoading: boolean;
  tableColumns: Array<ColumnDef<TData, unknown>>;
  tableData: Array<TData>;
  tableGetRowId: DataTableProps<TData>["getRowId"];
  tableRef: React.RefObject<TanStackTable<TData> | null>;
  tableScrollElement: HTMLElement | null;
  /**
   * @deprecated Filtering now runs through TanStack Table. Retained so
   * advanced 4.x hook callers remain source-compatible.
   */
  toolbarFilteredData?: Array<TData>;
  totalRowCount: DataTableProps<TData>["totalRowCount"];
  virtualization: DataTableProps<TData>["virtualization"];
  viewportHeight: number;
}) {
  const generatedColumnIds = React.useMemo(() => {
    return tableColumns.map((column, index) =>
      getColumnId(column as DataTableProps<TData>["columns"][number], index),
    );
  }, [tableColumns]);

  const effectiveColumnOrder = React.useMemo<ColumnOrderState>(() => {
    const columnIds = generatedColumnIds;
    const dataColumnIds = columnIds.filter(
      (columnId) =>
        !isUtilityColumnId(columnId) && columnId !== "__spacer__",
    );
    const dataColumnIdSet = new Set(dataColumnIds);
    const orderedDataColumnIds = currentColumnOrder.filter((columnId) =>
      dataColumnIdSet.has(columnId),
    );
    const unorderedDataColumnIds = dataColumnIds.filter(
      (columnId) => !orderedDataColumnIds.includes(columnId),
    );

    return [
      ...columnIds.filter(
        (columnId) => columnId === "__expand__" || columnId === "__select__",
      ),
      ...orderedDataColumnIds,
      ...unorderedDataColumnIds,
      ...columnIds.filter((columnId) => columnId === "__spacer__"),
      ...columnIds.filter((columnId) => columnId === "__actions__"),
    ];
  }, [currentColumnOrder, generatedColumnIds]);

  const effectiveColumnPinning = React.useMemo<ColumnPinningState>(() => {
    const columnIdSet = new Set(generatedColumnIds);
    const dataColumnIdSet = new Set(
      generatedColumnIds.filter(
        (columnId) =>
          !isUtilityColumnId(columnId) && columnId !== "__spacer__",
      ),
    );
    const dataLeft = (currentColumnPinning.left ?? []).filter((columnId) =>
      dataColumnIdSet.has(columnId),
    );
    const dataRight = (currentColumnPinning.right ?? []).filter((columnId) =>
      dataColumnIdSet.has(columnId),
    );

    return {
      left: [
        ...["__expand__", "__select__"].filter((columnId) =>
          columnIdSet.has(columnId),
        ),
        ...dataLeft,
      ],
      right: [
        ...dataRight,
        ...["__actions__"].filter((columnId) => columnIdSet.has(columnId)),
      ],
    };
  }, [currentColumnPinning, generatedColumnIds]);

  const tableState = React.useMemo(
    () => ({
      sorting: currentSorting,
      pagination: currentPagination,
      rowSelection: currentRowSelection,
      columnVisibility: effectiveColumnVisibility,
      columnFilters: currentColumnFilters,
      globalFilter: globalFilterValue,
      expanded: currentExpanded,
      columnOrder: effectiveColumnOrder,
      columnPinning: effectiveColumnPinning,
      columnSizing: currentColumnSizing,
    }),
    [
      currentColumnFilters,
      currentColumnSizing,
      currentExpanded,
      currentPagination,
      currentRowSelection,
      currentSorting,
      effectiveColumnVisibility,
      effectiveColumnOrder,
      effectiveColumnPinning,
      globalFilterValue,
    ],
  );

  const handlePaginationChange = React.useCallback<
    OnChangeFn<PaginationState>
  >(
    (updater) => {
      const nextValue =
        typeof updater === "function" ? updater(currentPagination) : updater;

      if (pageIndex === undefined || pageSize === undefined) {
        setLocalPagination((current) => ({
          pageIndex:
            pageIndex === undefined ? nextValue.pageIndex : current.pageIndex,
          pageSize:
            pageSize === undefined ? nextValue.pageSize : current.pageSize,
        }));
      }

      if (nextValue.pageIndex !== currentPagination.pageIndex) {
        onPageIndexChange?.(nextValue.pageIndex);
      }
      if (nextValue.pageSize !== currentPagination.pageSize) {
        onPageSizeChange?.(nextValue.pageSize);
      }
    },
    [
      currentPagination,
      onPageIndexChange,
      onPageSizeChange,
      pageIndex,
      pageSize,
      setLocalPagination,
    ],
  );

  const handleColumnSizingChange = React.useCallback<
    OnChangeFn<ColumnSizingState>
  >(
    (updater) => {
      setLocalColumnSizing(updater);
    },
    [setLocalColumnSizing],
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table owns its instance functions.
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getExpandedRowModel: renderExpandedRow ? getExpandedRowModel() : undefined,
    getPaginationRowModel:
      manualPagination || infiniteScroll?.enabled
        ? undefined
        : getPaginationRowModel(),
    enableRowSelection,
    enableMultiRowSelection: enableRowSelection,
    enableColumnResizing,
    columnResizeMode,
    getRowId: tableGetRowId,
    getRowCanExpand: renderExpandedRow
      ? (row) => getRowCanExpand?.(row.original) ?? true
      : undefined,
    globalFilterFn: globalFilterFn ?? dataTableGlobalFilterFn,
    getColumnCanGlobalFilter: (column) =>
      column.columnDef.enableGlobalFilter !== false &&
      typeof column.accessorFn === "function",
    manualSorting,
    manualFiltering,
    manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
    defaultColumn,
    autoResetPageIndex,
    state: tableState,
    onSortingChange: setCurrentSorting,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setCurrentRowSelection,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onExpandedChange: handleExpandedChange,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnPinningChange: handleColumnPinningChange,
    onColumnSizingChange: handleColumnSizingChange,
  });
  tableRef.current = table;

  const visibleLeafColumns = table.getVisibleLeafColumns();
  const reorderColumn = React.useCallback(
    (sourceColumnId: string, targetColumnId: string) => {
      if (sourceColumnId === targetColumnId) {
        return;
      }

      const defaultOrder = table
        .getAllLeafColumns()
        .map((column) => column.id)
        .filter((columnId) => !isUtilityColumnId(columnId));
      const nextOrder = moveColumnInOrder(
        currentColumnOrder.length ? currentColumnOrder : defaultOrder,
        sourceColumnId,
        targetColumnId,
      );
      handleColumnOrderChange(nextOrder);
    },
    [currentColumnOrder, handleColumnOrderChange, table],
  );

  const renderedRows = table.getRowModel().rows;
  const rowsToRender = renderedRows.map((row, rowIndex) => ({
    row,
    rowIndex,
  }));

  const usesManualRows = manualPagination || Boolean(infiniteScroll?.enabled);
  const derivedTotalRowCount = usesManualRows
    ? undefined
    : table.getFilteredRowModel().rows.length;
  const effectiveTotalRowCount = totalRowCount ?? derivedTotalRowCount;
  const isPageCountKnown =
    !usesManualRows || pageCount !== undefined || totalRowCount !== undefined;
  const footerTotalRowCount = effectiveTotalRowCount;
  const effectivePageCount = shouldRenderInitialLoading
    ? 1
    : (pageCount ??
      (effectiveTotalRowCount !== undefined
        ? Math.max(
            1,
            Math.ceil(effectiveTotalRowCount / currentPagination.pageSize),
          )
        : usesManualRows
          ? currentPagination.pageIndex + (hasNextPage ? 2 : 1)
          : table.getPageCount()));
  const maxPageIndex = Math.max(0, effectivePageCount - 1);

  const setLocalPageIndex = React.useCallback(
    (nextPageIndex: number) => {
      if (pageIndex !== undefined) {
        return;
      }

      setLocalPagination((current) =>
        current.pageIndex === nextPageIndex
          ? current
          : { ...current, pageIndex: nextPageIndex },
      );
    },
    [pageIndex, setLocalPagination],
  );
  useDataTablePaginationClamp({
    enabled:
      !shouldRenderInitialLoading &&
      !infiniteScroll?.enabled &&
      isPageCountKnown,
    maxPageIndex,
    onPageIndexChange,
    pageIndex: currentPagination.pageIndex,
    setLocalPageIndex,
  });

  const handleFooterPageIndexChange = React.useCallback(
    (nextPageIndex: number) => {
      if (nextPageIndex === currentPagination.pageIndex) {
        return;
      }

      onPageIndexChange?.(nextPageIndex);
      if (pageIndex === undefined) {
        setLocalPagination((current) =>
          current.pageIndex === nextPageIndex
            ? current
            : { ...current, pageIndex: nextPageIndex },
        );
      }
    },
    [
      currentPagination.pageIndex,
      onPageIndexChange,
      pageIndex,
      setLocalPagination,
    ],
  );
  const handleFooterPageSizeChange = React.useCallback(
    (nextPageSize: number) => {
      if (currentPagination.pageIndex !== 0) {
        onPageIndexChange?.(0);
      }
      if (nextPageSize !== currentPagination.pageSize) {
        onPageSizeChange?.(nextPageSize);
      }
      if (pageSize === undefined) {
        setLocalPagination({
          pageIndex: 0,
          pageSize: nextPageSize,
        });
      }
    },
    [
      currentPagination.pageIndex,
      currentPagination.pageSize,
      onPageIndexChange,
      onPageSizeChange,
      pageSize,
      setLocalPagination,
    ],
  );

  const sentinelRef = useDataTableInfiniteScroll({
    enabled: Boolean(infiniteScroll?.enabled),
    hasMore: Boolean(infiniteScroll?.hasMore),
    isLoadingMore: infiniteScroll?.isLoadingMore,
    onLoadMore: () => infiniteScroll?.onLoadMore(),
    onError: (error) => {
      onActionError?.({
        error,
        source: "infiniteScroll",
      });
    },
  });

  return {
    effectivePageCount,
    footerTotalRowCount,
    handleFooterPageIndexChange,
    handleFooterPageSizeChange,
    isPageCountKnown,
    renderedRows,
    reorderColumn,
    rowsToRender,
    sentinelRef,
    table,
    virtualPaddingBottom: 0,
    virtualPaddingTop: 0,
    visibleLeafColumns,
  };
}

export type DataTableRowsToRender<TData> = Array<{
  row: Row<TData>;
  rowIndex: number;
}>;
