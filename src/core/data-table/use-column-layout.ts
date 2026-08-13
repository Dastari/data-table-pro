import * as React from "react";
import type { ColumnSizingState } from "@tanstack/react-table";
import type { DataTableColumnDef } from "../types";
import type { DataTableUiClassNames } from "../ui-kit";
import {
  UTILITY_COLUMN_SIZE,
  getColumnId,
  getConfiguredColumnMinWidth,
  getDataTableLeafColumns,
  getFixedSide,
  getPinnedColumnClassName,
  hasExplicitDataTableColumnSize,
  isUtilityColumnId,
} from "./data-table-utils";
import type { DataTableTanStackColumn as Column } from "./tanstack-v9";

type ColumnLayoutMode = "fill" | "fit";

export type DataTableColumnLayout = {
  cellStyle: React.CSSProperties | undefined;
  colStyle: React.CSSProperties | undefined;
  fixedSide: "left" | "right" | false | undefined;
  headerStyle: React.CSSProperties | undefined;
  isActionsColumn: boolean;
  isExpansionColumn: boolean;
  isSelectionColumn: boolean;
  isSpacerColumn: boolean;
  isUtilityColumn: boolean;
  pinnedClassName: string | undefined;
  utilityClassName: string | undefined;
};

const EMPTY_COLUMN_LAYOUT: DataTableColumnLayout = {
  cellStyle: undefined,
  colStyle: undefined,
  fixedSide: undefined,
  headerStyle: undefined,
  isActionsColumn: false,
  isExpansionColumn: false,
  isSelectionColumn: false,
  isSpacerColumn: false,
  isUtilityColumn: false,
  pinnedClassName: undefined,
  utilityClassName: undefined,
};

