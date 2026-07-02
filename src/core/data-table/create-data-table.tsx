import * as React from "react";
import { flushSync } from "react-dom";
import {
  getExpandedRowModel,
  getFilteredRowModel,
  functionalUpdate,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table as TanStackTable,
  VisibilityState,
} from "@tanstack/react-table";
import type {
  DataTableDensity,
  DataTableProps,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { createDataTableCardView } from "./create-data-table-card-view";
import { createDataTableEmptyState } from "./create-data-table-empty-state";
import { createDataTablePagination } from "./create-data-table-pagination";
import { createDataTableRowActions } from "./create-data-table-row-actions";
import { createDataTableToolbar } from "./create-data-table-toolbar";
import { DataTableBodyRow } from "./data-table-body-row";
import { DataTableHeaderCell } from "./data-table-header-cell";
import { resolveDataTableLabels } from "./data-table-labels";
import {
  readDataTableColumnPrefs,
  usePersistDataTableColumnPrefs,
} from "./use-data-table-column-prefs";
import { useDataTableContainerWidth } from "./use-data-table-container-width";
import { useDataTableColumns } from "./use-data-table-columns";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";
import { useDataTablePaginationClamp } from "./use-data-table-pagination-clamp";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";
import {
  createDataTableLoadingRows,
  getColumnId,
  getDataTableLoadingRowId,
  getInitialColumnPinning,
  isDataTableLoadingRow,
  isUtilityColumnId,
  moveColumnInOrder,
  rowMatchesToolbarQuery,
} from "./data-table-utils";
import { useDataTableToolbarFeatures } from "./use-data-table-toolbar-features";
import { useColumnLayout } from "./use-column-layout";
import { useControllableState } from "./use-controllable-state";
import { useRowEditing } from "./use-row-editing";
import { isHiddenAtContainerWidth, isRowVisible } from "../types";

export function createDataTable(ui: DataTableUiKit) {
  const uiClassNames = ui.classNames ?? {};
  const {
    rootClassName,
    Button,
    Checkbox,
    Input,
    ScrollArea,
    ScrollBar,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableFooter = "tfoot",
    TableHead,
    TableHeader,
    TableRow,
    Tooltip,
    TooltipContent,
    TooltipProvider = React.Fragment,
    TooltipTrigger,
  } = ui;
  const DataTableEmptyState = createDataTableEmptyState(ui);
  const DataTableRowActions = createDataTableRowActions(ui);
  const { DataTableFooter } = createDataTablePagination(ui);
  const DataTableToolbar = createDataTableToolbar(ui);
  const DataTableCardView = createDataTableCardView(ui, DataTableRowActions);
  const defaultColumn = {
    minSize: 80,
    size: 180,
    maxSize: 720,
  };

  return function DataTable<TData>({
    columns,
    data,
    getRowId,
    children,
    title,
    description,
    toolbarQueryValue,
    onToolbarQueryValueChange,
    toolbarQueryPlaceholder,
    toolbarQueryDebounceMs,
    manualFiltering = false,
    enableToolbarQueryFiltering = true,
    globalFilterFn,
    columnFilters,
    onColumnFiltersChange,
    enableColumnFilters,
    customToolbar,
    compactToolbar,
    rowsPerPageOptions = [10, 20, 50, 100],
    totalRowCount,
    sorting,
    onSortingChange,
    manualSorting = false,
    pageIndex,
    pageSize,
    onPageIndexChange,
    onPageSizeChange,
    pageCount,
    manualPagination = false,
    rowSelection,
    onRowSelectionChange,
    enableRowSelection = false,
    expanded,
    onExpandedChange,
    getRowCanExpand,
    renderExpandedRow,
    columnOrder,
    onColumnOrderChange,
    enableColumnReordering = false,
    columnPinning,
    onColumnPinningChange,
    enableColumnPinning = false,
    toolbarActions = [],
    selectionActions = [],
    rowActions = [],
    csvExport,
    density,
    onDensityChange,
    enableDensityToggle = false,
    columnPrefsKey,
    labels,
    summaryRows = [],
    cardRenderer,
    cardGridClassName,
    cardClassName,
    viewMode,
    onViewModeChange,
    enableViewToggle = false,
    emptyState,
    isLoading = false,
    loadingRowCount,
    getRowLoadingState,
    hiddenRows,
    showHiddenRows,
    onShowHiddenRowsChange,
    infiniteScroll,
    editableRows,
    columnVisibility,
    onColumnVisibilityChange,
    enableColumnResizing = false,
    columnResizeMode = "onChange",
    layoutMode = "fill",
    stickyHeader = true,
    showFooter = true,
    showToolbar = true,
    dir = "ltr",
    flexGrow = true,
    toolbarVisibility,
    className,
    tableClassName,
    tableContainerClassName,
    getRowClassName,
    onRowClick,
    dragAndDrop,
    fileUpload,
    virtualization,
  }: DataTableProps<TData>) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const tableScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const draggedColumnIdRef = React.useRef<string | null>(null);
    const tableRef = React.useRef<TanStackTable<TData> | null>(null);
    const lastSelectedRowIdRef = React.useRef<string | null>(null);
    const persistedColumnPrefs = React.useMemo(
      () => readDataTableColumnPrefs(columnPrefsKey),
      [columnPrefsKey],
    );
    const resolvedLabels = React.useMemo(
      () => resolveDataTableLabels(labels),
      [labels],
    );
    const [localPagination, setLocalPagination] =
      React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: rowsPerPageOptions[0] ?? 20,
      });
    const [localColumnSizing, setLocalColumnSizing] =
      React.useState<ColumnSizingState>(() => persistedColumnPrefs.sizing ?? {});
    const [currentSorting, setCurrentSorting] =
      useControllableState<SortingState>({
        value: sorting,
        onChange: onSortingChange,
        defaultValue: [],
      });
    const [currentRowSelection, setCurrentRowSelection] = useControllableState<
      Record<string, boolean>
    >({
      value: rowSelection,
      onChange: onRowSelectionChange,
      defaultValue: {},
    });
    const [currentColumnVisibility, setCurrentColumnVisibility] =
      useControllableState<VisibilityState>({
        value: columnVisibility,
        onChange: onColumnVisibilityChange,
        defaultValue: () => persistedColumnPrefs.visibility ?? {},
      });
    const [currentColumnFilters, setCurrentColumnFilters] =
      useControllableState<ColumnFiltersState>({
        value: columnFilters,
        onChange: onColumnFiltersChange,
        defaultValue: [],
      });
    const [currentExpanded, setCurrentExpanded] =
      useControllableState<ExpandedState>({
        value: expanded,
        onChange: onExpandedChange,
        defaultValue: {},
      });
    const [currentColumnOrder, setCurrentColumnOrder] =
      useControllableState<ColumnOrderState>({
        value: columnOrder,
        onChange: onColumnOrderChange,
        defaultValue: () => persistedColumnPrefs.order ?? [],
      });
    const [currentColumnPinning, setCurrentColumnPinning] =
      useControllableState<ColumnPinningState>({
        value: columnPinning,
        onChange: onColumnPinningChange,
        defaultValue: () =>
          persistedColumnPrefs.pinning ?? getInitialColumnPinning(columns),
      });
    const [currentViewMode, setCurrentViewMode] = useControllableState<
      "table" | "card"
    >({
      value: viewMode,
      onChange: onViewModeChange,
      defaultValue: () => viewMode ?? "table",
    });
    const [currentShowHiddenRows, setCurrentShowHiddenRows] =
      useControllableState<boolean>({
        value: showHiddenRows,
        onChange: onShowHiddenRowsChange,
        defaultValue: () => showHiddenRows ?? false,
      });
    const [currentDensity, setCurrentDensity] =
      useControllableState<DataTableDensity>({
        value: density,
        onChange: onDensityChange,
        defaultValue: () =>
          density ?? persistedColumnPrefs.density ?? "comfortable",
      });
    const resolvedToolbarQueryValue = toolbarQueryValue ?? "";
    const resolvedToolbarQueryPlaceholder =
      toolbarQueryPlaceholder ?? resolvedLabels.searchPlaceholder;
    const resolvedToolbarQueryDebounceMs = toolbarQueryDebounceMs ?? 250;
    const resolvedOnToolbarQueryValueChange = onToolbarQueryValueChange;
    const [localSearchValue, setLocalSearchValue] = React.useState(
      resolvedToolbarQueryValue,
    );
    const {
      cancelEditing,
      draftValues,
      editingRowId,
      isSavingEdit,
      saveEdit,
      setDraftValues,
      setEditingRowId,
      startEditingRow,
    } = useRowEditing({
      columns,
      editableRows,
    });
    const containerWidth = useDataTableContainerWidth(containerRef);
    const { viewportElement: tableScrollElement, viewportHeight } =
      useDataTableScrollViewport(tableScrollContainerRef, currentViewMode);
    const hasOnSearchValueChange = Boolean(resolvedOnToolbarQueryValueChange);
    const lastReportedSearchValueRef = React.useRef(resolvedToolbarQueryValue);
    const onToolbarQueryValueChangeEvent = React.useEffectEvent(
      (value: string) => {
        lastReportedSearchValueRef.current = value;
        resolvedOnToolbarQueryValueChange?.(value);
      },
    );

    React.useEffect(() => {
      lastReportedSearchValueRef.current = resolvedToolbarQueryValue;
      setLocalSearchValue(resolvedToolbarQueryValue);
    }, [resolvedToolbarQueryValue]);

    React.useEffect(() => {
      if (!hasOnSearchValueChange) {
        return;
      }

      if (localSearchValue === resolvedToolbarQueryValue) {
        return;
      }

      if (localSearchValue === lastReportedSearchValueRef.current) {
        return;
      }

      const timeout = window.setTimeout(() => {
        onToolbarQueryValueChangeEvent(localSearchValue);
      }, resolvedToolbarQueryDebounceMs);

      return () => {
        window.clearTimeout(timeout);
      };
    }, [
      hasOnSearchValueChange,
      localSearchValue,
      resolvedToolbarQueryDebounceMs,
      resolvedToolbarQueryValue,
    ]);

    const currentPagination = React.useMemo<PaginationState>(
      () => ({
        pageIndex: pageIndex ?? localPagination.pageIndex,
        pageSize: pageSize ?? localPagination.pageSize,
      }),
      [
        localPagination.pageIndex,
        localPagination.pageSize,
        pageIndex,
        pageSize,
      ],
    );
    const resolvedLoadingRowCount = Math.max(
      1,
      loadingRowCount ?? Math.min(5, currentPagination.pageSize),
    );
    const currentColumnSizing = localColumnSizing;
    const globalFilterValue = "";
    const handleViewModeChange = React.useCallback(
      (nextViewMode: "table" | "card") => {
        setCurrentViewMode(nextViewMode);
      },
      [setCurrentViewMode],
    );
    const handleShowHiddenRowsChange = React.useCallback(
      (nextShowHiddenRows: boolean) => {
        setCurrentShowHiddenRows(nextShowHiddenRows);
      },
      [setCurrentShowHiddenRows],
    );
    const handleDensityChange = React.useCallback(
      (nextDensity: DataTableDensity) => {
        setCurrentDensity(nextDensity);
      },
      [setCurrentDensity],
    );
    const resetPageIndexForFilterChange = React.useCallback(() => {
      onPageIndexChange?.(0);
      if (pageIndex === undefined) {
        setLocalPagination((current) =>
          current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
        );
      }
    }, [onPageIndexChange, pageIndex]);
    const filterResetSignature = React.useMemo(
      () =>
        JSON.stringify({
          globalFilterValue,
          columnFilters: currentColumnFilters,
        }),
      [currentColumnFilters, globalFilterValue],
    );
    const lastFilterResetSignatureRef = React.useRef(filterResetSignature);

    React.useEffect(() => {
      if (manualFiltering) {
        lastFilterResetSignatureRef.current = filterResetSignature;
        return;
      }

      if (lastFilterResetSignatureRef.current === filterResetSignature) {
        return;
      }

      lastFilterResetSignatureRef.current = filterResetSignature;
      resetPageIndexForFilterChange();
    }, [filterResetSignature, manualFiltering, resetPageIndexForFilterChange]);

    usePersistDataTableColumnPrefs({
      key: columnPrefsKey,
      prefs: {
        visibility: columnVisibility ? undefined : currentColumnVisibility,
        sizing: currentColumnSizing,
        order: columnOrder ? undefined : currentColumnOrder,
        pinning: columnPinning ? undefined : currentColumnPinning,
        density: density ? undefined : currentDensity,
      },
    });
    const responsiveColumnVisibility = React.useMemo<VisibilityState>(() => {
      return columns.reduce<VisibilityState>((visibility, column, index) => {
        const columnId = getColumnId(column, index);
        if (isHiddenAtContainerWidth(column.meta?.hideOn, containerWidth)) {
          visibility[columnId] = false;
        }
        return visibility;
      }, {});
    }, [columns, containerWidth]);
    const effectiveColumnVisibility = React.useMemo<VisibilityState>(() => {
      return {
        ...currentColumnVisibility,
        ...responsiveColumnVisibility,
      };
    }, [currentColumnVisibility, responsiveColumnVisibility]);
    const openFileDialog = React.useCallback(() => {
      if (fileUpload?.disabled) {
        return;
      }

      fileInputRef.current?.click();
    }, [fileUpload?.disabled]);
    const handleSelectedFiles = React.useCallback(
      async (files: FileList | Array<File>) => {
        await fileUpload?.onFilesSelected(files);
      },
      [fileUpload],
    );

    const visibleData = React.useMemo(
      () =>
        data.filter((row) =>
          isRowVisible(row, hiddenRows, currentShowHiddenRows),
        ),
      [currentShowHiddenRows, data, hiddenRows],
    );
    const toolbarFilteredData = React.useMemo(() => {
      if (
        manualFiltering ||
        !enableToolbarQueryFiltering ||
        !localSearchValue.trim()
      ) {
        return visibleData;
      }

      return visibleData.filter((row) =>
        rowMatchesToolbarQuery(row, columns, localSearchValue),
      );
    }, [
      columns,
      enableToolbarQueryFiltering,
      localSearchValue,
      manualFiltering,
      visibleData,
    ]);
    const shouldRenderInitialLoading = isLoading && visibleData.length === 0;
    const loadingRows = React.useMemo(
      () => createDataTableLoadingRows<TData>(resolvedLoadingRowCount),
      [resolvedLoadingRowCount],
    );
    const tableData = shouldRenderInitialLoading
      ? loadingRows
      : toolbarFilteredData;
    const tableGetRowId = React.useCallback(
      (row: TData, index: number) => {
        if (isDataTableLoadingRow(row)) {
          return getDataTableLoadingRowId(index);
        }

        return getRowId(row, index);
      },
      [getRowId],
    );

    const shouldResolveSelectedRows =
      enableRowSelection ||
      selectionActions.length > 0 ||
      Object.values(currentRowSelection).some(Boolean);
    const rowById = React.useMemo(() => {
      if (!shouldResolveSelectedRows) {
        return new Map<string, TData>();
      }

      return new Map(
        visibleData.map((row, index) => [getRowId(row, index), row]),
      );
    }, [getRowId, shouldResolveSelectedRows, visibleData]);

    const selectedRows = React.useMemo(() => {
      if (!shouldResolveSelectedRows) {
        return [];
      }

      return Object.entries(currentRowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => rowById.get(rowId))
        .filter((row): row is TData => Boolean(row));
    }, [currentRowSelection, rowById, shouldResolveSelectedRows]);

    const tableColumns = useDataTableColumns<TData>({
      Button,
      Checkbox,
      DataTableRowActions,
      Tooltip,
      TooltipContent,
      TooltipTrigger,
      cancelEditing,
      columns,
      editableRows,
      editingRowId,
      enableRowSelection,
      getRowCanExpand,
      isSavingEdit,
      labels: resolvedLabels,
      lastSelectedRowIdRef,
      renderExpandedRow,
      rowActions,
      saveEdit,
      startEditingRow,
      tableRef,
    });

    const tableState = React.useMemo(
      () => ({
        sorting: currentSorting,
        pagination: currentPagination,
        rowSelection: currentRowSelection,
        columnVisibility: effectiveColumnVisibility,
        columnFilters: currentColumnFilters,
        globalFilter: globalFilterValue,
        expanded: currentExpanded,
        columnOrder: currentColumnOrder,
        columnPinning: currentColumnPinning,
        columnSizing: currentColumnSizing,
      }),
      [
        currentColumnFilters,
        currentColumnOrder,
        currentColumnPinning,
        currentColumnSizing,
        currentExpanded,
        currentPagination,
        currentRowSelection,
        currentSorting,
        effectiveColumnVisibility,
        globalFilterValue,
      ],
    );
    const handleSortingChange = React.useCallback<OnChangeFn<SortingState>>(
      (updater) => {
        setCurrentSorting(updater);
      },
      [setCurrentSorting],
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

        onPageIndexChange?.(nextValue.pageIndex);
        onPageSizeChange?.(nextValue.pageSize);
      },
      [
        currentPagination,
        onPageIndexChange,
        onPageSizeChange,
        pageIndex,
        pageSize,
      ],
    );
    const handleRowSelectionChange = React.useCallback<
      OnChangeFn<Record<string, boolean>>
    >(
      (updater) => {
        setCurrentRowSelection(updater);
      },
      [setCurrentRowSelection],
    );
    const handleColumnVisibilityChange = React.useCallback<
      OnChangeFn<VisibilityState>
    >(
      (updater) => {
        setCurrentColumnVisibility(updater);
      },
      [setCurrentColumnVisibility],
    );
    const handleColumnFiltersChange = React.useCallback<
      OnChangeFn<ColumnFiltersState>
    >(
      (updater) => {
        setCurrentColumnFilters(updater);
      },
      [setCurrentColumnFilters],
    );
    const handleExpandedChange = React.useCallback<OnChangeFn<ExpandedState>>(
      (updater) => {
        setCurrentExpanded(updater);
      },
      [setCurrentExpanded],
    );
    const handleColumnOrderChange = React.useCallback<
      OnChangeFn<ColumnOrderState>
    >(
      (updater) => {
        setCurrentColumnOrder(updater);
      },
      [setCurrentColumnOrder],
    );
    const handleColumnPinningChange = React.useCallback<
      OnChangeFn<ColumnPinningState>
    >(
      (updater) => {
        setCurrentColumnPinning(updater);
      },
      [setCurrentColumnPinning],
    );
    const handleColumnSizingChange = React.useCallback<
      OnChangeFn<ColumnSizingState>
    >((updater) => {
      setLocalColumnSizing((current) => functionalUpdate(updater, current));
    }, []);

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
      globalFilterFn,
      manualSorting,
      manualFiltering,
      manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
      defaultColumn,
      autoResetPageIndex: false,
      state: tableState,
      onSortingChange: handleSortingChange,
      onPaginationChange: handlePaginationChange,
      onRowSelectionChange: handleRowSelectionChange,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      onColumnFiltersChange: handleColumnFiltersChange,
      onExpandedChange: handleExpandedChange,
      onColumnOrderChange: handleColumnOrderChange,
      onColumnPinningChange: handleColumnPinningChange,
      onColumnSizingChange: handleColumnSizingChange,
    });
    tableRef.current = table;
    const columnSizing = currentColumnSizing;
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
    const virtualizationConfig =
      typeof virtualization === "object" ? virtualization : undefined;
    const enableVirtualization =
      currentViewMode === "table" &&
      !shouldRenderInitialLoading &&
      (virtualization === true || virtualizationConfig?.enabled === true);
    const shouldUseVirtualRows =
      enableVirtualization && Boolean(tableScrollElement) && viewportHeight > 0;
    const rowVirtualizer = useVirtualizer({
      count: enableVirtualization ? renderedRows.length : 0,
      enabled: shouldUseVirtualRows,
      estimateSize: () => virtualizationConfig?.estimateRowHeight ?? 48,
      getScrollElement: () => tableScrollElement,
      overscan: virtualizationConfig?.overscan ?? 8,
    });
    const virtualItems = shouldUseVirtualRows
      ? rowVirtualizer.getVirtualItems()
      : [];
    const rowsToRender = shouldUseVirtualRows
      ? virtualItems.flatMap((virtualItem) => {
          const row = renderedRows[virtualItem.index];
          return row ? [{ row, rowIndex: virtualItem.index }] : [];
        })
      : renderedRows.map((row, rowIndex) => ({ row, rowIndex }));
    const virtualPaddingTop = shouldUseVirtualRows
      ? (virtualItems[0]?.start ?? 0)
      : 0;
    const virtualPaddingBottom = shouldUseVirtualRows
      ? Math.max(
          0,
          rowVirtualizer.getTotalSize() -
            (virtualItems.at(-1)?.end ?? virtualPaddingTop),
        )
      : 0;

    const columnLayout = useColumnLayout({
      columns,
      columnSizing,
      editableRows: Boolean(editableRows),
      enableRowSelection,
      hasRowActions: rowActions.length > 0,
      hasRowExpansion: Boolean(renderExpandedRow),
      layoutMode,
      uiClassNames,
      visibleLeafColumns,
    });
    const { explicitlySizedColumnIds, fillMinWidth, getColumnLayout } =
      columnLayout;
    const explicitCustomCellColumnIds = React.useMemo(() => {
      return new Set(
        columns.flatMap((column, index) => {
          return Object.prototype.hasOwnProperty.call(column, "cell") &&
            typeof column.cell === "function"
            ? [getColumnId(column, index)]
            : [];
        }),
      );
    }, [columns]);
    const visibleLeafColumnCount = visibleLeafColumns.length;
    const bodyRowComponents = React.useMemo(
      () => ({
        Checkbox,
        Input,
        Skeleton,
        TableCell,
        TableRow,
      }),
      [],
    );
    const hasCardTitle = React.useMemo(
      () => columns.some((column) => column.meta?.cardTitle),
      [columns],
    );
    const primeColumnForResize = React.useCallback(
      (columnId: string, currentSize: number) => {
        if (
          explicitlySizedColumnIds.has(columnId) ||
          Object.prototype.hasOwnProperty.call(
            table.getState().columnSizing,
            columnId,
          )
        ) {
          return;
        }

        flushSync(() => {
          table.setColumnSizing((current) => ({
            ...current,
            [columnId]: currentSize,
          }));
        });
      },
      [explicitlySizedColumnIds, table],
    );
    const resetColumnSize = React.useCallback(
      (columnId: string) => {
        if (explicitlySizedColumnIds.has(columnId)) {
          table.getColumn(columnId)?.resetSize();
          return;
        }

        table.setColumnSizing((current) => {
          if (!Object.prototype.hasOwnProperty.call(current, columnId)) {
            return current;
          }

          const next = { ...current };
          delete next[columnId];
          return next;
        });
      },
      [explicitlySizedColumnIds, table],
    );

    const derivedTotalRowCount =
      manualPagination || infiniteScroll?.enabled
        ? toolbarFilteredData.length
        : table.getFilteredRowModel().rows.length;
    const effectiveTotalRowCount = totalRowCount ?? derivedTotalRowCount;
    const footerTotalRowCount = totalRowCount ?? effectiveTotalRowCount;
    const effectivePageCount = shouldRenderInitialLoading
      ? 1
      : (pageCount ??
        (manualPagination || infiniteScroll?.enabled
          ? Math.max(
              1,
              Math.ceil(effectiveTotalRowCount / currentPagination.pageSize),
            )
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
      [pageIndex],
    );
    useDataTablePaginationClamp({
      enabled: !shouldRenderInitialLoading && !infiniteScroll?.enabled,
      maxPageIndex,
      onPageIndexChange,
      pageIndex: currentPagination.pageIndex,
      setLocalPageIndex,
    });

    const handleFooterPageIndexChange = React.useCallback(
      (nextPageIndex: number) => {
        onPageIndexChange?.(nextPageIndex);
        if (pageIndex === undefined) {
          setLocalPagination((current) =>
            current.pageIndex === nextPageIndex
              ? current
              : { ...current, pageIndex: nextPageIndex },
          );
        }
      },
      [onPageIndexChange, pageIndex],
    );
    const handleFooterPageSizeChange = React.useCallback(
      (nextPageSize: number) => {
        onPageIndexChange?.(0);
        onPageSizeChange?.(nextPageSize);
        if (pageSize === undefined) {
          setLocalPagination({
            pageIndex: 0,
            pageSize: nextPageSize,
          });
        }
      },
      [onPageIndexChange, onPageSizeChange, pageSize],
    );

    const sentinelRef = useDataTableInfiniteScroll({
      enabled: Boolean(infiniteScroll?.enabled),
      hasMore: Boolean(infiniteScroll?.hasMore),
      isLoadingMore: infiniteScroll?.isLoadingMore,
      onLoadMore: () => {
        void infiniteScroll?.onLoadMore();
      },
    });

    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const emptyNode =
      typeof emptyState === "function"
      ? emptyState({
          rows: filteredData,
          toolbarQueryValue: localSearchValue,
        })
        : emptyState;
    const {
      columnVisibilityOptions,
      effectiveToolbarActions,
      handleClearColumnFilters,
      handleToolbarColumnFilterChange,
      handleToolbarColumnPinningChange,
      toolbarColumnFilters,
    } = useDataTableToolbarFeatures({
      columns,
      currentColumnFilters,
      currentColumnPinning,
      csvExport,
      effectiveColumnVisibility,
      enableColumnFilters,
      handleColumnFiltersChange,
      handleColumnPinningChange,
      labels: resolvedLabels,
      table,
      toolbarActions,
      visibleData,
    });

    return (
      <TooltipProvider>
        <div
          ref={containerRef}
          data-dtp-slot="data-table-root"
          data-density={currentDensity}
          dir={dir}
          className={cn(
            "@container/data-table data-table-container-query flex flex-col",
            flexGrow ? "h-full min-h-0 flex-1" : "grow",
            rootClassName,
          )}
          onDragEnter={dragAndDrop?.onDragEnter}
          onDragOver={dragAndDrop?.onDragOver}
          onDragLeave={dragAndDrop?.onDragLeave}
          onDrop={dragAndDrop?.onDrop}
        >
          {fileUpload ? (
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept={fileUpload.accept}
              multiple={fileUpload.multiple ?? true}
              disabled={fileUpload.disabled}
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files?.length) {
                  void handleSelectedFiles(files);
                }
                event.currentTarget.value = "";
              }}
            />
          ) : null}
          <div
            data-dtp-slot="data-table-layout"
            className={cn(
              "flex w-full flex-col",
              flexGrow ? "min-h-0 flex-1" : "grow",
            )}
          >
            <div
              data-dtp-slot="data-table-main"
              className={cn(
                "flex w-full flex-col gap-4",
                flexGrow ? "min-h-0 flex-1" : "grow",
                className,
              )}
            >
              {showToolbar ? (
                <div data-dtp-slot="data-table-toolbar" className="shrink-0">
                  <DataTableToolbar
                    title={title}
                    description={description}
                    toolbarQueryValue={localSearchValue}
                    toolbarQueryPlaceholder={resolvedToolbarQueryPlaceholder}
                    onToolbarQueryValueChange={setLocalSearchValue}
                    customToolbar={customToolbar}
                    compactToolbar={compactToolbar}
                    viewMode={currentViewMode}
                    onViewModeChange={handleViewModeChange}
                    enableViewToggle={enableViewToggle && Boolean(cardRenderer)}
                    toolbarActions={effectiveToolbarActions}
                    selectionActions={selectionActions}
                    selectedRows={selectedRows}
                    showHiddenRows={currentShowHiddenRows}
                    hiddenRowsLabel={hiddenRows?.label}
                    onShowHiddenRowsChange={handleShowHiddenRowsChange}
                    allRows={filteredData}
                    columnVisibilityOptions={columnVisibilityOptions}
                    onColumnVisibilityChange={(columnId, visible) => {
                      table.getColumn(columnId)?.toggleVisibility(visible);
                    }}
                    enableColumnPinning={enableColumnPinning}
                    onColumnPinningChange={handleToolbarColumnPinningChange}
                    columnFilters={toolbarColumnFilters}
                    onColumnFilterChange={handleToolbarColumnFilterChange}
                    onClearColumnFilters={handleClearColumnFilters}
                    density={currentDensity}
                    onDensityChange={handleDensityChange}
                    enableDensityToggle={enableDensityToggle}
                    labels={resolvedLabels}
                    toolbarVisibility={toolbarVisibility}
                    openFileDialog={fileUpload ? openFileDialog : undefined}
                  />
                </div>
              ) : null}

            <div
              data-dtp-slot="data-table-content"
              className={cn(flexGrow ? "flex min-h-0 flex-1 flex-col" : "")}
            >
              {currentViewMode === "card" && cardRenderer ? (
                <div
                  data-dtp-slot="data-table-card-shell"
                  className={cn(
                    "box-border border-2 border-transparent transition-colors",
                    flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
                    dragAndDrop?.isDragging &&
                      (uiClassNames.dragActive ?? "rounded-md border-dashed"),
                  )}
                >
                  <ScrollArea
                    className={cn(
                      flexGrow ? "min-h-0 flex-1" : "h-full",
                      uiClassNames.cardScrollArea,
                      tableContainerClassName,
                    )}
                  >
                    <div
                      data-dtp-slot="data-table-card-viewport"
                      className={cn(
                        "flex min-h-full min-w-0 flex-col",
                        flexGrow && "min-h-0 flex-1",
                        uiClassNames.cardViewport,
                      )}
                    >
                      {shouldRenderInitialLoading ? (
                        <DataTableCardView
                          rows={[]}
                          cardRenderer={cardRenderer}
                          cardGridClassName={cardGridClassName}
                          cardClassName={cardClassName}
                          rowActions={rowActions}
                          editableRows={editableRows}
                          renderExpandedRow={renderExpandedRow}
                          hasCardTitle={hasCardTitle}
                          rowSelection={currentRowSelection}
                          onRowSelectionChange={setCurrentRowSelection}
                          enableRowSelection={enableRowSelection}
                          editingRowId={editingRowId}
                          onEditingRowIdChange={setEditingRowId}
                          getRowClassName={getRowClassName}
                          onRowClick={onRowClick}
                          getRowDraggable={dragAndDrop?.getRowDraggable}
                          onRowDragStart={dragAndDrop?.onRowDragStart}
                          onRowDragEnd={dragAndDrop?.onRowDragEnd}
                          isLoading={true}
                          loadingRowCount={resolvedLoadingRowCount}
                          labels={resolvedLabels}
                        />
                      ) : renderedRows.length ? (
                        <DataTableCardView
                          rows={renderedRows}
                          cardRenderer={cardRenderer}
                          cardGridClassName={cardGridClassName}
                          cardClassName={cardClassName}
                          rowActions={rowActions}
                          editableRows={editableRows}
                          renderExpandedRow={renderExpandedRow}
                          hasCardTitle={hasCardTitle}
                          rowSelection={currentRowSelection}
                          onRowSelectionChange={setCurrentRowSelection}
                          enableRowSelection={enableRowSelection}
                          editingRowId={editingRowId}
                          onEditingRowIdChange={setEditingRowId}
                          getRowClassName={getRowClassName}
                          onRowClick={onRowClick}
                          getRowDraggable={dragAndDrop?.getRowDraggable}
                          onRowDragStart={dragAndDrop?.onRowDragStart}
                          onRowDragEnd={dragAndDrop?.onRowDragEnd}
                          labels={resolvedLabels}
                        />
                      ) : (
                        <div className="flex min-h-0 flex-1 items-center justify-center p-4">
                          {emptyNode ?? (
                            <DataTableEmptyState
                              title={
                                localSearchValue
                                  ? resolvedLabels.noMatchingRowsTitle
                                  : resolvedLabels.noRowsTitle
                              }
                              description={
                                localSearchValue
                                  ? resolvedLabels.noMatchingRowsDescription
                                  : resolvedLabels.noRowsDescription
                              }
                            />
                          )}
                        </div>
                      )}

                      {infiniteScroll?.enabled &&
                      !shouldRenderInitialLoading ? (
                        <div className="shrink-0 px-4 pb-4">
                          <div ref={sentinelRef} className="h-4 w-full" />
                        </div>
                      ) : null}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div
                  data-dtp-slot="data-table-table-shell"
                  className={cn(
                    "box-border border-2 border-transparent transition-colors",
                    flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
                    dragAndDrop?.isDragging &&
                      (uiClassNames.dragActive ?? "rounded-md border-dashed"),
                  )}
                >
                  <div
                    ref={tableScrollContainerRef}
                    className={cn(
                      flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
                    )}
                  >
                    <ScrollArea
                      className={cn(
                        "rounded-md border",
                        flexGrow ? "min-h-0 flex-1" : "h-full",
                        uiClassNames.tableContainer,
                        uiClassNames.tableScrollArea,
                        tableContainerClassName,
                      )}
                    >
                      <div className="min-h-full">
                        <Table
                          className={cn(
                            "w-full table-fixed border-separate border-spacing-0",
                            tableClassName,
                          )}
                          style={{
                            minWidth:
                              layoutMode === "fill"
                                ? fillMinWidth || undefined
                                : undefined,
                            width:
                              layoutMode === "fit"
                                ? table.getTotalSize()
                                : "100%",
                          }}
                        >
                          <colgroup>
                            {table.getVisibleLeafColumns().map((column) => {
                              const layout = getColumnLayout(column.id);
                              return (
                                <col
                                  key={column.id}
                                  style={layout.colStyle}
                                />
                              );
                            })}
                          </colgroup>
                          <TableHeader
                            className={cn(
                              stickyHeader
                                ? (uiClassNames.tableStickyHeader ??
                                  "sticky top-0 z-30 backdrop-blur")
                                : undefined,
                            )}
                          >
                            {table.getHeaderGroups().map((headerGroup) => (
                              <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                  const layout = getColumnLayout(
                                    header.column.id,
                                  );
                                  return (
                                    <DataTableHeaderCell
                                      key={header.id}
                                      currentDensity={currentDensity}
                                      currentSorting={currentSorting}
                                      draggedColumnIdRef={draggedColumnIdRef}
                                      enableColumnReordering={
                                        enableColumnReordering
                                      }
                                      enableColumnResizing={
                                        enableColumnResizing
                                      }
                                      header={header}
                                      headerGroupHeaders={headerGroup.headers}
                                      layout={layout}
                                      primeColumnForResize={
                                        primeColumnForResize
                                      }
                                      reorderColumn={reorderColumn}
                                      resetColumnSize={resetColumnSize}
                                      TableHead={TableHead}
                                      uiClassNames={uiClassNames}
                                    />
                                  );
                                })}
                              </TableRow>
                            ))}
                          </TableHeader>
                          <TableBody>
                            {renderedRows.length ? (
                              <>
                                {virtualPaddingTop > 0 ? (
                                  <TableRow aria-hidden="true">
                                    <TableCell
                                      colSpan={Math.max(
                                        1,
                                        visibleLeafColumnCount,
                                      )}
                                      className="border-b-0 p-0"
                                      style={{ height: virtualPaddingTop }}
                                    />
                                  </TableRow>
                                ) : null}
                                {rowsToRender.map(({ row, rowIndex }) => {
                                  const originalRow = row.original;
                                  const isInitialLoadingRow =
                                    isDataTableLoadingRow(originalRow);
                                  const loadingState = isInitialLoadingRow
                                    ? { isLoading: true }
                                    : getRowLoadingState?.(
                                        originalRow,
                                        rowIndex,
                                      );
                                  const resolvedLoadingState =
                                    typeof loadingState === "boolean"
                                      ? { isLoading: loadingState }
                                      : loadingState;
                                  const isEditing = editingRowId === row.id;
                                  const isDraggable = isInitialLoadingRow
                                    ? false
                                    : (dragAndDrop?.getRowDraggable?.(
                                        originalRow,
                                      ) ?? false);

                                  return (
                                    <DataTableBodyRow
                                      key={row.id}
                                      columnLayouts={
                                        columnLayout.columnLayouts
                                      }
                                      components={bodyRowComponents}
                                      currentDensity={currentDensity}
                                      draftValues={draftValues}
                                      dragAndDrop={dragAndDrop}
                                      explicitCustomCellColumnIds={
                                        explicitCustomCellColumnIds
                                      }
                                      getRowClassName={getRowClassName}
                                      isDraggable={isDraggable}
                                      isEditing={isEditing}
                                      isExpanded={row.getIsExpanded()}
                                      isInitialLoadingRow={
                                        isInitialLoadingRow
                                      }
                                      isSelected={row.getIsSelected()}
                                      loadingState={resolvedLoadingState}
                                      onRowClick={onRowClick}
                                      originalRow={originalRow}
                                      renderExpandedRow={renderExpandedRow}
                                      row={row}
                                      rowIndex={rowIndex}
                                      setDraftValues={setDraftValues}
                                      uiClassNames={uiClassNames}
                                      visibleCells={row.getVisibleCells()}
                                      visibleLeafColumnCount={
                                        visibleLeafColumnCount
                                      }
                                    />
                                  );
                                })}
                                {virtualPaddingBottom > 0 ? (
                                  <TableRow aria-hidden="true">
                                    <TableCell
                                      colSpan={Math.max(
                                        1,
                                        visibleLeafColumnCount,
                                      )}
                                      className="border-b-0 p-0"
                                      style={{ height: virtualPaddingBottom }}
                                    />
                                  </TableRow>
                                ) : null}
                              </>
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={Math.max(1, visibleLeafColumnCount)}
                                  className="h-full grow"
                                >
                                  <div className="flex h-full min-h-full w-full grow items-center justify-center">
                                    {emptyNode ?? (
                                      <DataTableEmptyState
                                        title={
                                          localSearchValue
                                            ? resolvedLabels.noMatchingRowsTitle
                                            : resolvedLabels.noRowsTitle
                                        }
                                        description={
                                          localSearchValue
                                            ? resolvedLabels.noMatchingRowsDescription
                                            : resolvedLabels.noRowsDescription
                                        }
                                      />
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                          {summaryRows.length ? (
                            <TableFooter>
                              {summaryRows.map((summaryRow) => (
                                <TableRow key={summaryRow.key}>
                                  {visibleLeafColumns.map((column, index) => {
                                    const content =
                                      summaryRow.cells[column.id] ??
                                      (index === 0 ? summaryRow.label : null);
                                    return (
                                      <TableCell
                                        key={`${summaryRow.key}-${column.id}`}
                                        className={cn(
                                          "border-b font-medium",
                                          uiClassNames.cellBorder,
                                        )}
                                      >
                                        {typeof content === "function"
                                          ? content({
                                              rows: table
                                                .getFilteredRowModel()
                                                .rows.map((row) => row.original),
                                              columnId: column.id,
                                            })
                                          : content}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableFooter>
                          ) : null}
                        </Table>
                      </div>

                      {infiniteScroll?.enabled &&
                      renderedRows.length &&
                      !shouldRenderInitialLoading ? (
                        <div className="px-4 pb-4">
                          <div ref={sentinelRef} className="h-4 w-full" />
                        </div>
                      ) : null}
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
            {(showFooter && !infiniteScroll?.enabled) || children ? (
              <div data-dtp-slot="data-table-footer" className="shrink-0">
                {showFooter && !infiniteScroll?.enabled ? (
                  <DataTableFooter
                    pageIndex={currentPagination.pageIndex}
                    pageCount={effectivePageCount}
                    pageSize={currentPagination.pageSize}
                    totalRowCount={footerTotalRowCount}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onPageIndexChange={handleFooterPageIndexChange}
                    onPageSizeChange={handleFooterPageSizeChange}
                    labels={resolvedLabels}
                  />
                ) : null}
                {children}
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </TooltipProvider>
    );
  };
}
