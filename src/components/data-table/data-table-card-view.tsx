import * as React from "react";
import type { Row } from "@tanstack/react-table";
import type {
  DataTableCardRendererProps,
  DataTableEditableRowsConfig,
  DataTableRowAction,
} from "./types";
import { Checkbox } from "../ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { Card, CardHeader } from "../ui/card";
import { cn } from "../../lib/utils";

type DataTableCardViewProps<TData> = {
  rows: Array<Row<TData>>;
  cardRenderer: (props: DataTableCardRendererProps<TData>) => React.ReactNode;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (rowSelection: Record<string, boolean>) => void;
  enableRowSelection: boolean;
  editingRowId: string | null;
  onEditingRowIdChange: (rowId: string | null) => void;
  getRowClassName?: (row: TData) => string | undefined;
  onRowClick?: (context: { row: TData; rowId: string }) => void | Promise<void>;
  getRowDraggable?: (row: TData) => boolean;
  onRowDragStart?: (context: {
    row: TData;
    rowId: string;
    event: React.DragEvent<HTMLElement>;
  }) => void;
  onRowDragEnd?: (context: {
    row: TData;
    rowId: string;
    event: React.DragEvent<HTMLElement>;
  }) => void;
};

export function DataTableCardView<TData>({
  rows,
  cardRenderer,
  rowActions,
  editableRows,
  rowSelection,
  onRowSelectionChange,
  enableRowSelection,
  editingRowId,
  onEditingRowIdChange,
  getRowClassName,
  onRowClick,
  getRowDraggable,
  onRowDragStart,
  onRowDragEnd,
}: DataTableCardViewProps<TData>) {
  return (
    <div className="flex flex-wrap gap-4 p-2">
      {rows.map((row) => {
        const rowId = row.id;
        const originalRow = row.original;
        const isSelected = Boolean(rowSelection[rowId]);
        const isEditing = editingRowId === rowId;

        return (
          <Card
            key={rowId}
            draggable={getRowDraggable?.(originalRow) ?? false}
            data-state={isSelected ? "selected" : undefined}
            className={cn(
              [getRowClassName?.(originalRow)].filter(Boolean).join(" "),
              "relative gap-0 py-0 transition transition-colors hover:scale-101 hover:bg-muted/50 data-[state=selected]:scale-101 data-[state=selected]:bg-primary/10",
              onRowClick && "cursor-pointer",
              isSelected ? "bg-accent ring-primary" : "border-default",
            )}
            onClick={(event) => {
              const target = event.target as HTMLElement | null;
              if (
                !onRowClick ||
                target?.closest("[data-row-click-ignore='true']")
              ) {
                return;
              }

              void onRowClick({ row: originalRow, rowId });
            }}
            onDragStart={(event) => {
              onRowDragStart?.({ row: originalRow, rowId, event });
            }}
            onDragEnd={(event) => {
              onRowDragEnd?.({ row: originalRow, rowId, event });
            }}
          >
            <div className="flex min-h-full grow">
              {cardRenderer({
                row: originalRow,
                rowId,
                isSelected,
                onSelectedChange: (nextValue) => {
                  onRowSelectionChange({
                    ...rowSelection,
                    [rowId]: nextValue,
                  });
                },
                actions: rowActions,
                isEditing,
                startEditing: () => {
                  onEditingRowIdChange(rowId);
                },
                cancelEditing: () => {
                  onEditingRowIdChange(null);
                },
              })}
            </div>
            <CardHeader className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-row items-center gap-3 space-y-0 bg-linear-to-b from-background/95 via-background/85 to-transparent px-4 pt-4 pb-8">
              {enableRowSelection ? (
                <div
                  data-row-click-ignore="true"
                  className="pointer-events-auto"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      onRowSelectionChange({
                        ...rowSelection,
                        [rowId]: checked === true,
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="size-4 shrink-0" />
              )}
              <div className="min-w-0 flex-1" />
              <div data-row-click-ignore="true" className="pointer-events-auto">
                <DataTableRowActions
                  row={originalRow}
                  rowActions={rowActions}
                  editableRows={editableRows}
                  isEditing={isEditing}
                  onStartEditing={() => {
                    onEditingRowIdChange(rowId);
                  }}
                  onCancelEditing={() => {
                    onEditingRowIdChange(null);
                  }}
                />
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