export function useColumnLayout<TData>({
  columns,
  columnSizing,
  editableRows,
  enableRowSelection,
  hasRowActions,
  hasRowExpansion,
  layoutMode,
  uiClassNames,
  visibleLeafColumns,
}: {
  columns: Array<DataTableColumnDef<TData, unknown>>;
  columnSizing: ColumnSizingState;
  editableRows: boolean;
  enableRowSelection: boolean;
  hasRowActions: boolean;
  hasRowExpansion: boolean;
  layoutMode: ColumnLayoutMode;
  uiClassNames: DataTableUiClassNames;
  visibleLeafColumns: Array<Column<TData, unknown>>;
}) {
  const explicitlySizedColumnIds = React.useMemo(() => {
    const ids = new Set<string>();

    for (const { column, index } of getDataTableLeafColumns(columns)) {
      if (hasExplicitDataTableColumnSize(column)) {
        ids.add(getColumnId(column, index));
      }
    }

    if (enableRowSelection) {
      ids.add("__select__");
    }

    if (hasRowExpansion) {
      ids.add("__expand__");
    }

    if (hasRowActions || editableRows) {
      ids.add("__actions__");
    }

    return ids;
  }, [
    columns,
    editableRows,
    enableRowSelection,
    hasRowActions,
    hasRowExpansion,
  ]);

  const minimumColumnWidths = React.useMemo(() => {
    const widths = new Map<string, number>();

    for (const { column, index } of getDataTableLeafColumns(columns)) {
      const configuredMinWidth = getConfiguredColumnMinWidth(column);

      if (configuredMinWidth !== undefined) {
        widths.set(getColumnId(column, index), configuredMinWidth);
      }
    }

    return widths;
  }, [columns]);

  const pinnedColumns = React.useMemo(() => {
    const left = new Map<string, number>();
    const right = new Map<string, number>();

    let leftOffset = 0;
    for (const column of visibleLeafColumns) {
      if (getFixedSide(column) === "left") {
        left.set(column.id, leftOffset);
        leftOffset += getColumnLayoutSize(column);
      }
    }

    let rightOffset = 0;
    for (const column of [...visibleLeafColumns].reverse()) {
      if (getFixedSide(column) === "right") {
        right.set(column.id, rightOffset);
        rightOffset += getColumnLayoutSize(column);
      }
    }

    return { left, right };
  }, [visibleLeafColumns]);

  const fixedWidthColumnIds = React.useMemo(() => {
    return new Set([
      ...explicitlySizedColumnIds,
      ...Object.keys(columnSizing),
    ]);
  }, [columnSizing, explicitlySizedColumnIds]);

  const columnLayouts = React.useMemo(() => {
    const layouts = new Map<string, DataTableColumnLayout>();

    for (const column of visibleLeafColumns) {
      const isSelectionColumn = column.id === "__select__";
      const isExpansionColumn = column.id === "__expand__";
      const isActionsColumn = column.id === "__actions__";
      const isUtilityColumn =
        isSelectionColumn || isExpansionColumn || isActionsColumn;
      const isSpacerColumn = column.id === "__spacer__";
      const configuredMinWidth = minimumColumnWidths.get(column.id);
      const columnMinWidth = configuredMinWidth;
      const shouldFixWidth =
        !isSpacerColumn &&
        (layoutMode === "fit" ||
          isUtilityColumn ||
          fixedWidthColumnIds.has(column.id));
      const baseStyle =
        shouldFixWidth || columnMinWidth !== undefined
          ? {
              width: shouldFixWidth
                ? isUtilityColumn
                  ? UTILITY_COLUMN_SIZE
                  : column.getSize()
                : undefined,
              minWidth: isUtilityColumn
                ? UTILITY_COLUMN_SIZE
                : shouldFixWidth
                  ? column.getSize()
                  : columnMinWidth,
              maxWidth: shouldFixWidth
                ? isUtilityColumn
                  ? UTILITY_COLUMN_SIZE
                  : column.getSize()
                : undefined,
            }
          : undefined;
      const fixedSide = getFixedSide(column);
      const pinnedStyle = fixedSide
        ? {
            left:
              fixedSide === "left" ? pinnedColumns.left.get(column.id) : undefined,
            right:
              fixedSide === "right"
                ? pinnedColumns.right.get(column.id)
                : undefined,
          }
        : undefined;
      const cellStyle =
        baseStyle || pinnedStyle ? { ...baseStyle, ...pinnedStyle } : undefined;

      layouts.set(column.id, {
        cellStyle,
        colStyle: baseStyle,
        fixedSide,
        headerStyle: cellStyle,
        isActionsColumn,
        isExpansionColumn,
        isSelectionColumn,
        isSpacerColumn,
        isUtilityColumn,
        pinnedClassName: fixedSide
          ? getPinnedColumnClassName(fixedSide, uiClassNames, {
              isUtilityColumn,
            })
          : undefined,
        utilityClassName: isUtilityColumn
          ? "w-[50px] max-w-[50px] min-w-[50px] px-0"
          : undefined,
      });
    }

    return layouts;
  }, [
    fixedWidthColumnIds,
    layoutMode,
    minimumColumnWidths,
    pinnedColumns,
    uiClassNames,
    visibleLeafColumns,
  ]);

  const fillMinWidth = React.useMemo(() => {
    return visibleLeafColumns.reduce((total, column) => {
      const layout = columnLayouts.get(column.id);
      const configuredMinWidth = minimumColumnWidths.get(column.id);

      if (layout?.isUtilityColumn) {
        return total + UTILITY_COLUMN_SIZE;
      }

      if (fixedWidthColumnIds.has(column.id)) {
        return total + column.getSize();
      }

      return (
        total +
        (configuredMinWidth ?? 0)
      );
    }, 0);
  }, [
    columnLayouts,
    fixedWidthColumnIds,
    minimumColumnWidths,
    visibleLeafColumns,
  ]);

  const getColumnLayout = React.useCallback(
    (columnId: string) => columnLayouts.get(columnId) ?? EMPTY_COLUMN_LAYOUT,
    [columnLayouts],
  );

  return {
    columnLayouts,
    explicitlySizedColumnIds,
    fillMinWidth,
    getColumnLayout,
  };
}

function getColumnLayoutSize<TData>(column: Column<TData>) {
  return isUtilityColumnId(column.id) ? UTILITY_COLUMN_SIZE : column.getSize();
}
