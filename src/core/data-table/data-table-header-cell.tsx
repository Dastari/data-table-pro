import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { IconChevronDown, IconSelector } from "../icons";
import type { Header, SortingState } from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableDensity,
} from "../types";
import type { DataTableUiClassNames, DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import type { DataTableColumnLayout } from "./use-column-layout";
import {
  getDensityHeaderClassName,
  isUtilityColumnId,
} from "./data-table-utils";
import { headerAlignClassName, hideOnClassName } from "../types";

type DataTableHeaderCellProps<TData> = {
  currentDensity: DataTableDensity;
  currentSorting: SortingState;
  draggedColumnIdRef: React.MutableRefObject<string | null>;
  enableColumnReordering: boolean;
  enableColumnResizing: boolean;
  header: Header<TData, unknown>;
  headerGroupHeaders: Array<Header<TData, unknown>>;
  layout: DataTableColumnLayout;
  primeColumnForResize: (columnId: string, currentSize: number) => void;
  reorderColumn: (sourceColumnId: string, targetColumnId: string) => void;
  resetColumnSize: (columnId: string) => void;
  TableHead: DataTableUiKit["TableHead"];
  uiClassNames: DataTableUiClassNames;
};

function DataTableHeaderCellInner<TData>({
  currentDensity,
  currentSorting,
  draggedColumnIdRef,
  enableColumnReordering,
  enableColumnResizing,
  header,
  headerGroupHeaders,
  layout,
  primeColumnForResize,
  reorderColumn,
  resetColumnSize,
  TableHead,
  uiClassNames,
}: DataTableHeaderCellProps<TData>) {
  const meta = (header.column.columnDef as DataTableColumnDef<TData, unknown>)
    .meta;
  const canSort = header.column.getCanSort();
  const sortingState = header.column.getIsSorted();
  const sortingIndex = currentSorting.findIndex(
    (sort) => sort.id === header.column.id,
  );
  const canReorderColumn =
    enableColumnReordering &&
    !layout.isUtilityColumn &&
    !layout.isSpacerColumn;
  const hideClassName = hideOnClassName(meta?.hideOn);

  return (
    <TableHead
      key={header.id}
      className={cn(
        "relative border-b",
        getDensityHeaderClassName(currentDensity),
        layout.utilityClassName,
        layout.isSpacerColumn && "border-b-1 bg-transparent p-0",
        layout.pinnedClassName,
        hideClassName,
        headerAlignClassName(header.getContext()),
        meta?.headerClassName,
        meta?.responsiveClassName,
      )}
      style={layout.headerStyle}
      aria-sort={
        sortingState === "asc"
          ? "ascending"
          : sortingState === "desc"
            ? "descending"
            : canSort
              ? "none"
              : undefined
      }
      draggable={canReorderColumn}
      tabIndex={canReorderColumn ? 0 : undefined}
      onDragStart={
        canReorderColumn
          ? (event: React.DragEvent<HTMLTableCellElement>) => {
              draggedColumnIdRef.current = header.column.id;
              event.dataTransfer.effectAllowed = "move";
            }
          : undefined
      }
      onDragOver={
        canReorderColumn
          ? (event: React.DragEvent<HTMLTableCellElement>) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }
          : undefined
      }
      onDrop={
        canReorderColumn
          ? (event: React.DragEvent<HTMLTableCellElement>) => {
              event.preventDefault();
              const sourceColumnId = draggedColumnIdRef.current;
              draggedColumnIdRef.current = null;
              if (sourceColumnId) {
                reorderColumn(sourceColumnId, header.column.id);
              }
            }
          : undefined
      }
      onKeyDown={
        canReorderColumn
          ? (event: React.KeyboardEvent<HTMLTableCellElement>) => {
              if (
                !event.altKey ||
                (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
              ) {
                return;
              }

              event.preventDefault();
              const headers = headerGroupHeaders.filter(
                (item) =>
                  !isUtilityColumnId(item.column.id) &&
                  item.column.id !== "__spacer__",
              );
              const currentIndex = headers.findIndex(
                (item) => item.column.id === header.column.id,
              );
              const target =
                headers[
                  event.key === "ArrowLeft"
                    ? currentIndex - 1
                    : currentIndex + 1
                ];
              if (target) {
                reorderColumn(header.column.id, target.column.id);
              }
            }
          : undefined
      }
    >
      {header.isPlaceholder ? null : canSort ? (
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 font-medium",
            headerAlignClassName(header.getContext()),
          )}
          onClick={header.column.getToggleSortingHandler()}
        >
          <span className="truncate">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {sortingState ? (
            <>
              <IconChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform",
                  sortingState === "desc" ? "rotate-0" : "rotate-180",
                )}
              />
              {currentSorting.length > 1 && sortingIndex >= 0 ? (
                <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none">
                  {sortingIndex + 1}
                </span>
              ) : null}
            </>
          ) : (
            <IconSelector
              className={cn(
                "size-4 shrink-0",
                uiClassNames.headerSortIcon ?? "opacity-70",
              )}
            />
          )}
        </button>
      ) : (
        flexRender(header.column.columnDef.header, header.getContext())
      )}

      {enableColumnResizing && header.column.getCanResize() ? (
        <div
          onDoubleClick={() => {
            resetColumnSize(header.column.id);
          }}
          onMouseDown={(event) => {
            primeColumnForResize(header.column.id, header.getSize());
            header.getResizeHandler()(event);
          }}
          onTouchStart={(event) => {
            primeColumnForResize(header.column.id, header.getSize());
            header.getResizeHandler()(event);
          }}
          className={cn(
            "absolute inset-y-0 right-0 z-50 h-full w-3 translate-x-1/2 cursor-col-resize touch-none select-none after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2",
            uiClassNames.resizeHandle ??
              "after:bg-current after:opacity-20 hover:after:opacity-70",
            header.column.getIsResizing() &&
              (uiClassNames.resizeHandleActive ?? "after:opacity-100"),
          )}
        />
      ) : null}
    </TableHead>
  );
}

