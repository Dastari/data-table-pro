import * as React from "react";
import { flushSync } from "react-dom";
import type {
  Table as TanStackTable,
} from "@tanstack/react-table";
import type {
  DataTableActionErrorContext,
  DataTableProps,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { createDataTableCardView } from "./create-data-table-card-view";
import { createDataTableEmptyState } from "./create-data-table-empty-state";
import { createDataTablePagination } from "./create-data-table-pagination";
import { createDataTableRowActions } from "./create-data-table-row-actions";
import { createDataTableToolbar } from "./create-data-table-toolbar";
import { DataTableCardPanel } from "./data-table-card-panel";
import { DataTableFooterSection } from "./data-table-footer-section";
import { DataTableTablePanel } from "./data-table-table-panel";
import { DataTableToolbarSection } from "./data-table-toolbar-section";
import { resolveDataTableLabels } from "./data-table-labels";
import { useDataTableColumns } from "./use-data-table-columns";
import { useDataTableInstance } from "./use-data-table-instance";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";
import {
  getColumnId,
} from "./data-table-utils";
import { useDataTableState } from "./use-data-table-state";
import { useDataTableToolbarFeatures } from "./use-data-table-toolbar-features";
import { useColumnLayout } from "./use-column-layout";
import { useRowEditing } from "./use-row-editing";

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
    const resolvedLabels = React.useMemo(
      () => resolveDataTableLabels(labels),
      [labels],
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
      currentColumnFilters,
      currentColumnOrder,
      currentColumnPinning,
      currentColumnSizing,
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
      columnFilters,
      columnOrder,
      columnPinning,
      columnPrefsKey,
      columnVisibility,
      columns,
      containerRef,
      data,
      density,
      enableRowSelection,
      enableToolbarQueryFiltering,
      expanded,
      getRowId,
      hiddenRows,
      isLoading,
      loadingRowCount,
      manualFiltering,
      onColumnFiltersChange,
      onColumnOrderChange,
      onColumnPinningChange,
      onColumnVisibilityChange,
      onDensityChange,
      onExpandedChange,
      onPageIndexChange,
      onRowSelectionChange,
      onShowHiddenRowsChange,
      onSortingChange,
      onToolbarQueryValueChange,
      onViewModeChange,
      pageIndex,
      pageSize,
      resolvedLabels,
      rowSelection,
      rowsPerPageOptions,
      selectionActions,
      showHiddenRows,
      sorting,
      toolbarQueryDebounceMs,
      toolbarQueryPlaceholder,
      toolbarQueryValue,
      viewMode,
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
      columnResizeMode,
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
      tableScrollElement,
      totalRowCount,
      virtualization,
      viewportHeight,
    });
    const columnSizing = currentColumnSizing;

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
                  bodyRowComponents={bodyRowComponents}
                  columnLayouts={columnLayout.columnLayouts}
                  currentDensity={currentDensity}
                  currentSorting={currentSorting}
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
                  uiClassNames={uiClassNames}
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
