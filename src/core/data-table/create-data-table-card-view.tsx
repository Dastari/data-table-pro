import * as React from "react";
import type { ExpandedState, OnChangeFn } from "@tanstack/react-table";
import { IconChevronDown } from "../icons";
import type {
  DataTableCardRendererProps,
  DataTableCardSizing,
  DataTableEditableRowsConfig,
  DataTableDetailPanel,
  DataTableLabels,
  DataTableProps,
  DataTableRowAction,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { DATA_TABLE_DEFAULT_LABELS } from "./data-table-labels";
import {
  isDataTableInteractiveTarget,
  toggleDataTableExpandedState,
} from "./data-table-utils";
import type { DataTableTanStackRow as Row } from "./tanstack-v9";

type DataTableCardViewProps<TData> = {
  rows: Array<Row<TData>>;
  cardRenderer: (props: DataTableCardRendererProps<TData>) => React.ReactNode;
  cardSizing?: DataTableCardSizing;
  cardGridClassName?: string;
  cardClassName?: string;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  detailPanel?: DataTableDetailPanel<TData>;
  detailExpanded: ExpandedState;
  onDetailExpandedChange: OnChangeFn<ExpandedState>;
  hasCardTitle: boolean;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (rowSelection: Record<string, boolean>) => void;
  enableRowSelection: boolean;
  editingRowId: string | null;
  onEditingRowIdChange: (rowId: string | null) => void;
  getRowClassName?: DataTableProps<TData>["getRowClassName"];
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
  isLoading?: boolean;
  loadingRowCount?: number;
  labels: DataTableLabels;
};

type DataTableRowActionsComponent = <TData>(props: {
  row: TData;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  labels: DataTableLabels;
}) => React.ReactElement | null;

export function createDataTableCardView(
  ui: DataTableUiKit,
  DataTableRowActions: DataTableRowActionsComponent,
) {
  const uiClassNames = ui.classNames ?? {};
  const { Button, Card, CardContent, CardHeader, Checkbox, Skeleton } = ui;

  return function DataTableCardView<TData>({
    rows,
    cardRenderer,
    cardSizing = "fixed",
    cardGridClassName,
    cardClassName,
    rowActions,
    editableRows,
    detailPanel,
    detailExpanded,
    onDetailExpandedChange,
    hasCardTitle,
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
    isLoading = false,
    loadingRowCount = 5,
    labels,
  }: DataTableCardViewProps<TData>) {
    const resolvedCardSizing = cardSizing ?? "fixed";
    const resolvedCardGridClassName =
      cardGridClassName
        ? cn("grid", cardGridClassName)
        : getCardGridClassName(resolvedCardSizing);
    const cardGridClasses = cn(
      "min-h-0 w-full gap-4 p-1",
      uiClassNames.cardGrid,
      resolvedCardGridClassName,
    );
    const cardItemClasses = (stateClassName?: string) =>
      cn(
        "relative min-w-0 max-w-full gap-0 overflow-hidden bg-transparent p-0",
        getCardItemClassName(resolvedCardSizing),
        uiClassNames.cardItem,
        cardClassName,
        stateClassName,
      );

    if (isLoading) {
      return (
        <div
          role="list"
          data-dtp-slot="data-table-card-grid"
          className={cardGridClasses}
        >
          {Array.from({ length: Math.max(1, loadingRowCount) }, (_, index) => (
            <Card
              key={`loading-card-${index}`}
              role="listitem"
              aria-hidden="true"
              data-dtp-slot="data-table-card-item"
              className={cardItemClasses("min-h-52")}
            >
              {hasCardTitle ? (
                <CardHeader className="px-4 pt-4 pb-3">
                  <Skeleton className="h-5 w-40 max-w-[70%]" />
                  <Skeleton className="h-4 w-24 max-w-[40%]" />
                </CardHeader>
              ) : null}
              <CardContent
                className={cn("space-y-3 pb-4", hasCardTitle ? "" : "pt-4")}
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[82%]" />
                <Skeleton className="h-4 w-[68%]" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div
        role="list"
        data-dtp-slot="data-table-card-grid"
        className={cardGridClasses}
      >
        {rows.map((row) => {
          const rowId = row.id;
          const originalRow = row.original;
          const isSelected = Boolean(rowSelection[rowId]);
          const isEditing = editingRowId === rowId;
          const hasCardActions = rowActions.length > 0 || Boolean(editableRows);
          const canExpandDetail = Boolean(
            detailPanel && (detailPanel.getRowCanExpand?.(originalRow) ?? true),
          );
          const showCardGradient =
            enableRowSelection || hasCardActions || hasCardTitle;
          const showCardOverlayControls =
            enableRowSelection ||
            hasCardActions ||
            row.getCanExpand() ||
            canExpandDetail;
          const handleCardActivate = () => {
            if (!onRowClick) {
              return;
            }

            void onRowClick({ row: originalRow, rowId });
          };

          return (
            <Card
              key={rowId}
              role="listitem"
              data-row-id={rowId}
              data-tree-depth={row.depth}
              draggable={getRowDraggable?.(originalRow) ?? false}
              data-dtp-slot="data-table-card-item"
              data-state={isSelected ? "selected" : undefined}
              className={cardItemClasses(
                cn(
                  [
                    getRowClassName?.(originalRow, {
                      row: originalRow,
                      rowId,
                      rowIndex: row.index,
                      isEditing,
                      isExpanded: row.getIsExpanded(),
                      isLoading: false,
                      isSelected,
                      pinnedPosition: false,
                    }),
                  ]
                    .filter(Boolean)
                    .join(" "),
                  "transition transition-colors hover:scale-101 data-[state=selected]:scale-101",
                  uiClassNames.card,
                  isSelected
                    ? uiClassNames.cardSelected
                    : uiClassNames.cardUnselected,
                ),
              )}
              onDragStart={(event: React.DragEvent<HTMLElement>) => {
                onRowDragStart?.({ row: originalRow, rowId, event });
              }}
              onDragEnd={(event: React.DragEvent<HTMLElement>) => {
                onRowDragEnd?.({ row: originalRow, rowId, event });
              }}
            >
              {showCardGradient ? (
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-linear-to-b opacity-0 transition-opacity group-hover/card:opacity-100",
                    uiClassNames.cardOverlay ??
                      "from-transparent via-transparent to-transparent",
                  )}
                />
              ) : null}
              <div
                data-dtp-slot="data-table-card-renderer"
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={cn(
                  "flex min-h-0 max-w-full min-w-0 overflow-hidden rounded-[inherit] [&>*]:min-w-0",
                  getCardRendererClassName(resolvedCardSizing),
                  onRowClick && "cursor-pointer focus-visible:outline-none",
                )}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  if (
                    isDataTableInteractiveTarget(
                      event.target,
                      event.currentTarget,
                    )
                  ) {
                    return;
                  }

                  handleCardActivate();
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                  if (
                    isDataTableInteractiveTarget(
                      event.target,
                      event.currentTarget,
                    )
                  ) {
                    return;
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleCardActivate();
                  }
                }}
              >
                {cardRenderer({
                  row: originalRow,
                  rowId,
                  depth: row.depth,
                  canExpandSubRows: row.getCanExpand(),
                  isSubRowsExpanded: row.getIsExpanded(),
                  toggleSubRowsExpanded: () => row.toggleExpanded(),
                  isSelected,
                  onSelectedChange: (nextValue) => {
                    onRowSelectionChange(
                      updateRowSelection(
                        rowSelection,
                        rowId,
                        nextValue,
                        row.getCanSelect(),
                        row.getCanMultiSelect(),
                      ),
                    );
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
              {isEditing ||
              !detailPanel ||
              !(detailExpanded === true || Boolean(detailExpanded[row.id]))
                ? null
                : (
                    <div
                      data-dtp-slot="data-table-card-detail-panel"
                      className="relative z-20 min-w-0"
                    >
                      {detailPanel.render({
                        row: originalRow,
                        rowId,
                        tableRow: row,
                      })}
                    </div>
                  )}
              {showCardOverlayControls ? (
                <CardHeader className="absolute inset-x-0 top-0 z-20 flex flex-row items-center gap-3 space-y-0 px-4 pt-4 pb-8">
                  {enableRowSelection ? (
                    <div
                      data-row-click-ignore="true"
                      className="pointer-events-auto"
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={!row.getCanSelect()}
                        aria-label={(
                          labels.selectCardRow ??
                          DATA_TABLE_DEFAULT_LABELS.selectCardRow
                        )(rowId)}
                        onCheckedChange={(checked: boolean | "indeterminate") => {
                          onRowSelectionChange(
                            updateRowSelection(
                              rowSelection,
                              rowId,
                              checked === true,
                              row.getCanSelect(),
                              row.getCanMultiSelect(),
                            ),
                          );
                        }}
                      />
                    </div>
                  ) : null}
                  {row.getCanExpand() ? (
                    <div data-row-click-ignore="true" className="pointer-events-auto">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={
                          row.getIsExpanded()
                            ? labels.collapseRow
                            : labels.expandRow
                        }
                        aria-expanded={row.getIsExpanded()}
                        onClick={() => row.toggleExpanded()}
                      >
                        <IconChevronDown
                          className={cn(
                            "transition-transform",
                            row.getIsExpanded() ? "rotate-0" : "-rotate-90",
                          )}
                        />
                      </Button>
                    </div>
                  ) : null}
                  {canExpandDetail ? (
                    <div
                      data-row-click-ignore="true"
                      className="pointer-events-auto"
                    >
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={
                          detailExpanded === true || detailExpanded[row.id]
                            ? row.getCanExpand()
                              ? (labels.collapseRowDetails ??
                                DATA_TABLE_DEFAULT_LABELS.collapseRowDetails)
                              : labels.collapseRow
                            : row.getCanExpand()
                              ? (labels.expandRowDetails ??
                                DATA_TABLE_DEFAULT_LABELS.expandRowDetails)
                              : labels.expandRow
                        }
                        aria-expanded={
                          detailExpanded === true ||
                          Boolean(detailExpanded[row.id])
                        }
                        data-detail-toggle="true"
                        onClick={() => {
                          onDetailExpandedChange((current) =>
                            toggleDataTableExpandedState(
                              current,
                              row.id,
                              rows.map((item) => item.id),
                            ),
                          );
                        }}
                      >
                        <IconChevronDown
                          className={cn(
                            "transition-transform",
                            detailExpanded === true || detailExpanded[row.id]
                              ? "rotate-0"
                              : "-rotate-90",
                          )}
                        />
                      </Button>
                    </div>
                  ) : null}
                  <div className="pointer-events-none min-w-0 flex-1" />
                  {hasCardActions ? (
                    <div
                      data-row-click-ignore="true"
                      className="pointer-events-auto"
                    >
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
                        labels={labels}
                      />
                    </div>
                  ) : null}
                </CardHeader>
              ) : null}
            </Card>
          );
        })}
      </div>
    );
  };
}

function getCardGridClassName(cardSizing: DataTableCardSizing) {
  switch (cardSizing) {
    case "content":
      return "flex flex-wrap items-start justify-start";
    case "fluid":
      return "grid grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))]";
    case "fixed":
    default:
      return "grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),18rem))] justify-start";
  }
}

function getCardItemClassName(cardSizing: DataTableCardSizing) {
  switch (cardSizing) {
    case "content":
      return "w-fit";
    case "fluid":
      return "w-full";
    case "fixed":
    default:
      return undefined;
  }
}

function getCardRendererClassName(cardSizing: DataTableCardSizing) {
  switch (cardSizing) {
    case "content":
      return "w-fit";
    case "fluid":
      return "w-full flex-1 [&>*]:w-full";
    case "fixed":
    default:
      return "flex-1";
  }
}

function updateRowSelection(
  rowSelection: Record<string, boolean>,
  rowId: string,
  isSelected: boolean,
  canSelect: boolean,
  canMultiSelect: boolean,
) {
  if (!canSelect) {
    return rowSelection;
  }

  if (isSelected) {
    return canMultiSelect
      ? {
          ...rowSelection,
          [rowId]: true,
        }
      : { [rowId]: true };
  }

  if (!rowSelection[rowId]) {
    return rowSelection;
  }

  const nextSelection = { ...rowSelection };
  delete nextSelection[rowId];
  return nextSelection;
}