function areDataTableHeaderCellsEqual<TData>(
  previous: DataTableHeaderCellProps<TData>,
  next: DataTableHeaderCellProps<TData>,
) {
  return (
    previous.header.id === next.header.id &&
    previous.header.column.id === next.header.column.id &&
    previous.currentDensity === next.currentDensity &&
    previous.enableColumnReordering === next.enableColumnReordering &&
    previous.enableColumnResizing === next.enableColumnResizing &&
    previous.TableHead === next.TableHead &&
    previous.uiClassNames === next.uiClassNames &&
    previous.draggedColumnIdRef === next.draggedColumnIdRef &&
    previous.primeColumnForResize === next.primeColumnForResize &&
    previous.reorderColumn === next.reorderColumn &&
    previous.resetColumnSize === next.resetColumnSize &&
    sameSorting(previous.currentSorting, next.currentSorting) &&
    sameHeaderGroupHeaders(
      previous.headerGroupHeaders,
      next.headerGroupHeaders,
    ) &&
    sameHeaderLayout(previous.layout, next.layout)
  );
}

function sameSorting(previous: SortingState, next: SortingState) {
  return (
    previous.length === next.length &&
    previous.every((sort, index) => {
      const nextSort = next[index];
      return nextSort?.id === sort.id && nextSort.desc === sort.desc;
    })
  );
}

function sameHeaderGroupHeaders<TData>(
  previous: Array<Header<TData, unknown>>,
  next: Array<Header<TData, unknown>>,
) {
  return (
    previous.length === next.length &&
    previous.every((header, index) => next[index]?.id === header.id)
  );
}

function sameHeaderLayout(
  previous: DataTableColumnLayout,
  next: DataTableColumnLayout,
) {
  return (
    previous.fixedSide === next.fixedSide &&
    previous.isSpacerColumn === next.isSpacerColumn &&
    previous.isUtilityColumn === next.isUtilityColumn &&
    previous.pinnedClassName === next.pinnedClassName &&
    previous.utilityClassName === next.utilityClassName &&
    previous.headerStyle?.width === next.headerStyle?.width &&
    previous.headerStyle?.minWidth === next.headerStyle?.minWidth &&
    previous.headerStyle?.maxWidth === next.headerStyle?.maxWidth &&
    previous.headerStyle?.insetInlineStart ===
      next.headerStyle?.insetInlineStart &&
    previous.headerStyle?.insetInlineEnd === next.headerStyle?.insetInlineEnd
  );
}

export const DataTableHeaderCell = React.memo(
  DataTableHeaderCellInner,
  areDataTableHeaderCellsEqual,
) as typeof DataTableHeaderCellInner;
