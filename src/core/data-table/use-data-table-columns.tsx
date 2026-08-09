import * as React from "react";
import type { ColumnDef, ExpandedState, OnChangeFn, Table as TanStackTable } from "@tanstack/react-table";
import { IconChevronDown } from "../icons";
import type {
  DataTableEditableRowsConfig,
  DataTableDetailPanel,
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
  toggleDataTableExpandedState,
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
  hasTreeExpansion,
  isSavingEdit,
  labels,
  lastSelectedRowIdRef,
  detailPanel,
  detailExpanded,
  onDetailExpandedChange,
  rowSelectionSelectAllScope,
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
  hasTreeExpansion: boolean;
  isSavingEdit: boolean;
  labels: DataTableLabels;
  lastSelectedRowIdRef: React.MutableRefObject<string | null>;
  detailPanel: DataTableDetailPanel<TData> | undefined;
  detailExpanded: ExpandedState;
  onDetailExpandedChange: OnChangeFn<ExpandedState>;
  rowSelectionSelectAllScope: NonNullable<
    DataTableProps<TData>["rowSelectionSelectAllScope"]
  >;
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
        for (const row of rows
          .slice(from, to + 1)
          .filter(
            (item) => item.getCanSelect() && item.getCanMultiSelect(),
          )) {
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

    if (hasTreeExpansion || detailPanel) {
      const expansionColumnSize =
        hasTreeExpansion && detailPanel ? 80 : UTILITY_COLUMN_SIZE;
      defs.push({
        id: "__expand__",
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: expansionColumnSize,
        minSize: expansionColumnSize,
        maxSize: expansionColumnSize,
        header: () => <span className="sr-only">{labels.expandRow}</span>,
        cell: ({ row, table }) => {
          const canExpandTree = hasTreeExpansion && row.getCanExpand();
          const canExpandDetail = Boolean(
            detailPanel && (detailPanel.getRowCanExpand?.(row.original) ?? true),
          );
          if (!canExpandTree && !canExpandDetail) {
            return null;
          }

          const isTreeExpanded = row.getIsExpanded();
          const isDetailExpanded =
            detailExpanded === true || Boolean(detailExpanded[row.id]);
          return (
            <div className="flex items-center justify-center gap-1">
              {canExpandTree ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={
                    isTreeExpanded ? labels.collapseRow : labels.expandRow
                  }
                  aria-expanded={isTreeExpanded}
                  data-tree-toggle="true"
                  onClick={() => row.toggleExpanded()}
                >
                  <IconChevronDown
                    className={cn(
                      "transition-transform",
                      isTreeExpanded ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </Button>
              ) : null}
              {canExpandDetail ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={
                    isDetailExpanded
                      ? hasTreeExpansion
                        ? (labels.collapseRowDetails ??
                          DATA_TABLE_DEFAULT_LABELS.collapseRowDetails)
                        : labels.collapseRow
                      : hasTreeExpansion
                        ? (labels.expandRowDetails ??
                          DATA_TABLE_DEFAULT_LABELS.expandRowDetails)
                        : labels.expandRow
                  }
                  aria-expanded={isDetailExpanded}
                  data-detail-toggle="true"
                  onClick={() => {
                    onDetailExpandedChange((current) =>
                      toggleDataTableExpandedState(
                        current,
                        row.id,
                        table.getCoreRowModel().flatRows.map((item) => item.id),
                      ),
                    );
                  }}
                >
                  <IconChevronDown
                    className={cn(
                      "transition-transform",
                      isDetailExpanded ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </Button>
              ) : null}
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
        header: ({ table }) => {
          const selectsFilteredRows = rowSelectionSelectAllScope === "filtered";
          const selectableRows = (selectsFilteredRows
            ? table.getFilteredRowModel().flatRows
            : table.getRowModel().flatRows
          ).filter((row) => row.getCanSelect() && row.getCanMultiSelect());
          const allSelected =
            selectableRows.length > 0 &&
            selectableRows.every((row) => row.getIsSelected());
          const someSelected = selectableRows.some((row) => row.getIsSelected());
          const label = selectsFilteredRows
            ? (labels.selectAllFilteredRows ??
              DATA_TABLE_DEFAULT_LABELS.selectAllFilteredRows)
            : (labels.selectAllVisibleRows ??
              DATA_TABLE_DEFAULT_LABELS.selectAllVisibleRows);

          if (selectableRows.length === 0) {
            return <span className="sr-only">{label}</span>;
          }

          return (
            <div className="flex items-center justify-center">
              <Checkbox
                className="my-0.5"
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  table.setRowSelection((current) => {
                    const next = { ...current };
                    for (const row of selectableRows) {
                      if (checked === true) {
                        next[row.id] = true;
                      } else {
                        delete next[row.id];
                      }
                    }
                    return next;
                  });
                }}
                aria-label={label}
              />
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              className="my-0.5"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                if (
                  !event.shiftKey ||
                  !lastSelectedRowIdRef.current ||
                  !row.getCanMultiSelect()
                ) {
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

    if (rowActions.length || editableRows) {
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
    detailExpanded,
    detailPanel,
    editingRowId,
    enableRowSelection,
    hasTreeExpansion,
    isSavingEdit,
    labels,
    lastSelectedRowIdRef,
    onDetailExpandedChange,
    rowSelectionSelectAllScope,
    rowActions,
    saveEdit,
    selectRowRange,
    startEditingRow,
  ]);
}
