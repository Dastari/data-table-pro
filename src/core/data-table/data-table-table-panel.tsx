import * as React from "react";
import type {
  Column,
  Header,
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
import { DataTableBodyRow } from "./data-table-body-row";
import { DataTableHeaderCell } from "./data-table-header-cell";
import type { DataTableColumnLayout } from "./use-column-layout";
import { isDataTableLoadingRow } from "./data-table-utils";
import type { DataTableLabels } from "../types";

export type DataTableTablePanelProps<TData> = {
  bodyRowComponents: Pick<
    DataTableUiKit,
    "Checkbox" | "Input" | "Skeleton" | "TableCell" | "TableRow"
  >;
  columnLayouts: ReadonlyMap<string, DataTableColumnLayout>;
  currentDensity: DataTableDensity;
  currentSorting: DataTableProps<TData>["sorting"];
  DataTableEmptyState: React.ElementType;
  dragAndDrop: DataTableProps<TData>["dragAndDrop"];
  draggedColumnIdRef: React.RefObject<string | null>;
  draftValues: Record<string, unknown>;
  editingRowId: string | null;
  emptyNode: React.ReactNode;
  enableColumnReordering: boolean;
  enableColumnResizing: boolean;
  explicitCustomCellColumnIds: ReadonlySet<string>;
  fillMinWidth: number;
  flexGrow: boolean;
  getColumnLayout: (columnId: string) => DataTableColumnLayout;
  getRowClassName: DataTableProps<TData>["getRowClassName"];
  getRowLoadingState: DataTableProps<TData>["getRowLoadingState"];
  infiniteScroll: DataTableProps<TData>["infiniteScroll"];
  layoutMode: "fill" | "fit";
  localSearchValue: string;
  onRowClick: DataTableProps<TData>["onRowClick"];
  primeColumnForResize: (columnId: string, currentSize: number) => void;
  renderedRows: Array<Row<TData>>;
  renderExpandedRow: DataTableProps<TData>["renderExpandedRow"];
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
  uiClassNames: DataTableUiClassNames;
  viewportHeight?: number;
  virtualization?: DataTableProps<TData>["virtualization"];
  virtualPaddingBottom: number;
  virtualPaddingTop: number;
  visibleLeafColumnCount: number;
  visibleLeafColumns: Array<Column<TData, unknown>>;
};

export function DataTableTablePanel<TData>({
  bodyRowComponents,
  columnLayouts,
  currentDensity,
  currentSorting = [],
  DataTableEmptyState,
  dragAndDrop,
  draggedColumnIdRef,
  draftValues,
  editingRowId,
  emptyNode,
  enableColumnReordering,
  enableColumnResizing,
  explicitCustomCellColumnIds,
  fillMinWidth,
  flexGrow,
  getColumnLayout,
  getRowClassName,
  getRowLoadingState,
  infiniteScroll,
  layoutMode,
  localSearchValue,
  onRowClick,
  primeColumnForResize,
  renderedRows,
  renderExpandedRow,
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
                className={cn(
                  stickyHeader
                    ? (uiClassNames.tableStickyHeader ??
                      "sticky top-0 z-30 backdrop-blur")
                    : undefined,
                )}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <DataTableHeaderCell
                        key={header.id}
                        currentDensity={currentDensity}
                        currentSorting={currentSorting}
                        draggedColumnIdRef={draggedColumnIdRef}
                        enableColumnReordering={enableColumnReordering}
                        enableColumnResizing={enableColumnResizing}
                        header={header}
                        headerGroupHeaders={headerGroup.headers}
                        layout={getHeaderLayout(header, getColumnLayout)}
                        primeColumnForResize={primeColumnForResize}
                        reorderColumn={reorderColumn}
                        resetColumnSize={resetColumnSize}
                        selectionState={
                          header.column.id === "__select__"
                            ? selectionState
                            : undefined
                        }
                        TableHead={TableHead}
                        uiClassNames={uiClassNames}
                      />
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {renderedRows.length ? (
                  <>
                    {virtualPaddingTop > 0 ? (
                      <TableRow aria-hidden="true">
                        <TableCell
                          colSpan={Math.max(1, visibleLeafColumnCount)}
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
                          key={row.id}
                          columnLayouts={columnLayouts}
                          components={bodyRowComponents}
                          currentDensity={currentDensity}
                          draftValues={draftValues}
                          dragAndDrop={dragAndDrop}
                          explicitCustomCellColumnIds={explicitCustomCellColumnIds}
                          getRowClassName={getRowClassName}
                          isDraggable={isDraggable}
                          isEditing={editingRowId === row.id}
                          isExpanded={row.getIsExpanded()}
                          isInitialLoadingRow={isInitialLoadingRow}
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
                          visibleLeafColumnCount={visibleLeafColumnCount}
                        />
                      );
                    })}
                    {virtualPaddingBottom > 0 ? (
                      <TableRow aria-hidden="true">
                        <TableCell
                          colSpan={Math.max(1, visibleLeafColumnCount)}
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
          insetInlineStart: edgeLayout.headerStyle.insetInlineStart,
          insetInlineEnd: edgeLayout.headerStyle.insetInlineEnd,
        }
      : undefined,
    pinnedClassName: edgeLayout?.pinnedClassName,
  };
}
