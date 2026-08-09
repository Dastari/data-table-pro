import * as React from "react";
import { flushSync } from "react-dom";
import type {
  Table as TanStackTable,
} from "@tanstack/react-table";
import type {
  DataTableActionErrorContext,
  DataTableApi,
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
    columnGroupHeaderHeight,
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
    persistence,
    savedViews,
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
  }: DataTableProps<TData>) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const tableScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const draggedColumnIdRef = React.useRef<string | null>(null);
    const tableRef = React.useRef<TanStackTable<TData> | null>(null);
    const lastSelectedRowIdRef = React.useRef<string | null>(null);
    const generatedTitleId = React.useId();
    const generatedDescriptionId = React.useId();
    React.useMemo(() => validateDataTableColumnIds(columns), [columns]);
    const resolvedLabels = React.useMemo(
      () => resolveDataTableLabels(labels),
      [labels],
    );
    const resolvedToolbarQueryValue =
      toolbarQueryValue ?? unifiedState?.globalFilter;
    const resolvedSorting = sorting ?? unifiedState?.sorting;
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
      columnSizing: columnSizing !== undefined,
      columnVisibility: columnVisibility !== undefined,
      density: density !== undefined,
      expanded: expanded !== undefined,
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
      currentColumnSizing,
      currentColumnVisibility,
      currentDensity,
      currentExpanded,
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
      selectedRows,
      setCurrentColumnFilters,
      setCurrentColumnOrder,
      setCurrentColumnPinning,
      setCurrentColumnVisibility,
      setCurrentExpanded,
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
      getRowId,
      hiddenRows,
      isLoading,
      loadingRowCount,
      manualFiltering,
      initialState,
      onColumnFiltersChange: handleColumnFiltersPropChange,
      onColumnOrderChange: handleColumnOrderPropChange,
      onColumnPinningChange: handleColumnPinningPropChange,
      onColumnSizingChange: handleColumnSizingPropChange,
      onColumnVisibilityChange: handleColumnVisibilityPropChange,
      onDensityChange: handleDensityPropChange,
      onExpandedChange: handleExpandedPropChange,
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
      onError: handleEditError,
    });
    const { viewportElement: tableScrollElement, viewportHeight } =
      useDataTableScrollViewport(tableScrollContainerRef, currentViewMode);
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
      editingRowId,
      enableRowSelection,
      getRowCanExpand,
      isSavingEdit,
      labels: resolvedLabels,
      lastSelectedRowIdRef,
      renderExpandedRow,
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
      currentColumnSizing,
      currentExpanded,
      currentPagination,
      currentRowSelection,
      currentSorting,
      currentViewMode,
      defaultColumn,
      effectiveColumnVisibility,
      enableColumnResizing,
      enableRowSelection,
      getRowCanExpand,
      globalFilterFn,
      globalFilterValue,
      hasNextPage,
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnOrderChange: setCurrentColumnOrder,
      handleColumnPinningChange: setCurrentColumnPinning,
      handleColumnVisibilityChange: setCurrentColumnVisibility,
      handleExpandedChange: setCurrentExpanded,
      infiniteScroll,
      manualFiltering,
      manualPagination,
      manualSorting,
      onActionError,
      onPageIndexChange: handlePageIndexPropChange,
      onPageSizeChange: handlePageSizePropChange,
      pageCount,
      pageIndex: resolvedPageIndex,
      pageSize: resolvedPageSize,
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
      hasRowExpansion: Boolean(renderExpandedRow),
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
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnPinningChange: setCurrentColumnPinning,
      labels: resolvedLabels,
      table,
      toolbarActions,
      visibleData,
    });
    const guardedToolbarActions = React.useMemo(
      () =>
        effectiveToolbarActions.map((action) => ({
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
      [effectiveToolbarActions, runAction],
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
        columnOrder: currentColumnOrder,
        columnPinning: currentColumnPinning,
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
        currentColumnSizing,
        currentColumnVisibility,
        currentDensity,
        currentExpanded,
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
        if (nextState.columnOrder !== undefined) {
          table.setColumnOrder(nextState.columnOrder);
        }
        if (nextState.columnPinning !== undefined) {
          table.setColumnPinning(nextState.columnPinning);
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
          columnOrder: initialState?.columnOrder ?? [],
          columnPinning:
            initialState?.columnPinning ?? getInitialColumnPinning(columns),
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
      }),
      [
        applySavedView,
        clearPersistedState,
        clearSavedViews,
        createSavedView,
        deleteSavedView,
        exportCsvFromApi,
        getSavedViews,
        getCurrentState,
        renameSavedView,
        resetColumnLayout,
        resetState,
        restoreState,
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
                  onViewModeChange={handleViewModeChange}
                  openFileDialog={fileUpload ? openFileDialog : undefined}
                  selectedRows={selectedRows}
                  selectionActions={guardedSelectionActions}
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
                  currentRowSelection={currentRowSelection}
                  DataTableCardView={DataTableCardView}
                  DataTableEmptyState={DataTableEmptyState}
                  dragAndDrop={dragAndDrop}
                  editableRows={editableRows}
                  editingRowId={editingRowId}
                  emptyNode={emptyNode}
                  enableRowSelection={enableRowSelection}
                  flexGrow={flexGrow}
                  getRowClassName={getRowClassName}
                  hasCardTitle={hasCardTitle}
                  infiniteScroll={infiniteScroll}
                  localSearchValue={localSearchValue}
                  onRowClick={guardedOnRowClick}
                  renderedRows={renderedRows}
                  renderExpandedRow={renderExpandedRow}
                  resolvedLabels={resolvedLabels}
                  resolvedLoadingRowCount={resolvedLoadingRowCount}
                  rowActions={guardedRowActions}
                  ScrollArea={ScrollArea}
                  sentinelRef={sentinelRef}
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
                  currentSorting={currentSorting}
                  dir={dir}
                  DataTableEmptyState={DataTableEmptyState}
                  dragAndDrop={dragAndDrop}
                  draggedColumnIdRef={draggedColumnIdRef}
                  draftValues={draftValues}
                  editingRowId={editingRowId}
                  emptyNode={emptyNode}
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
                  renderExpandedRow={renderExpandedRow}
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
  onLegacyChange: ((value: DataTableState[K]) => void) | undefined,
  onStateChange: DataTableProps<unknown>["onStateChange"],
) {
  const handleChange = React.useCallback(
    (value: DataTableState[K]) => {
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
    columnOrder: [...state.columnOrder],
    columnPinning: {
      left: state.columnPinning.left
        ? [...state.columnPinning.left]
        : undefined,
      right: state.columnPinning.right
        ? [...state.columnPinning.right]
        : undefined,
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
