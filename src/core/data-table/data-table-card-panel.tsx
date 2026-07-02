import * as React from "react";
import type { Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { DataTableLabels, DataTableProps } from "../types";
import type { DataTableUiClassNames, DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { useDataTableContainerWidth } from "./use-data-table-container-width";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";

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
  virtualization: DataTableProps<TData>["virtualization"];
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
  virtualization,
}: DataTableCardPanelProps<TData>) {
  const shouldRenderCards = shouldRenderInitialLoading || renderedRows.length > 0;
  const cardScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const { viewportElement, viewportHeight } = useDataTableScrollViewport(
    cardScrollContainerRef,
    shouldRenderCards,
  );
  const containerWidth = useDataTableContainerWidth(cardScrollContainerRef);
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
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual owns its instance functions.
  const cardVirtualizer = useVirtualizer({
    count: enableCardVirtualization ? virtualRowCount : 0,
    enabled: shouldUseVirtualCardRows,
    estimateSize: () => virtualizationConfig?.estimateCardHeight ?? 280,
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

  if (containerWidth >= 1536) {
    return 5;
  }
  if (containerWidth >= 1280) {
    return 4;
  }
  if (containerWidth >= 1024) {
    return 3;
  }
  if (containerWidth >= 640) {
    return 2;
  }
  return 1;
}
