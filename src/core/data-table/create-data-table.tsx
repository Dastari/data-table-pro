import * as React from "react";
import { flushSync } from "react-dom";
import type {
  Table as TanStackTable,
} from "@tanstack/react-table";
import type {
  DataTableActionErrorContext,
  DataTableApi,
  DataTableCellSelection,
  DataTableProps,
  DataTableState,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { createDataTableCardView } from "./create-data-table-card-view";
import { createDataTableEmptyState } from "./create-data-table-empty-state";
import { createDataTablePagination } from "./create-data-table-pagination";
import { createDataTableRowActions } from "./create-data-table-row-actions";
import { createDataTableToolbar } from "./create-data-table-toolbar";
import { DataTableCardPanel as DefaultDataTableCardPanel } from "./data-table-card-panel";
import { DataTableFooterSection } from "./data-table-footer-section";
import { DataTableTablePanelRouter as DefaultDataTableTablePanel } from "./data-table-table-panel-router";
import { DataTableToolbarSection } from "./data-table-toolbar-section";
import {
  clearDataTableSavedViews,
  createDataTableSavedView,
  deleteDataTableSavedView,
  readDataTableSavedViews,
  renameDataTableSavedView,
} from "./data-table-saved-views";
import { resolveDataTableLabels } from "./data-table-labels";
import { useDataTableColumns } from "./use-data-table-columns";
import { useControllableState } from "./use-controllable-state";
import { useDataTableInstance } from "./use-data-table-instance";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";
import {
  exportDataTableCsv,
  getColumnId,
  getDataTableColumnGroupPaths,
  getDataTableLeafColumns,
  getInitialColumnPinning,
  validateDataTableColumnIds,
} from "./data-table-utils";
import { useDataTableState } from "./use-data-table-state";
import { clearDataTableColumnPrefs } from "./use-data-table-column-prefs";
import { useDataTableToolbarFeatures } from "./use-data-table-toolbar-features";
import { useColumnLayout } from "./use-column-layout";
import { useRowEditing } from "./use-row-editing";
import { useDataTableAutoPageSize } from "./use-data-table-auto-page-size";
import { useDataTablePerformanceDiagnostics } from "./use-data-table-performance-diagnostics";
import { createDataTableStateOverlay } from "./data-table-state-overlay";

type CreateDataTableOptions = {
  CardPanel?: typeof DefaultDataTableCardPanel;
  TablePanel?: typeof DefaultDataTableTablePanel;
};

export function createDataTable(ui: DataTableUiKit) {
  return createDataTableWithPanels(ui);
}

export function createDataTableWithPanels(
  ui: DataTableUiKit,
  options: CreateDataTableOptions = {},
) {
  const DataTableCardPanel =
    options.CardPanel ?? DefaultDataTableCardPanel;
  const DataTableTablePanel =
    options.TablePanel ?? DefaultDataTableTablePanel;
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
  const DataTableStateOverlay = createDataTableStateOverlay(ui);
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
    hasNextPage,
    sorting,
    onSortingChange,
    manualSorting = false,
    grouping,
    onGroupingChange,
    manualGrouping = false,
    enableGrouping = false,
    groupedColumnMode = "reorder",
    aggregationFns,
    pageIndex,
    pageSize,
    autoPageSize = false,
    onPageIndexChange,
    onPageSizeChange,
    pageCount,
    manualPagination = false,
    rowSelection,
    onRowSelectionChange,
    enableRowSelection = false,
    enableMultiRowSelection = true,
    enableSubRowSelection = true,
    getRowCanSelect,
    rowSelectionSelectAllScope = "page",
    expanded,
    onExpandedChange,
    getSubRows,
    manualExpanding = false,
    paginateExpandedRows,
    filterFromLeafRows,
    maxLeafRowFilterDepth,
    detailPanel,
    getRowCanExpand,
    renderExpandedRow,
    columnOrder,
    onColumnOrderChange,
    enableColumnReordering = false,
    columnGroupHeaderHeight,
    columnPinning,
    onColumnPinningChange,
    enableColumnPinning = false,
    rowPinning,
    onRowPinningChange,
    enableRowPinning = false,
    keepPinnedRows = true,
    toolbarActions = [],
    selectionActions = [],
    rowActions = [],
    csvExport,
    clipboard,
    enableCellSelection = false,
    cellSelection,
    defaultCellSelection,
    onCellSelectionChange,
    gridCommands,
    density,
    onDensityChange,
    enableDensityToggle = false,
    columnPrefsKey,
    persistence,
    savedViews,
    toolbarDataOperations,
    initialState,
    state: unifiedState,
    onStateChange,
    apiRef,
    labels,
    summaryRows = [],
    cardRenderer,
    cardSizing,
    cardGridClassName,
    cardClassName,
    viewMode,
    onViewModeChange,
    enableViewToggle = false,
    enablePrint = false,
    enableFullscreen = false,
    emptyState,
    stateOverlay,
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
    columnSizing,
    onColumnSizingChange,
    enableColumnResizing = false,
    columnResizeMode = "onEnd",
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
    stripedRows = false,
    getRowClassName,
    onRowClick,
    onActionError,
    dragAndDrop,
    fileUpload,
    virtualization,
    accessibility,
    interactiveGrid,
  }: DataTableProps<TData>) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const tableScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const draggedColumnIdRef = React.useRef<string | null>(null);
    const tableRef = React.useRef<TanStackTable<TData> | null>(null);
    const lastSelectedRowIdRef = React.useRef<string | null>(null);
    const [toolbarSavedViewsVersion, setToolbarSavedViewsVersion] =
      React.useState(0);
    const generatedTitleId = React.useId();
    const generatedDescriptionId = React.useId();
    useDataTablePerformanceDiagnostics({ columns, data, getRowId });
    React.useMemo(() => validateDataTableColumnIds(columns), [columns]);
    const resolvedLabels = React.useMemo(
      () => resolveDataTableLabels(labels),
      [labels],
    );
    const toolbarOperations =
      toolbarDataOperations === true
        ? { columnChooser: true, savedViews: true, resetLayout: true }
        : toolbarDataOperations === false
          ? {}
          : (toolbarDataOperations ?? {});
    const gridMode =
      accessibility?.mode === "grid" ||
      interactiveGrid === true ||
      typeof interactiveGrid === "object";
    const [currentCellSelection, setCurrentCellSelection] =
      useControllableState<DataTableCellSelection | null>({
        defaultValue: defaultCellSelection ?? null,
        onChange: onCellSelectionChange,
         value: cellSelection,
       });
    const resolvedToolbarQueryValue =
      toolbarQueryValue ?? unifiedState?.globalFilter;
    const resolvedSorting = sorting ?? unifiedState?.sorting;
    const resolvedGrouping = grouping ?? unifiedState?.grouping;
    const resolvedPageIndex =
      pageIndex ?? unifiedState?.pagination?.pageIndex;
    const resolvedPageSize = pageSize ?? unifiedState?.pagination?.pageSize;
    const resolvedRowSelection =
      rowSelection ?? unifiedState?.rowSelection;
    const resolvedColumnVisibility =
      columnVisibility ?? unifiedState?.columnVisibility;
    const resolvedColumnFilters =
      columnFilters ?? unifiedState?.columnFilters;
    const resolvedExpanded = expanded ?? unifiedState?.expanded;
    const resolvedColumnOrder =
      columnOrder ?? unifiedState?.columnOrder;
    const resolvedColumnPinning =
      columnPinning ?? unifiedState?.columnPinning;
    const resolvedRowPinning = rowPinning ?? unifiedState?.rowPinning;
    const resolvedColumnSizing =
      columnSizing ?? unifiedState?.columnSizing;
    const resolvedDensity = density ?? unifiedState?.density;
    const resolvedViewMode = viewMode ?? unifiedState?.viewMode;
    const resolvedShowHiddenRows =
      showHiddenRows ?? unifiedState?.showHiddenRows;
    const showTableHeading =
      showToolbar && (toolbarVisibility?.title ?? true);
    const titleId = showTableHeading && title ? generatedTitleId : undefined;
    const descriptionId =
      showTableHeading && description ? generatedDescriptionId : undefined;
    useDataTableStateConflictWarnings(unifiedState, {
      columnFilters: columnFilters !== undefined,
      columnOrder: columnOrder !== undefined,
      columnPinning: columnPinning !== undefined,
      rowPinning: rowPinning !== undefined,
      columnSizing: columnSizing !== undefined,
      columnVisibility: columnVisibility !== undefined,
      density: density !== undefined,
      expanded: expanded !== undefined,
      grouping: grouping !== undefined,
      globalFilter: toolbarQueryValue !== undefined,
      pagination: pageIndex !== undefined || pageSize !== undefined,
      rowSelection: rowSelection !== undefined,
      showHiddenRows: showHiddenRows !== undefined,
      sorting: sorting !== undefined,
      viewMode: viewMode !== undefined,
    });
    const handleToolbarQueryValueChange = useDataTableStateSliceChange(
      "globalFilter",
      onToolbarQueryValueChange,
      onStateChange,
    );
    const handleSortingPropChange = useDataTableStateSliceChange(
      "sorting",
      onSortingChange,
      onStateChange,
    );
    const handleGroupingPropChange = useDataTableStateSliceChange(
      "grouping",
      onGroupingChange,
      onStateChange,
    );
    const handleRowSelectionPropChange = useDataTableStateSliceChange(
      "rowSelection",
      onRowSelectionChange,
      onStateChange,
    );
    const handleColumnVisibilityPropChange = useDataTableStateSliceChange(
      "columnVisibility",
      onColumnVisibilityChange,
      onStateChange,
    );
    const handleColumnFiltersPropChange = useDataTableStateSliceChange(
      "columnFilters",
      onColumnFiltersChange,
      onStateChange,
    );
    const handleExpandedPropChange = useDataTableStateSliceChange(
      "expanded",
      onExpandedChange,
      onStateChange,
    );
    const handleColumnOrderPropChange = useDataTableStateSliceChange(
      "columnOrder",
      onColumnOrderChange,
      onStateChange,
    );
    const handleColumnPinningPropChange = useDataTableStateSliceChange(
      "columnPinning",
      onColumnPinningChange,
      onStateChange,
    );
    const handleRowPinningPropChange = useDataTableStateSliceChange(
      "rowPinning",
      onRowPinningChange,
      onStateChange,
    );
    const handleColumnSizingPropChange = useDataTableStateSliceChange(
      "columnSizing",
      onColumnSizingChange,
      onStateChange,
    );
    const handleDensityPropChange = useDataTableStateSliceChange(
      "density",
      onDensityChange,
      onStateChange,
    );
    const handleViewModePropChange = useDataTableStateSliceChange(
      "viewMode",
      onViewModeChange,
      onStateChange,
    );
    const handleShowHiddenRowsPropChange = useDataTableStateSliceChange(
      "showHiddenRows",
      onShowHiddenRowsChange,
      onStateChange,
    );
    const handlePageIndexPropChange = React.useCallback(
      (nextPageIndex: number) => {
        onPageIndexChange?.(nextPageIndex);
        onStateChange?.((current) => ({
          ...current,
          pagination: {
            pageIndex: nextPageIndex,
            pageSize:
              resolvedPageSize ?? current.pagination.pageSize,
          },
        }));
      },
      [onPageIndexChange, onStateChange, resolvedPageSize],
    );
    const handlePageSizePropChange = React.useCallback(
      (nextPageSize: number) => {
        onPageSizeChange?.(nextPageSize);
        onStateChange?.((current) => ({
          ...current,
          pagination: {
            pageIndex:
              resolvedPageIndex ?? current.pagination.pageIndex,
            pageSize: nextPageSize,
          },
        }));
      },
      [onPageSizeChange, onStateChange, resolvedPageIndex],
    );
    const runAction = React.useCallback(
      (
        context: Omit<DataTableActionErrorContext<TData>, "error">,
        action: () => void | Promise<void>,
      ) => {
        runDataTableAction(action, context, onActionError);
      },
      [onActionError],
    );
    const guardedRowActions = React.useMemo(
      () =>
        rowActions.map((action) => ({
          ...action,
          onClick: (row: TData) => {
            runAction(
              {
                actionKey: action.key,
                row,
                source: "rowAction",
              },
              () => action.onClick(row),
            );
          },
        })),
      [rowActions, runAction],
    );
    const guardedOnRowClick = React.useMemo<
      DataTableProps<TData>["onRowClick"]
    >(
      () =>
        onRowClick
          ? (context) => {
              runAction(
                {
                  row: context.row,
                  source: "rowClick",
                },
                () => onRowClick(context),
              );
            }
          : undefined,
      [onRowClick, runAction],
    );
    const handleEditError = React.useCallback(
      (error: unknown, row: TData) => {
        onActionError?.({
          error,
          row,
          source: "edit",
        });
      },
      [onActionError],
    );
    const {
      containerWidth,
      currentColumnFilters,
      currentColumnOrder,
      currentColumnPinning,
      currentRowPinning,
      currentColumnSizing,
      currentColumnVisibility,
      currentDensity,
      currentExpanded,
      currentGrouping,
      currentPagination,
      currentRowSelection,
      currentShowHiddenRows,
      currentSorting,
      currentViewMode,
      effectiveColumnVisibility,
      globalFilterValue,
      handleDensityChange,
      handleShowHiddenRowsChange,
      handleViewModeChange,
      localSearchValue,
      resolvedLoadingRowCount,
      resolvedToolbarQueryPlaceholder,
      selectedRowIds,
      selectedRows,
      setCurrentColumnFilters,
      setCurrentColumnOrder,
      setCurrentColumnPinning,
      setCurrentRowPinning,
      setCurrentColumnVisibility,
      setCurrentExpanded,
      setCurrentGrouping,
      setCurrentRowSelection,
      setCurrentSorting,
      setLocalColumnSizing,
      setLocalPagination,
      setLocalSearchValue,
      shouldRenderInitialLoading,
      tableData,
      tableGetRowId,
      visibleData,
    } = useDataTableState({
      columnFilters: resolvedColumnFilters,
      columnOrder: resolvedColumnOrder,
      columnPinning: resolvedColumnPinning,
      rowPinning: resolvedRowPinning,
      columnSizing: resolvedColumnSizing,
      columnPrefsKey,
      persistence,
      columnVisibility: resolvedColumnVisibility,
      columns,
      containerRef,
      data,
      density: resolvedDensity,
      enableRowSelection,
      enableToolbarQueryFiltering,
      expanded: resolvedExpanded,
      grouping: resolvedGrouping,
      getSubRows,
      getRowId,
      hiddenRows,
      isLoading,
      loadingRowCount,
      manualFiltering,
      initialState,
      onColumnFiltersChange: handleColumnFiltersPropChange,
      onColumnOrderChange: handleColumnOrderPropChange,
      onColumnPinningChange: handleColumnPinningPropChange,
      onRowPinningChange: handleRowPinningPropChange,
      onColumnSizingChange: handleColumnSizingPropChange,
      onColumnVisibilityChange: handleColumnVisibilityPropChange,
      onDensityChange: handleDensityPropChange,
      onExpandedChange: handleExpandedPropChange,
      onGroupingChange: handleGroupingPropChange,
      onPageIndexChange: handlePageIndexPropChange,
      onRowSelectionChange: handleRowSelectionPropChange,
      onShowHiddenRowsChange: handleShowHiddenRowsPropChange,
      onSortingChange: handleSortingPropChange,
      onToolbarQueryValueChange: handleToolbarQueryValueChange,
      onViewModeChange: handleViewModePropChange,
      pageIndex: resolvedPageIndex,
      pageSize: resolvedPageSize,
      resolvedLabels,
      rowSelection: resolvedRowSelection,
      rowsPerPageOptions,
      selectionActions,
      showHiddenRows: resolvedShowHiddenRows,
      sorting: resolvedSorting,
      toolbarQueryDebounceMs,
      toolbarQueryPlaceholder,
      toolbarQueryValue: resolvedToolbarQueryValue,
      viewMode: resolvedViewMode,
    });
    const usesLegacyDetailPanelState = Boolean(
      renderExpandedRow && !detailPanel && !getSubRows,
    );
    const resolvedDetailPanel =
      detailPanel ??
      (renderExpandedRow
        ? {
            getRowCanExpand: getSubRows ? undefined : getRowCanExpand,
            render: renderExpandedRow,
          }
        : undefined);
    const [currentDetailExpanded, setCurrentDetailExpanded] =
      useControllableState({
        defaultValue: () =>
          usesLegacyDetailPanelState ? (initialState?.expanded ?? {}) : {},
        onChange: usesLegacyDetailPanelState
          ? setCurrentExpanded
          : resolvedDetailPanel?.onExpandedChange,
        value: usesLegacyDetailPanelState
          ? currentExpanded
          : resolvedDetailPanel?.expanded,
      });
    const {
      cancelEditing,
      clearEditError,
      draftValues,
      editErrors,
      editingRowId,
      isEditDirty,
      isSavingEdit,
      saveEdit,
      setDraftValues,
      setEditingRowId,
      startEditingRow,
    } = useRowEditing({
      columns,
      editableRows,
      onError: handleEditError,
    });
    const rowEditingContext = React.useMemo(
      () => ({
        cancel: cancelEditing,
        cancelOnEscape: editableRows?.cancelOnEscape !== false,
        clearError: clearEditError,
        commit: (row: TData) => {
          void saveEdit(row);
        },
        commitOnEnter: editableRows?.commitOnEnter !== false,
        errors: editErrors,
        isDirty: isEditDirty,
        isPending: isSavingEdit,
      }),
      [
        cancelEditing,
        clearEditError,
        editableRows?.cancelOnEscape,
        editableRows?.commitOnEnter,
        editErrors,
        isEditDirty,
        isSavingEdit,
        saveEdit,
      ],
    );
    const { viewportElement: tableScrollElement, viewportHeight } =
      useDataTableScrollViewport(tableScrollContainerRef, currentViewMode);
    const autoPageSizeConfig =
      typeof autoPageSize === "object" ? autoPageSize : undefined;
    const handleAutoPageSizeChange = React.useCallback(
      (nextPageSize: number) => {
        if (nextPageSize === currentPagination.pageSize) {
          return;
        }
        if (currentPagination.pageIndex !== 0) {
          handlePageIndexPropChange(0);
        }
        handlePageSizePropChange(nextPageSize);
        if (resolvedPageSize === undefined) {
          setLocalPagination({ pageIndex: 0, pageSize: nextPageSize });
        }
      },
      [
        currentPagination.pageIndex,
        currentPagination.pageSize,
        handlePageIndexPropChange,
        handlePageSizePropChange,
        resolvedPageSize,
        setLocalPagination,
      ],
    );
    useDataTableAutoPageSize({
      config: autoPageSizeConfig,
      currentPageSize: currentPagination.pageSize,
      enabled: autoPageSize === true || autoPageSizeConfig !== undefined,
      onPageSizeChange: handleAutoPageSizeChange,
      viewportElement: tableScrollElement,
      viewportHeight,
    });
    const print = React.useCallback(() => {
      if (typeof window === "undefined" || typeof window.print !== "function") {
        return false;
      }
      window.print();
      return true;
    }, []);
    const toggleFullscreen = React.useCallback(async () => {
      const element = containerRef.current;
      if (!element || typeof document === "undefined") {
        return false;
      }
      if (document.fullscreenElement) {
        if (typeof document.exitFullscreen !== "function") return false;
        await document.exitFullscreen();
        return true;
      }
      if (typeof element.requestFullscreen !== "function") return false;
      await element.requestFullscreen();
      return true;
    }, []);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    React.useEffect(() => {
      if (!enableFullscreen || typeof document === "undefined") return;
      const update = () => {
        setIsFullscreen(document.fullscreenElement === containerRef.current);
      };
      update();
      document.addEventListener("fullscreenchange", update);
      return () => document.removeEventListener("fullscreenchange", update);
    }, [enableFullscreen]);
    const openFileDialog = React.useCallback(() => {
      if (fileUpload?.disabled) {
        return;
      }

      fileInputRef.current?.click();
    }, [fileUpload?.disabled]);
    const handleSelectedFiles = React.useCallback(
      (files: FileList | Array<File>) => {
        runAction(
          {
            source: "fileUpload",
          },
          () => fileUpload?.onFilesSelected(files),
        );
      },
      [fileUpload, runAction],
    );

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
      editErrors,
      editingRowId,
      enableRowSelection,
      enableRowPinning,
      hasTreeExpansion: Boolean(getSubRows),
      isSavingEdit,
      isEditDirty,
      labels: resolvedLabels,
      lastSelectedRowIdRef,
      detailPanel: resolvedDetailPanel,
      detailExpanded: currentDetailExpanded,
      onDetailExpandedChange: setCurrentDetailExpanded,
      rowSelectionSelectAllScope,
      rowActions: guardedRowActions,
      saveEdit,
      startEditingRow,
      tableRef,
    });
    const columnGroupPaths = React.useMemo(
      () => getDataTableColumnGroupPaths(columns),
      [columns],
    );

    const {
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
      virtualPaddingBottom,
      virtualPaddingTop,
      visibleLeafColumns,
    } = useDataTableInstance({
      autoResetPageIndex: false,
      columnGroupPaths,
      columnResizeMode,
      dir,
      currentColumnFilters,
      currentColumnOrder,
      currentColumnPinning,
      currentRowPinning,
      currentColumnSizing,
      currentExpanded,
      currentGrouping,
      currentPagination,
      currentRowSelection,
      currentSorting,
      currentViewMode,
      defaultColumn,
      effectiveColumnVisibility,
      enableColumnResizing,
      enableRowPinning,
      enableRowSelection,
      enableMultiRowSelection,
      enableSubRowSelection,
      getRowCanSelect,
      getRowCanExpand,
      getSubRows,
      aggregationFns,
      groupedColumnMode,
      globalFilterFn,
      globalFilterValue,
      hasNextPage,
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnOrderChange: setCurrentColumnOrder,
      handleColumnPinningChange: setCurrentColumnPinning,
      handleRowPinningChange: setCurrentRowPinning,
      handleColumnVisibilityChange: setCurrentColumnVisibility,
      handleExpandedChange: setCurrentExpanded,
      handleGroupingChange: setCurrentGrouping,
      infiniteScroll,
      keepPinnedRows,
      manualFiltering,
      manualGrouping,
      manualExpanding,
      manualPagination,
      manualSorting,
      onActionError,
      onPageIndexChange: handlePageIndexPropChange,
      onPageSizeChange: handlePageSizePropChange,
      pageCount,
      pageIndex: resolvedPageIndex,
      pageSize: resolvedPageSize,
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
      tableScrollElement,
      totalRowCount,
      virtualization,
      viewportHeight,
    });
    const columnLayout = useColumnLayout({
      columns,
      columnSizing: currentColumnSizing,
      editableRows: Boolean(editableRows),
      enableRowSelection,
      hasRowActions: rowActions.length > 0,
      hasRowExpansion: Boolean(getSubRows || resolvedDetailPanel),
      layoutMode,
      uiClassNames,
      visibleLeafColumns,
    });
    const { explicitlySizedColumnIds, fillMinWidth, getColumnLayout } =
      columnLayout;
    const explicitCustomCellColumnIds = React.useMemo(() => {
      return new Set(
        getDataTableLeafColumns(columns).flatMap(({ column, index }) => {
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
      () =>
        getDataTableLeafColumns(columns).some(
          ({ column }) => column.meta?.cardTitle,
        ),
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

    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const configuredEmptyState = stateOverlay?.empty ?? emptyState;
    const emptyNode =
      typeof configuredEmptyState === "function"
      ? configuredEmptyState({
          rows: filteredData,
          toolbarQueryValue: localSearchValue,
        })
        : configuredEmptyState;
    const guardedStateOverlay = React.useMemo(
      () =>
        stateOverlay
          ? {
              ...stateOverlay,
              onRetry: stateOverlay.onRetry
                ? () =>
                    runAction(
                      { source: "retry" },
                      stateOverlay.onRetry!,
                    )
                : undefined,
            }
          : undefined,
      [runAction, stateOverlay],
    );
    const stateOverlayNode = guardedStateOverlay ? (
      <DataTableStateOverlay
        labels={resolvedLabels}
        overlay={guardedStateOverlay}
        rows={filteredData}
        toolbarQueryValue={localSearchValue}
      />
    ) : undefined;
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
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnPinningChange: setCurrentColumnPinning,
      labels: resolvedLabels,
      table,
      toolbarActions,
      visibleData,
    });
    const guardedToolbarActions = React.useMemo(
      () =>
        [
          ...effectiveToolbarActions,
          ...(enablePrint
            ? [
                {
                  key: "__print__",
                  label: resolvedLabels.print,
                  placement: "trailing" as const,
                  onClick: () => {
                    print();
                  },
                },
              ]
            : []),
          ...(enableFullscreen
            ? [
                {
                  key: "__fullscreen__",
                  label: isFullscreen
                    ? resolvedLabels.exitFullscreen
                    : resolvedLabels.enterFullscreen,
                  placement: "trailing" as const,
                  onClick: () => toggleFullscreen(),
                },
              ]
            : []),
        ].map((action) => ({
          ...action,
          onClick: (context: {
            rows: Array<TData>;
            openFileDialog?: () => void;
          }) => {
            runAction(
              {
                actionKey: action.key,
                source: "toolbarAction",
              },
              () => action.onClick(context),
            );
          },
        })),
      [
        effectiveToolbarActions,
        enableFullscreen,
        enablePrint,
        isFullscreen,
        print,
        resolvedLabels.enterFullscreen,
        resolvedLabels.exitFullscreen,
        resolvedLabels.print,
        runAction,
        toggleFullscreen,
      ],
    );
    const guardedSelectionActions = React.useMemo(
      () =>
        selectionActions.map((action) => ({
          ...action,
          onClick: (context: Parameters<typeof action.onClick>[0]) => {
            runAction(
              {
                actionKey: action.key,
                source: "selectionAction",
              },
              () => action.onClick(context),
            );
          },
        })),
      [runAction, selectionActions],
    );
    const currentDataTableState = React.useMemo<DataTableState>(
      () => ({
        sorting: currentSorting,
        pagination: currentPagination,
        rowSelection: currentRowSelection,
        columnVisibility: currentColumnVisibility,
        columnFilters: currentColumnFilters,
        expanded: currentExpanded,
        grouping: currentGrouping,
        columnOrder: currentColumnOrder,
        columnPinning: currentColumnPinning,
        rowPinning: currentRowPinning,
        columnSizing: currentColumnSizing,
        density: currentDensity,
        viewMode: currentViewMode,
        showHiddenRows: currentShowHiddenRows,
        globalFilter: localSearchValue,
      }),
      [
        currentColumnFilters,
        currentColumnOrder,
        currentColumnPinning,
        currentRowPinning,
        currentColumnSizing,
        currentColumnVisibility,
        currentDensity,
        currentExpanded,
        currentGrouping,
        currentPagination,
        currentRowSelection,
        currentShowHiddenRows,
        currentSorting,
        currentViewMode,
        localSearchValue,
      ],
    );
    const getCurrentState = React.useCallback(
      () => cloneDataTableState(currentDataTableState),
      [currentDataTableState],
    );
    const restoreState = React.useCallback(
      (nextState: Partial<DataTableState>) => {
        if (nextState.sorting !== undefined) {
          table.setSorting(nextState.sorting);
        }
        if (nextState.pagination !== undefined) {
          table.setPagination(nextState.pagination);
        }
        if (nextState.rowSelection !== undefined) {
          table.setRowSelection(nextState.rowSelection);
        }
        if (nextState.columnVisibility !== undefined) {
          table.setColumnVisibility(nextState.columnVisibility);
        }
        if (nextState.columnFilters !== undefined) {
          table.setColumnFilters(nextState.columnFilters);
        }
        if (nextState.expanded !== undefined) {
          table.setExpanded(nextState.expanded);
        }
        if (nextState.grouping !== undefined) {
          table.setGrouping(nextState.grouping);
        }
        if (nextState.columnOrder !== undefined) {
          table.setColumnOrder(nextState.columnOrder);
        }
        if (nextState.columnPinning !== undefined) {
          table.setColumnPinning(nextState.columnPinning);
        }
        if (nextState.rowPinning !== undefined) {
          table.setRowPinning(nextState.rowPinning);
        }
        if (nextState.columnSizing !== undefined) {
          table.setColumnSizing(nextState.columnSizing);
        }
        if (nextState.density !== undefined) {
          handleDensityChange(nextState.density);
        }
        if (nextState.viewMode !== undefined) {
          handleViewModeChange(nextState.viewMode);
        }
        if (nextState.showHiddenRows !== undefined) {
          handleShowHiddenRowsChange(nextState.showHiddenRows);
        }
        if (nextState.globalFilter !== undefined) {
          setLocalSearchValue(nextState.globalFilter);
        }
      },
      [
        handleDensityChange,
        handleShowHiddenRowsChange,
        handleViewModeChange,
        setLocalSearchValue,
        table,
      ],
    );
    const clearPersistedState = React.useCallback(
      () => clearDataTableColumnPrefs(persistence ?? columnPrefsKey),
      [columnPrefsKey, persistence],
    );
    const resetColumnLayout = React.useCallback<
      DataTableApi<TData>["resetColumnLayout"]
    >(
      (options) => {
        if (options?.clearPersistence) {
          clearPersistedState();
        }
        restoreState({
          columnVisibility: initialState?.columnVisibility ?? {},
          columnOrder: initialState?.columnOrder ?? [],
          columnPinning:
            initialState?.columnPinning ?? getInitialColumnPinning(columns),
          rowPinning: initialState?.rowPinning ?? { top: [], bottom: [] },
          columnSizing: initialState?.columnSizing ?? {},
        });
      },
      [
        clearPersistedState,
        columns,
        initialState,
        restoreState,
      ],
    );
    const resetState = React.useCallback<DataTableApi<TData>["resetState"]>(
      (options) => {
        if (options?.clearPersistence) {
          clearPersistedState();
        }
        restoreState({
          sorting: initialState?.sorting ?? [],
          pagination: initialState?.pagination ?? {
            pageIndex: 0,
            pageSize: rowsPerPageOptions[0] ?? 20,
          },
          rowSelection: initialState?.rowSelection ?? {},
          columnVisibility: initialState?.columnVisibility ?? {},
          columnFilters: initialState?.columnFilters ?? [],
          expanded: initialState?.expanded ?? {},
          grouping: initialState?.grouping ?? [],
          columnOrder: initialState?.columnOrder ?? [],
          columnPinning:
            initialState?.columnPinning ?? getInitialColumnPinning(columns),
          rowPinning: initialState?.rowPinning ?? { top: [], bottom: [] },
          columnSizing: initialState?.columnSizing ?? {},
          density: initialState?.density ?? "comfortable",
          viewMode: initialState?.viewMode ?? "table",
          showHiddenRows: initialState?.showHiddenRows ?? false,
          globalFilter: initialState?.globalFilter ?? "",
        });
      },
      [
        clearPersistedState,
        columns,
        initialState,
        restoreState,
        rowsPerPageOptions,
      ],
    );
    const getSavedViews = React.useCallback(
      () => readDataTableSavedViews(savedViews),
      [savedViews],
    );
    const createSavedView = React.useCallback<
      DataTableApi<TData>["createSavedView"]
    >(
      (name) =>
        createDataTableSavedView(savedViews, name, getCurrentState()),
      [getCurrentState, savedViews],
    );
    const applySavedView = React.useCallback<
      DataTableApi<TData>["applySavedView"]
    >(
      (id) => {
        const view = readDataTableSavedViews(savedViews).find(
          (candidate) => candidate.id === id,
        );
        if (!view) {
          return false;
        }
        restoreState(view.state);
        savedViews?.onApply?.(view);
        return true;
      },
      [restoreState, savedViews],
    );
    const renameSavedView = React.useCallback<
      DataTableApi<TData>["renameSavedView"]
    >(
      (id, name) => renameDataTableSavedView(savedViews, id, name),
      [savedViews],
    );
    const deleteSavedView = React.useCallback<
      DataTableApi<TData>["deleteSavedView"]
    >(
      (id) => deleteDataTableSavedView(savedViews, id),
      [savedViews],
    );
    const clearSavedViews = React.useCallback(
      () => clearDataTableSavedViews(savedViews),
      [savedViews],
    );
    const toolbarSavedViews = React.useMemo(() => {
      void toolbarSavedViewsVersion;
      return readDataTableSavedViews(savedViews);
    }, [savedViews, toolbarSavedViewsVersion]);
    const handleToolbarCreateSavedView = React.useCallback(
      (name: string) => {
        const view = createSavedView(name);
        if (view) {
          setToolbarSavedViewsVersion((current) => current + 1);
        }
        return view;
      },
      [createSavedView],
    );
    const handleToolbarRenameSavedView = React.useCallback(
      (id: string, name: string) => {
        const view = renameSavedView(id, name);
        if (view) {
          setToolbarSavedViewsVersion((current) => current + 1);
        }
        return view;
      },
      [renameSavedView],
    );
    const handleToolbarDeleteSavedView = React.useCallback(
      (id: string) => {
        const deleted = deleteSavedView(id);
        if (deleted) {
          setToolbarSavedViewsVersion((current) => current + 1);
        }
        return deleted;
      },
      [deleteSavedView],
    );
    const exportCsvFromApi = React.useCallback<
      DataTableApi<TData>["exportCsv"]
    >(
      (options) =>
        exportDataTableCsv({
          csvExport: options ?? (csvExport || true),
          labels: resolvedLabels,
          table,
        }),
      [csvExport, resolvedLabels, table],
    );
    const copyToClipboard = React.useCallback<
      DataTableApi<TData>["copyToClipboard"]
    >(
      async (options) => {
        const { copyDataTableToClipboard } = await import(
          "./data-table-clipboard"
        );
        return copyDataTableToClipboard({
          clipboard:
            options ??
            (clipboard?.copy === false
              ? false
              : currentCellSelection
                ? {
                    ...(clipboard?.copy === true ? {} : clipboard?.copy),
                    scope: "cellSelection",
                  }
                : clipboard?.copy ?? true),
          cellSelection: currentCellSelection,
          table,
        });
      },
      [clipboard?.copy, currentCellSelection, table],
    );
    const pinRow = React.useCallback<DataTableApi<TData>["pinRow"]>(
      (rowId, position = "top") => {
        try {
          const row = table.getRow(rowId, true);
          if (!row.getCanPin()) {
            return false;
          }
          row.pin(position);
          return true;
        } catch {
          return false;
        }
      },
      [table],
    );
    const unpinRow = React.useCallback<DataTableApi<TData>["unpinRow"]>(
      (rowId) => {
        try {
          const row = table.getRow(rowId, true);
          if (!row.getCanPin()) {
            return false;
          }
          row.pin(false);
          return true;
        } catch {
          return false;
        }
      },
      [table],
    );
    React.useImperativeHandle(
      apiRef,
      () => ({
        getTable: () => tableRef.current,
        getState: getCurrentState,
        snapshot: getCurrentState,
        restore: restoreState,
        resetColumnLayout,
        resetState,
        clearPersistedState,
        getSavedViews,
        createSavedView,
        applySavedView,
        renameSavedView,
        deleteSavedView,
        clearSavedViews,
        pinRow,
        unpinRow,
        focus: () => {
          containerRef.current?.focus();
        },
        scrollToRow: (rowId) =>
          scrollDataTableElementIntoView(containerRef.current, "row", rowId),
        scrollToColumn: (columnId) =>
          scrollDataTableElementIntoView(
            containerRef.current,
            "column",
            columnId,
          ),
        exportCsv: exportCsvFromApi,
        copyToClipboard,
        getCellSelection: () => currentCellSelection,
        setCellSelection: setCurrentCellSelection,
        clearCellSelection: () => setCurrentCellSelection(null),
        print,
        toggleFullscreen,
      }),
      [
        applySavedView,
        clearPersistedState,
        clearSavedViews,
        copyToClipboard,
        currentCellSelection,
        createSavedView,
        deleteSavedView,
        exportCsvFromApi,
        getSavedViews,
        getCurrentState,
        renameSavedView,
        resetColumnLayout,
        resetState,
        restoreState,
        pinRow,
        print,
        setCurrentCellSelection,
        unpinRow,
        toggleFullscreen,
      ],
    );

    return (
      <TooltipProvider>
        <div
          ref={containerRef}
          data-dtp-slot="data-table-root"
          data-density={currentDensity}
          data-dtp-striped-rows={stripedRows || undefined}
          aria-busy={isLoading || undefined}
          dir={dir}
          tabIndex={-1}
          className={cn(
            "@container/data-table data-table-container-query flex w-full min-w-0 flex-col",
            flexGrow ? "h-full min-h-0 flex-1" : "grow",
            rootClassName,
          )}
          onDragEnter={dragAndDrop?.onDragEnter}
          onDragOver={dragAndDrop?.onDragOver}
          onDragLeave={dragAndDrop?.onDragLeave}
          onDrop={dragAndDrop?.onDrop}
          onKeyDown={(event) => {
            if (
              gridMode &&
              gridCommands &&
              (event.ctrlKey || event.metaKey) &&
              event.key.toLowerCase() === "z" &&
              !isDataTableEditableClipboardTarget(event.target)
            ) {
              const command = event.shiftKey ? gridCommands.redo : gridCommands.undo;
              if (command) {
                event.preventDefault();
                runAction(
                  { source: event.shiftKey ? "redo" : "undo" },
                  () => command({ cellSelection: currentCellSelection, table }),
                );
              }
              return;
            }
            if (
              !clipboard?.copy ||
              !(event.ctrlKey || event.metaKey) ||
              event.key.toLowerCase() !== "c" ||
              isDataTableEditableClipboardTarget(event.target)
            ) {
              return;
            }
            event.preventDefault();
            runAction(
              { source: "clipboardCopy" },
              async () => {
                await copyToClipboard(
                  clipboard.copy === true
                    ? undefined
                    : currentCellSelection &&
                        typeof clipboard.copy === "object" &&
                        !clipboard.copy.scope
                      ? { ...clipboard.copy, scope: "cellSelection" }
                      : clipboard.copy,
                );
              },
            );
          }}
          onPaste={(event) => {
            const paste = clipboard?.paste;
            if (
              !paste ||
              paste.enabled === false ||
              isDataTableEditableClipboardTarget(event.target)
            ) {
              return;
            }
            const text = event.clipboardData.getData("text/plain");
            if (!text) {
              return;
            }
            if (paste.preventDefault ?? true) {
              event.preventDefault();
            }
            runAction(
              { source: "clipboardPaste" },
              async () => {
                const { parseDataTableClipboardText } = await import(
                  "./data-table-clipboard"
                );
                return paste.onPaste({
                  table,
                  text,
                  values: parseDataTableClipboardText(text),
                });
              },
            );
          }}
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
                  handleSelectedFiles(files);
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
                <DataTableToolbarSection
                  allRows={filteredData}
                  columnFilters={toolbarColumnFilters}
                  columnVisibilityOptions={columnVisibilityOptions}
                  compactToolbar={compactToolbar}
                  customToolbar={customToolbar}
                  DataTableToolbar={DataTableToolbar}
                  density={currentDensity}
                  description={description}
                  descriptionId={descriptionId}
                  effectiveToolbarActions={guardedToolbarActions}
                  enableColumnPinning={enableColumnPinning}
                  enableGrouping={enableGrouping}
                  enableToolbarColumnChooser={toolbarOperations.columnChooser === true}
                  enableToolbarFilterChips={Boolean(toolbarDataOperations)}
                  enableToolbarResetLayout={toolbarOperations.resetLayout === true}
                  enableToolbarSavedViews={
                    toolbarOperations.savedViews === true && Boolean(savedViews)
                  }
                  enableDensityToggle={enableDensityToggle}
                  enableViewToggle={enableViewToggle && Boolean(cardRenderer)}
                  hiddenRowsLabel={hiddenRows?.label}
                  labels={resolvedLabels}
                  onClearColumnFilters={handleClearColumnFilters}
                  onColumnFilterChange={handleToolbarColumnFilterChange}
                  onColumnPinningChange={handleToolbarColumnPinningChange}
                  onDensityChange={handleDensityChange}
                  onShowHiddenRowsChange={handleShowHiddenRowsChange}
                  onToolbarQueryValueChange={setLocalSearchValue}
                  reorderColumn={reorderColumn}
                  onResetColumnLayout={resetColumnLayout}
                  onCreateSavedView={handleToolbarCreateSavedView}
                  onApplySavedView={applySavedView}
                  onRenameSavedView={handleToolbarRenameSavedView}
                  onDeleteSavedView={handleToolbarDeleteSavedView}
                  onViewModeChange={handleViewModeChange}
                  openFileDialog={fileUpload ? openFileDialog : undefined}
                  selectedRowIds={selectedRowIds}
                  selectedRows={selectedRows}
                  selectionActions={guardedSelectionActions}
                  savedViews={toolbarSavedViews}
                  showHiddenRows={currentShowHiddenRows}
                  table={table}
                  title={title}
                  titleId={titleId}
                  toolbarQueryPlaceholder={resolvedToolbarQueryPlaceholder}
                  toolbarQueryValue={localSearchValue}
                  toolbarVisibility={toolbarVisibility}
                  viewMode={currentViewMode}
                />
              ) : null}

            <div
              data-dtp-slot="data-table-content"
              className={cn(flexGrow ? "flex min-h-0 flex-1 flex-col" : "")}
            >
              {currentViewMode === "card" && cardRenderer ? (
                <DataTableCardPanel
                  cardClassName={cardClassName}
                  cardGridClassName={cardGridClassName}
                  cardSizing={cardSizing}
                  cardRenderer={cardRenderer}
                  containerWidth={containerWidth}
                  currentDetailExpanded={currentDetailExpanded}
                  currentRowSelection={currentRowSelection}
                  DataTableCardView={DataTableCardView}
                  DataTableEmptyState={DataTableEmptyState}
                  dragAndDrop={dragAndDrop}
                  editableRows={editableRows}
                  editingRowId={editingRowId}
                  emptyNode={emptyNode}
                  stateOverlayNode={stateOverlayNode}
                  enableRowSelection={enableRowSelection}
                  flexGrow={flexGrow}
                  getRowClassName={getRowClassName}
                  hasCardTitle={hasCardTitle}
                  infiniteScroll={infiniteScroll}
                  localSearchValue={localSearchValue}
                  onRowClick={guardedOnRowClick}
                  renderedRows={renderedRows}
                  detailPanel={resolvedDetailPanel}
                  resolvedLabels={resolvedLabels}
                  resolvedLoadingRowCount={resolvedLoadingRowCount}
                  rowActions={guardedRowActions}
                  ScrollArea={ScrollArea}
                  sentinelRef={sentinelRef}
                  setCurrentDetailExpanded={setCurrentDetailExpanded}
                  setCurrentRowSelection={setCurrentRowSelection}
                  setEditingRowId={setEditingRowId}
                  shouldRenderInitialLoading={shouldRenderInitialLoading}
                  tableContainerClassName={tableContainerClassName}
                  uiClassNames={uiClassNames}
                  virtualization={virtualization}
                />
              ) : (
                <DataTableTablePanel
                  ariaDescribedBy={descriptionId}
                  ariaLabelledBy={titleId}
                  bodyRowComponents={bodyRowComponents}
                  columnLayouts={columnLayout.columnLayouts}
                  currentDensity={currentDensity}
                  columnGroupHeaderHeight={columnGroupHeaderHeight}
                  currentDetailExpanded={currentDetailExpanded}
                  currentSorting={currentSorting}
                  dir={dir}
                  DataTableEmptyState={DataTableEmptyState}
                  dragAndDrop={dragAndDrop}
                  draggedColumnIdRef={draggedColumnIdRef}
                  draftValues={draftValues}
                  editingRowId={editingRowId}
                  editingContext={rowEditingContext}
                  emptyNode={emptyNode}
                  stateOverlayNode={stateOverlayNode}
                  enableColumnReordering={enableColumnReordering}
                  enableColumnResizing={enableColumnResizing}
                  explicitCustomCellColumnIds={explicitCustomCellColumnIds}
                  fillMinWidth={fillMinWidth}
                  flexGrow={flexGrow}
                  getColumnLayout={getColumnLayout}
                  getRowClassName={getRowClassName}
                  getRowLoadingState={getRowLoadingState}
                  infiniteScroll={infiniteScroll}
                  layoutMode={layoutMode}
                  localSearchValue={localSearchValue}
                  onRowClick={guardedOnRowClick}
                  primeColumnForResize={primeColumnForResize}
                  renderedRows={renderedRows}
                  detailPanel={resolvedDetailPanel}
                  topPinnedRows={topPinnedRows}
                  bottomPinnedRows={bottomPinnedRows}
                  reorderColumn={reorderColumn}
                  resetColumnSize={resetColumnSize}
                  resolvedLabels={resolvedLabels}
                  rowsToRender={rowsToRender}
                  ScrollArea={ScrollArea}
                  ScrollBar={ScrollBar}
                  sentinelRef={sentinelRef}
                  setDraftValues={setDraftValues}
                  shouldRenderInitialLoading={shouldRenderInitialLoading}
                  stickyHeader={stickyHeader}
                  stripedRows={stripedRows}
                  summaryRows={summaryRows}
                  table={table}
                  tableClassName={tableClassName}
                  tableContainerClassName={tableContainerClassName}
                  Table={Table}
                  TableBody={TableBody}
                  TableCell={TableCell}
                  TableFooter={TableFooter}
                  TableHead={TableHead}
                  TableHeader={TableHeader}
                  TableRow={TableRow}
                  tableScrollContainerRef={tableScrollContainerRef}
                  tableScrollElement={tableScrollElement}
                  uiClassNames={uiClassNames}
                  viewportHeight={viewportHeight}
                  virtualization={virtualization}
                  gridMode={gridMode}
                  gridPageSize={
                    accessibility?.pageSize ??
                    (typeof interactiveGrid === "object"
                      ? interactiveGrid.pageSize
                      : undefined)
                  }
                  cellSelectionEnabled={
                    gridMode &&
                    (enableCellSelection ||
                    cellSelection !== undefined ||
                    defaultCellSelection !== undefined)
                  }
                  cellSelection={currentCellSelection}
                  onCellSelectionChange={setCurrentCellSelection}
                  gridRowOffset={
                    manualPagination
                      ? currentPagination.pageIndex * currentPagination.pageSize
                      : 0
                  }
                  totalRowCount={totalRowCount}
                  virtualPaddingBottom={virtualPaddingBottom}
                  virtualPaddingTop={virtualPaddingTop}
                  visibleLeafColumnCount={visibleLeafColumnCount}
                  visibleLeafColumns={visibleLeafColumns}
                />
              )}
            </div>
            <DataTableFooterSection
              currentPagination={currentPagination}
              DataTableFooter={DataTableFooter}
              effectivePageCount={effectivePageCount}
              footerTotalRowCount={footerTotalRowCount}
              handleFooterPageIndexChange={handleFooterPageIndexChange}
              handleFooterPageSizeChange={handleFooterPageSizeChange}
              labels={resolvedLabels}
              pageCountKnown={isPageCountKnown}
              rowsPerPageOptions={rowsPerPageOptions}
              showFooter={showFooter && !infiniteScroll?.enabled}
            >
              {children}
            </DataTableFooterSection>
          </div>
        </div>
        </div>
      </TooltipProvider>
    );
  };
}

