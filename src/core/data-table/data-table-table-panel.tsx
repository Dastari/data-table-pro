import * as React from "react";
import type {
  Column,
  ExpandedState,
  Header,
  RowPinningPosition,
  Row,
  Table as TanStackTable,
} from "@tanstack/react-table";
import type {
  DataTableDensity,
  DataTableProps,
  DataTableRowLoadingState,
} from "../types";
import type { DataTableUiClassNames, DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import {
  DataTableBodyRow,
  type DataTableRowEditingContext,
} from "./data-table-body-row";
import { DataTableHeaderCell } from "./data-table-header-cell";
import type { DataTableColumnLayout } from "./use-column-layout";
import { isDataTableLoadingRow } from "./data-table-utils";
import type { DataTableLabels } from "../types";

export type DataTableTablePanelProps<TData> = {
  ariaDescribedBy: string | undefined;
  ariaLabelledBy: string | undefined;
  bodyRowComponents: Pick<
    DataTableUiKit,
    "Checkbox" | "Input" | "Skeleton" | "TableCell" | "TableRow"
  >;
  columnLayouts: ReadonlyMap<string, DataTableColumnLayout>;
  columnGroupHeaderHeight: DataTableProps<TData>["columnGroupHeaderHeight"];
  currentDensity: DataTableDensity;
  currentDetailExpanded: ExpandedState;
  currentSorting: DataTableProps<TData>["sorting"];
  dir: NonNullable<DataTableProps<TData>["dir"]>;
  DataTableEmptyState: React.ElementType;
  dragAndDrop: DataTableProps<TData>["dragAndDrop"];
  draggedColumnIdRef: React.RefObject<string | null>;
  draftValues: Record<string, unknown>;
  editingRowId: string | null;
  editingContext?: DataTableRowEditingContext<TData>;
  emptyNode: React.ReactNode;
  enableColumnReordering: boolean;
  enableColumnResizing: boolean;
  explicitCustomCellColumnIds: ReadonlySet<string>;
  fillMinWidth: number;
  flexGrow: boolean;
  gridMode: boolean;
  gridPageSize?: number;
  gridRowOffset: number;
  onGridActiveRowIndexChange?: (rowIndex: number) => void;
  getColumnLayout: (columnId: string) => DataTableColumnLayout;
  getRowClassName: DataTableProps<TData>["getRowClassName"];
  getRowLoadingState: DataTableProps<TData>["getRowLoadingState"];
  infiniteScroll: DataTableProps<TData>["infiniteScroll"];
  layoutMode: "fill" | "fit";
  localSearchValue: string;
  onRowClick: DataTableProps<TData>["onRowClick"];
  primeColumnForResize: (columnId: string, currentSize: number) => void;
  renderedRows: Array<Row<TData>>;
  detailPanel: DataTableProps<TData>["detailPanel"];
  topPinnedRows: Array<Row<TData>>;
  bottomPinnedRows: Array<Row<TData>>;
  reorderColumn: (sourceColumnId: string, targetColumnId: string) => void;
  resetColumnSize: (columnId: string) => void;
  resolvedLabels: DataTableLabels;
  rowsToRender: Array<{ row: Row<TData>; rowIndex: number }>;
  ScrollArea: DataTableUiKit["ScrollArea"];
  ScrollBar: DataTableUiKit["ScrollBar"];
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  setDraftValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  shouldRenderInitialLoading: boolean;
  stickyHeader: boolean;
  stripedRows: boolean;
  summaryRows: NonNullable<DataTableProps<TData>["summaryRows"]>;
  table: TanStackTable<TData>;
  tableClassName: string | undefined;
  tableContainerClassName: string | undefined;
  Table: DataTableUiKit["Table"];
  TableBody: DataTableUiKit["TableBody"];
  TableCell: DataTableUiKit["TableCell"];
  TableFooter: DataTableUiKit["TableFooter"];
  TableHead: DataTableUiKit["TableHead"];
  TableHeader: DataTableUiKit["TableHeader"];
  TableRow: DataTableUiKit["TableRow"];
  tableScrollContainerRef: React.RefObject<HTMLDivElement | null>;
  tableScrollElement?: HTMLElement | null;
  totalRowCount?: number;
  uiClassNames: DataTableUiClassNames;
  viewportHeight?: number;
  virtualization?: DataTableProps<TData>["virtualization"];
  virtualPaddingBottom: number;
  virtualPaddingTop: number;
  visibleLeafColumnCount: number;
  visibleLeafColumns: Array<Column<TData, unknown>>;
};

export function DataTableTablePanel<TData>({
  ariaDescribedBy,
  ariaLabelledBy,
  bodyRowComponents,
  columnLayouts,
  columnGroupHeaderHeight,
  currentDensity,
  currentDetailExpanded,
  currentSorting = [],
  dir,
  DataTableEmptyState,
  dragAndDrop,
  draggedColumnIdRef,
  draftValues,
  editingRowId,
  editingContext,
  emptyNode,
  enableColumnReordering,
  enableColumnResizing,
  explicitCustomCellColumnIds,
  fillMinWidth,
  flexGrow,
  gridMode,
  gridPageSize,
  gridRowOffset,
  onGridActiveRowIndexChange,
  getColumnLayout,
  getRowClassName,
  getRowLoadingState,
  infiniteScroll,
  layoutMode,
  localSearchValue,
  onRowClick,
  primeColumnForResize,
  renderedRows,
  detailPanel,
  topPinnedRows,
  bottomPinnedRows,
  reorderColumn,
  resetColumnSize,
  resolvedLabels,
  rowsToRender,
  ScrollArea,
  ScrollBar,
  sentinelRef,
  setDraftValues,
  shouldRenderInitialLoading,
  stickyHeader,
  stripedRows,
  summaryRows,
  table,
  tableClassName,
  tableContainerClassName,
  Table,
  TableBody,
  TableCell,
  TableFooter = "tfoot",
  TableHead,
  TableHeader,
  TableRow,
  tableScrollContainerRef,
  tableScrollElement,
  totalRowCount,
  uiClassNames,
  virtualPaddingBottom,
  virtualPaddingTop,
  visibleLeafColumnCount,
  visibleLeafColumns,
}: DataTableTablePanelProps<TData>) {
  const selectionState: boolean | "indeterminate" =
    table.getIsAllPageRowsSelected()
      ? true
      : table.getIsSomePageRowsSelected()
        ? "indeterminate"
        : false;
  const filteredRows = table.getFilteredRowModel().rows;
  const summarySourceRows = React.useMemo(
    () =>
      summaryRows.length
        ? filteredRows.map((row) => row.original)
        : [],
    [filteredRows, summaryRows.length],
  );
  const headerRowCount = table.getHeaderGroups().length;
  const displayRowCount =
    topPinnedRows.length + renderedRows.length + bottomPinnedRows.length;
  const [activeCell, setActiveCell] = React.useState({ row: 0, column: 0 });
  const shouldRestoreGridFocusRef = React.useRef(false);
  const handleGridCellFocus = React.useCallback(
    (cell: { row: number; column: number }) => {
      shouldRestoreGridFocusRef.current = true;
      setActiveCell(cell);
    },
    [],
  );

  // Keep focus on the roving cell after sorting, filtering, or a virtual row
  // range changes. A missing target is normal while a virtualizer is rendering.
  React.useEffect(() => {
    if (!gridMode) return;
    onGridActiveRowIndexChange?.(activeCell.row);
    const frame = requestAnimationFrame(() => {
      const cells = tableScrollContainerRef.current?.querySelectorAll<HTMLElement>(
        '[data-dtp-grid-cell="true"]',
      );
      const target = Array.from(cells ?? []).find(
        (cell) =>
          Number(cell.dataset.gridRowIndex) === activeCell.row &&
          Number(cell.dataset.gridColumnIndex) === activeCell.column,
      );
      if (target && shouldRestoreGridFocusRef.current) {
        target.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [activeCell, gridMode, onGridActiveRowIndexChange, tableScrollContainerRef]);

  const moveGridFocus = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>, row: number, column: number) => {
      if (event.defaultPrevented || event.target !== event.currentTarget) return;
      const pageRows = Math.max(
        1,
        gridPageSize ?? (
          Math.floor(
            (tableScrollElement?.clientHeight || 0) /
              Math.max(1, (tableScrollElement?.querySelector("tr") as HTMLElement | null)?.offsetHeight || 48),
          ) || 10),
      );
      const lastRow = Math.max(0, displayRowCount - 1);
      const lastColumn = Math.max(0, visibleLeafColumnCount - 1);
      let nextRow = row;
      let nextColumn = column;
      switch (event.key) {
        case "ArrowUp": nextRow--; break;
        case "ArrowDown": nextRow++; break;
        case "ArrowLeft": nextColumn--; break;
        case "ArrowRight": nextColumn++; break;
        case "Home":
          if (event.ctrlKey || event.metaKey) { nextRow = 0; nextColumn = 0; } else nextColumn = 0;
          break;
        case "End":
          if (event.ctrlKey || event.metaKey) { nextRow = lastRow; nextColumn = lastColumn; } else nextColumn = lastColumn;
          break;
        case "PageUp": nextRow -= pageRows; break;
        case "PageDown": nextRow += pageRows; break;
        default: return;
      }
      event.preventDefault();
      setActiveCell({
        row: Math.min(lastRow, Math.max(0, nextRow)),
        column: Math.min(lastColumn, Math.max(0, nextColumn)),
      });
    },
    [displayRowCount, gridPageSize, tableScrollElement, visibleLeafColumnCount],
  );
  const renderBodyRow = (
    row: Row<TData>,
    rowIndex: number,
    pinnedPosition?: Exclude<RowPinningPosition, false>,
  ) => {
    const originalRow = row.original;
    const isInitialLoadingRow = isDataTableLoadingRow(originalRow);
    const loadingState = isInitialLoadingRow
      ? { isLoading: true }
      : getRowLoadingState?.(originalRow, rowIndex);
    const resolvedLoadingState: DataTableRowLoadingState | undefined =
      typeof loadingState === "boolean"
        ? { isLoading: loadingState }
        : loadingState;
    const isDraggable = isInitialLoadingRow
      ? false
      : (dragAndDrop?.getRowDraggable?.(originalRow) ?? false);

    return (
      <DataTableBodyRow
        key={`${pinnedPosition ?? "center"}-${row.id}`}
        columnLayouts={columnLayouts}
        components={bodyRowComponents}
        currentDensity={currentDensity}
        draftValues={draftValues}
        editingContext={editingContext}
        dragAndDrop={dragAndDrop}
        explicitCustomCellColumnIds={explicitCustomCellColumnIds}
        getRowClassName={getRowClassName}
        groupToggleLabel={
          row.getIsExpanded()
            ? resolvedLabels.collapseRow
            : resolvedLabels.expandRow
        }
        isDraggable={isDraggable}
        isDetailExpanded={
          currentDetailExpanded === true ||
          Boolean(currentDetailExpanded[row.id])
        }
        isEditing={editingRowId === row.id}
        isExpanded={row.getIsExpanded()}
        isInitialLoadingRow={isInitialLoadingRow}
        isSelected={row.getIsSelected()}
        loadingState={resolvedLoadingState}
        onRowClick={onRowClick}
        originalRow={originalRow}
        pinnedPosition={pinnedPosition}
        detailPanel={detailPanel}
        row={row}
        rowIndex={rowIndex}
        setDraftValues={setDraftValues}
        stripedRows={stripedRows}
        uiClassNames={uiClassNames}
        visibleCells={row.getVisibleCells()}
        visibleLeafColumnCount={visibleLeafColumnCount}
        gridMode={gridMode}
        gridRowIndex={rowIndex}
        gridRowAriaIndex={headerRowCount + gridRowOffset + rowIndex + 1}
        activeGridCell={activeCell}
        onGridCellFocus={handleGridCellFocus}
        onGridCellKeyDown={moveGridFocus}
      />
    );
  };

  return (
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
        className={cn(flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full")}
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
              aria-describedby={ariaDescribedBy}
              aria-labelledby={ariaLabelledBy}
              role={gridMode ? "grid" : undefined}
              aria-colcount={gridMode ? visibleLeafColumnCount : undefined}
              aria-rowcount={
                gridMode
                  ?
                      headerRowCount +
                      (totalRowCount ?? displayRowCount) +
                      summaryRows.length
                  : undefined
              }
              className={cn(
                "w-full table-fixed border-separate border-spacing-0",
                tableClassName,
              )}
              style={{
                minWidth: layoutMode === "fill" ? fillMinWidth || undefined : undefined,
                width: layoutMode === "fit" ? table.getTotalSize() : "100%",
              }}
            >
              <colgroup>
                {table.getVisibleLeafColumns().map((column) => {
                  const layout = getColumnLayout(column.id);
                  return <col key={column.id} style={layout.colStyle} />;
                })}
              </colgroup>
              <TableHeader
                role={gridMode ? "rowgroup" : undefined}
                className={cn(
                  stickyHeader
                    ? (uiClassNames.tableStickyHeader ??
                      "sticky top-0 z-30 backdrop-blur")
                    : undefined,
                )}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} role={gridMode ? "row" : undefined} aria-rowindex={gridMode ? headerGroup.depth + 1 : undefined}>
                    {headerGroup.headers.map((header) => (
                      <DataTableHeaderCell
                        key={header.id}
                        columnGroupHeaderHeight={columnGroupHeaderHeight}
                        currentDensity={currentDensity}
                        currentSorting={currentSorting}
                        dir={dir}
                        draggedColumnIdRef={draggedColumnIdRef}
                        enableColumnReordering={enableColumnReordering}
                        enableColumnResizing={enableColumnResizing}
                        header={header}
                        headerGroupHeaders={headerGroup.headers}
                        layout={getHeaderLayout(header, getColumnLayout)}
                        primeColumnForResize={primeColumnForResize}
                        reorderColumn={reorderColumn}
                        resizeColumnLabel={resolvedLabels.resizeColumn(
                          typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : header.column.id,
                        )}
                        resetColumnSize={resetColumnSize}
                        selectionState={
                          header.column.id === "__select__"
                            ? selectionState
                            : undefined
                        }
                        TableHead={TableHead}
                        uiClassNames={uiClassNames}
                        gridMode={gridMode}
                        gridColumnIndex={
                          header.isPlaceholder || header.subHeaders.length
                            ? undefined
                            : table.getVisibleLeafColumns().findIndex(
                                (column) => column.id === header.column.id,
                              ) + 1
                        }
                      />
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody role={gridMode ? "rowgroup" : undefined}>
                {topPinnedRows.length || renderedRows.length || bottomPinnedRows.length ? (
                  <>
                    {topPinnedRows.map((row, index) =>
                      renderBodyRow(row, index, "top"),
                    )}
                    {virtualPaddingTop > 0 ? (
                      <TableRow aria-hidden="true" role={gridMode ? "presentation" : undefined}>
                        <TableCell
                          colSpan={Math.max(1, visibleLeafColumnCount)}
                          className="border-b-0 p-0"
                          style={{ height: virtualPaddingTop }}
                        />
                      </TableRow>
                    ) : null}
                    {rowsToRender.map(({ row, rowIndex }) =>
                      renderBodyRow(row, rowIndex + topPinnedRows.length),
                    )}
                    {virtualPaddingBottom > 0 ? (
                      <TableRow aria-hidden="true" role={gridMode ? "presentation" : undefined}>
                        <TableCell
                          colSpan={Math.max(1, visibleLeafColumnCount)}
                          className="border-b-0 p-0"
                          style={{ height: virtualPaddingBottom }}
                        />
                      </TableRow>
                    ) : null}
                    {bottomPinnedRows.map((row, index) =>
                      renderBodyRow(
                        row,
                        topPinnedRows.length + renderedRows.length + index,
                        "bottom",
                      ),
                    )}
                  </>
                ) : (
                  <TableRow role={gridMode ? "row" : undefined} aria-rowindex={gridMode ? headerRowCount + 1 : undefined}>
                    <TableCell
                      role={gridMode ? "gridcell" : undefined}
                      aria-colindex={gridMode ? 1 : undefined}
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
                <TableFooter role={gridMode ? "rowgroup" : undefined}>
                  {summaryRows.map((summaryRow, summaryIndex) => (
                    <TableRow
                      key={summaryRow.key}
                      role={gridMode ? "row" : undefined}
                      aria-rowindex={
                        gridMode
                          ? headerRowCount +
                            (totalRowCount ?? displayRowCount) +
                            summaryIndex +
                            1
                          : undefined
                      }
                    >
                      {visibleLeafColumns.map((column, index) => {
                        const content =
                          summaryRow.cells[column.id] ??
                          (index === 0 ? summaryRow.label : null);
                        return (
                          <TableCell
                            key={`${summaryRow.key}-${column.id}`}
                            role={gridMode ? "gridcell" : undefined}
                            aria-colindex={gridMode ? index + 1 : undefined}
                            className={cn(
                              "border-b font-medium",
                              uiClassNames.cellBorder,
                            )}
                          >
                            {typeof content === "function"
                              ? content({
                                  rows: summarySourceRows,
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
  );
}

function getHeaderLayout<TData>(
  header: Header<TData, unknown>,
  getColumnLayout: (columnId: string) => DataTableColumnLayout,
) {
  const columnLayout = getColumnLayout(header.column.id);
  if (header.isPlaceholder || !header.subHeaders.length) {
    return columnLayout;
  }

  const leafLayouts = header
    .getLeafHeaders()
    .filter((leafHeader) => !leafHeader.subHeaders.length)
    .map((leafHeader) => getColumnLayout(leafHeader.column.id));
  const fixedSide = leafLayouts[0]?.fixedSide;

  if (
    !fixedSide ||
    !leafLayouts.every((layout) => layout.fixedSide === fixedSide)
  ) {
    return columnLayout;
  }

  const edgeLayout =
    fixedSide === "left" ? leafLayouts[0] : leafLayouts.at(-1);

  return {
    ...columnLayout,
    fixedSide,
      headerStyle: edgeLayout?.headerStyle
        ? {
          left: edgeLayout.headerStyle.left,
          right: edgeLayout.headerStyle.right,
        }
      : undefined,
    pinnedClassName: edgeLayout?.pinnedClassName,
  };
}
