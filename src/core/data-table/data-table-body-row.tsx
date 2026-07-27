import * as React from "react";
import type { Cell, Row } from "@tanstack/react-table";
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
  isEditing: boolean;
  isExpanded: boolean;
  isInitialLoadingRow: boolean;
  isSelected: boolean;
  loadingState: DataTableRowLoadingState | undefined;
  onRowClick: DataTableProps<TData>["onRowClick"];
  originalRow: TData;
  renderExpandedRow: DataTableProps<TData>["renderExpandedRow"];
  row: Row<TData>;
  rowIndex: number;
  setDraftValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
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
  isEditing,
  isExpanded,
  isInitialLoadingRow,
  isSelected,
  loadingState,
  onRowClick,
  originalRow,
  renderExpandedRow,
  row,
  setDraftValues,
  uiClassNames,
  visibleCells,
  visibleLeafColumnCount,
}: DataTableBodyRowProps<TData>) {
  const { Checkbox, Input, Skeleton, TableCell, TableRow } = components;

  return (
    <React.Fragment>
      <TableRow
        data-row-id={row.id}
        draggable={isInitialLoadingRow ? false : isDraggable}
        data-loading={loadingState?.isLoading || undefined}
        data-state={
          isInitialLoadingRow ? undefined : isSelected ? "selected" : undefined
        }
        tabIndex={onRowClick && !isInitialLoadingRow ? 0 : undefined}
        className={cn(
          !isInitialLoadingRow && getRowClassName?.(originalRow),
          uiClassNames.row,
          isSelected && !isInitialLoadingRow && uiClassNames.rowSelected,
          onRowClick && !isInitialLoadingRow && "cursor-pointer",
          isInitialLoadingRow && "pointer-events-none",
        )}
        onClick={(event: React.MouseEvent<HTMLTableRowElement>) => {
          if (isInitialLoadingRow) {
            return;
          }

          const target = event.target as HTMLElement | null;
          if (target?.closest("[data-row-click-ignore='true']")) {
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

          const target = event.target as HTMLElement | null;
          if (target?.closest("[data-row-click-ignore='true']")) {
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
      {!isInitialLoadingRow && renderExpandedRow && isExpanded ? (
        <TableRow>
          <TableCell
            colSpan={Math.max(1, visibleLeafColumnCount)}
            className={cn(
              "border-b",
              getDensityCellClassName(currentDensity),
              uiClassNames.cellBorder,
            )}
          >
            {renderExpandedRow({
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
    previous.renderExpandedRow === next.renderExpandedRow &&
    previous.onRowClick === next.onRowClick &&
    previous.dragAndDrop === next.dragAndDrop &&
    previous.getRowClassName === next.getRowClassName &&
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
    previous?.insetInlineStart === next?.insetInlineStart &&
    previous?.insetInlineEnd === next?.insetInlineEnd
  );
}

export const DataTableBodyRow = React.memo(
  DataTableBodyRowInner,
  areDataTableBodyRowsEqual,
) as typeof DataTableBodyRowInner;
