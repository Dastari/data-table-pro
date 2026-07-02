import * as React from "react";
import type { Row } from "@tanstack/react-table";
import type { DataTableLabels, DataTableProps } from "../types";
import type { DataTableUiClassNames, DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";

type DataTableCardPanelProps<TData> = {
  cardClassName: string | undefined;
  cardGridClassName: string | undefined;
  cardRenderer: NonNullable<DataTableProps<TData>["cardRenderer"]>;
  currentRowSelection: Record<string, boolean>;
  DataTableCardView: React.ElementType;
  DataTableEmptyState: React.ElementType;
  dragAndDrop: DataTableProps<TData>["dragAndDrop"];
  editableRows: DataTableProps<TData>["editableRows"];
  editingRowId: string | null;
  emptyNode: React.ReactNode;
  enableRowSelection: boolean;
  flexGrow: boolean;
  getRowClassName: DataTableProps<TData>["getRowClassName"];
  hasCardTitle: boolean;
  infiniteScroll: DataTableProps<TData>["infiniteScroll"];
  localSearchValue: string;
  onRowClick: DataTableProps<TData>["onRowClick"];
  renderedRows: Array<Row<TData>>;
  renderExpandedRow: DataTableProps<TData>["renderExpandedRow"];
  resolvedLabels: DataTableLabels;
  resolvedLoadingRowCount: number;
  rowActions: DataTableProps<TData>["rowActions"];
  ScrollArea: DataTableUiKit["ScrollArea"];
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  setCurrentRowSelection: (rowSelection: Record<string, boolean>) => void;
  setEditingRowId: React.Dispatch<React.SetStateAction<string | null>>;
  shouldRenderInitialLoading: boolean;
  tableContainerClassName: string | undefined;
  uiClassNames: DataTableUiClassNames;
};

export function DataTableCardPanel<TData>({
  cardClassName,
  cardGridClassName,
  cardRenderer,
  currentRowSelection,
  DataTableCardView,
  DataTableEmptyState,
  dragAndDrop,
  editableRows,
  editingRowId,
  emptyNode,
  enableRowSelection,
  flexGrow,
  getRowClassName,
  hasCardTitle,
  infiniteScroll,
  localSearchValue,
  onRowClick,
  renderedRows,
  renderExpandedRow,
  resolvedLabels,
  resolvedLoadingRowCount,
  rowActions = [],
  ScrollArea,
  sentinelRef,
  setCurrentRowSelection,
  setEditingRowId,
  shouldRenderInitialLoading,
  tableContainerClassName,
  uiClassNames,
}: DataTableCardPanelProps<TData>) {
  const shouldRenderCards = shouldRenderInitialLoading || renderedRows.length > 0;

  return (
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
          {shouldRenderCards ? (
            <DataTableCardView
              rows={shouldRenderInitialLoading ? [] : renderedRows}
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
              isLoading={shouldRenderInitialLoading || undefined}
              loadingRowCount={
                shouldRenderInitialLoading ? resolvedLoadingRowCount : undefined
              }
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

          {infiniteScroll?.enabled && !shouldRenderInitialLoading ? (
            <div className="shrink-0 px-4 pb-4">
              <div ref={sentinelRef} className="h-4 w-full" />
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
