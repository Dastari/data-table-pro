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
import { useVirtualizer } from "@tanstack/react-virtual";
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
import type { DataTableColumnDef, DataTableProps } from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { renderDataTableCellContent } from "./data-table-cell-content";
import { createDataTableCardView } from "./create-data-table-card-view";
import { createDataTableEmptyState } from "./create-data-table-empty-state";
import { createDataTablePagination } from "./create-data-table-pagination";
import { createDataTableRowActions } from "./create-data-table-row-actions";
import { createDataTableToolbar } from "./create-data-table-toolbar";
import { useDataTableContainerWidth } from "./use-data-table-container-width";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";
import { useDataTablePaginationClamp } from "./use-data-table-pagination-clamp";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";
import {
  cellAlignClassName,
  headerAlignClassName,
  hideOnClassName,
  isHiddenAtContainerWidth,
  isRowVisible,
} from "../types";

const DATA_TABLE_LOADING_ROW = Symbol("data-table-loading-row");

type DataTableLoadingRow = {
  [DATA_TABLE_LOADING_ROW]: true;
  index: number;
};

export function createDataTable(ui: DataTableUiKit) {
  const {
    Button,
    Checkbox,
    Input,
    ScrollArea,
    ScrollBar,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tooltip,
    TooltipContent,
    TooltipProvider = React.Fragment,
    TooltipTrigger,
  } = ui;
  const DataTableEmptyState = createDataTableEmptyState(ui);
  const DataTableRowActions = createDataTableRowActions(ui);
  const { DataTableFooter } = createDataTablePagination(ui);
  const DataTableToolbar = createDataTableToolbar(ui);
  const DataTableCardView = createDataTableCardView(ui, DataTableRowActions);
  const defaultColumn = {
    minSize: 80,
    size: 180,
    maxSize: 720,
  };

  return function DataTable<TData>({
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
    isLoading = false,
    loadingRowCount,
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
    showFooter = true,
    showToolbar = true,
    flexGrow = true,
    toolbarVisibility,
    className,
    tableClassName,
    tableContainerClassName,
    getRowClassName,
    onRowClick,
    dragAndDrop,
    fileUpload,
    virtualization,
  }: DataTableProps<TData>) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const tableScrollContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [localSorting, setLocalSorting] = React.useState<SortingState>([]);
    const [localPagination, setLocalPagination] =
      React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: rowsPerPageOptions[0] ?? 20,
      });
    const [localRowSelection, setLocalRowSelection] = React.useState<
      Record<string, boolean>
    >({});
    const [localColumnVisibility, setLocalColumnVisibility] =
      React.useState<VisibilityState>({});
    const [localSearchValue, setLocalSearchValue] = React.useState(searchValue);
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
    const [draftValues, setDraftValues] = React.useState<
      Record<string, unknown>
    >({});
    const [isSavingEdit, setIsSavingEdit] = React.useState(false);
    const containerWidth = useDataTableContainerWidth(containerRef);
    const { viewportElement: tableScrollElement, viewportHeight } =
      useDataTableScrollViewport(tableScrollContainerRef, viewMode);
    const hasOnSearchValueChange = Boolean(onSearchValueChange);
    const lastReportedSearchValueRef = React.useRef(searchValue);
    const onSearchValueChangeEvent = React.useEffectEvent((value: string) => {
      lastReportedSearchValueRef.current = value;
      onSearchValueChange?.(value);
    });

    React.useEffect(() => {
      lastReportedSearchValueRef.current = searchValue;
      setLocalSearchValue(searchValue);
    }, [searchValue]);

    React.useEffect(() => {
      if (!hasOnSearchValueChange) {
        return;
      }

      if (localSearchValue === searchValue) {
        return;
      }

      if (localSearchValue === lastReportedSearchValueRef.current) {
        return;
      }

      const timeout = window.setTimeout(() => {
        onSearchValueChangeEvent(localSearchValue);
      }, searchDebounceMs);

      return () => {
        window.clearTimeout(timeout);
      };
    }, [
      hasOnSearchValueChange,
      localSearchValue,
      searchDebounceMs,
      searchValue,
    ]);

    const currentSorting = sorting ?? localSorting;
    const currentPagination = React.useMemo<PaginationState>(
      () => ({
        pageIndex: pageIndex ?? localPagination.pageIndex,
        pageSize: pageSize ?? localPagination.pageSize,
      }),
      [
        localPagination.pageIndex,
        localPagination.pageSize,
        pageIndex,
        pageSize,
      ],
    );
    const resolvedLoadingRowCount = Math.max(
      1,
      loadingRowCount ?? Math.min(5, currentPagination.pageSize),
    );
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
    const shouldRenderInitialLoading = isLoading && visibleData.length === 0;
    const loadingRows = React.useMemo(
      () => createDataTableLoadingRows<TData>(resolvedLoadingRowCount),
      [resolvedLoadingRowCount],
    );
    const tableData = shouldRenderInitialLoading ? loadingRows : visibleData;
    const tableGetRowId = React.useCallback(
      (row: TData, index: number) => {
        if (isDataTableLoadingRow(row)) {
          return getDataTableLoadingRowId(index);
        }

        return getRowId(row, index);
      },
      [getRowId],
    );

    const shouldResolveSelectedRows =
      enableRowSelection ||
      selectionActions.length > 0 ||
      Object.values(currentRowSelection).some(Boolean);
    const rowById = React.useMemo(() => {
      if (!shouldResolveSelectedRows) {
        return new Map<string, TData>();
      }

      return new Map(
        visibleData.map((row, index) => [getRowId(row, index), row]),
      );
    }, [getRowId, shouldResolveSelectedRows, visibleData]);

    const selectedRows = React.useMemo(() => {
      if (!shouldResolveSelectedRows) {
        return [];
      }

      return Object.entries(currentRowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => rowById.get(rowId))
        .filter((row): row is TData => Boolean(row));
    }, [currentRowSelection, rowById, shouldResolveSelectedRows]);

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

    const startEditingRow = React.useCallback(
      (row: TData, rowId: string) => {
        const initialValues =
          editableRows?.getInitialValues?.(row) ??
          defaultDraftValues(row, columns);
        setDraftValues(initialValues);
        setEditingRowId(rowId);
      },
      [columns, editableRows],
    );

    const saveEdit = React.useCallback(
      async (row: TData) => {
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
      },
      [draftValues, editableRows],
    );

    const tableColumns = React.useMemo<Array<ColumnDef<TData, unknown>>>(() => {
      const defs: Array<ColumnDef<TData, unknown>> = [];

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
                onCheckedChange={(checked: boolean | "indeterminate") => {
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
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  row.toggleSelected(checked === true);
                }}
                aria-label="Select row"
              />
            </div>
          ),
        });
      }

      defs.push(...columns);

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
                  onCancelEditing={() => {}}
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
      saveEdit,
      startEditingRow,
    ]);

    const tableState = React.useMemo(
      () => ({
        sorting: currentSorting,
        pagination: currentPagination,
        rowSelection: currentRowSelection,
        columnVisibility: effectiveColumnVisibility,
      }),
      [
        currentPagination,
        currentRowSelection,
        currentSorting,
        effectiveColumnVisibility,
      ],
    );
    const handleSortingChange = React.useCallback<OnChangeFn<SortingState>>(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentSorting);
        onSortingChange?.(nextValue);
        if (!sorting) {
          setLocalSorting(nextValue);
        }
      },
      [currentSorting, onSortingChange, sorting],
    );
    const handlePaginationChange = React.useCallback<
      OnChangeFn<PaginationState>
    >(
      (updater) => {
        const nextValue =
          typeof updater === "function" ? updater(currentPagination) : updater;

        if (pageIndex === undefined || pageSize === undefined) {
          setLocalPagination((current) => ({
            pageIndex:
              pageIndex === undefined ? nextValue.pageIndex : current.pageIndex,
            pageSize:
              pageSize === undefined ? nextValue.pageSize : current.pageSize,
          }));
        }

        onPageIndexChange?.(nextValue.pageIndex);
        onPageSizeChange?.(nextValue.pageSize);
      },
      [
        currentPagination,
        onPageIndexChange,
        onPageSizeChange,
        pageIndex,
        pageSize,
      ],
    );
    const handleRowSelectionChange = React.useCallback<
      OnChangeFn<Record<string, boolean>>
    >(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentRowSelection);
        onRowSelectionChange?.(nextValue);
        if (!rowSelection) {
          setLocalRowSelection(nextValue);
        }
      },
      [currentRowSelection, onRowSelectionChange, rowSelection],
    );
    const handleColumnVisibilityChange = React.useCallback<
      OnChangeFn<VisibilityState>
    >(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentColumnVisibility);
        onColumnVisibilityChange?.(nextValue);
        if (!columnVisibility) {
          setLocalColumnVisibility(nextValue);
        }
      },
      [columnVisibility, currentColumnVisibility, onColumnVisibilityChange],
    );

    const table = useReactTable({
      data: tableData,
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
      getRowId: tableGetRowId,
      manualSorting,
      manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
      defaultColumn,
      autoResetPageIndex: false,
      state: tableState,
      onSortingChange: handleSortingChange,
      onPaginationChange: handlePaginationChange,
      onRowSelectionChange: handleRowSelectionChange,
      onColumnVisibilityChange: handleColumnVisibilityChange,
    });
    const columnSizing = table.getState().columnSizing;
    const visibleLeafColumns = table.getVisibleLeafColumns();

    const renderedRows = table.getRowModel().rows;
    const virtualizationConfig =
      typeof virtualization === "object" ? virtualization : undefined;
    const enableVirtualization =
      viewMode === "table" &&
      !shouldRenderInitialLoading &&
      (virtualization === true || virtualizationConfig?.enabled === true);
    const shouldUseVirtualRows =
      enableVirtualization && Boolean(tableScrollElement) && viewportHeight > 0;
    const rowVirtualizer = useVirtualizer({
      count: enableVirtualization ? renderedRows.length : 0,
      enabled: shouldUseVirtualRows,
      estimateSize: () => virtualizationConfig?.estimateRowHeight ?? 48,
      getScrollElement: () => tableScrollElement,
      overscan: virtualizationConfig?.overscan ?? 8,
    });
    const virtualItems = shouldUseVirtualRows
      ? rowVirtualizer.getVirtualItems()
      : [];
    const rowsToRender = shouldUseVirtualRows
      ? virtualItems.flatMap((virtualItem) => {
          const row = renderedRows[virtualItem.index];
          return row ? [{ row, rowIndex: virtualItem.index }] : [];
        })
      : renderedRows.map((row, rowIndex) => ({ row, rowIndex }));
    const virtualPaddingTop = shouldUseVirtualRows
      ? (virtualItems[0]?.start ?? 0)
      : 0;
    const virtualPaddingBottom = shouldUseVirtualRows
      ? Math.max(
          0,
          rowVirtualizer.getTotalSize() -
            (virtualItems.at(-1)?.end ?? virtualPaddingTop),
        )
      : 0;

    const pinnedColumns = React.useMemo(() => {
      const left = new Map<string, number>();
      const right = new Map<string, number>();

      let leftOffset = 0;
      for (const column of visibleLeafColumns) {
        if (getFixedSide(column) === "left") {
          left.set(column.id, leftOffset);
          leftOffset += column.getSize();
        }
      }

      let rightOffset = 0;
      for (const column of [...visibleLeafColumns].reverse()) {
        if (getFixedSide(column) === "right") {
          right.set(column.id, rightOffset);
          rightOffset += column.getSize();
        }
      }

      return { left, right };
    }, [visibleLeafColumns]);
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
    const minimumColumnWidths = React.useMemo(() => {
      const widths = new Map<string, number>();

      for (const [index, column] of columns.entries()) {
        const configuredMinWidth = getConfiguredColumnMinWidth(column);

        if (configuredMinWidth !== undefined) {
          widths.set(getColumnId(column, index), configuredMinWidth);
        }
      }

      return widths;
    }, [columns]);
    const visibleLeafColumnCount = visibleLeafColumns.length;
    const fillColumnId = React.useMemo(() => {
      if (layoutMode !== "fill") {
        return undefined;
      }

      const dataColumns = visibleLeafColumns.filter(
        (column) =>
          column.id !== "__select__" && column.id !== "__actions__",
      );

      if (!dataColumns.length) {
        return undefined;
      }

      const allDataColumnsAreFixed = dataColumns.every(
        (column) =>
          explicitlySizedColumnIds.has(column.id) ||
          Object.prototype.hasOwnProperty.call(columnSizing, column.id),
      );

      return allDataColumnsAreFixed
        ? dataColumns[dataColumns.length - 1]?.id
        : undefined;
    }, [
      columnSizing,
      explicitlySizedColumnIds,
      layoutMode,
      visibleLeafColumns,
    ]);
    const fixedWidthColumnIds = React.useMemo(() => {
      const ids = new Set([
        ...explicitlySizedColumnIds,
        ...Object.keys(columnSizing),
      ]);

      if (fillColumnId) {
        ids.delete(fillColumnId);
      }

      return ids;
    }, [columnSizing, explicitlySizedColumnIds, fillColumnId]);
    const fillMinWidth = React.useMemo(() => {
      return visibleLeafColumns.reduce((total, column) => {
        const isFixedUtilityColumn =
          column.id === "__select__" || column.id === "__actions__";
        const configuredMinWidth = minimumColumnWidths.get(column.id);
        const isFlexibleFillColumn = column.id === fillColumnId;

        if (isFixedUtilityColumn || fixedWidthColumnIds.has(column.id)) {
          return total + column.getSize();
        }

        return (
          total +
          (configuredMinWidth ??
            (isFlexibleFillColumn ? column.getSize() : 0))
        );
      }, 0);
    }, [
      fillColumnId,
      fixedWidthColumnIds,
      minimumColumnWidths,
      visibleLeafColumns,
    ]);
    const hasCardTitle = React.useMemo(
      () => columns.some((column) => column.meta?.cardTitle),
      [columns],
    );
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

    const derivedTotalRowCount =
      manualPagination || infiniteScroll?.enabled
        ? visibleData.length
        : table.getFilteredRowModel().rows.length;
    const effectiveTotalRowCount = totalRowCount ?? derivedTotalRowCount;
    const footerTotalRowCount = totalRowCount ?? effectiveTotalRowCount;
    const effectivePageCount = shouldRenderInitialLoading
      ? 1
      : (pageCount ??
        (manualPagination || infiniteScroll?.enabled
          ? Math.max(
              1,
              Math.ceil(effectiveTotalRowCount / currentPagination.pageSize),
            )
          : table.getPageCount()));
    const maxPageIndex = Math.max(0, effectivePageCount - 1);

    const setLocalPageIndex = React.useCallback(
      (nextPageIndex: number) => {
        if (pageIndex !== undefined) {
          return;
        }

        setLocalPagination((current) =>
          current.pageIndex === nextPageIndex
            ? current
            : { ...current, pageIndex: nextPageIndex },
        );
      },
      [pageIndex],
    );
    useDataTablePaginationClamp({
      enabled: !shouldRenderInitialLoading && !infiniteScroll?.enabled,
      maxPageIndex,
      onPageIndexChange,
      pageIndex: currentPagination.pageIndex,
      setLocalPageIndex,
    });

    const handleFooterPageIndexChange = React.useCallback(
      (nextPageIndex: number) => {
        onPageIndexChange?.(nextPageIndex);
        if (pageIndex === undefined) {
          setLocalPagination((current) =>
            current.pageIndex === nextPageIndex
              ? current
              : { ...current, pageIndex: nextPageIndex },
          );
        }
      },
      [onPageIndexChange, pageIndex],
    );
    const handleFooterPageSizeChange = React.useCallback(
      (nextPageSize: number) => {
        onPageIndexChange?.(0);
        onPageSizeChange?.(nextPageSize);
        if (pageSize === undefined) {
          setLocalPagination({
            pageIndex: 0,
            pageSize: nextPageSize,
          });
        }
      },
      [onPageIndexChange, onPageSizeChange, pageSize],
    );

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

    return (
      <TooltipProvider>
      <div
        ref={containerRef}
        className="@container/data-table data-table-container-query flex grow flex-col"
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
        <div className={cn(flexGrow ? "flex h-0 grow" : "flex")}>
          <div className={cn("flex w-full grow flex-col gap-4", className)}>
            {showToolbar ? (
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
            ) : null}

            <div className="h-0 min-h-0 flex-1">
              {viewMode === "card" && cardRenderer ? (
                <div
                  className={cn(
                    "box-border h-full border-2 border-transparent transition-colors",
                    dragAndDrop?.isDragging &&
                      "rounded-md border-dashed border-primary",
                  )}
                >
                  <ScrollArea className={cn("h-full", tableContainerClassName)}>
                    {shouldRenderInitialLoading ? (
                      <DataTableCardView
                        rows={[]}
                        cardRenderer={cardRenderer}
                        rowActions={rowActions}
                        editableRows={editableRows}
                        hasCardTitle={hasCardTitle}
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
                        isLoading={true}
                        loadingRowCount={resolvedLoadingRowCount}
                      />
                    ) : visibleData.length ? (
                      <DataTableCardView
                        rows={renderedRows}
                        cardRenderer={cardRenderer}
                        rowActions={rowActions}
                        editableRows={editableRows}
                        hasCardTitle={hasCardTitle}
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

                    {infiniteScroll?.enabled && !shouldRenderInitialLoading ? (
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
                      "rounded-md border-dashed border-primary",
                  )}
                >
                  <div ref={tableScrollContainerRef} className="h-full">
                    <ScrollArea
                      className={cn(
                        "h-full rounded-md border border-border bg-card",
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
                              layoutMode === "fit"
                                ? table.getTotalSize()
                                : "100%",
                          }}
                        >
                          <colgroup>
                            {table.getVisibleLeafColumns().map((column) => {
                              const isFixedUtilityColumn =
                                column.id === "__select__" ||
                                column.id === "__actions__";
                              const isSpacerColumn = column.id === "__spacer__";
                              const configuredMinWidth =
                                minimumColumnWidths.get(column.id);
                              const isFlexibleFillColumn =
                                column.id === fillColumnId;
                              const columnMinWidth =
                                configuredMinWidth ??
                                (isFlexibleFillColumn
                                  ? column.getSize()
                                  : undefined);
                              const shouldFixWidth =
                                !isSpacerColumn &&
                                (layoutMode === "fit" ||
                                  isFixedUtilityColumn ||
                                  fixedWidthColumnIds.has(column.id));

                              return (
                                <col
                                  key={column.id}
                                  style={
                                    shouldFixWidth ||
                                    columnMinWidth !== undefined
                                      ? {
                                          width: shouldFixWidth
                                            ? isFixedUtilityColumn
                                              ? 50
                                              : column.getSize()
                                            : undefined,
                                          minWidth: isFixedUtilityColumn
                                            ? 50
                                            : shouldFixWidth
                                              ? column.getSize()
                                              : columnMinWidth,
                                          maxWidth: shouldFixWidth
                                            ? isFixedUtilityColumn
                                              ? 50
                                              : column.getSize()
                                            : undefined,
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
                                    header.column
                                      .columnDef as DataTableColumnDef<
                                      TData,
                                      unknown
                                    >
                                  ).meta;
                                  const canSort = header.column.getCanSort();
                                  const sortingState =
                                    header.column.getIsSorted();
                                  const isSelectionColumn =
                                    header.column.id === "__select__";
                                  const isActionsColumn =
                                    header.column.id === "__actions__";
                                  const isSpacerColumn =
                                    header.column.id === "__spacer__";
                                  const configuredMinWidth =
                                    minimumColumnWidths.get(header.column.id);
                                  const isFlexibleFillColumn =
                                    header.column.id === fillColumnId;
                                  const columnMinWidth =
                                    configuredMinWidth ??
                                    (isFlexibleFillColumn
                                      ? header.column.getSize()
                                      : undefined);
                                  const shouldFixWidth =
                                    !isSpacerColumn &&
                                    (layoutMode === "fit" ||
                                      isSelectionColumn ||
                                      isActionsColumn ||
                                      fixedWidthColumnIds.has(
                                        header.column.id,
                                      ));
                                  const fixedSide = getFixedSide(header.column);
                                  const hideClassName = hideOnClassName(
                                    meta?.hideOn,
                                  );
                                  return (
                                    <TableHead
                                      key={header.id}
                                      className={cn(
                                        "relative border-b",
                                        (isSelectionColumn ||
                                          isActionsColumn) &&
                                          "w-[50px] max-w-[50px] min-w-[50px] px-0",
                                        isSpacerColumn &&
                                          "border-b-1 bg-transparent p-0",
                                        fixedSide &&
                                          getPinnedColumnClassName(fixedSide, {
                                            isUtilityColumn:
                                              isSelectionColumn ||
                                              isActionsColumn,
                                          }),
                                        hideClassName,
                                        headerAlignClassName(
                                          header.getContext(),
                                        ),
                                        meta?.headerClassName,
                                        meta?.responsiveClassName,
                                      )}
                                      style={{
                                        width: shouldFixWidth
                                          ? isSelectionColumn || isActionsColumn
                                            ? 50
                                            : header.getSize()
                                          : undefined,
                                        minWidth:
                                          isSelectionColumn || isActionsColumn
                                            ? 50
                                            : shouldFixWidth
                                              ? header.getSize()
                                              : columnMinWidth,
                                        maxWidth: shouldFixWidth
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
                                            "absolute inset-y-0 right-0 z-50 h-full w-3 translate-x-1/2 cursor-col-resize touch-none select-none after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-border hover:after:bg-primary",
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
                              <>
                                {virtualPaddingTop > 0 ? (
                                  <TableRow aria-hidden="true">
                                    <TableCell
                                      colSpan={Math.max(
                                        1,
                                        visibleLeafColumnCount,
                                      )}
                                      className="border-b-0 p-0"
                                      style={{ height: virtualPaddingTop }}
                                    />
                                  </TableRow>
                                ) : null}
                                {rowsToRender.map(({ row, rowIndex }) => {
                                  const originalRow = row.original;
                                  const isInitialLoadingRow =
                                    isDataTableLoadingRow(originalRow);
                                  const loadingState = isInitialLoadingRow
                                    ? { isLoading: true }
                                    : getRowLoadingState?.(
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
                                        isInitialLoadingRow
                                          ? false
                                          : (dragAndDrop?.getRowDraggable?.(
                                              originalRow,
                                            ) ?? false)
                                      }
                                      data-loading={
                                        resolvedLoadingState?.isLoading ||
                                        undefined
                                      }
                                      data-state={
                                        isInitialLoadingRow
                                          ? undefined
                                          : row.getIsSelected()
                                            ? "selected"
                                            : undefined
                                      }
                                      className={cn(
                                        !isInitialLoadingRow &&
                                          getRowClassName?.(originalRow),
                                        "hover:bg-muted/50 data-[state=selected]:!bg-primary/10",
                                        onRowClick &&
                                          !isInitialLoadingRow &&
                                          "cursor-pointer",
                                        isInitialLoadingRow &&
                                          "pointer-events-none",
                                      )}
                                      onClick={(
                                        event: React.MouseEvent<HTMLTableRowElement>,
                                      ) => {
                                        if (isInitialLoadingRow) {
                                          return;
                                        }

                                        handleRowClick(
                                          event,
                                          originalRow,
                                          row.id,
                                        );
                                      }}
                                      onDragStart={(
                                        event: React.DragEvent<HTMLTableRowElement>,
                                      ) => {
                                        if (isInitialLoadingRow) {
                                          return;
                                        }

                                        dragAndDrop?.onRowDragStart?.({
                                          row: originalRow,
                                          rowId: row.id,
                                          event,
                                        });
                                      }}
                                      onDragEnd={(
                                        event: React.DragEvent<HTMLTableRowElement>,
                                      ) => {
                                        if (isInitialLoadingRow) {
                                          return;
                                        }

                                        dragAndDrop?.onRowDragEnd?.({
                                          row: originalRow,
                                          rowId: row.id,
                                          event,
                                        });
                                      }}
                                    >
                                      {row.getVisibleCells().map((cell) => {
                                        const meta = (
                                          cell.column
                                            .columnDef as DataTableColumnDef<
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
                                        const configuredMinWidth =
                                          minimumColumnWidths.get(
                                            cell.column.id,
                                          );
                                        const isFlexibleFillColumn =
                                          cell.column.id === fillColumnId;
                                        const columnMinWidth =
                                          configuredMinWidth ??
                                          (isFlexibleFillColumn
                                            ? cell.column.getSize()
                                            : undefined);
                                        const shouldFixWidth =
                                          !isSpacerColumn &&
                                          (layoutMode === "fit" ||
                                            isSelectionColumn ||
                                            isActionsColumn ||
                                            fixedWidthColumnIds.has(
                                              cell.column.id,
                                            ));
                                        const fixedSide = getFixedSide(
                                          cell.column,
                                        );
                                        const hideClassName = hideOnClassName(
                                          meta?.hideOn,
                                        );
                                        const cellClassName =
                                          isInitialLoadingRow
                                            ? undefined
                                            : typeof meta?.cellClassName ===
                                                "function"
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
                                                getPinnedColumnClassName(
                                                  fixedSide,
                                                  {
                                                    isUtilityColumn:
                                                      isSelectionColumn ||
                                                      isActionsColumn,
                                                  },
                                                ),
                                              hideClassName,
                                              cellAlignClassName(cellContext),
                                              meta?.responsiveClassName,
                                              cellClassName,
                                            )}
                                            style={{
                                              width: shouldFixWidth
                                                ? isSelectionColumn ||
                                                  isActionsColumn
                                                  ? 50
                                                  : cell.column.getSize()
                                                : undefined,
                                              minWidth:
                                                isSelectionColumn ||
                                                isActionsColumn
                                                  ? 50
                                                  : shouldFixWidth
                                                    ? cell.column.getSize()
                                                    : columnMinWidth,
                                              maxWidth: shouldFixWidth
                                                ? isSelectionColumn ||
                                                  isActionsColumn
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
                                                isSelectionColumn ||
                                                isActionsColumn
                                                  ? "true"
                                                  : undefined
                                              }
                                            >
                                              {resolvedLoadingState?.isLoading
                                                ? (meta?.skeleton?.(
                                                    cellContext,
                                                  ) ??
                                                  resolvedLoadingState.skeleton ?? (
                                                    <Skeleton
                                                      className={cn(
                                                        "h-4 rounded",
                                                        meta?.type === "numeric"
                                                          ? "ml-auto w-16"
                                                          : meta?.type ===
                                                              "date"
                                                            ? "ml-auto w-28"
                                                            : "w-full",
                                                      )}
                                                    />
                                                  ))
                                                : isEditing &&
                                                    cell.column.id !==
                                                      "__select__" &&
                                                    cell.column.id !==
                                                      "__actions__"
                                                  ? renderEditableCell(
                                                      cellContext,
                                                      draftValues,
                                                      setDraftValues,
                                                      { Checkbox, Input },
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
                                })}
                                {virtualPaddingBottom > 0 ? (
                                  <TableRow aria-hidden="true">
                                    <TableCell
                                      colSpan={Math.max(
                                        1,
                                        visibleLeafColumnCount,
                                      )}
                                      className="border-b-0 p-0"
                                      style={{ height: virtualPaddingBottom }}
                                    />
                                  </TableRow>
                                ) : null}
                              </>
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={Math.max(1, visibleLeafColumnCount)}
                                  className="h-full grow"
                                >
                                  <div className="flex h-full min-h-full w-full grow items-center justify-center">
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

                      {infiniteScroll?.enabled &&
                      renderedRows.length &&
                      !shouldRenderInitialLoading ? (
                        <div className="px-4 pb-4">
                          <div ref={sentinelRef} className="h-4 w-full" />
                        </div>
                      ) : null}
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
            {(showFooter && !infiniteScroll?.enabled) || children ? (
              <div>
                {showFooter && !infiniteScroll?.enabled ? (
                  <DataTableFooter
                    pageIndex={currentPagination.pageIndex}
                    pageCount={effectivePageCount}
                    pageSize={currentPagination.pageSize}
                    totalRowCount={footerTotalRowCount}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onPageIndexChange={handleFooterPageIndexChange}
                    onPageSizeChange={handleFooterPageSizeChange}
                  />
                ) : null}
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      </TooltipProvider>
    );
  };
}

function defaultDraftValues<TData>(
  row: TData,
  columns: Array<DataTableColumnDef<TData, unknown>>,
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
  components: Pick<DataTableUiKit, "Checkbox" | "Input">,
) {
  const { Checkbox, Input } = components;
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
        onCheckedChange={(checked: boolean | "indeterminate") => {
          setDraftValue(checked === true);
        }}
      />
    );
  }

  return (
    <Input
      value={getEditableInputValue(draftValue)}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setDraftValue(event.target.value);
      }}
    />
  );
}

function getEditableInputValue(value: unknown) {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  return "";
}

function createDataTableLoadingRows<TData>(count: number) {
  return Array.from({ length: count }, (_, index) => {
    return {
      [DATA_TABLE_LOADING_ROW]: true,
      index,
    } as DataTableLoadingRow as TData;
  });
}

function isDataTableLoadingRow(row: unknown): row is DataTableLoadingRow {
  return Boolean(
    row &&
      typeof row === "object" &&
      DATA_TABLE_LOADING_ROW in (row as Record<PropertyKey, unknown>),
  );
}

function getDataTableLoadingRowId(index: number) {
  return `__loading__${index}`;
}

function getConfiguredColumnMinWidth<TData>(
  column: DataTableColumnDef<TData, unknown>,
) {
  if (typeof column.meta?.minWidth === "number") {
    return column.meta.minWidth;
  }

  if (Object.prototype.hasOwnProperty.call(column, "minSize")) {
    const minSize = (column as { minSize?: unknown }).minSize;

    if (typeof minSize === "number") {
      return minSize;
    }
  }

  return undefined;
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

function getPinnedColumnClassName(
  side: "left" | "right",
  options?: { isUtilityColumn?: boolean },
) {
  const isUtilityColumn = options?.isUtilityColumn ?? false;
  return cn(
    "sticky border-border backdrop-blur box-border",
    isUtilityColumn ? "bg-card" : "border-dotted",
    side === "left" ? "border-r-1" : "right-0 border-l",
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
