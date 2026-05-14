import * as React from "react";
import type { Row } from "@tanstack/react-table";
import type {
  DataTableCardRendererProps,
  DataTableEditableRowsConfig,
  DataTableRowAction,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";

type DataTableCardViewProps<TData> = {
  rows: Array<Row<TData>>;
  cardRenderer: (props: DataTableCardRendererProps<TData>) => React.ReactNode;
  cardGridClassName?: string;
  cardClassName?: string;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  hasCardTitle: boolean;
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
  isLoading?: boolean;
  loadingRowCount?: number;
};

type DataTableRowActionsComponent = <TData>(props: {
  row: TData;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
}) => React.ReactElement | null;

export function createDataTableCardView(
  ui: DataTableUiKit,
  DataTableRowActions: DataTableRowActionsComponent,
) {
  const uiClassNames = ui.classNames ?? {};
  const { Card, CardContent, CardHeader, Checkbox, Skeleton } = ui;

  return function DataTableCardView<TData>({
    rows,
    cardRenderer,
    cardGridClassName,
    cardClassName,
    rowActions,
    editableRows,
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
  }: DataTableCardViewProps<TData>) {
    const resolvedCardGridClassName =
      cardGridClassName ??
      "grid-cols-[repeat(auto-fit,minmax(min(18rem,100%),1fr))]";
    const cardGridClasses = cn(
      "grid min-h-0 w-full gap-4 p-1",
      uiClassNames.cardGrid,
      resolvedCardGridClassName,
    );
    const cardItemClasses = (stateClassName?: string) =>
      cn(
        "relative w-full min-w-0 gap-0 overflow-hidden bg-transparent p-0",
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
          const showCardGradient =
            enableRowSelection || hasCardActions || hasCardTitle;
          const showCardOverlayControls = enableRowSelection || hasCardActions;
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
              draggable={getRowDraggable?.(originalRow) ?? false}
              data-dtp-slot="data-table-card-item"
              data-state={isSelected ? "selected" : undefined}
              className={cardItemClasses(
                cn(
                  [getRowClassName?.(originalRow)].filter(Boolean).join(" "),
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
                  "flex min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-[inherit] [&>*]:w-full [&>*]:min-w-0",
                  onRowClick && "cursor-pointer focus-visible:outline-none",
                )}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  const target = event.target as HTMLElement | null;
                  if (target?.closest("[data-row-click-ignore='true']")) {
                    return;
                  }

                  handleCardActivate();
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                  const target = event.target as HTMLElement | null;
                  if (target?.closest("[data-row-click-ignore='true']")) {
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
                  isSelected,
                  onSelectedChange: (nextValue) => {
                    onRowSelectionChange(
                      updateRowSelection(rowSelection, rowId, nextValue),
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
              {showCardOverlayControls ? (
                <CardHeader className="absolute inset-x-0 top-0 z-20 flex flex-row items-center gap-3 space-y-0 px-4 pt-4 pb-8">
                  {enableRowSelection ? (
                    <div
                      data-row-click-ignore="true"
                      className="pointer-events-auto"
                    >
                      <Checkbox
                        checked={isSelected}
                        aria-label={`Select row ${rowId}`}
                        onCheckedChange={(checked: boolean | "indeterminate") => {
                          onRowSelectionChange(
                            updateRowSelection(
                              rowSelection,
                              rowId,
                              checked === true,
                            ),
                          );
                        }}
                      />
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

function updateRowSelection(
  rowSelection: Record<string, boolean>,
  rowId: string,
  isSelected: boolean,
) {
  if (isSelected) {
    return {
      ...rowSelection,
      [rowId]: true,
    };
  }

  if (!rowSelection[rowId]) {
    return rowSelection;
  }

  const nextSelection = { ...rowSelection };
  delete nextSelection[rowId];
  return nextSelection;
}
