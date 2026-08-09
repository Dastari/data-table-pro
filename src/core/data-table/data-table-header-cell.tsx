import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import { IconChevronDown, IconSelector } from "../icons";
import type { Header, SortingState } from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableColumnGroupDef,
  DataTableDensity,
  DataTableProps,
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
  columnGroupHeaderHeight: DataTableProps<TData>["columnGroupHeaderHeight"];
  currentDensity: DataTableDensity;
  currentSorting: SortingState;
  dir: NonNullable<DataTableProps<TData>["dir"]>;
  draggedColumnIdRef: React.MutableRefObject<string | null>;
  enableColumnReordering: boolean;
  enableColumnResizing: boolean;
  gridColumnIndex?: number;
  gridMode: boolean;
  header: Header<TData, unknown>;
  headerGroupHeaders: Array<Header<TData, unknown>>;
  layout: DataTableColumnLayout;
  primeColumnForResize: (columnId: string, currentSize: number) => void;
  reorderColumn: (sourceColumnId: string, targetColumnId: string) => void;
  resizeColumnLabel: string;
  resetColumnSize: (columnId: string) => void;
  // Rendered through flexRender inside the header def; carried as a prop so
  // the memo comparator re-renders the selection header when it changes.
  selectionState?: boolean | "indeterminate";
  TableHead: DataTableUiKit["TableHead"];
  uiClassNames: DataTableUiClassNames;
};

