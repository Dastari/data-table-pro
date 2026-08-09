import * as React from "react";
import type { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../../lib/utils";
import { DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS } from "../types";
import type { DataTableCardPanelProps } from "./data-table-card-panel-types";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";

export function DataTableVirtualCardPanel<TData>({
  cardClassName,
  cardGridClassName,
  cardSizing,
  cardRenderer,
  containerWidth,
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
  sentinelRef,
  setCurrentRowSelection,
  setEditingRowId,
  shouldRenderInitialLoading,
  tableContainerClassName,
  uiClassNames,
  virtualization,
}: DataTableCardPanelProps<TData>) {
  const shouldRenderCards = shouldRenderInitialLoading || renderedRows.length > 0;
  const cardScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const { viewportElement, viewportHeight } = useDataTableScrollViewport(
    cardScrollContainerRef,
    shouldRenderCards,
  );
  const virtualizationConfig =
    typeof virtualization === "object" ? virtualization.card : undefined;
  const enableCardVirtualization =
    !shouldRenderInitialLoading &&
    renderedRows.length > 0 &&
    virtualizationConfig?.enabled === true;
  const lanes = resolveCardVirtualizationLanes(
    virtualizationConfig?.lanes,
    containerWidth,
  );
  const virtualRowCount = Math.ceil(renderedRows.length / lanes);
  const shouldUseVirtualCardRows =
    enableCardVirtualization && Boolean(viewportElement) && viewportHeight > 0;
  const getItemKey = React.useCallback(
    (index: number) => renderedRows[index * lanes]?.id ?? index,
    [lanes, renderedRows],
  );
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual owns its instance functions.
  const cardVirtualizer = useVirtualizer({
    count: enableCardVirtualization ? virtualRowCount : 0,
    enabled: shouldUseVirtualCardRows,
    estimateSize: () => virtualizationConfig?.estimateCardHeight ?? 280,
    getItemKey,
    getScrollElement: () => viewportElement,
    overscan: virtualizationConfig?.overscan ?? 4,
  });
  const virtualCardRows = shouldUseVirtualCardRows
    ? cardVirtualizer.getVirtualItems()
    : [];

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
            shouldRenderInitialLoading ? (
              renderCardView([], {
                isLoading: true,
                loadingRowCount: resolvedLoadingRowCount,
              })
            ) : shouldUseVirtualCardRows ? (
              <div
                data-dtp-slot="data-table-card-virtualizer"
                style={{
                  height: cardVirtualizer.getTotalSize(),
                  position: "relative",
                  width: "100%",
                }}
              >
                {virtualCardRows.map((virtualRow) => {
                  const startIndex = virtualRow.index * lanes;
                  const rows = renderedRows.slice(
                    startIndex,
                    startIndex + lanes,
                  );

                  return (
                    <div
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={cardVirtualizer.measureElement}
                      style={{
                        left: 0,
                        position: "absolute",
                        top: 0,
                        transform: `translateY(${virtualRow.start}px)`,
                        width: "100%",
                      }}
                    >
                      {renderCardView(rows)}
                    </div>
                  );
                })}
              </div>
            ) : (
              renderCardView(
                renderedRows.slice(
                  0,
                  Math.max(
                    1,
                    Math.floor(
                      virtualizationConfig?.fallbackCardCount ?? 12,
                    ),
                  ),
                ),
              )
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
    </div>
  );
}

function resolveCardVirtualizationLanes(
  configuredLanes: number | "auto" | undefined,
  containerWidth: number,
) {
  if (typeof configuredLanes === "number") {
    return Math.max(1, Math.floor(configuredLanes));
  }

  if (configuredLanes !== "auto") {
    return 1;
  }

  if (containerWidth >= DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS["2xl"]) {
    return 5;
  }
  if (containerWidth >= DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS.xl) {
    return 4;
  }
  if (containerWidth >= DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS.lg) {
    return 3;
  }
  if (containerWidth >= DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS.sm) {
    return 2;
  }
  return 1;
}
