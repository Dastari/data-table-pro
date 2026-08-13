import * as React from "react";
import { cn } from "../../lib/utils";
import type { DataTableCardPanelProps } from "./data-table-card-panel-types";
import type { DataTableTanStackRow as Row } from "./tanstack-v9";

export function DataTableBaseCardPanel<TData>({
  cardClassName,
  cardGridClassName,
  cardSizing,
  cardRenderer,
  currentRowSelection,
  currentDetailExpanded,
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
  detailPanel,
  resolvedLabels,
  resolvedLoadingRowCount,
  rowActions = [],
  ScrollArea,
  scrollbarVisibility,
  sentinelRef,
  setCurrentDetailExpanded,
  setCurrentRowSelection,
  setEditingRowId,
  shouldRenderInitialLoading,
  stateOverlayNode,
  tableContainerClassName,
  uiClassNames,
}: DataTableCardPanelProps<TData>) {
  const shouldRenderCards =
    shouldRenderInitialLoading || renderedRows.length > 0;
  const cardScrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const renderCardView = (
    rows: Array<Row<TData>>,
    options?: {
      isLoading?: boolean;
      loadingRowCount?: number;
    },
  ) => (
    <DataTableCardView
      rows={rows}
      cardRenderer={cardRenderer}
      cardGridClassName={cardGridClassName}
      cardClassName={cardClassName}
      cardSizing={cardSizing}
      rowActions={rowActions}
      editableRows={editableRows}
      detailPanel={detailPanel}
      detailExpanded={currentDetailExpanded}
      onDetailExpandedChange={setCurrentDetailExpanded}
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
      isLoading={options?.isLoading}
      loadingRowCount={options?.loadingRowCount}
      labels={resolvedLabels}
    />
  );

  return (
    <div
      ref={cardScrollContainerRef}
      data-dtp-slot="data-table-card-shell"
      className={cn(
        "relative box-border border-2 border-transparent transition-colors",
        flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
        dragAndDrop?.isDragging &&
          (uiClassNames.dragActive ?? "rounded-md border-dashed"),
      )}
    >
      <ScrollArea
        type={scrollbarVisibility}
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
            shouldRenderInitialLoading ? (
              renderCardView([], {
                isLoading: true,
                loadingRowCount: resolvedLoadingRowCount,
              })
            ) : (
              renderCardView(renderedRows)
            )
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
      {stateOverlayNode}
    </div>
  );
}
