import * as React from "react";
import { flushSync } from "react-dom";
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconChevronDown, IconSelector } from "@tabler/icons-react";
import type {
  CellContext,
  Column,
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type { DataTableColumnDef, DataTableProps } from "./types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "../../lib/utils";
import { renderDataTableCellContent } from "./data-table-cell-content";
import { DataTableCardView } from "./data-table-card-view";
import { DataTableEmptyState } from "./data-table-empty-state";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";
import {
  cellAlignClassName,
  headerAlignClassName,
  hideOnClassName,
  isHiddenAtContainerWidth,
  isRowVisible,
} from "./types";

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  children,
  title,
  description,
  searchValue = "",
  onSearchValueChange,
  searchPlaceholder = "Search rows...",
  searchDebounceMs = 250,
  customToolbar,
  rowsPerPageOptions = [10, 20, 50, 100],
  totalRowCount,
  sorting,
  onSortingChange,
  manualSorting = false,
  pageIndex,
  pageSize,
  onPageIndexChange,
  onPageSizeChange,
  pageCount,
  manualPagination = false,
  rowSelection,
  onRowSelectionChange,
  enableRowSelection = false,
  toolbarActions = [],
  selectionActions = [],
  rowActions = [],
  cardRenderer,
  viewMode = "table",
  onViewModeChange,
  enableViewToggle = false,
  emptyState,
  getRowLoadingState,
  hiddenRows,
  showHiddenRows = false,
  onShowHiddenRowsChange,
  infiniteScroll,
  editableRows,
  columnVisibility,
  onColumnVisibilityChange,
  enableColumnResizing = false,
  columnResizeMode = "onChange",
  layoutMode = "fill",
  stickyHeader = true,
  toolbarVisibility,
  className,
  tableClassName,
  tableContainerClassName,
  getRowClassName,
  onRowClick,
  dragAndDrop,
  fileUpload,
}: DataTableProps<TData>) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [localSorting, setLocalSorting] = React.useState<SortingState>([]);
  const [localPagination, setLocalPagination] = React.useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: rowsPerPageOptions[0] ?? 20,
    },
  );
  const [localRowSelection, setLocalRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [localColumnVisibility, setLocalColumnVisibility] =
    React.useState<VisibilityState>({});
  const [localSearchValue, setLocalSearchValue] = React.useState(searchValue);
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [draftValues, setDraftValues] = React.useState<Record<string, unknown>>(
    {},
  );
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  React.useEffect(() => {
    if (!onSearchValueChange) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onSearchValueChange(localSearchValue);
    }, searchDebounceMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [localSearchValue, onSearchValueChange, searchDebounceMs]);

  const currentSorting = sorting ?? localSorting;
  const currentPagination: PaginationState = {
    pageIndex: pageIndex ?? localPagination.pageIndex,
    pageSize: pageSize ?? localPagination.pageSize,
  };
  const currentRowSelection = rowSelection ?? localRowSelection;
  const currentColumnVisibility = columnVisibility ?? localColumnVisibility;
  const responsiveColumnVisibility = React.useMemo<VisibilityState>(() => {
    return columns.reduce<VisibilityState>((visibility, column, index) => {
      const columnId = getColumnId(column, index);
      if (isHiddenAtContainerWidth(column.meta?.hideOn, containerWidth)) {
        visibility[columnId] = false;
      }
      return visibility;
    }, {});
  }, [columns, containerWidth]);
  const effectiveColumnVisibility = React.useMemo<VisibilityState>(() => {
    return {
      ...currentColumnVisibility,
      ...responsiveColumnVisibility,
    };
  }, [currentColumnVisibility, responsiveColumnVisibility]);
  const openFileDialog = React.useCallback(() => {
    if (fileUpload?.disabled) {
      return;
    }

    fileInputRef.current?.click();
  }, [fileUpload?.disabled]);
  const handleSelectedFiles = React.useCallback(
    async (files: FileList | Array<File>) => {
      await fileUpload?.onFilesSelected(files);
    },
    [fileUpload],
  );

  const visibleData = React.useMemo(
    () => data.filter((row) => isRowVisible(row, hiddenRows, showHiddenRows)),
    [data, hiddenRows, showHiddenRows],
  );

  const rowById = React.useMemo(() => {
    return new Map(
      visibleData.map((row, index) => [getRowId(row, index), row]),
    );
  }, [getRowId, visibleData]);

  const selectedRows = React.useMemo(() => {
    return Object.entries(currentRowSelection)
      .filter(([, selected]) => selected)
      .map(([rowId]) => rowById.get(rowId))
      .filter((row): row is TData => Boolean(row));
  }, [currentRowSelection, rowById]);

  const columnVisibilityOptions = React.useMemo(() => {
    return columns.map((column, index) => {
      const id = getColumnId(column, index);
      const header = column.header;
      const accessorKey = getAccessorKey(column);
      const label =
        typeof header === "string"
          ? header
          : accessorKey
            ? startCase(accessorKey)
            : startCase(id);

      return {
        id,
        label,
        visible: effectiveColumnVisibility[id] !== false,
        canHide: column.enableHiding !== false,
      };
    });
  }, [columns, effectiveColumnVisibility]);

  const tableColumns = React.useMemo<Array<ColumnDef<TData, any>>>(() => {
    const defs: Array<ColumnDef<TData, any>> = [];

    if (enableRowSelection) {
      defs.push({
        id: "__select__",
        enableResizing: false,
        enableSorting: false,
        enableHiding: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(checked) => {
                table.toggleAllPageRowsSelected(checked === true);
              }}
              aria-label="Select all visible rows"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => {
                row.toggleSelected(checked === true);
              }}
              aria-label="Select row"
            />
          </div>
        ),
      });
    }

    defs.push(...columns);

    const shouldUseFillSpacer =
      layoutMode === "fill" &&
      columns.length > 0 &&
      columns.every((column) =>
        Object.prototype.hasOwnProperty.call(column, "size"),
      );

    if (shouldUseFillSpacer) {
      defs.push({
        id: "__spacer__",
        header: () => null,
        cell: () => null,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 1,
        minSize: 1,
      });
    }

    if (rowActions.length || editableRows) {
      defs.push({
        id: "__actions__",
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
        header: () => <span className="sr-only">Actions</span>,
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
                  Save
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingRowId(null);
                        setDraftValues({});
                      }}
                    >
                      <IconChevronDown className="rotate-45" />
                      <span className="sr-only">Cancel editing</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cancel editing</TooltipContent>
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
                onCancelEditing={() => { }}
              />
            </div>
          );
        },
      });
    }

    return defs;
  }, [
    columns,
    editableRows,
    editingRowId,
    enableRowSelection,
    isSavingEdit,
    rowActions,
  ]);

  const table = useReactTable({
    data: visibleData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getPaginationRowModel:
      manualPagination || infiniteScroll?.enabled
        ? undefined
        : getPaginationRowModel(),
    enableRowSelection,
    enableMultiRowSelection: enableRowSelection,
    enableColumnResizing,
    columnResizeMode,
    getRowId,
    manualSorting,
    manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
    defaultColumn: {
      minSize: 80,
      size: 180,
      maxSize: 720,
    },
    state: {
      sorting: currentSorting,
      pagination: currentPagination,
      rowSelection: currentRowSelection,
      columnVisibility: effectiveColumnVisibility,
    },
    onSortingChange: handleStateChange(currentSorting, (nextValue) => {
      onSortingChange?.(nextValue);
      if (!sorting) {
        setLocalSorting(nextValue);
      }
    }),
    onPaginationChange: (updater) => {
      const nextValue =
        typeof updater === "function" ? updater(currentPagination) : updater;

      if (pageIndex === undefined) {
        setLocalPagination(nextValue);
      }
      if (pageSize === undefined) {
        setLocalPagination((current) => ({
          ...current,
          pageSize: nextValue.pageSize,
        }));
      }
      onPageIndexChange?.(nextValue.pageIndex);
      onPageSizeChange?.(nextValue.pageSize);
    },
    onRowSelectionChange: handleStateChange(
      currentRowSelection,
      (nextValue) => {
        onRowSelectionChange?.(nextValue);
        if (!rowSelection) {
          setLocalRowSelection(nextValue);
        }
      },
    ),
    onColumnVisibilityChange: handleStateChange(
      currentColumnVisibility,
      (nextValue) => {
        onColumnVisibilityChange?.(nextValue);
        if (!columnVisibility) {
          setLocalColumnVisibility(nextValue);
        }
      },
    ),
  });
  const columnSizing = table.getState().columnSizing;

  const renderedRows = infiniteScroll?.enabled
    ? table.getRowModel().rows
    : manualPagination
      ? table.getRowModel().rows
      : table.getRowModel().rows;

  const pinnedColumns = React.useMemo(() => {
    const leafColumns = table.getVisibleLeafColumns();
    const left = new Map<string, number>();
    const right = new Map<string, number>();

    let leftOffset = 0;
    for (const column of leafColumns) {
      if (getFixedSide(column) === "left") {
        left.set(column.id, leftOffset);
        leftOffset += column.getSize();
      }
    }

    let rightOffset = 0;
    for (const column of [...leafColumns].reverse()) {
      if (getFixedSide(column) === "right") {
        right.set(column.id, rightOffset);
        rightOffset += column.getSize();
      }
    }

    return { left, right };
  }, [columnSizing, effectiveColumnVisibility, table, tableColumns]);
  const explicitlySizedColumnIds = React.useMemo(() => {
    const ids = new Set<string>();

    for (const [index, column] of columns.entries()) {
      if (Object.prototype.hasOwnProperty.call(column, "size")) {
        ids.add(getColumnId(column, index));
      }
    }

    if (enableRowSelection) {
      ids.add("__select__");
    }

    if (rowActions.length || editableRows) {
      ids.add("__actions__");
    }

    return ids;
  }, [columns, editableRows, enableRowSelection, rowActions.length]);
  const constrainedColumnIds = React.useMemo(() => {
    return new Set([...explicitlySizedColumnIds, ...Object.keys(columnSizing)]);
  }, [columnSizing, explicitlySizedColumnIds]);
  const fillMinWidth = React.useMemo(() => {
    return table.getVisibleLeafColumns().reduce((total, column) => {
      const isFixedUtilityColumn =
        column.id === "__select__" || column.id === "__actions__";
      const isSpacerColumn = column.id === "__spacer__";
      const shouldConstrain =
        !isSpacerColumn &&
        (isFixedUtilityColumn || constrainedColumnIds.has(column.id));

      return total + (shouldConstrain ? column.getSize() : 0);
    }, 0);
  }, [columnSizing, constrainedColumnIds, table]);
  const primeColumnForResize = React.useCallback(
    (columnId: string, currentSize: number) => {
      if (
        explicitlySizedColumnIds.has(columnId) ||
        Object.prototype.hasOwnProperty.call(
          table.getState().columnSizing,
          columnId,
        )
      ) {
        return;
      }

      flushSync(() => {
        table.setColumnSizing((current) => ({
          ...current,
          [columnId]: currentSize,
        }));
      });
    },
    [explicitlySizedColumnIds, table],
  );
  const resetColumnSize = React.useCallback(
    (columnId: string) => {
      if (explicitlySizedColumnIds.has(columnId)) {
        table.getColumn(columnId)?.resetSize();
        return;
      }

      table.setColumnSizing((current) => {
        if (!Object.prototype.hasOwnProperty.call(current, columnId)) {
          return current;
        }

        const next = { ...current };
        delete next[columnId];
        return next;
      });
    },
    [explicitlySizedColumnIds, table],
  );

  const effectiveTotalRowCount =
    totalRowCount ??
    (manualPagination || infiniteScroll?.enabled
      ? visibleData.length
      : table.getFilteredRowModel().rows.length);
  const effectivePageCount =
    pageCount ??
    (manualPagination || infiniteScroll?.enabled
      ? Math.max(
        1,
        Math.ceil(effectiveTotalRowCount / currentPagination.pageSize),
      )
      : table.getPageCount());

  const sentinelRef = useDataTableInfiniteScroll({
    enabled: Boolean(infiniteScroll?.enabled),
    hasMore: Boolean(infiniteScroll?.hasMore),
    isLoadingMore: infiniteScroll?.isLoadingMore,
    onLoadMore: () => {
      void infiniteScroll?.onLoadMore();
    },
  });

  const emptyNode =
    typeof emptyState === "function"
      ? emptyState({ rows: visibleData, searchValue })
      : emptyState;

  const handleRowClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>, row: TData, rowId: string) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-row-click-ignore='true']")) {
        return;
      }

      void onRowClick?.({ row, rowId });
    },
    [onRowClick],
  );

  function startEditingRow(row: TData, rowId: string) {
    const initialValues =
      editableRows?.getInitialValues?.(row) ?? defaultDraftValues(row, columns);
    setDraftValues(initialValues);
    setEditingRowId(rowId);
  }

  async function saveEdit(row: TData) {
    if (!editableRows) {
      return;
    }

    setIsSavingEdit(true);
    try {
      await editableRows.onSaveRow(row, draftValues);
      React.startTransition(() => {
        setEditingRowId(null);
        setDraftValues({});
      });
    } finally {
      setIsSavingEdit(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="data-table-container-query flex grow flex-col"
      onDragEnter={dragAndDrop?.onDragEnter}
      onDragOver={dragAndDrop?.onDragOver}
      onDragLeave={dragAndDrop?.onDragLeave}
      onDrop={dragAndDrop?.onDrop}
    >
      {fileUpload ? (
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept={fileUpload.accept}
          multiple={fileUpload.multiple ?? true}
          disabled={fileUpload.disabled}
          onChange={(event) => {
            const files = event.currentTarget.files;
            if (files?.length) {
              void handleSelectedFiles(files);
            }
            event.currentTarget.value = "";
          }}
        />
      ) : null}
      <div className="flex h-0 grow">
        <div className={cn("flex w-full grow flex-col gap-2", className)}>
          <DataTableToolbar
            title={title}
            description={description}
            searchValue={localSearchValue}
            searchPlaceholder={searchPlaceholder}
            onSearchValueChange={setLocalSearchValue}
            customToolbar={customToolbar}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            enableViewToggle={enableViewToggle && Boolean(cardRenderer)}
            toolbarActions={toolbarActions}
            selectionActions={selectionActions}
            selectedRows={selectedRows}
            totalRowCount={effectiveTotalRowCount}
            showHiddenRows={showHiddenRows}
            hiddenRowsLabel={hiddenRows?.label}
            onShowHiddenRowsChange={onShowHiddenRowsChange}
            allRows={visibleData}
            columnVisibilityOptions={columnVisibilityOptions}
            onColumnVisibilityChange={(columnId, visible) => {
              table.getColumn(columnId)?.toggleVisibility(visible);
            }}
            toolbarVisibility={toolbarVisibility}
            openFileDialog={fileUpload ? openFileDialog : undefined}
          />

          <div className="h-0 min-h-0 flex-1 overflow-hidden px-2">
            {viewMode === "card" && cardRenderer ? (
              <div
                className={cn(
                  "box-border h-full border-2 border-transparent transition-colors",
                  dragAndDrop?.isDragging &&
                  "rounded-md border-dotted border-primary ring-2 ring-primary/20",
                )}
              >
                <ScrollArea className={cn("h-full", tableContainerClassName)}>
                  {visibleData.length ? (
                    <DataTableCardView
                      rows={renderedRows}
                      cardRenderer={cardRenderer}
                      rowActions={rowActions}
                      editableRows={editableRows}
                      rowSelection={currentRowSelection}
                      onRowSelectionChange={(nextValue) => {
                        onRowSelectionChange?.(nextValue);
                        if (!rowSelection) {
                          setLocalRowSelection(nextValue);
                        }
                      }}
                      enableRowSelection={enableRowSelection}
                      editingRowId={editingRowId}
                      onEditingRowIdChange={setEditingRowId}
                      getRowClassName={getRowClassName}
                      onRowClick={onRowClick}
                      getRowDraggable={dragAndDrop?.getRowDraggable}
                      onRowDragStart={dragAndDrop?.onRowDragStart}
                      onRowDragEnd={dragAndDrop?.onRowDragEnd}
                    />
                  ) : (
                    <div className="flex h-full min-h-full grow items-center justify-center p-4">
                      {emptyNode ?? (
                        <DataTableEmptyState
                          title={
                            localSearchValue
                              ? "No matching rows"
                              : "No rows yet"
                          }
                          description={
                            localSearchValue
                              ? "Try a different search term or clear filters."
                              : "Create a record or refresh this view once data exists."
                          }
                        />
                      )}
                    </div>
                  )}

                  {infiniteScroll?.enabled ? (
                    <div className="px-4 pb-4">
                      <div ref={sentinelRef} className="h-4 w-full" />
                    </div>
                  ) : null}
                </ScrollArea>
              </div>
            ) : (
              <div
                className={cn(
                  "box-border h-full border-2 border-transparent transition-colors",
                  dragAndDrop?.isDragging &&
                  "rounded-md border-dotted border-primary ring-2 ring-primary/20",
                )}
              >
                <ScrollArea
                  className={cn(
                    "h-full rounded-md border bg-card",
                    tableContainerClassName,
                  )}
                >
                  <div className="min-h-full">
                    <Table
                      className={cn(
                        "w-full table-fixed border-separate border-spacing-0",
                        tableClassName,
                      )}
                      style={{
                        minWidth:
                          layoutMode === "fill"
                            ? fillMinWidth || undefined
                            : undefined,
                        width:
                          layoutMode === "fit" ? table.getTotalSize() : "100%",
                      }}
                    >
                      <colgroup>
                        {table.getVisibleLeafColumns().map((column) => {
                          const isFixedUtilityColumn =
                            column.id === "__select__" ||
                            column.id === "__actions__";
                          const isSpacerColumn = column.id === "__spacer__";
                          const shouldConstrain =
                            !isSpacerColumn &&
                            (layoutMode === "fit" ||
                              isFixedUtilityColumn ||
                              constrainedColumnIds.has(column.id));

                          return (
                            <col
                              key={column.id}
                              style={
                                shouldConstrain
                                  ? {
                                    width: isFixedUtilityColumn
                                      ? 50
                                      : column.getSize(),
                                    minWidth: isFixedUtilityColumn
                                      ? 50
                                      : column.getSize(),
                                    maxWidth: isFixedUtilityColumn
                                      ? 50
                                      : column.getSize(),
                                  }
                                  : undefined
                              }
                            />
                          );
                        })}
                      </colgroup>
                      <TableHeader
                        className={cn(
                          stickyHeader
                            ? "sticky top-0 z-30 bg-card/95 backdrop-blur [&_th]:border-border [&_th]:bg-card/95"
                            : undefined,
                        )}
                      >
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              const meta = (
                                header.column.columnDef as DataTableColumnDef<
                                  TData,
                                  unknown
                                >
                              ).meta;
                              const canSort = header.column.getCanSort();
                              const sortingState = header.column.getIsSorted();
                              const isSelectionColumn =
                                header.column.id === "__select__";
                              const isActionsColumn =
                                header.column.id === "__actions__";
                              const isSpacerColumn =
                                header.column.id === "__spacer__";
                              const shouldConstrain =
                                !isSpacerColumn &&
                                (layoutMode === "fit" ||
                                  isSelectionColumn ||
                                  isActionsColumn ||
                                  constrainedColumnIds.has(header.column.id));
                              const fixedSide = getFixedSide(header.column);
                              const hideClassName = hideOnClassName(
                                meta?.hideOn,
                              );
                              return (
                                <TableHead
                                  key={header.id}
                                  className={cn(
                                    "relative border-b",
                                    (isSelectionColumn || isActionsColumn) &&
                                    "w-[50px] max-w-[50px] min-w-[50px] px-0",
                                    isSpacerColumn &&
                                    "border-b-1 bg-transparent p-0",
                                    fixedSide &&
                                    getPinnedColumnClassName(fixedSide),
                                    hideClassName,
                                    headerAlignClassName(header.getContext()),
                                    meta?.headerClassName,
                                    meta?.responsiveClassName,
                                  )}
                                  style={{
                                    width: shouldConstrain
                                      ? isSelectionColumn || isActionsColumn
                                        ? 50
                                        : header.getSize()
                                      : undefined,
                                    minWidth: shouldConstrain
                                      ? isSelectionColumn || isActionsColumn
                                        ? 50
                                        : header.getSize()
                                      : undefined,
                                    maxWidth: shouldConstrain
                                      ? isSelectionColumn || isActionsColumn
                                        ? 50
                                        : header.getSize()
                                      : undefined,
                                    left:
                                      fixedSide === "left"
                                        ? pinnedColumns.left.get(
                                          header.column.id,
                                        )
                                        : undefined,
                                    right:
                                      fixedSide === "right"
                                        ? pinnedColumns.right.get(
                                          header.column.id,
                                        )
                                        : undefined,
                                  }}
                                >
                                  {header.isPlaceholder ? null : canSort ? (
                                    <button
                                      type="button"
                                      className={cn(
                                        "flex w-full items-center gap-2 font-medium",
                                        headerAlignClassName(
                                          header.getContext(),
                                        ),
                                      )}
                                      onClick={header.column.getToggleSortingHandler()}
                                    >
                                      <span className="truncate">
                                        {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                        )}
                                      </span>
                                      {sortingState ? (
                                        <IconChevronDown
                                          className={cn(
                                            "shrink-0 transition-transform",
                                            sortingState === "desc"
                                              ? "rotate-0"
                                              : "rotate-180",
                                          )}
                                        />
                                      ) : (
                                        <IconSelector className="shrink-0 text-muted-foreground" />
                                      )}
                                    </button>
                                  ) : (
                                    flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )
                                  )}

                                  {enableColumnResizing &&
                                    header.column.getCanResize() ? (
                                    <div
                                      onDoubleClick={() => {
                                        resetColumnSize(header.column.id);
                                      }}
                                      onMouseDown={(event) => {
                                        primeColumnForResize(
                                          header.column.id,
                                          header.getSize(),
                                        );
                                        header.getResizeHandler()(event);
                                      }}
                                      onTouchStart={(event) => {
                                        primeColumnForResize(
                                          header.column.id,
                                          header.getSize(),
                                        );
                                        header.getResizeHandler()(event);
                                      }}
                                      className={cn(
                                        "absolute top-0 right-[-4px] z-20 h-full w-2 cursor-col-resize touch-none select-none after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-border hover:after:bg-primary",
                                        header.column.getIsResizing() &&
                                        "after:bg-primary",
                                      )}
                                    />
                                  ) : null}
                                </TableHead>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {renderedRows.length ? (
                          renderedRows.map((row, rowIndex) => {
                            const originalRow = row.original;
                            const loadingState = getRowLoadingState?.(
                              originalRow,
                              rowIndex,
                            );
                            const resolvedLoadingState =
                              typeof loadingState === "boolean"
                                ? { isLoading: loadingState }
                                : loadingState;
                            const isEditing = editingRowId === row.id;

                            return (
                              <TableRow
                                key={row.id}
                                draggable={
                                  dragAndDrop?.getRowDraggable?.(originalRow) ??
                                  false
                                }
                                data-state={
                                  row.getIsSelected() ? "selected" : undefined
                                }
                                className={cn(
                                  getRowClassName?.(originalRow),
                                  "hover:bg-muted/50 data-[state=selected]:!bg-primary/10",
                                  onRowClick && "cursor-pointer",
                                )}
                                onClick={(event) => {
                                  handleRowClick(event, originalRow, row.id);
                                }}
                                onDragStart={(event) => {
                                  dragAndDrop?.onRowDragStart?.({
                                    row: originalRow,
                                    rowId: row.id,
                                    event,
                                  });
                                }}
                                onDragEnd={(event) => {
                                  dragAndDrop?.onRowDragEnd?.({
                                    row: originalRow,
                                    rowId: row.id,
                                    event,
                                  });
                                }}
                              >
                                {row.getVisibleCells().map((cell) => {
                                  const meta = (
                                    cell.column.columnDef as DataTableColumnDef<
                                      TData,
                                      unknown
                                    >
                                  ).meta;
                                  const cellContext = cell.getContext();
                                  const value = cell.getValue();
                                  const isSelectionColumn =
                                    cell.column.id === "__select__";
                                  const isActionsColumn =
                                    cell.column.id === "__actions__";
                                  const isSpacerColumn =
                                    cell.column.id === "__spacer__";
                                  const shouldConstrain =
                                    !isSpacerColumn &&
                                    (layoutMode === "fit" ||
                                      isSelectionColumn ||
                                      isActionsColumn ||
                                      constrainedColumnIds.has(cell.column.id));
                                  const fixedSide = getFixedSide(cell.column);
                                  const hideClassName = hideOnClassName(
                                    meta?.hideOn,
                                  );
                                  const cellClassName =
                                    typeof meta?.cellClassName === "function"
                                      ? meta.cellClassName({
                                        row: originalRow,
                                        value,
                                      })
                                      : meta?.cellClassName;

                                  return (
                                    <TableCell
                                      key={cell.id}
                                      className={cn(
                                        "border-b border-border/40",
                                        (isSelectionColumn ||
                                          isActionsColumn) &&
                                        "w-[50px] max-w-[50px] min-w-[50px] px-0",
                                        isSpacerColumn &&
                                        "border-b-0 bg-transparent p-0",
                                        fixedSide &&
                                        getPinnedColumnClassName(fixedSide),
                                        hideClassName,
                                        cellAlignClassName(cellContext),
                                        meta?.responsiveClassName,
                                        cellClassName,
                                      )}
                                      style={{
                                        width: shouldConstrain
                                          ? isSelectionColumn || isActionsColumn
                                            ? 50
                                            : cell.column.getSize()
                                          : undefined,
                                        minWidth: shouldConstrain
                                          ? isSelectionColumn || isActionsColumn
                                            ? 50
                                            : cell.column.getSize()
                                          : undefined,
                                        maxWidth: shouldConstrain
                                          ? isSelectionColumn || isActionsColumn
                                            ? 50
                                            : cell.column.getSize()
                                          : undefined,
                                        left:
                                          fixedSide === "left"
                                            ? pinnedColumns.left.get(
                                              cell.column.id,
                                            )
                                            : undefined,
                                        right:
                                          fixedSide === "right"
                                            ? pinnedColumns.right.get(
                                              cell.column.id,
                                            )
                                            : undefined,
                                      }}
                                    >
                                      <div
                                        data-row-click-ignore={
                                          isSelectionColumn || isActionsColumn
                                            ? "true"
                                            : undefined
                                        }
                                      >
                                        {resolvedLoadingState?.isLoading
                                          ? (meta?.skeleton?.(cellContext) ??
                                            resolvedLoadingState.skeleton ?? (
                                              <Skeleton
                                                className={cn(
                                                  "h-4 rounded",
                                                  meta?.type === "numeric"
                                                    ? "ml-auto w-16"
                                                    : meta?.type === "date"
                                                      ? "ml-auto w-28"
                                                      : "w-full",
                                                )}
                                              />
                                            ))
                                          : isEditing &&
                                            cell.column.id !== "__select__" &&
                                            cell.column.id !== "__actions__"
                                            ? renderEditableCell(
                                              cellContext,
                                              draftValues,
                                              setDraftValues,
                                            )
                                            : renderDataTableCellContent(
                                              cellContext,
                                            )}
                                      </div>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={Math.max(
                                1,
                                table.getVisibleLeafColumns().length,
                              )}
                              className="h-full grow"
                            >
                              <div className="flex h-full min-h-40 w-fit items-center justify-center">
                                {emptyNode ?? (
                                  <DataTableEmptyState
                                    title={
                                      localSearchValue
                                        ? "No matching rows"
                                        : "No rows yet"
                                    }
                                    description={
                                      localSearchValue
                                        ? "Try a different search term or clear filters."
                                        : "Create a record or refresh this view once data exists."
                                    }
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {infiniteScroll?.enabled && renderedRows.length ? (
                    <div className="px-4 pb-4">
                      <div ref={sentinelRef} className="h-4 w-full" />
                    </div>
                  ) : null}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
          </div>
          <div className="px-2">
            {!infiniteScroll?.enabled ? (
              <DataTablePagination
                pageIndex={currentPagination.pageIndex}
                pageCount={effectivePageCount}
                pageSize={currentPagination.pageSize}
                rowsPerPageOptions={rowsPerPageOptions}
                onPageIndexChange={(nextPageIndex) => {
                  onPageIndexChange?.(nextPageIndex);
                  if (pageIndex === undefined) {
                    setLocalPagination((current) => ({
                      ...current,
                      pageIndex: nextPageIndex,
                    }));
                  }
                }}
                onPageSizeChange={(nextPageSize) => {
                  onPageSizeChange?.(nextPageSize);
                  if (pageSize === undefined) {
                    setLocalPagination({
                      pageIndex: 0,
                      pageSize: nextPageSize,
                    });
                  }
                }}
              />
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function defaultDraftValues<TData>(
  row: TData,
  columns: Array<DataTableColumnDef<TData, any>>,
) {
  return columns.reduce<Record<string, unknown>>((draft, column) => {
    if ("accessorKey" in column && typeof column.accessorKey === "string") {
      draft[column.accessorKey] = (row as Record<string, unknown>)[
        column.accessorKey
      ];
    }
    return draft;
  }, {});
}

function renderEditableCell<TData>(
  context: CellContext<TData, unknown>,
  draftValues: Record<string, unknown>,
  setDraftValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
) {
  const column = context.column.columnDef as DataTableColumnDef<TData, unknown>;
  const meta = column.meta;
  const accessorKey =
    "accessorKey" in column && typeof column.accessorKey === "string"
      ? column.accessorKey
      : context.column.id;
  const draftValue = draftValues[accessorKey];
  const setDraftValue = (value: unknown) => {
    setDraftValues((current) => ({
      ...current,
      [accessorKey]: value,
    }));
  };

  if (meta?.renderEditCell) {
    return meta.renderEditCell({
      cell: context,
      row: context.row.original,
      value: context.getValue(),
      draftValue,
      setDraftValue,
    });
  }

  if (typeof draftValue === "boolean") {
    return (
      <Checkbox
        checked={draftValue}
        onCheckedChange={(checked) => {
          setDraftValue(checked === true);
        }}
      />
    );
  }

  return (
    <Input
      value={draftValue == null ? "" : String(draftValue)}
      onChange={(event) => {
        setDraftValue(event.target.value);
      }}
    />
  );
}

function handleStateChange<TState>(
  currentValue: TState,
  onResolved: (value: TState) => void,
): OnChangeFn<TState> {
  return (updater) => {
    const nextValue = functionalUpdate(updater, currentValue);
    onResolved(nextValue);
  };
}

function getColumnId<TData>(
  column: DataTableColumnDef<TData, unknown>,
  index: number,
) {
  if (column.id) {
    return column.id;
  }

  const accessorKey = getAccessorKey(column);
  if (accessorKey) {
    return accessorKey;
  }

  return `column-${index}`;
}

function getAccessorKey<TData>(column: DataTableColumnDef<TData, unknown>) {
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey;
  }

  return undefined;
}

function getFixedSide<TData>(column: Column<TData>) {
  if (column.id === "__select__") {
    return "left" as const;
  }

  if (column.id === "__actions__") {
    return "right" as const;
  }

  const meta = (column.columnDef as DataTableColumnDef<TData, unknown>).meta;
  return meta?.fixed;
}

function getPinnedColumnClassName(side: "left" | "right") {
  return cn(
    "sticky border-dotted border-border bg-card bg-transparent [&:is(th)]:z-40",
    side === "left" ? "border-r-2" : "right-0 border-l",
  );
}

function startCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