function DataTableHeaderCellInner<TData>({
  columnGroupHeaderHeight,
  currentDensity,
  currentSorting,
  dir,
  draggedColumnIdRef,
  enableColumnReordering,
  enableColumnResizing,
  gridColumnIndex,
  gridMode,
  header,
  headerGroupHeaders,
  layout,
  primeColumnForResize,
  reorderColumn,
  resizeColumnLabel,
  resetColumnSize,
  TableHead,
  uiClassNames,
}: DataTableHeaderCellProps<TData>) {
  const meta = (header.column.columnDef as DataTableColumnDef<TData, unknown>)
    .meta;
  const headerContentId = React.useId();
  const isColumnGroup =
    !header.isPlaceholder && header.subHeaders.length > 0;
  const groupDefinition = isColumnGroup
    ? (header.column.columnDef as DataTableColumnGroupDef<TData>)
    : undefined;
  const canSort = header.column.getCanSort();
  const sortingState = header.column.getIsSorted();
  const sortingIndex = currentSorting.findIndex(
    (sort) => sort.id === header.column.id,
  );
  const canReorderColumn =
    enableColumnReordering &&
    !header.isPlaceholder &&
    !isColumnGroup &&
    !layout.isUtilityColumn &&
    !layout.isSpacerColumn;
  const hideClassName = hideOnClassName(meta?.hideOn);

  return (
    <TableHead
      key={header.id}
      colSpan={header.colSpan}
      scope={
        header.isPlaceholder ? undefined : isColumnGroup ? "colgroup" : "col"
      }
      role={gridMode ? "columnheader" : undefined}
      aria-colindex={gridMode ? gridColumnIndex : undefined}
      aria-hidden={header.isPlaceholder || undefined}
      aria-description={isColumnGroup ? groupDefinition?.description : undefined}
      aria-labelledby={
        !header.isPlaceholder &&
        !layout.isUtilityColumn &&
        !layout.isSpacerColumn
          ? headerContentId
          : undefined
      }
      data-column-id={header.column.id}
      data-column-group-id={isColumnGroup ? groupDefinition?.id : undefined}
      data-header-depth={header.depth}
      data-dtp-slot={
        isColumnGroup
          ? "data-table-column-group-header"
          : "data-table-column-header"
      }
      className={cn(
        "relative border-b",
        getDensityHeaderClassName(currentDensity),
        isColumnGroup && uiClassNames.columnGroupHeader,
        layout.utilityClassName,
        layout.isSpacerColumn && "border-b-1 bg-transparent p-0",
        layout.pinnedClassName,
        hideClassName,
        headerAlignClassName(header.getContext()),
        meta?.headerClassName,
        isColumnGroup && groupDefinition?.headerClassName,
        meta?.responsiveClassName,
      )}
      style={{
        ...meta?.headerStyle,
        ...(isColumnGroup ? groupDefinition?.headerStyle : undefined),
        ...(isColumnGroup &&
        (groupDefinition?.headerHeight ?? columnGroupHeaderHeight) !== undefined
          ? {
              height:
                groupDefinition?.headerHeight ?? columnGroupHeaderHeight,
            }
          : undefined),
        ...layout.headerStyle,
      }}
      title={isColumnGroup ? groupDefinition?.description : undefined}
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
      tabIndex={
        canReorderColumn &&
        !canSort &&
        !(enableColumnResizing && header.column.getCanResize())
          ? 0
          : undefined
      }
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
                  (event.key === "ArrowLeft") !== (dir === "rtl")
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
          <span id={headerContentId} className="truncate">
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
        layout.isUtilityColumn || layout.isSpacerColumn ? (
          flexRender(header.column.columnDef.header, header.getContext())
        ) : (
          <span id={headerContentId}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
        )
      )}

      {enableColumnResizing &&
      !header.isPlaceholder &&
      header.column.getCanResize() ? (
        <div
          aria-label={resizeColumnLabel}
          aria-orientation="vertical"
          aria-valuemax={getHeaderMaximumSize(header)}
          aria-valuemin={getHeaderMinimumSize(header)}
          aria-valuenow={Math.round(header.getSize())}
          role="separator"
          tabIndex={0}
          onDoubleClick={() => {
            for (const leafHeader of getResizableLeafHeaders(header)) {
              resetColumnSize(leafHeader.column.id);
            }
          }}
          onMouseDown={(event) => {
            for (const leafHeader of getResizableLeafHeaders(header)) {
              primeColumnForResize(
                leafHeader.column.id,
                leafHeader.getSize(),
              );
            }
            header.getResizeHandler()(event);
          }}
          onTouchStart={(event) => {
            for (const leafHeader of getResizableLeafHeaders(header)) {
              primeColumnForResize(
                leafHeader.column.id,
                leafHeader.getSize(),
              );
            }
            header.getResizeHandler()(event);
          }}
          onKeyDown={(event) => {
            if (event.altKey) {
              return;
            }
            if (event.key === "Home") {
              event.preventDefault();
              for (const leafHeader of getResizableLeafHeaders(header)) {
                resetColumnSize(leafHeader.column.id);
              }
              return;
            }
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            const grows =
              (event.key === "ArrowRight") !== (dir === "rtl");
            resizeHeaderBy(
              header,
              (grows ? 1 : -1) * (event.shiftKey ? 25 : 10),
            );
          }}
          className={cn(
            "absolute inset-y-0 z-50 h-full w-3 cursor-col-resize touch-none select-none ltr:right-0 ltr:translate-x-1/2 rtl:left-0 rtl:-translate-x-1/2 after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2",
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
    previous.header.column.columnDef === next.header.column.columnDef &&
    previous.header.colSpan === next.header.colSpan &&
    previous.header.isPlaceholder === next.header.isPlaceholder &&
    sameSubHeaders(previous.header, next.header) &&
    previous.currentDensity === next.currentDensity &&
    previous.columnGroupHeaderHeight === next.columnGroupHeaderHeight &&
    previous.dir === next.dir &&
    previous.enableColumnReordering === next.enableColumnReordering &&
    previous.enableColumnResizing === next.enableColumnResizing &&
    previous.gridMode === next.gridMode &&
    previous.gridColumnIndex === next.gridColumnIndex &&
    previous.TableHead === next.TableHead &&
    previous.uiClassNames === next.uiClassNames &&
    previous.draggedColumnIdRef === next.draggedColumnIdRef &&
    previous.primeColumnForResize === next.primeColumnForResize &&
    previous.reorderColumn === next.reorderColumn &&
    previous.resizeColumnLabel === next.resizeColumnLabel &&
    previous.resetColumnSize === next.resetColumnSize &&
    previous.selectionState === next.selectionState &&
    sameSorting(previous.currentSorting, next.currentSorting) &&
    sameHeaderGroupHeaders(
      previous.headerGroupHeaders,
      next.headerGroupHeaders,
    ) &&
    sameHeaderLayout(previous.layout, next.layout)
  );
}

function getResizableLeafHeaders<TData>(header: Header<TData, unknown>) {
  if (!header.subHeaders.length) {
    return [header];
  }

  return header
    .getLeafHeaders()
    .filter((leafHeader) => !leafHeader.subHeaders.length);
}

function getHeaderMinimumSize<TData>(header: Header<TData, unknown>) {
  return getResizableLeafHeaders(header).reduce(
    (total, leafHeader) =>
      total + (leafHeader.column.columnDef.minSize ?? 20),
    0,
  );
}

function getHeaderMaximumSize<TData>(header: Header<TData, unknown>) {
  return getResizableLeafHeaders(header).reduce(
    (total, leafHeader) =>
      total + (leafHeader.column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER),
    0,
  );
}

function resizeHeaderBy<TData>(
  header: Header<TData, unknown>,
  delta: number,
) {
  const leafHeaders = getResizableLeafHeaders(header);
  const deltaPerLeaf = delta / leafHeaders.length;
  header.getContext().table.setColumnSizing((current) => {
    const next = { ...current };

    for (const leafHeader of leafHeaders) {
      const column = leafHeader.column;
      const minimum = column.columnDef.minSize ?? 20;
      const maximum =
        column.columnDef.maxSize ?? Number.MAX_SAFE_INTEGER;
      next[column.id] = Math.min(
        maximum,
        Math.max(minimum, column.getSize() + deltaPerLeaf),
      );
    }

    return next;
  });
}

function sameSubHeaders<TData>(
  previous: Header<TData, unknown>,
  next: Header<TData, unknown>,
) {
  return (
    previous.subHeaders.length === next.subHeaders.length &&
    previous.subHeaders.every(
      (header, index) => next.subHeaders[index]?.id === header.id,
    )
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
    previous.headerStyle?.left === next.headerStyle?.left &&
    previous.headerStyle?.right === next.headerStyle?.right
  );
}

export const DataTableHeaderCell = React.memo(
  DataTableHeaderCellInner,
  areDataTableHeaderCellsEqual,
) as typeof DataTableHeaderCellInner;
