import * as React from "react";
import { flushSync } from "react-dom";
import type {
  Table as TanStackTable,
} from "@tanstack/react-table";
import type { DataTableProps } from "../types";
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
import { useDataTableColumns } from "./use-data-table-columns";
import { useDataTableInstance } from "./use-data-table-instance";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";
import {
  getColumnId,
  isDataTableLoadingRow,
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
    const resolvedLabels = React.useMemo(
      () => resolveDataTableLabels(labels),
      [labels],
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
      toolbarFilteredData,
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
      async (files: FileList | Array<File>) => {
        await fileUpload?.onFilesSelected(files);
      },
      [fileUpload],
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
      rowActions,
      saveEdit,
      startEditingRow,
      tableRef,
    });

    const {
      effectivePageCount,
      footerTotalRowCount,
      handleFooterPageIndexChange,
      handleFooterPageSizeChange,
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
      handleColumnFiltersChange: setCurrentColumnFilters,
      handleColumnOrderChange: setCurrentColumnOrder,
      handleColumnPinningChange: setCurrentColumnPinning,
      handleColumnVisibilityChange: setCurrentColumnVisibility,
      handleExpandedChange: setCurrentExpanded,
      infiniteScroll,
      manualFiltering,
      manualPagination,
      manualSorting,
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
      toolbarFilteredData,
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
