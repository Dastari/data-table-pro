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
  RowPinningState,
  Row,
  SortingState,
  Table as TanStackTable,
  VisibilityState,
} from "@tanstack/react-table";
import type { DataTableProps } from "../types";
import {
  canReorderDataTableColumn,
  dataTableGlobalFilterFn,
  getColumnId,
  getDataTableLeafColumns,
  isDataTableLoadingRow,
  isUtilityColumnId,
  moveColumnInOrder,
} from "./data-table-utils";
import type { DataTableColumnGroupPaths } from "./data-table-utils";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";
import { useDataTablePaginationClamp } from "./use-data-table-pagination-clamp";

export function useDataTableInstance<TData>({
  autoResetPageIndex,
  columnGroupPaths,
  columnResizeMode,
  dir,
  currentColumnFilters,
  currentColumnOrder,
  currentColumnPinning,
  currentRowPinning,
  currentColumnSizing,
  currentExpanded,
  currentPagination,
  currentRowSelection,
  currentSorting,
  currentViewMode,
  defaultColumn,
  effectiveColumnVisibility,
  enableColumnResizing,
  enableMultiRowSelection,
  enableRowPinning,
  enableRowSelection,
  enableSubRowSelection,
  getRowCanSelect,
  getRowCanExpand,
  getSubRows,
  globalFilterFn,
  globalFilterValue,
  hasNextPage,
  handleColumnFiltersChange,
  handleColumnOrderChange,
  handleColumnPinningChange,
  handleRowPinningChange,
  handleColumnVisibilityChange,
  handleExpandedChange,
  infiniteScroll,
  keepPinnedRows,
  manualFiltering,
  manualExpanding,
  manualPagination,
  manualSorting,
  onActionError,
  onPageIndexChange,
  onPageSizeChange,
  pageCount,
  pageIndex,
  pageSize,
  paginateExpandedRows,
  filterFromLeafRows,
  maxLeafRowFilterDepth,
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
  virtualization,
}: {
  autoResetPageIndex: boolean;
  columnGroupPaths: DataTableColumnGroupPaths;
  columnResizeMode: DataTableProps<TData>["columnResizeMode"];
  dir: NonNullable<DataTableProps<TData>["dir"]>;
  currentColumnFilters: ColumnFiltersState;
  currentColumnOrder: ColumnOrderState;
  currentColumnPinning: ColumnPinningState;
  currentRowPinning: RowPinningState;
  currentColumnSizing: ColumnSizingState;
  currentExpanded: ExpandedState;
  currentPagination: PaginationState;
  currentRowSelection: Record<string, boolean>;
  currentSorting: SortingState;
  currentViewMode: "table" | "card";
  defaultColumn: Partial<ColumnDef<TData, unknown>>;
  effectiveColumnVisibility: VisibilityState;
  enableColumnResizing: boolean;
  enableMultiRowSelection: NonNullable<
    DataTableProps<TData>["enableMultiRowSelection"]
  >;
  enableRowPinning: DataTableProps<TData>["enableRowPinning"];
  enableRowSelection: boolean;
  enableSubRowSelection: NonNullable<
    DataTableProps<TData>["enableSubRowSelection"]
  >;
  getRowCanSelect: DataTableProps<TData>["getRowCanSelect"];
  getRowCanExpand: DataTableProps<TData>["getRowCanExpand"];
  getSubRows: DataTableProps<TData>["getSubRows"];
  globalFilterFn: FilterFnOption<TData> | undefined;
  globalFilterValue: string;
  hasNextPage?: DataTableProps<TData>["hasNextPage"];
  handleColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  handleColumnOrderChange: OnChangeFn<ColumnOrderState>;
  handleColumnPinningChange: OnChangeFn<ColumnPinningState>;
  handleRowPinningChange: OnChangeFn<RowPinningState>;
  handleColumnVisibilityChange: OnChangeFn<VisibilityState>;
  handleExpandedChange: OnChangeFn<ExpandedState>;
  infiniteScroll: DataTableProps<TData>["infiniteScroll"];
  keepPinnedRows: boolean;
  manualFiltering: boolean;
  manualExpanding: boolean;
  manualPagination: boolean;
  manualSorting: boolean;
  onActionError?: DataTableProps<TData>["onActionError"];
  onPageIndexChange: DataTableProps<TData>["onPageIndexChange"];
  onPageSizeChange: DataTableProps<TData>["onPageSizeChange"];
  pageCount: DataTableProps<TData>["pageCount"];
  pageIndex: DataTableProps<TData>["pageIndex"];
  pageSize: DataTableProps<TData>["pageSize"];
  paginateExpandedRows: DataTableProps<TData>["paginateExpandedRows"];
  filterFromLeafRows: DataTableProps<TData>["filterFromLeafRows"];
  maxLeafRowFilterDepth: DataTableProps<TData>["maxLeafRowFilterDepth"];
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
    return getDataTableLeafColumns(
      tableColumns as DataTableProps<TData>["columns"],
    ).map(({ column, index }) => getColumnId(column, index));
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

  const effectiveRowPinning = React.useMemo<RowPinningState>(() => {
    const availableRowIds = new Set<string>();
    const visitRows = (rows: Array<TData>) => {
      rows.forEach((row, index) => {
        availableRowIds.add(tableGetRowId(row, index));
        if (!isDataTableLoadingRow(row)) {
          const subRows = getSubRows?.(row, index);
          if (subRows?.length) {
            visitRows(subRows);
          }
        }
      });
    };
    visitRows(tableData);
    const top = (currentRowPinning.top ?? []).filter((rowId) =>
      availableRowIds.has(rowId),
    );
    const topIds = new Set(top);
    const bottom = (currentRowPinning.bottom ?? []).filter(
      (rowId) => availableRowIds.has(rowId) && !topIds.has(rowId),
    );
    return { top, bottom };
  }, [
    currentRowPinning.bottom,
    currentRowPinning.top,
    getSubRows,
    tableData,
    tableGetRowId,
  ]);

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
      rowPinning: effectiveRowPinning,
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
      effectiveRowPinning,
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
    getExpandedRowModel:
      getSubRows && !manualExpanding ? getExpandedRowModel() : undefined,
    getPaginationRowModel:
      manualPagination || infiniteScroll?.enabled
        ? undefined
        : getPaginationRowModel(),
    enableRowSelection: getRowCanSelect
      ? (row) => enableRowSelection && getRowCanSelect(row.original)
      : enableRowSelection,
    enableRowPinning:
      typeof enableRowPinning === "function"
        ? (row) => enableRowPinning(row.original)
        : enableRowPinning,
    keepPinnedRows,
    enableMultiRowSelection:
      typeof enableMultiRowSelection === "function"
        ? (row) => enableMultiRowSelection(row.original)
        : enableMultiRowSelection,
    enableSubRowSelection:
      typeof enableSubRowSelection === "function"
        ? (row) => enableSubRowSelection(row.original)
        : enableSubRowSelection,
    enableColumnResizing,
    columnResizeMode,
    columnResizeDirection: dir,
    getRowId: tableGetRowId,
    getSubRows,
    getRowCanExpand: getSubRows
      ? (row) => getRowCanExpand?.(row.original) ?? row.subRows.length > 0
      : undefined,
    globalFilterFn: globalFilterFn ?? dataTableGlobalFilterFn,
    getColumnCanGlobalFilter: (column) =>
      column.columnDef.enableGlobalFilter !== false &&
      typeof column.accessorFn === "function",
    manualSorting,
    manualFiltering,
    manualExpanding,
    manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
    paginateExpandedRows,
    filterFromLeafRows,
    maxLeafRowFilterDepth,
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
    onRowPinningChange: handleRowPinningChange,
    onColumnSizingChange: handleColumnSizingChange,
  });
  tableRef.current = table;

  const visibleLeafColumns = table.getVisibleLeafColumns();
  const reorderColumn = React.useCallback(
    (sourceColumnId: string, targetColumnId: string) => {
      if (sourceColumnId === targetColumnId) {
        return;
      }

      if (
        !canReorderDataTableColumn(
          sourceColumnId,
          targetColumnId,
          columnGroupPaths,
        )
      ) {
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
    [columnGroupPaths, currentColumnOrder, handleColumnOrderChange, table],
  );

  const topPinnedRows = table.getTopRows();
  const bottomPinnedRows = table.getBottomRows();
  // Card rendering has no top/bottom table regions. Keep its original row
  // model intact rather than silently dropping pinned records.
  const renderedRows =
    currentViewMode === "table"
      ? table.getCenterRows()
      : table.getRowModel().rows;
  const virtualizationConfig =
    typeof virtualization === "object" ? virtualization : undefined;
  const virtualRowsEnabled =
    virtualization === true || virtualizationConfig?.enabled === true;
  const fallbackRowCount = Math.max(
    1,
    Math.floor(virtualizationConfig?.fallbackRowCount ?? 20),
  );
  const initialRowsToRender = virtualRowsEnabled
    ? renderedRows.slice(0, fallbackRowCount)
    : renderedRows;
  const rowsToRender = initialRowsToRender.map((row, rowIndex) => ({
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
    topPinnedRows,
    bottomPinnedRows,
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
