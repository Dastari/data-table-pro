import * as React from "react";
import { flushSync } from "react-dom";
import {
  flexRender,
  getExpandedRowModel,
  getFilteredRowModel,
  functionalUpdate,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { IconChevronDown, IconDownload, IconSelector } from "../icons";
import type {
  CellContext,
  ColumnFiltersState,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table as TanStackTable,
  VisibilityState,
} from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableColumnFixed,
  DataTableColumnType,
  DataTableDensity,
  DataTableProps,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { cn } from "../../lib/utils";
import { renderDataTableCellContent } from "./data-table-cell-content";
import { createDataTableCardView } from "./create-data-table-card-view";
import { createDataTableEmptyState } from "./create-data-table-empty-state";
import { createDataTablePagination } from "./create-data-table-pagination";
import { createDataTableRowActions } from "./create-data-table-row-actions";
import { createDataTableToolbar } from "./create-data-table-toolbar";
import { resolveDataTableLabels } from "./data-table-labels";
import {
  readDataTableColumnPrefs,
  usePersistDataTableColumnPrefs,
} from "./use-data-table-column-prefs";
import { useDataTableContainerWidth } from "./use-data-table-container-width";
import { useDataTableInfiniteScroll } from "./use-data-table-infinite-scroll";
import { useDataTablePaginationClamp } from "./use-data-table-pagination-clamp";
import { useDataTableScrollViewport } from "./use-data-table-scroll-viewport";
import {
  UTILITY_COLUMN_SIZE,
  createDataTableLoadingRows,
  decorateFilterableColumn,
  exportDataTableCsv,
  getAccessorKey,
  getColumnId,
  getConfiguredColumnMinWidth,
  getDataTableLoadingRowId,
  getDensityCellClassName,
  getDensityHeaderClassName,
  getFixedSide,
  getInitialColumnPinning,
  getPinnedColumnClassName,
  hasFilterValue,
  isDataTableLoadingRow,
  isUtilityColumnId,
  moveColumnInOrder,
  normalizeColumnFilterOptions,
  rowMatchesToolbarQuery,
  startCase,
} from "./data-table-utils";
import {
  cellAlignClassName,
  headerAlignClassName,
  hideOnClassName,
  isHiddenAtContainerWidth,
  isRowVisible,
} from "../types";

export function createDataTable(ui: DataTableUiKit) {
  const uiClassNames = ui.classNames ?? {};
  const {
    rootClassName,
    Button,
    Checkbox,
    Input,
    ScrollArea,
    ScrollBar,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableFooter = "tfoot",
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
    toolbarQueryValue,
    onToolbarQueryValueChange,
    toolbarQueryPlaceholder,
    toolbarQueryDebounceMs,
    manualFiltering = false,
    enableToolbarQueryFiltering = true,
    globalFilterFn,
    columnFilters,
    onColumnFiltersChange,
    enableColumnFilters,
    customToolbar,
    compactToolbar,
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
    expanded,
    onExpandedChange,
    getRowCanExpand,
    renderExpandedRow,
    columnOrder,
    onColumnOrderChange,
    enableColumnReordering = false,
    columnPinning,
    onColumnPinningChange,
    enableColumnPinning = false,
    toolbarActions = [],
    selectionActions = [],
    rowActions = [],
    csvExport,
    density,
    onDensityChange,
    enableDensityToggle = false,
    columnPrefsKey,
    labels,
    summaryRows = [],
    cardRenderer,
    cardGridClassName,
    cardClassName,
    viewMode,
    onViewModeChange,
    enableViewToggle = false,
    emptyState,
    isLoading = false,
    loadingRowCount,
    getRowLoadingState,
    hiddenRows,
    showHiddenRows,
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
    dir = "ltr",
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
    const draggedColumnIdRef = React.useRef<string | null>(null);
    const tableRef = React.useRef<TanStackTable<TData> | null>(null);
    const lastSelectedRowIdRef = React.useRef<string | null>(null);
    const persistedColumnPrefs = React.useMemo(
      () => readDataTableColumnPrefs(columnPrefsKey),
      [columnPrefsKey],
    );
    const resolvedLabels = React.useMemo(
      () => resolveDataTableLabels(labels),
      [labels],
    );
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
      React.useState<VisibilityState>(() => persistedColumnPrefs.visibility ?? {});
    const [localColumnFilters, setLocalColumnFilters] =
      React.useState<ColumnFiltersState>([]);
    const [localExpanded, setLocalExpanded] = React.useState<ExpandedState>({});
    const [localColumnOrder, setLocalColumnOrder] =
      React.useState<ColumnOrderState>(() => persistedColumnPrefs.order ?? []);
    const [localColumnPinning, setLocalColumnPinning] =
      React.useState<ColumnPinningState>(
        () => persistedColumnPrefs.pinning ?? getInitialColumnPinning(columns),
      );
    const [localColumnSizing, setLocalColumnSizing] =
      React.useState<ColumnSizingState>(() => persistedColumnPrefs.sizing ?? {});
    const [localViewMode, setLocalViewMode] =
      React.useState(() => viewMode ?? "table");
    const [localShowHiddenRows, setLocalShowHiddenRows] = React.useState(
      showHiddenRows ?? false,
    );
    const [localDensity, setLocalDensity] = React.useState<DataTableDensity>(
      () => density ?? persistedColumnPrefs.density ?? "comfortable",
    );
    const resolvedToolbarQueryValue = toolbarQueryValue ?? "";
    const resolvedToolbarQueryPlaceholder =
      toolbarQueryPlaceholder ?? resolvedLabels.searchPlaceholder;
    const resolvedToolbarQueryDebounceMs = toolbarQueryDebounceMs ?? 250;
    const resolvedOnToolbarQueryValueChange = onToolbarQueryValueChange;
    const [localSearchValue, setLocalSearchValue] = React.useState(
      resolvedToolbarQueryValue,
    );
    const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
    const [draftValues, setDraftValues] = React.useState<
      Record<string, unknown>
    >({});
    const draftValuesRef = React.useRef(draftValues);
    const [isSavingEdit, setIsSavingEdit] = React.useState(false);
    const currentViewMode = viewMode ?? localViewMode;
    const currentShowHiddenRows = showHiddenRows ?? localShowHiddenRows;
    const currentDensity = density ?? localDensity;
    const containerWidth = useDataTableContainerWidth(containerRef);
    const { viewportElement: tableScrollElement, viewportHeight } =
      useDataTableScrollViewport(tableScrollContainerRef, currentViewMode);
    const hasOnSearchValueChange = Boolean(resolvedOnToolbarQueryValueChange);
    const lastReportedSearchValueRef = React.useRef(resolvedToolbarQueryValue);
    const onToolbarQueryValueChangeEvent = React.useEffectEvent(
      (value: string) => {
        lastReportedSearchValueRef.current = value;
        resolvedOnToolbarQueryValueChange?.(value);
      },
    );

    React.useEffect(() => {
      lastReportedSearchValueRef.current = resolvedToolbarQueryValue;
      setLocalSearchValue(resolvedToolbarQueryValue);
    }, [resolvedToolbarQueryValue]);

    React.useEffect(() => {
      draftValuesRef.current = draftValues;
    }, [draftValues]);

    React.useEffect(() => {
      if (!hasOnSearchValueChange) {
        return;
      }

      if (localSearchValue === resolvedToolbarQueryValue) {
        return;
      }

      if (localSearchValue === lastReportedSearchValueRef.current) {
        return;
      }

      const timeout = window.setTimeout(() => {
        onToolbarQueryValueChangeEvent(localSearchValue);
      }, resolvedToolbarQueryDebounceMs);

      return () => {
        window.clearTimeout(timeout);
      };
    }, [
      hasOnSearchValueChange,
      localSearchValue,
      resolvedToolbarQueryDebounceMs,
      resolvedToolbarQueryValue,
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
    const currentColumnFilters = columnFilters ?? localColumnFilters;
    const currentExpanded = expanded ?? localExpanded;
    const currentColumnOrder = columnOrder ?? localColumnOrder;
    const currentColumnPinning = columnPinning ?? localColumnPinning;
    const currentColumnSizing = localColumnSizing;
    const globalFilterValue = "";
    const handleViewModeChange = React.useCallback(
      (nextViewMode: "table" | "card") => {
        onViewModeChange?.(nextViewMode);
        if (viewMode === undefined) {
          setLocalViewMode(nextViewMode);
        }
      },
      [onViewModeChange, viewMode],
    );
    const handleShowHiddenRowsChange = React.useCallback(
      (nextShowHiddenRows: boolean) => {
        onShowHiddenRowsChange?.(nextShowHiddenRows);
        if (showHiddenRows === undefined) {
          setLocalShowHiddenRows(nextShowHiddenRows);
        }
      },
      [onShowHiddenRowsChange, showHiddenRows],
    );
    const handleDensityChange = React.useCallback(
      (nextDensity: DataTableDensity) => {
        onDensityChange?.(nextDensity);
        if (density === undefined) {
          setLocalDensity(nextDensity);
        }
      },
      [density, onDensityChange],
    );
    const resetPageIndexForFilterChange = React.useCallback(() => {
      onPageIndexChange?.(0);
      if (pageIndex === undefined) {
        setLocalPagination((current) =>
          current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
        );
      }
    }, [onPageIndexChange, pageIndex]);
    const filterResetSignature = React.useMemo(
      () =>
        JSON.stringify({
          globalFilterValue,
          columnFilters: currentColumnFilters,
        }),
      [currentColumnFilters, globalFilterValue],
    );
    const lastFilterResetSignatureRef = React.useRef(filterResetSignature);

    React.useEffect(() => {
      if (manualFiltering) {
        lastFilterResetSignatureRef.current = filterResetSignature;
        return;
      }

      if (lastFilterResetSignatureRef.current === filterResetSignature) {
        return;
      }

      lastFilterResetSignatureRef.current = filterResetSignature;
      resetPageIndexForFilterChange();
    }, [filterResetSignature, manualFiltering, resetPageIndexForFilterChange]);

    usePersistDataTableColumnPrefs({
      key: columnPrefsKey,
      prefs: {
        visibility: columnVisibility ? undefined : currentColumnVisibility,
        sizing: currentColumnSizing,
        order: columnOrder ? undefined : currentColumnOrder,
        pinning: columnPinning ? undefined : currentColumnPinning,
        density: density ? undefined : currentDensity,
      },
    });
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
      () =>
        data.filter((row) =>
          isRowVisible(row, hiddenRows, currentShowHiddenRows),
        ),
      [currentShowHiddenRows, data, hiddenRows],
    );
    const toolbarFilteredData = React.useMemo(() => {
      if (
        manualFiltering ||
        !enableToolbarQueryFiltering ||
        !localSearchValue.trim()
      ) {
        return visibleData;
      }

      return visibleData.filter((row) =>
        rowMatchesToolbarQuery(row, columns, localSearchValue),
      );
    }, [
      columns,
      enableToolbarQueryFiltering,
      localSearchValue,
      manualFiltering,
      visibleData,
    ]);
    const shouldRenderInitialLoading = isLoading && visibleData.length === 0;
    const loadingRows = React.useMemo(
      () => createDataTableLoadingRows<TData>(resolvedLoadingRowCount),
      [resolvedLoadingRowCount],
    );
    const tableData = shouldRenderInitialLoading
      ? loadingRows
      : toolbarFilteredData;
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

        const pinned: false | DataTableColumnFixed =
          currentColumnPinning.left?.includes(id) === true
            ? "left"
            : currentColumnPinning.right?.includes(id) === true
              ? "right"
              : false;

        return {
          id,
          label,
          visible: effectiveColumnVisibility[id] !== false,
          canHide: column.enableHiding !== false,
          pinned,
        };
      });
    }, [columns, currentColumnPinning, effectiveColumnVisibility]);

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
          await editableRows.onSaveRow(row, draftValuesRef.current);
          React.startTransition(() => {
            setEditingRowId(null);
            setDraftValues({});
          });
        } finally {
          setIsSavingEdit(false);
        }
      },
      [editableRows],
    );
    const selectRowRange = React.useCallback(
      (targetRowId: string, selected: boolean) => {
        const tableInstance = tableRef.current;
        if (!tableInstance || !lastSelectedRowIdRef.current) {
          return;
        }

        const rows = tableInstance
          .getRowModel()
          .rows.filter((row) => !isDataTableLoadingRow(row.original));
        const startIndex = rows.findIndex(
          (row) => row.id === lastSelectedRowIdRef.current,
        );
        const endIndex = rows.findIndex((row) => row.id === targetRowId);

        if (startIndex < 0 || endIndex < 0) {
          return;
        }

        const from = Math.min(startIndex, endIndex);
        const to = Math.max(startIndex, endIndex);
        tableInstance.setRowSelection((current) => {
          const next = { ...current };
          for (const row of rows.slice(from, to + 1)) {
            if (selected) {
              next[row.id] = true;
            } else {
              delete next[row.id];
            }
          }
          return next;
        });
      },
      [],
    );

    const tableColumns = React.useMemo<Array<ColumnDef<TData, unknown>>>(() => {
      const defs: Array<ColumnDef<TData, unknown>> = [];

      if (renderExpandedRow) {
        defs.push({
          id: "__expand__",
          enableResizing: false,
          enableSorting: false,
          enableHiding: false,
          size: UTILITY_COLUMN_SIZE,
          minSize: UTILITY_COLUMN_SIZE,
          maxSize: UTILITY_COLUMN_SIZE,
          header: () => <span className="sr-only">{resolvedLabels.expandRow}</span>,
          cell: ({ row }) => {
            const canExpand =
              getRowCanExpand?.(row.original) ?? Boolean(renderExpandedRow);
            if (!canExpand) {
              return null;
            }

            const isExpanded = row.getIsExpanded();
            return (
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={
                    isExpanded
                      ? resolvedLabels.collapseRow
                      : resolvedLabels.expandRow
                  }
                  aria-expanded={isExpanded}
                  onClick={() => row.toggleExpanded()}
                >
                  <IconChevronDown
                    className={cn(
                      "transition-transform",
                      isExpanded ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </Button>
              </div>
            );
          },
        });
      }

      if (enableRowSelection) {
        defs.push({
          id: "__select__",
          enableResizing: false,
          enableSorting: false,
          enableHiding: false,
          size: UTILITY_COLUMN_SIZE,
          minSize: UTILITY_COLUMN_SIZE,
          maxSize: UTILITY_COLUMN_SIZE,
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
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  if (!event.shiftKey || !lastSelectedRowIdRef.current) {
                    lastSelectedRowIdRef.current = row.id;
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();
                  selectRowRange(row.id, !row.getIsSelected());
                  lastSelectedRowIdRef.current = row.id;
                }}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  lastSelectedRowIdRef.current = row.id;
                  row.toggleSelected(checked === true);
                }}
                aria-label="Select row"
              />
            </div>
          ),
        });
      }

      defs.push(...columns.map((column) => decorateFilterableColumn(column)));

      if (rowActions.length || editableRows) {
        defs.push({
          id: "__actions__",
          enableSorting: false,
          enableResizing: false,
          enableHiding: false,
          size: UTILITY_COLUMN_SIZE,
          minSize: UTILITY_COLUMN_SIZE,
          maxSize: UTILITY_COLUMN_SIZE,
          header: () => <span className="sr-only">{resolvedLabels.actions}</span>,
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
                    {resolvedLabels.saveEdit}
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
                        <span className="sr-only">
                          {resolvedLabels.cancelEdit}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{resolvedLabels.cancelEdit}</TooltipContent>
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
                  labels={resolvedLabels}
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
      getRowCanExpand,
      isSavingEdit,
      renderExpandedRow,
      resolvedLabels,
      rowActions,
      saveEdit,
      selectRowRange,
      startEditingRow,
    ]);

    const tableState = React.useMemo(
      () => ({
        sorting: currentSorting,
        pagination: currentPagination,
        rowSelection: currentRowSelection,
        columnVisibility: effectiveColumnVisibility,
        columnFilters: currentColumnFilters,
        globalFilter: globalFilterValue,
        expanded: currentExpanded,
        columnOrder: currentColumnOrder,
        columnPinning: currentColumnPinning,
        columnSizing: currentColumnSizing,
      }),
      [
        currentColumnFilters,
        currentColumnOrder,
        currentColumnPinning,
        currentColumnSizing,
        currentExpanded,
        currentPagination,
        currentRowSelection,
        currentSorting,
        effectiveColumnVisibility,
        globalFilterValue,
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
    const handleColumnFiltersChange = React.useCallback<
      OnChangeFn<ColumnFiltersState>
    >(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentColumnFilters);
        onColumnFiltersChange?.(nextValue);
        if (!columnFilters) {
          setLocalColumnFilters(nextValue);
        }
      },
      [columnFilters, currentColumnFilters, onColumnFiltersChange],
    );
    const handleExpandedChange = React.useCallback<OnChangeFn<ExpandedState>>(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentExpanded);
        onExpandedChange?.(nextValue);
        if (!expanded) {
          setLocalExpanded(nextValue);
        }
      },
      [currentExpanded, expanded, onExpandedChange],
    );
    const handleColumnOrderChange = React.useCallback<
      OnChangeFn<ColumnOrderState>
    >(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentColumnOrder);
        onColumnOrderChange?.(nextValue);
        if (!columnOrder) {
          setLocalColumnOrder(nextValue);
        }
      },
      [columnOrder, currentColumnOrder, onColumnOrderChange],
    );
    const handleColumnPinningChange = React.useCallback<
      OnChangeFn<ColumnPinningState>
    >(
      (updater) => {
        const nextValue = functionalUpdate(updater, currentColumnPinning);
        onColumnPinningChange?.(nextValue);
        if (!columnPinning) {
          setLocalColumnPinning(nextValue);
        }
      },
      [columnPinning, currentColumnPinning, onColumnPinningChange],
    );
    const handleColumnSizingChange = React.useCallback<
      OnChangeFn<ColumnSizingState>
    >((updater) => {
      setLocalColumnSizing((current) => functionalUpdate(updater, current));
    }, []);

    const table = useReactTable({
      data: tableData,
      columns: tableColumns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
      getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
      getExpandedRowModel: renderExpandedRow ? getExpandedRowModel() : undefined,
      getPaginationRowModel:
        manualPagination || infiniteScroll?.enabled
          ? undefined
          : getPaginationRowModel(),
      enableRowSelection,
      enableMultiRowSelection: enableRowSelection,
      enableColumnResizing,
      columnResizeMode,
      getRowId: tableGetRowId,
      getRowCanExpand: renderExpandedRow
        ? (row) => getRowCanExpand?.(row.original) ?? true
        : undefined,
      globalFilterFn,
      manualSorting,
      manualFiltering,
      manualPagination: manualPagination || Boolean(infiniteScroll?.enabled),
      defaultColumn,
      autoResetPageIndex: false,
      state: tableState,
      onSortingChange: handleSortingChange,
      onPaginationChange: handlePaginationChange,
      onRowSelectionChange: handleRowSelectionChange,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      onColumnFiltersChange: handleColumnFiltersChange,
      onExpandedChange: handleExpandedChange,
      onColumnOrderChange: handleColumnOrderChange,
      onColumnPinningChange: handleColumnPinningChange,
      onColumnSizingChange: handleColumnSizingChange,
    });
    tableRef.current = table;
    const columnSizing = currentColumnSizing;
    const visibleLeafColumns = table.getVisibleLeafColumns();
    const reorderColumn = React.useCallback(
      (sourceColumnId: string, targetColumnId: string) => {
        if (sourceColumnId === targetColumnId) {
          return;
        }

        const defaultOrder = table
          .getAllLeafColumns()
          .map((column) => column.id)
          .filter((columnId) => !isUtilityColumnId(columnId));
        const nextOrder = moveColumnInOrder(
          currentColumnOrder.length ? currentColumnOrder : defaultOrder,
          sourceColumnId,
          targetColumnId,
        );
        handleColumnOrderChange(nextOrder);
      },
      [currentColumnOrder, handleColumnOrderChange, table],
    );

    const renderedRows = table.getRowModel().rows;
    const virtualizationConfig =
      typeof virtualization === "object" ? virtualization : undefined;
    const enableVirtualization =
      currentViewMode === "table" &&
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

      if (renderExpandedRow) {
        ids.add("__expand__");
      }

      if (rowActions.length || editableRows) {
        ids.add("__actions__");
      }

      return ids;
    }, [
      columns,
      editableRows,
      enableRowSelection,
      renderExpandedRow,
      rowActions.length,
    ]);
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
    const explicitCustomCellColumnIds = React.useMemo(() => {
      return new Set(
        columns.flatMap((column, index) => {
          return Object.prototype.hasOwnProperty.call(column, "cell") &&
            typeof column.cell === "function"
            ? [getColumnId(column, index)]
            : [];
        }),
      );
    }, [columns]);
    const visibleLeafColumnCount = visibleLeafColumns.length;
    const fillColumnId = React.useMemo(() => {
      if (layoutMode !== "fill") {
        return undefined;
      }

      const dataColumns = visibleLeafColumns.filter(
        (column) =>
          !isUtilityColumnId(column.id),
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
        const isFixedUtilityColumn = isUtilityColumnId(column.id);
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
        ? toolbarFilteredData.length
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

    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const emptyNode =
      typeof emptyState === "function"
      ? emptyState({
          rows: filteredData,
          toolbarQueryValue: localSearchValue,
        })
        : emptyState;
    const toolbarColumnFilters = React.useMemo(() => {
      if (enableColumnFilters === false) {
        return [];
      }

      return columns.flatMap((column, index) => {
        const filter = column.meta?.filter;
        if (!filter) {
          return [];
        }

        const id = getColumnId(column, index);
        const header = column.header;
        const accessorKey = getAccessorKey(column);
        const label =
          filter.label ??
          (typeof header === "string"
            ? header
            : accessorKey
              ? startCase(accessorKey)
              : startCase(id));
        const state = currentColumnFilters.find((item) => item.id === id);
        const rawOptions =
          typeof filter.options === "function"
            ? filter.options({ rows: visibleData })
            : (filter.options ?? []);

        return [
          {
            id,
            label,
            type: filter.type,
            value: state?.value,
            placeholder: filter.placeholder,
            options: normalizeColumnFilterOptions(rawOptions),
          },
        ];
      });
    }, [columns, currentColumnFilters, enableColumnFilters, visibleData]);
    const handleToolbarColumnFilterChange = React.useCallback(
      (columnId: string, value: unknown) => {
        handleColumnFiltersChange((current) => {
          const next = current.filter((filter) => filter.id !== columnId);
          if (hasFilterValue(value)) {
            next.push({ id: columnId, value });
          }
          return next;
        });
      },
      [handleColumnFiltersChange],
    );
    const handleClearColumnFilters = React.useCallback(() => {
      handleColumnFiltersChange([]);
    }, [handleColumnFiltersChange]);
    const handleToolbarColumnPinningChange = React.useCallback(
      (columnId: string, side: DataTableColumnFixed | false) => {
        handleColumnPinningChange((current) => {
          const left = (current.left ?? []).filter((id) => id !== columnId);
          const right = (current.right ?? []).filter((id) => id !== columnId);

          if (side === "left") {
            left.push(columnId);
          }
          if (side === "right") {
            right.push(columnId);
          }

          return { left, right };
        });
      },
      [handleColumnPinningChange],
    );
    const handleCsvExport = React.useCallback(() => {
      if (!csvExport) {
        return;
      }

      void exportDataTableCsv({
        csvExport,
        table,
        labels: resolvedLabels,
      });
    }, [csvExport, resolvedLabels, table]);
    const effectiveToolbarActions = React.useMemo(() => {
      if (!csvExport) {
        return toolbarActions;
      }

      return [
        ...toolbarActions,
        {
          key: "__csv_export__",
          label: resolvedLabels.exportCsv,
          icon: IconDownload,
          placement: "trailing" as const,
          onClick: handleCsvExport,
        },
      ];
    }, [csvExport, handleCsvExport, resolvedLabels.exportCsv, toolbarActions]);

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
          data-dtp-slot="data-table-root"
          data-density={currentDensity}
          dir={dir}
          className={cn(
            "@container/data-table data-table-container-query flex flex-col",
            flexGrow ? "h-full min-h-0 flex-1" : "grow",
            rootClassName,
          )}
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
          <div
            data-dtp-slot="data-table-layout"
            className={cn(
              "flex w-full flex-col",
              flexGrow ? "min-h-0 flex-1" : "grow",
            )}
          >
            <div
              data-dtp-slot="data-table-main"
              className={cn(
                "flex w-full flex-col gap-4",
                flexGrow ? "min-h-0 flex-1" : "grow",
                className,
              )}
            >
              {showToolbar ? (
                <div data-dtp-slot="data-table-toolbar" className="shrink-0">
                  <DataTableToolbar
                    title={title}
                    description={description}
                    toolbarQueryValue={localSearchValue}
                    toolbarQueryPlaceholder={resolvedToolbarQueryPlaceholder}
                    onToolbarQueryValueChange={setLocalSearchValue}
                    customToolbar={customToolbar}
                    compactToolbar={compactToolbar}
                    viewMode={currentViewMode}
                    onViewModeChange={handleViewModeChange}
                    enableViewToggle={enableViewToggle && Boolean(cardRenderer)}
                    toolbarActions={effectiveToolbarActions}
                    selectionActions={selectionActions}
                    selectedRows={selectedRows}
                    showHiddenRows={currentShowHiddenRows}
                    hiddenRowsLabel={hiddenRows?.label}
                    onShowHiddenRowsChange={handleShowHiddenRowsChange}
                    allRows={filteredData}
                    columnVisibilityOptions={columnVisibilityOptions}
                    onColumnVisibilityChange={(columnId, visible) => {
                      table.getColumn(columnId)?.toggleVisibility(visible);
                    }}
                    enableColumnPinning={enableColumnPinning}
                    onColumnPinningChange={handleToolbarColumnPinningChange}
                    columnFilters={toolbarColumnFilters}
                    onColumnFilterChange={handleToolbarColumnFilterChange}
                    onClearColumnFilters={handleClearColumnFilters}
                    density={currentDensity}
                    onDensityChange={handleDensityChange}
                    enableDensityToggle={enableDensityToggle}
                    labels={resolvedLabels}
                    toolbarVisibility={toolbarVisibility}
                    openFileDialog={fileUpload ? openFileDialog : undefined}
                  />
                </div>
              ) : null}

            <div
              data-dtp-slot="data-table-content"
              className={cn(flexGrow ? "flex min-h-0 flex-1 flex-col" : "")}
            >
              {currentViewMode === "card" && cardRenderer ? (
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
                      {shouldRenderInitialLoading ? (
                        <DataTableCardView
                          rows={[]}
                          cardRenderer={cardRenderer}
                          cardGridClassName={cardGridClassName}
                          cardClassName={cardClassName}
                          rowActions={rowActions}
                          editableRows={editableRows}
                          renderExpandedRow={renderExpandedRow}
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
                          labels={resolvedLabels}
                        />
                      ) : renderedRows.length ? (
                        <DataTableCardView
                          rows={renderedRows}
                          cardRenderer={cardRenderer}
                          cardGridClassName={cardGridClassName}
                          cardClassName={cardClassName}
                          rowActions={rowActions}
                          editableRows={editableRows}
                          renderExpandedRow={renderExpandedRow}
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

                      {infiniteScroll?.enabled &&
                      !shouldRenderInitialLoading ? (
                        <div className="shrink-0 px-4 pb-4">
                          <div ref={sentinelRef} className="h-4 w-full" />
                        </div>
                      ) : null}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div
                  data-dtp-slot="data-table-table-shell"
                  className={cn(
                    "box-border border-2 border-transparent transition-colors",
                    flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
                    dragAndDrop?.isDragging &&
                      (uiClassNames.dragActive ?? "rounded-md border-dashed"),
                  )}
                >
                  <div
                    ref={tableScrollContainerRef}
                    className={cn(
                      flexGrow ? "flex min-h-0 flex-1 flex-col" : "h-full",
                    )}
                  >
                    <ScrollArea
                      className={cn(
                        "rounded-md border",
                        flexGrow ? "min-h-0 flex-1" : "h-full",
                        uiClassNames.tableContainer,
                        uiClassNames.tableScrollArea,
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
                              const isFixedUtilityColumn = isUtilityColumnId(
                                column.id,
                              );
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
                                              ? UTILITY_COLUMN_SIZE
                                              : column.getSize()
                                            : undefined,
                                          minWidth: isFixedUtilityColumn
                                            ? UTILITY_COLUMN_SIZE
                                            : shouldFixWidth
                                              ? column.getSize()
                                              : columnMinWidth,
                                          maxWidth: shouldFixWidth
                                            ? isFixedUtilityColumn
                                              ? UTILITY_COLUMN_SIZE
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
                                ? (uiClassNames.tableStickyHeader ??
                                  "sticky top-0 z-30 backdrop-blur")
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
                                  const sortingIndex = currentSorting.findIndex(
                                    (sort) => sort.id === header.column.id,
                                  );
                                  const isSelectionColumn =
                                    header.column.id === "__select__";
                                  const isExpansionColumn =
                                    header.column.id === "__expand__";
                                  const isActionsColumn =
                                    header.column.id === "__actions__";
                                  const isUtilityColumn =
                                    isSelectionColumn ||
                                    isExpansionColumn ||
                                    isActionsColumn;
                                  const isSpacerColumn =
                                    header.column.id === "__spacer__";
                                  const canReorderColumn =
                                    enableColumnReordering &&
                                    !isUtilityColumn &&
                                    !isSpacerColumn;
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
                                      isUtilityColumn ||
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
                                        getDensityHeaderClassName(
                                          currentDensity,
                                        ),
                                        isUtilityColumn &&
                                          "w-[50px] max-w-[50px] min-w-[50px] px-0",
                                        isSpacerColumn &&
                                          "border-b-1 bg-transparent p-0",
                                        fixedSide &&
                                          getPinnedColumnClassName(
                                            fixedSide,
                                            uiClassNames,
                                            {
                                              isUtilityColumn:
                                                isUtilityColumn,
                                            },
                                          ),
                                        hideClassName,
                                        headerAlignClassName(
                                          header.getContext(),
                                        ),
                                        meta?.headerClassName,
                                        meta?.responsiveClassName,
                                      )}
                                      style={{
                                        width: shouldFixWidth
                                          ? isUtilityColumn
                                            ? UTILITY_COLUMN_SIZE
                                            : header.getSize()
                                          : undefined,
                                        minWidth:
                                          isUtilityColumn
                                            ? UTILITY_COLUMN_SIZE
                                            : shouldFixWidth
                                              ? header.getSize()
                                              : columnMinWidth,
                                        maxWidth: shouldFixWidth
                                          ? isUtilityColumn
                                            ? UTILITY_COLUMN_SIZE
                                            : header.getSize()
                                          : undefined,
                                        insetInlineStart:
                                          fixedSide === "left"
                                            ? pinnedColumns.left.get(
                                                header.column.id,
                                              )
                                            : undefined,
                                        insetInlineEnd:
                                          fixedSide === "right"
                                            ? pinnedColumns.right.get(
                                                header.column.id,
                                              )
                                            : undefined,
                                      }}
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
                                          ? (
                                              event: React.DragEvent<
                                                HTMLTableCellElement
                                              >,
                                            ) => {
                                              draggedColumnIdRef.current =
                                                header.column.id;
                                              event.dataTransfer.effectAllowed =
                                                "move";
                                            }
                                          : undefined
                                      }
                                      onDragOver={
                                        canReorderColumn
                                          ? (
                                              event: React.DragEvent<
                                                HTMLTableCellElement
                                              >,
                                            ) => {
                                              event.preventDefault();
                                              event.dataTransfer.dropEffect =
                                                "move";
                                            }
                                          : undefined
                                      }
                                      onDrop={
                                        canReorderColumn
                                          ? (
                                              event: React.DragEvent<
                                                HTMLTableCellElement
                                              >,
                                            ) => {
                                              event.preventDefault();
                                              const sourceColumnId =
                                                draggedColumnIdRef.current;
                                              draggedColumnIdRef.current = null;
                                              if (sourceColumnId) {
                                                reorderColumn(
                                                  sourceColumnId,
                                                  header.column.id,
                                                );
                                              }
                                            }
                                          : undefined
                                      }
                                      onKeyDown={
                                        canReorderColumn
                                          ? (
                                              event: React.KeyboardEvent<
                                                HTMLTableCellElement
                                              >,
                                            ) => {
                                              if (
                                                !event.altKey ||
                                                (event.key !== "ArrowLeft" &&
                                                  event.key !== "ArrowRight")
                                              ) {
                                                return;
                                              }

                                              event.preventDefault();
                                              const headers =
                                                headerGroup.headers.filter(
                                                  (item) =>
                                                    !isUtilityColumnId(
                                                      item.column.id,
                                                    ) &&
                                                    item.column.id !==
                                                      "__spacer__",
                                                );
                                              const currentIndex =
                                                headers.findIndex(
                                                  (item) =>
                                                    item.column.id ===
                                                    header.column.id,
                                                );
                                              const target =
                                                headers[
                                                  event.key === "ArrowLeft"
                                                    ? currentIndex - 1
                                                    : currentIndex + 1
                                                ];
                                              if (target) {
                                                reorderColumn(
                                                  header.column.id,
                                                  target.column.id,
                                                );
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
                                            <>
                                              <IconChevronDown
                                                className={cn(
                                                  "shrink-0 transition-transform",
                                                  sortingState === "desc"
                                                    ? "rotate-0"
                                                    : "rotate-180",
                                                )}
                                              />
                                              {currentSorting.length > 1 &&
                                              sortingIndex >= 0 ? (
                                                <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none">
                                                  {sortingIndex + 1}
                                                </span>
                                              ) : null}
                                            </>
                                          ) : (
                                            <IconSelector
                                              className={cn(
                                                "shrink-0",
                                                uiClassNames.headerSortIcon ??
                                                  "opacity-70",
                                              )}
                                            />
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
                                            "absolute inset-y-0 right-0 z-50 h-full w-3 translate-x-1/2 cursor-col-resize touch-none select-none after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2",
                                            uiClassNames.resizeHandle ??
                                              "after:bg-current after:opacity-20 hover:after:opacity-70",
                                            header.column.getIsResizing() &&
                                              (uiClassNames.resizeHandleActive ??
                                                "after:opacity-100"),
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
                                    <React.Fragment key={row.id}>
                                    <TableRow
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
                                      role={
                                        onRowClick && !isInitialLoadingRow
                                          ? "button"
                                          : undefined
                                      }
                                      tabIndex={
                                        onRowClick && !isInitialLoadingRow
                                          ? 0
                                          : undefined
                                      }
                                      className={cn(
                                        !isInitialLoadingRow &&
                                          getRowClassName?.(originalRow),
                                        uiClassNames.row,
                                        row.getIsSelected() &&
                                          !isInitialLoadingRow &&
                                          uiClassNames.rowSelected,
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
                                      onKeyDown={(
                                        event: React.KeyboardEvent<HTMLTableRowElement>,
                                      ) => {
                                        if (
                                          isInitialLoadingRow ||
                                          !onRowClick ||
                                          (event.key !== "Enter" &&
                                            event.key !== " ")
                                        ) {
                                          return;
                                        }

                                        const target =
                                          event.target as HTMLElement | null;
                                        if (
                                          target?.closest(
                                            "[data-row-click-ignore='true']",
                                          )
                                        ) {
                                          return;
                                        }

                                        event.preventDefault();
                                        void onRowClick({
                                          row: originalRow,
                                          rowId: row.id,
                                        });
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
                                        const isExpansionColumn =
                                          cell.column.id === "__expand__";
                                        const isActionsColumn =
                                          cell.column.id === "__actions__";
                                        const isUtilityColumn =
                                          isSelectionColumn ||
                                          isExpansionColumn ||
                                          isActionsColumn;
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
                                            isExpansionColumn ||
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
                                              "border-b",
                                              getDensityCellClassName(
                                                currentDensity,
                                              ),
                                              uiClassNames.cellBorder,
                                              isUtilityColumn &&
                                                "w-[50px] max-w-[50px] min-w-[50px] px-0",
                                              isSpacerColumn &&
                                                "border-b-0 bg-transparent p-0",
                                              fixedSide &&
                                                getPinnedColumnClassName(
                                                  fixedSide,
                                                  uiClassNames,
                                                  {
                                                    isUtilityColumn:
                                                      isUtilityColumn,
                                                  },
                                                ),
                                              hideClassName,
                                              cellAlignClassName(cellContext),
                                              meta?.responsiveClassName,
                                              cellClassName,
                                            )}
                                            style={{
                                              width: shouldFixWidth
                                                ? isUtilityColumn
                                                  ? UTILITY_COLUMN_SIZE
                                                  : cell.column.getSize()
                                                : undefined,
                                              minWidth:
                                                isUtilityColumn
                                                  ? UTILITY_COLUMN_SIZE
                                                  : shouldFixWidth
                                                    ? cell.column.getSize()
                                                    : columnMinWidth,
                                              maxWidth: shouldFixWidth
                                                ? isUtilityColumn
                                                  ? UTILITY_COLUMN_SIZE
                                                  : cell.column.getSize()
                                                : undefined,
                                              insetInlineStart:
                                                fixedSide === "left"
                                                  ? pinnedColumns.left.get(
                                                      cell.column.id,
                                                    )
                                                  : undefined,
                                              insetInlineEnd:
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
                                                isExpansionColumn ||
                                                isActionsColumn
                                                  ? "true"
                                                  : undefined
                                              }
                                              className="min-w-0 max-w-full"
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
                                                      "__expand__" &&
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
                                                uiClassNames,
                                                {
                                                  hasCustomCell:
                                                    explicitCustomCellColumnIds.has(
                                                      cell.column.id,
                                                    ) ||
                                                    isSelectionColumn ||
                                                    isExpansionColumn ||
                                                    isActionsColumn ||
                                                    isSpacerColumn,
                                                  useCustomOverflowDefaults:
                                                    explicitCustomCellColumnIds.has(
                                                      cell.column.id,
                                                    ) ||
                                                    isSelectionColumn ||
                                                    isExpansionColumn ||
                                                    isActionsColumn ||
                                                    isSpacerColumn,
                                                },
                                              )}
                                            </div>
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                    {!isInitialLoadingRow &&
                                    renderExpandedRow &&
                                    row.getIsExpanded() ? (
                                      <TableRow>
                                        <TableCell
                                          colSpan={Math.max(
                                            1,
                                            visibleLeafColumnCount,
                                          )}
                                          className={cn(
                                          "border-b",
                                          getDensityCellClassName(
                                            currentDensity,
                                          ),
                                          uiClassNames.cellBorder,
                                          )}
                                        >
                                          {renderExpandedRow({
                                            row: originalRow,
                                            rowId: row.id,
                                            tableRow: row,
                                          })}
                                        </TableCell>
                                      </TableRow>
                                    ) : null}
                                    </React.Fragment>
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
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                          {summaryRows.length ? (
                            <TableFooter>
                              {summaryRows.map((summaryRow) => (
                                <TableRow key={summaryRow.key}>
                                  {visibleLeafColumns.map((column, index) => {
                                    const content =
                                      summaryRow.cells[column.id] ??
                                      (index === 0 ? summaryRow.label : null);
                                    return (
                                      <TableCell
                                        key={`${summaryRow.key}-${column.id}`}
                                        className={cn(
                                          "border-b font-medium",
                                          uiClassNames.cellBorder,
                                        )}
                                      >
                                        {typeof content === "function"
                                          ? content({
                                              rows: table
                                                .getFilteredRowModel()
                                                .rows.map((row) => row.original),
                                              columnId: column.id,
                                            })
                                          : content}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableFooter>
                          ) : null}
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
              <div data-dtp-slot="data-table-footer" className="shrink-0">
                {showFooter && !infiniteScroll?.enabled ? (
                  <DataTableFooter
                    pageIndex={currentPagination.pageIndex}
                    pageCount={effectivePageCount}
                    pageSize={currentPagination.pageSize}
                    totalRowCount={footerTotalRowCount}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onPageIndexChange={handleFooterPageIndexChange}
                    onPageSizeChange={handleFooterPageSizeChange}
                    labels={resolvedLabels}
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

  const inputType = getEditableInputType(meta?.type, draftValue);

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
      type={inputType}
      value={
        meta?.formatEditValue
          ? meta.formatEditValue(draftValue, context)
          : getEditableInputValue(draftValue, inputType)
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value;
        const parsedValue = meta?.parseEditValue
          ? meta.parseEditValue(rawValue, context)
          : parseEditableInputValue(rawValue, inputType, draftValue);
        setDraftValue(parsedValue);
      }}
    />
  );
}

function getEditableInputType(
  type: DataTableColumnType | undefined,
  value: unknown,
) {
  if (type === "numeric" || typeof value === "number") {
    return "number";
  }

  if (type === "date" || value instanceof Date) {
    return "datetime-local";
  }

  return "text";
}

function getEditableInputValue(value: unknown, inputType = "text") {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return inputType === "datetime-local"
      ? value.toISOString().slice(0, 16)
      : value.toISOString();
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

function parseEditableInputValue(
  value: string,
  inputType: string,
  previousValue: unknown,
) {
  if (inputType === "number") {
    return value === "" ? null : Number(value);
  }

  if (inputType === "datetime-local") {
    if (!value) {
      return null;
    }
    return previousValue instanceof Date ? new Date(value) : value;
  }

  return value;
}
