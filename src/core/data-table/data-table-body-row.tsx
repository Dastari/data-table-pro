import * as React from "react";
import { flexRender, type Cell, type Row } from "@tanstack/react-table";
import type { RowPinningPosition } from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableDensity,
  DataTableProps,
  DataTableRowLoadingState,
} from "../types";
import type { DataTableUiClassNames, DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { renderDataTableCellContent } from "./data-table-cell-content";
import type { DataTableColumnLayout } from "./use-column-layout";
import {
  getDensityCellClassName,
  isDataTableInteractiveTarget,
  isDataTableLoadingRow,
} from "./data-table-utils";
import { renderEditableCell } from "./use-row-editing";
import { cellAlignClassName, hideOnClassName } from "../types";

type DataTableBodyRowProps<TData> = {
  columnLayouts: ReadonlyMap<string, DataTableColumnLayout>;
  components: Pick<
    DataTableUiKit,
    "Checkbox" | "Input" | "Skeleton" | "TableCell" | "TableRow"
  >;
  currentDensity: DataTableDensity;
  draftValues: Record<string, unknown>;
  dragAndDrop: DataTableProps<TData>["dragAndDrop"];
  explicitCustomCellColumnIds: ReadonlySet<string>;
  getRowClassName: DataTableProps<TData>["getRowClassName"];
  isDraggable: boolean;
  isDetailExpanded: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  isInitialLoadingRow: boolean;
  isSelected: boolean;
  loadingState: DataTableRowLoadingState | undefined;
  onRowClick: DataTableProps<TData>["onRowClick"];
  pinnedPosition?: Exclude<RowPinningPosition, false>;
  originalRow: TData;
  detailPanel: DataTableProps<TData>["detailPanel"];
  row: Row<TData>;
  rowIndex: number;
  setDraftValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  stripedRows: boolean;
  uiClassNames: DataTableUiClassNames;
  visibleCells: Array<Cell<TData, unknown>>;
  visibleLeafColumnCount: number;
};

function DataTableBodyRowInner<TData>({
  columnLayouts,
  components,
  currentDensity,
  draftValues,
  dragAndDrop,
  explicitCustomCellColumnIds,
  getRowClassName,
  isDraggable,
  isDetailExpanded,
  isEditing,
  isExpanded,
  isInitialLoadingRow,
  isSelected,
  loadingState,
  onRowClick,
  pinnedPosition,
  originalRow,
  detailPanel,
  row,
  rowIndex,
  setDraftValues,
  stripedRows,
  uiClassNames,
  visibleCells,
  visibleLeafColumnCount,
}: DataTableBodyRowProps<TData>) {
  const { Checkbox, Input, Skeleton, TableCell, TableRow } = components;
  const firstDataColumnId = visibleCells.find(
    (cell) => !columnLayouts.get(cell.column.id)?.isUtilityColumn,
  )?.column.id;

  return (
    <React.Fragment>
      <TableRow
        data-row-id={row.id}
        data-tree-depth={
          !isInitialLoadingRow && row.depth > 0 ? row.depth : undefined
        }
        data-dtp-slot={
          pinnedPosition ? "data-table-pinned-row" : "data-table-row"
        }
        data-row-pinned={pinnedPosition}
        data-row-grouped={row.getIsGrouped() || undefined}
        draggable={isInitialLoadingRow ? false : isDraggable}
        data-loading={loadingState?.isLoading || undefined}
        data-row-index={isInitialLoadingRow ? undefined : rowIndex}
        data-row-parity={
          stripedRows && !isInitialLoadingRow
            ? rowIndex % 2 === 0
              ? "odd"
              : "even"
            : undefined
        }
        data-state={
          isInitialLoadingRow ? undefined : isSelected ? "selected" : undefined
        }
        tabIndex={onRowClick && !isInitialLoadingRow ? 0 : undefined}
        className={cn(
          !isInitialLoadingRow &&
            getRowClassName?.(originalRow, {
              row: originalRow,
              rowId: row.id,
              rowIndex,
              isEditing,
              isExpanded,
              isLoading: Boolean(loadingState?.isLoading),
              isSelected,
              pinnedPosition: pinnedPosition ?? false,
            }),
          uiClassNames.row,
          pinnedPosition === "top" &&
            cn("border-b-2", uiClassNames.rowPinnedTop),
          pinnedPosition === "bottom" &&
            cn("border-t-2", uiClassNames.rowPinnedBottom),
          stripedRows &&
            !isInitialLoadingRow &&
            (rowIndex % 2 === 0
              ? uiClassNames.rowOdd
              : uiClassNames.rowEven),
          isSelected && !isInitialLoadingRow && uiClassNames.rowSelected,
          onRowClick && !isInitialLoadingRow && "cursor-pointer",
          isInitialLoadingRow && "pointer-events-none",
        )}
        onClick={(event: React.MouseEvent<HTMLTableRowElement>) => {
          if (isInitialLoadingRow) {
            return;
          }

          if (isDataTableInteractiveTarget(event.target, event.currentTarget)) {
            return;
          }

          void onRowClick?.({ row: originalRow, rowId: row.id });
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLTableRowElement>) => {
          if (
            isInitialLoadingRow ||
            !onRowClick ||
            (event.key !== "Enter" && event.key !== " ")
          ) {
            return;
          }

          if (isDataTableInteractiveTarget(event.target, event.currentTarget)) {
            return;
          }

          event.preventDefault();
          void onRowClick({ row: originalRow, rowId: row.id });
        }}
        onDragStart={(event: React.DragEvent<HTMLTableRowElement>) => {
          if (isInitialLoadingRow) {
            return;
          }

          dragAndDrop?.onRowDragStart?.({
            row: originalRow,
            rowId: row.id,
            event,
          });
        }}
        onDragEnd={(event: React.DragEvent<HTMLTableRowElement>) => {
          if (isInitialLoadingRow) {
            return;
          }

          dragAndDrop?.onRowDragEnd?.({
            row: originalRow,
            rowId: row.id,
            event,
          });
        }}
      >
        {visibleCells.map((cell) => {
          const meta = (
            cell.column.columnDef as DataTableColumnDef<TData, unknown>
          ).meta;
          const cellContext = cell.getContext();
          const value = cell.getValue();
          const layout = columnLayouts.get(cell.column.id);
          const isSelectionColumn = layout?.isSelectionColumn ?? false;
          const isExpansionColumn = layout?.isExpansionColumn ?? false;
          const isActionsColumn = layout?.isActionsColumn ?? false;
          const isSpacerColumn = layout?.isSpacerColumn ?? false;
          const hideClassName = hideOnClassName(meta?.hideOn);
          const cellClassName =
            isInitialLoadingRow || isDataTableLoadingRow(originalRow)
              ? undefined
              : typeof meta?.cellClassName === "function"
                ? meta.cellClassName({
                    row: originalRow,
                    value,
                  })
                : meta?.cellClassName;

          return (
            <TableCell
              key={cell.id}
              className={cn(
                "border-b",
                getDensityCellClassName(currentDensity),
                uiClassNames.cellBorder,
                layout?.utilityClassName,
                layout?.isSpacerColumn && "border-b-0 bg-transparent p-0",
                layout?.pinnedClassName,
                hideClassName,
                cellAlignClassName(cellContext),
                meta?.responsiveClassName,
                cellClassName,
              )}
              style={layout?.cellStyle}
            >
              <div
                data-row-click-ignore={
                  isSelectionColumn || isExpansionColumn || isActionsColumn
                    ? "true"
                    : undefined
                }
                className="min-w-0 max-w-full"
                style={
                  row.depth > 0 && cell.column.id === firstDataColumnId
                    ? { paddingInlineStart: `${row.depth}rem` }
                    : undefined
                }
              >
                {loadingState?.isLoading ? (
                  (meta?.skeleton?.(cellContext) ??
                  loadingState.skeleton ?? (
                    <Skeleton
                      className={cn(
                        "h-4 rounded",
                        meta?.type === "numeric"
                          ? "ml-auto w-16"
                          : meta?.type === "date"
                            ? "ml-auto w-28"
                            : "w-full",
                      )}
                    />
                  ))
                ) : isEditing &&
                  cell.column.id !== "__select__" &&
                  cell.column.id !== "__expand__" &&
                  cell.column.id !== "__actions__" ? (
                  renderEditableCell(cellContext, draftValues, setDraftValues, {
                    Checkbox,
                    Input,
                  })
                ) : row.getIsGrouped() && cell.getIsPlaceholder() ? null : row.getIsGrouped() && cell.getIsGrouped() ? (
                  <button
                    type="button"
                    className="inline-flex min-w-0 items-center gap-1 text-left font-medium"
                    onClick={() => row.toggleExpanded()}
                    aria-expanded={row.getIsExpanded()}
                    aria-label={
                      row.getIsExpanded() ? "Collapse group" : "Expand group"
                    }
                  >
                    <span aria-hidden="true">
                      {renderDataTableCellContent(cellContext, uiClassNames, {
                        hasCustomCell:
                          explicitCustomCellColumnIds.has(cell.column.id),
                        useCustomOverflowDefaults:
                          explicitCustomCellColumnIds.has(cell.column.id),
                      })}
                    </span>
                    <span className="shrink-0 opacity-70">
                      ({row.subRows.length})
                    </span>
                  </button>
                ) : row.getIsGrouped() && cell.getIsAggregated() ? (
                  cell.column.columnDef.aggregatedCell
                    ? flexRender(cell.column.columnDef.aggregatedCell, cellContext)
                    : renderDataTableCellContent(cellContext, uiClassNames, {
                        hasCustomCell: false,
                        useCustomOverflowDefaults: false,
                      })
                ) : (
                  renderDataTableCellContent(cellContext, uiClassNames, {
                    hasCustomCell:
                      explicitCustomCellColumnIds.has(cell.column.id) ||
                      isSelectionColumn ||
                      isExpansionColumn ||
                      isActionsColumn ||
                      isSpacerColumn,
                    useCustomOverflowDefaults:
                      explicitCustomCellColumnIds.has(cell.column.id) ||
                      isSelectionColumn ||
                      isExpansionColumn ||
                      isActionsColumn ||
                      isSpacerColumn,
                  })
                )}
              </div>
            </TableCell>
          );
        })}
      </TableRow>
      {!isInitialLoadingRow && detailPanel && isDetailExpanded ? (
        <TableRow
          data-dtp-slot="data-table-detail-panel-row"
          data-row-pinned={pinnedPosition}
        >
          <TableCell
            colSpan={Math.max(1, visibleLeafColumnCount)}
            className={cn(
              "border-b",
              getDensityCellClassName(currentDensity),
              uiClassNames.cellBorder,
            )}
          >
            {detailPanel.render({
              row: originalRow,
              rowId: row.id,
              tableRow: row,
            })}
          </TableCell>
        </TableRow>
      ) : null}
    </React.Fragment>
  );
}

function areDataTableBodyRowsEqual<TData>(
  previous: DataTableBodyRowProps<TData>,
  next: DataTableBodyRowProps<TData>,
) {
  return (
    previous.row.id === next.row.id &&
    previous.row.original === next.row.original &&
    previous.rowIndex === next.rowIndex &&
    previous.isSelected === next.isSelected &&
    previous.isInitialLoadingRow === next.isInitialLoadingRow &&
    previous.isEditing === next.isEditing &&
    previous.isExpanded === next.isExpanded &&
    previous.isDraggable === next.isDraggable &&
    sameLoadingState(previous.loadingState, next.loadingState) &&
    sameVisibleCells(previous.visibleCells, next.visibleCells) &&
    previous.components === next.components &&
    sameColumnLayouts(
      previous.columnLayouts,
      next.columnLayouts,
      next.visibleCells,
    ) &&
    previous.currentDensity === next.currentDensity &&
    previous.detailPanel === next.detailPanel &&
    previous.isDetailExpanded === next.isDetailExpanded &&
    previous.pinnedPosition === next.pinnedPosition &&
    previous.onRowClick === next.onRowClick &&
    previous.dragAndDrop === next.dragAndDrop &&
    previous.getRowClassName === next.getRowClassName &&
    previous.stripedRows === next.stripedRows &&
    previous.uiClassNames === next.uiClassNames &&
    previous.explicitCustomCellColumnIds === next.explicitCustomCellColumnIds &&
    (!previous.isEditing || previous.draftValues === next.draftValues)
  );
}

function sameLoadingState(
  previous: DataTableRowLoadingState | undefined,
  next: DataTableRowLoadingState | undefined,
) {
  return (
    previous?.isLoading === next?.isLoading &&
    previous?.skeleton === next?.skeleton
  );
}

function sameVisibleCells<TData>(
  previous: Array<Cell<TData, unknown>>,
  next: Array<Cell<TData, unknown>>,
) {
  return (
    previous.length === next.length &&
    previous.every((cell, index) => {
      const nextCell = next[index];
      return nextCell?.id === cell.id && nextCell.column.id === cell.column.id;
    })
  );
}

function sameColumnLayouts<TData>(
  previous: ReadonlyMap<string, DataTableColumnLayout>,
  next: ReadonlyMap<string, DataTableColumnLayout>,
  cells: Array<Cell<TData, unknown>>,
) {
  return cells.every((cell) => {
    const previousLayout = previous.get(cell.column.id);
    const nextLayout = next.get(cell.column.id);

    return (
      previousLayout?.fixedSide === nextLayout?.fixedSide &&
      previousLayout?.isActionsColumn === nextLayout?.isActionsColumn &&
      previousLayout?.isExpansionColumn === nextLayout?.isExpansionColumn &&
      previousLayout?.isSelectionColumn === nextLayout?.isSelectionColumn &&
      previousLayout?.isSpacerColumn === nextLayout?.isSpacerColumn &&
      previousLayout?.isUtilityColumn === nextLayout?.isUtilityColumn &&
      previousLayout?.pinnedClassName === nextLayout?.pinnedClassName &&
      previousLayout?.utilityClassName === nextLayout?.utilityClassName &&
      sameCellStyle(previousLayout?.cellStyle, nextLayout?.cellStyle)
    );
  });
}

function sameCellStyle(
  previous: React.CSSProperties | undefined,
  next: React.CSSProperties | undefined,
) {
  return (
    previous?.width === next?.width &&
    previous?.minWidth === next?.minWidth &&
    previous?.maxWidth === next?.maxWidth &&
    previous?.left === next?.left &&
    previous?.right === next?.right
  );
}

export const DataTableBodyRow = React.memo(
  DataTableBodyRowInner,
  areDataTableBodyRowsEqual,
) as typeof DataTableBodyRowInner;