function runDataTableAction<TData>(
  action: () => void | Promise<void>,
  context: Omit<DataTableActionErrorContext<TData>, "error">,
  onActionError: DataTableProps<TData>["onActionError"],
) {
  let result: void | Promise<void>;
  try {
    result = action();
  } catch (error) {
    onActionError?.({ ...context, error });
    return;
  }

  void Promise.resolve(result).catch((error: unknown) => {
    onActionError?.({ ...context, error });
  });
}

function useDataTableStateSliceChange<K extends keyof DataTableState>(
  key: K,
  onLegacyChange:
    | ((value: Exclude<DataTableState[K], undefined>) => void)
    | undefined,
  onStateChange: DataTableProps<unknown>["onStateChange"],
) {
  const handleChange = React.useCallback(
    (value: Exclude<DataTableState[K], undefined>) => {
      onLegacyChange?.(value);
      onStateChange?.((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [key, onLegacyChange, onStateChange],
  );

  return onLegacyChange || onStateChange ? handleChange : undefined;
}

function useDataTableStateConflictWarnings(
  state: Partial<DataTableState> | undefined,
  legacySlices: Record<keyof DataTableState, boolean>,
) {
  const warnedSlicesRef = React.useRef(new Set<keyof DataTableState>());

  React.useEffect(() => {
    if (!state || !isDevelopmentEnvironment()) {
      return;
    }

    for (const key of Object.keys(legacySlices) as Array<
      keyof DataTableState
    >) {
      if (
        state[key] === undefined ||
        !legacySlices[key] ||
        warnedSlicesRef.current.has(key)
      ) {
        continue;
      }

      warnedSlicesRef.current.add(key);
      console.warn(
        `[data-table-pro] Both state.${key} and its legacy controlled prop were provided. The legacy prop takes precedence during the 4.x compatibility window.`,
      );
    }
  }, [legacySlices, state]);
}

function isDevelopmentEnvironment() {
  const nodeEnvironment = (
    globalThis as {
      process?: { env?: { NODE_ENV?: string } };
    }
  ).process?.env?.NODE_ENV;

  return nodeEnvironment !== "production";
}

function cloneDataTableState(state: DataTableState): DataTableState {
  return {
    sorting: state.sorting.map((item) => ({ ...item })),
    pagination: { ...state.pagination },
    rowSelection: { ...state.rowSelection },
    columnVisibility: { ...state.columnVisibility },
    columnFilters: state.columnFilters.map((item) => ({ ...item })),
    expanded:
      typeof state.expanded === "boolean"
        ? state.expanded
        : { ...state.expanded },
    grouping: [...(state.grouping ?? [])],
    columnOrder: [...state.columnOrder],
    columnPinning: {
      left: state.columnPinning.left
        ? [...state.columnPinning.left]
        : undefined,
      right: state.columnPinning.right
        ? [...state.columnPinning.right]
        : undefined,
    },
    rowPinning: {
      top: state.rowPinning.top ? [...state.rowPinning.top] : undefined,
      bottom: state.rowPinning.bottom ? [...state.rowPinning.bottom] : undefined,
    },
    columnSizing: { ...state.columnSizing },
    density: state.density,
    viewMode: state.viewMode,
    showHiddenRows: state.showHiddenRows,
    globalFilter: state.globalFilter,
  };
}

function scrollDataTableElementIntoView(
  container: HTMLDivElement | null,
  kind: "row" | "column",
  value: string,
) {
  if (!container) {
    return false;
  }

  const attribute = kind === "row" ? "data-row-id" : "data-column-id";
  const element = Array.from(
    container.querySelectorAll<HTMLElement>(`[${attribute}]`),
  ).find((candidate) => candidate.getAttribute(attribute) === value);
  if (!element) {
    return false;
  }

  element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  return true;
}

function isDataTableEditableClipboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}
