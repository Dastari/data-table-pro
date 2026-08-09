import * as React from "react";
import type { ColumnDef, Table as TanStackTable } from "@tanstack/react-table";
import type { RowPinningPosition } from "@tanstack/react-table";
import { IconChevronDown } from "../icons";
import type {
  DataTableEditableRowsConfig,
  DataTableLabels,
  DataTableProps,
  DataTableRowAction,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import {
  UTILITY_COLUMN_SIZE,
  decorateFilterableColumn,
  isDataTableLoadingRow,
} from "./data-table-utils";
import { DATA_TABLE_DEFAULT_LABELS } from "./data-table-labels";

type DataTableRowActionsComponentProps<TData> = {
  editableRows?: DataTableEditableRowsConfig<TData>;
  isEditing: boolean;
  labels: DataTableLabels;
  onCancelEditing: () => void;
  onStartEditing: () => void;
  row: TData;
  rowActions: Array<DataTableRowAction<TData>>;
  rowPinning?: {
    canPin: boolean;
    position: RowPinningPosition;
    pin: (position: RowPinningPosition) => void;
  };
};

export function useDataTableColumns<TData>({
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
  enableRowPinning,
  getRowCanExpand,
  isSavingEdit,
  labels,
  lastSelectedRowIdRef,
  renderExpandedRow,
  rowActions,
  saveEdit,
  startEditingRow,
  tableRef,
}: {
  Button: DataTableUiKit["Button"];
  Checkbox: DataTableUiKit["Checkbox"];
  DataTableRowActions: React.ComponentType<
    DataTableRowActionsComponentProps<TData>
  >;
  Tooltip: DataTableUiKit["Tooltip"];
  TooltipContent: DataTableUiKit["TooltipContent"];
  TooltipTrigger: DataTableUiKit["TooltipTrigger"];
  cancelEditing: () => void;
  columns: DataTableProps<TData>["columns"];
  editableRows: DataTableProps<TData>["editableRows"];
  editingRowId: string | null;
  enableRowSelection: boolean;
  enableRowPinning: DataTableProps<TData>["enableRowPinning"];
  getRowCanExpand: DataTableProps<TData>["getRowCanExpand"];
  isSavingEdit: boolean;
  labels: DataTableLabels;
  lastSelectedRowIdRef: React.MutableRefObject<string | null>;
  renderExpandedRow: DataTableProps<TData>["renderExpandedRow"];
  rowActions: Array<DataTableRowAction<TData>>;
  saveEdit: (row: TData) => Promise<void>;
  startEditingRow: (row: TData, rowId: string) => void;
  tableRef: React.RefObject<TanStackTable<TData> | null>;
}) {
  const selectRowRange = React.useCallback(
    (targetRowId: string, selected: boolean) => {
      const tableInstance = tableRef.current;
      if (!tableInstance || !lastSelectedRowIdRef.current) {
        return;
      }

      const rows = tableInstance
        .getRowModel()
        .rows.filter((row) => !isDataTableLoadingRow(row.original));
      const startIndex = rows.findIndex(
        (row) => row.id === lastSelectedRowIdRef.current,
      );
      const endIndex = rows.findIndex((row) => row.id === targetRowId);

      if (startIndex < 0 || endIndex < 0) {
        return;
      }

      const from = Math.min(startIndex, endIndex);
      const to = Math.max(startIndex, endIndex);
      tableInstance.setRowSelection((current) => {
        const next = { ...current };
        for (const row of rows.slice(from, to + 1)) {
          if (selected) {
            next[row.id] = true;
          } else {
            delete next[row.id];
          }
        }
        return next;
      });
    },
    [lastSelectedRowIdRef, tableRef],
  );

  return React.useMemo<Array<ColumnDef<TData, unknown>>>(() => {
    const defs: Array<ColumnDef<TData, unknown>> = [];

    if (renderExpandedRow) {
      defs.push({
        id: "__expand__",
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: UTILITY_COLUMN_SIZE,
        minSize: UTILITY_COLUMN_SIZE,
        maxSize: UTILITY_COLUMN_SIZE,
        header: () => <span className="sr-only">{labels.expandRow}</span>,
        cell: ({ row }) => {
          const canExpand =
            getRowCanExpand?.(row.original) ?? Boolean(renderExpandedRow);
          if (!canExpand) {
            return null;
          }

          const isExpanded = row.getIsExpanded();
          return (
            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={
                  isExpanded ? labels.collapseRow : labels.expandRow
                }
                aria-expanded={isExpanded}
                onClick={() => row.toggleExpanded()}
              >
                <IconChevronDown
                  className={cn(
                    "transition-transform",
                    isExpanded ? "rotate-0" : "-rotate-90",
                  )}
                />
              </Button>
            </div>
          );
        },
      });
    }

    if (enableRowSelection) {
      defs.push({
        id: "__select__",
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: UTILITY_COLUMN_SIZE,
        minSize: UTILITY_COLUMN_SIZE,
        maxSize: UTILITY_COLUMN_SIZE,
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              className="my-0.5"
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(checked: boolean | "indeterminate") => {
                table.toggleAllPageRowsSelected(checked === true);
              }}
              aria-label={
                labels.selectAllVisibleRows ??
                DATA_TABLE_DEFAULT_LABELS.selectAllVisibleRows
              }
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              className="my-0.5"
              checked={row.getIsSelected()}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                if (!event.shiftKey || !lastSelectedRowIdRef.current) {
                  lastSelectedRowIdRef.current = row.id;
                  return;
                }

                event.preventDefault();
                event.stopPropagation();
                selectRowRange(row.id, !row.getIsSelected());
                lastSelectedRowIdRef.current = row.id;
              }}
              onCheckedChange={(checked: boolean | "indeterminate") => {
                lastSelectedRowIdRef.current = row.id;
                row.toggleSelected(checked === true);
              }}
              aria-label={
                labels.selectRow ?? DATA_TABLE_DEFAULT_LABELS.selectRow
              }
            />
          </div>
        ),
      });
    }

    defs.push(...columns.map((column) => decorateFilterableColumn(column)));

    if (rowActions.length || editableRows || enableRowPinning) {
      defs.push({
        id: "__actions__",
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: UTILITY_COLUMN_SIZE,
        minSize: UTILITY_COLUMN_SIZE,
        maxSize: UTILITY_COLUMN_SIZE,
        header: () => <span className="sr-only">{labels.actions}</span>,
        cell: ({ row }) => {
          const rowId = row.id;
          const isEditing = editingRowId === rowId;

          if (isEditing) {
            return (
              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isSavingEdit}
                  onClick={() => {
                    void saveEdit(row.original);
                  }}
                >
                  {labels.saveEdit}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={cancelEditing}
                    >
                      <IconChevronDown className="rotate-45" />
                      <span className="sr-only">{labels.cancelEdit}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{labels.cancelEdit}</TooltipContent>
                </Tooltip>
              </div>
            );
          }

          return (
            <div className="flex w-full items-center justify-center">
              <DataTableRowActions
                row={row.original}
                rowActions={rowActions}
                editableRows={editableRows}
                isEditing={false}
                onStartEditing={() => {
                  startEditingRow(row.original, row.id);
                }}
                onCancelEditing={() => {}}
                labels={labels}
                rowPinning={
                  enableRowPinning
                    ? {
                        canPin: row.getCanPin(),
                        position: row.getIsPinned(),
                        pin: (position) => row.pin(position),
                      }
                    : undefined
                }
              />
            </div>
          );
        },
      });
    }

    return defs;
  }, [
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
    enableRowPinning,
    getRowCanExpand,
    isSavingEdit,
    labels,
    lastSelectedRowIdRef,
    renderExpandedRow,
    rowActions,
    saveEdit,
    selectRowRange,
    startEditingRow,
  ]);
}
