import * as React from "react";
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import type {
  DataTableDensity,
  DataTableLabels,
  DataTableProps,
} from "../types";
import {
  createDataTableLoadingRows,
  getColumnId,
  getDataTableLoadingRowId,
  getInitialColumnPinning,
  isDataTableLoadingRow,
} from "./data-table-utils";
import {
  readDataTableColumnPrefs,
  usePersistDataTableColumnPrefs,
} from "./use-data-table-column-prefs";
import { useControllableState } from "./use-controllable-state";
import { useDataTableContainerWidth } from "./use-data-table-container-width";
import { isHiddenAtContainerWidth, isRowVisible } from "../types";

export function useDataTableState<TData>({
  columnFilters,
  columnOrder,
  columnPinning,
  columnSizing,
  columnPrefsKey,
  persistence,
  columnVisibility,
  columns,
  data,
  density,
  enableRowSelection,
  enableToolbarQueryFiltering,
  expanded,
  getRowId,
  hiddenRows,
  initialState,
  isLoading,
  loadingRowCount,
  manualFiltering,
  onColumnFiltersChange,
  onColumnOrderChange,
  onColumnPinningChange,
  onColumnSizingChange,
  onColumnVisibilityChange,
  onDensityChange,
  onExpandedChange,
  onPageIndexChange,
  onRowSelectionChange,
  onShowHiddenRowsChange,
  onSortingChange,
  onToolbarQueryValueChange,
  onViewModeChange,
  pageIndex,
  pageSize,
  resolvedLabels,
  rowSelection,
  rowsPerPageOptions,
  selectionActions,
  showHiddenRows,
  sorting,
  toolbarQueryDebounceMs,
  toolbarQueryPlaceholder,
  toolbarQueryValue,
  viewMode,
  containerRef,
}: {
  columnFilters: DataTableProps<TData>["columnFilters"];
  columnOrder: DataTableProps<TData>["columnOrder"];
  columnPinning: DataTableProps<TData>["columnPinning"];
  columnSizing?: DataTableProps<TData>["columnSizing"];
  columnPrefsKey: DataTableProps<TData>["columnPrefsKey"];
  persistence?: DataTableProps<TData>["persistence"];
  columnVisibility: DataTableProps<TData>["columnVisibility"];
  columns: DataTableProps<TData>["columns"];
  data: DataTableProps<TData>["data"];
  density: DataTableProps<TData>["density"];
  enableRowSelection: boolean;
  enableToolbarQueryFiltering: boolean;
  expanded: DataTableProps<TData>["expanded"];
  getRowId: DataTableProps<TData>["getRowId"];
  hiddenRows: DataTableProps<TData>["hiddenRows"];
  initialState?: DataTableProps<TData>["initialState"];
  isLoading: boolean;
  loadingRowCount: DataTableProps<TData>["loadingRowCount"];
  manualFiltering: boolean;
  onColumnFiltersChange: DataTableProps<TData>["onColumnFiltersChange"];
  onColumnOrderChange: DataTableProps<TData>["onColumnOrderChange"];
  onColumnPinningChange: DataTableProps<TData>["onColumnPinningChange"];
  onColumnSizingChange?: DataTableProps<TData>["onColumnSizingChange"];
  onColumnVisibilityChange: DataTableProps<TData>["onColumnVisibilityChange"];
  onDensityChange: DataTableProps<TData>["onDensityChange"];
  onExpandedChange: DataTableProps<TData>["onExpandedChange"];
  onPageIndexChange: DataTableProps<TData>["onPageIndexChange"];
  onRowSelectionChange: DataTableProps<TData>["onRowSelectionChange"];
  onShowHiddenRowsChange: DataTableProps<TData>["onShowHiddenRowsChange"];
  onSortingChange: DataTableProps<TData>["onSortingChange"];
  onToolbarQueryValueChange: DataTableProps<TData>["onToolbarQueryValueChange"];
  onViewModeChange: DataTableProps<TData>["onViewModeChange"];
  pageIndex: DataTableProps<TData>["pageIndex"];
  pageSize: DataTableProps<TData>["pageSize"];
  resolvedLabels: DataTableLabels;
  rowSelection: DataTableProps<TData>["rowSelection"];
  rowsPerPageOptions: Array<number>;
  selectionActions: DataTableProps<TData>["selectionActions"];
  showHiddenRows: DataTableProps<TData>["showHiddenRows"];
  sorting: DataTableProps<TData>["sorting"];
  toolbarQueryDebounceMs: DataTableProps<TData>["toolbarQueryDebounceMs"];
  toolbarQueryPlaceholder: DataTableProps<TData>["toolbarQueryPlaceholder"];
  toolbarQueryValue: DataTableProps<TData>["toolbarQueryValue"];
  viewMode: DataTableProps<TData>["viewMode"];
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const persistenceConfig = React.useMemo(
    () => persistence ?? (columnPrefsKey ? { key: columnPrefsKey } : undefined),
    [columnPrefsKey, persistence],
  );
  const persistedColumnPrefs = React.useMemo(
    () => readDataTableColumnPrefs(persistenceConfig),
    [persistenceConfig],
  );
  const [localPagination, setLocalPagination] =
    React.useState<PaginationState>({
      pageIndex: initialState?.pagination?.pageIndex ?? 0,
      pageSize:
        initialState?.pagination?.pageSize ??
        rowsPerPageOptions[0] ??
        20,
    });
  const [currentSorting, setCurrentSorting] =
    useControllableState<SortingState>({
      value: sorting,
      onChange: onSortingChange,
      defaultValue: () => initialState?.sorting ?? [],
    });
  const [currentRowSelection, setCurrentRowSelection] = useControllableState<
    Record<string, boolean>
  >({
      value: rowSelection,
      onChange: onRowSelectionChange,
      defaultValue: () => initialState?.rowSelection ?? {},
  });
  const [currentColumnVisibility, setCurrentColumnVisibility] =
    useControllableState<VisibilityState>({
      value: columnVisibility,
      onChange: onColumnVisibilityChange,
      defaultValue: () =>
        initialState?.columnVisibility ??
        persistedColumnPrefs.visibility ??
        {},
    });
  const [currentColumnFilters, setCurrentColumnFilters] =
    useControllableState<ColumnFiltersState>({
      value: columnFilters,
      onChange: onColumnFiltersChange,
      defaultValue: () => initialState?.columnFilters ?? [],
    });
  const [currentExpanded, setCurrentExpanded] =
    useControllableState<ExpandedState>({
      value: expanded,
      onChange: onExpandedChange,
      defaultValue: () => initialState?.expanded ?? {},
    });
  const [currentColumnOrder, setCurrentColumnOrder] =
    useControllableState<ColumnOrderState>({
      value: columnOrder,
      onChange: onColumnOrderChange,
      defaultValue: () =>
        initialState?.columnOrder ?? persistedColumnPrefs.order ?? [],
    });
  const [currentColumnPinning, setCurrentColumnPinning] =
    useControllableState<ColumnPinningState>({
      value: columnPinning,
      onChange: onColumnPinningChange,
      defaultValue: () =>
        initialState?.columnPinning ??
        persistedColumnPrefs.pinning ??
        getInitialColumnPinning(columns),
    });
  const [currentColumnSizing, setCurrentColumnSizing] =
    useControllableState<ColumnSizingState>({
      value: columnSizing,
      onChange: onColumnSizingChange,
      defaultValue: () =>
        initialState?.columnSizing ?? persistedColumnPrefs.sizing ?? {},
    });
  const [currentViewMode, setCurrentViewMode] = useControllableState<
    "table" | "card"
  >({
    value: viewMode,
    onChange: onViewModeChange,
    defaultValue: () => initialState?.viewMode ?? "table",
  });
  const [currentShowHiddenRows, setCurrentShowHiddenRows] =
    useControllableState<boolean>({
      value: showHiddenRows,
      onChange: onShowHiddenRowsChange,
      defaultValue: () => initialState?.showHiddenRows ?? false,
    });
  const [currentDensity, setCurrentDensity] =
    useControllableState<DataTableDensity>({
      value: density,
      onChange: onDensityChange,
      defaultValue: () =>
        initialState?.density ??
        persistedColumnPrefs.density ??
        "comfortable",
    });
  const resolvedToolbarQueryValue =
    toolbarQueryValue ?? initialState?.globalFilter ?? "";
  const resolvedToolbarQueryPlaceholder =
    toolbarQueryPlaceholder ?? resolvedLabels.searchPlaceholder;
  const resolvedToolbarQueryDebounceMs = toolbarQueryDebounceMs ?? 250;
  const [localSearchValue, setLocalSearchValue] = React.useState(
    resolvedToolbarQueryValue,
  );
  const containerWidth = useDataTableContainerWidth(containerRef);
  const hasOnSearchValueChange = Boolean(onToolbarQueryValueChange);
  const lastReportedSearchValueRef = React.useRef(resolvedToolbarQueryValue);
  const onToolbarQueryValueChangeEvent = React.useEffectEvent(
    (value: string) => {
      lastReportedSearchValueRef.current = value;
      onToolbarQueryValueChange?.(value);
    },
  );

  React.useEffect(() => {
    lastReportedSearchValueRef.current = resolvedToolbarQueryValue;
    // A controlled query change must replace any pending debounced draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearchValue(resolvedToolbarQueryValue);
  }, [resolvedToolbarQueryValue]);

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
  const globalFilterValue = enableToolbarQueryFiltering
    ? localSearchValue
    : "";
  const handleViewModeChange = React.useCallback(
    (nextViewMode: "table" | "card") => {
      setCurrentViewMode(nextViewMode);
    },
    [setCurrentViewMode],
  );
  const handleShowHiddenRowsChange = React.useCallback(
    (nextShowHiddenRows: boolean) => {
      setCurrentShowHiddenRows(nextShowHiddenRows);
    },
    [setCurrentShowHiddenRows],
  );
  const handleDensityChange = React.useCallback(
    (nextDensity: DataTableDensity) => {
      setCurrentDensity(nextDensity);
    },
    [setCurrentDensity],
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
    persistence: persistenceConfig,
    prefs: {
      visibility: columnVisibility ? undefined : currentColumnVisibility,
      sizing:
        columnSizing === undefined ? currentColumnSizing : undefined,
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
  const visibleData = React.useMemo(
    () =>
      data.filter((row) =>
        isRowVisible(row, hiddenRows, currentShowHiddenRows),
      ),
    [currentShowHiddenRows, data, hiddenRows],
  );
  const shouldRenderInitialLoading = isLoading && visibleData.length === 0;
  const loadingRows = React.useMemo(
    () => createDataTableLoadingRows<TData>(resolvedLoadingRowCount),
    [resolvedLoadingRowCount],
  );
  const tableData = shouldRenderInitialLoading
    ? loadingRows
    : visibleData;
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
    (selectionActions?.length ?? 0) > 0 ||
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

  return {
    currentColumnFilters,
    currentColumnOrder,
    currentColumnPinning,
    currentColumnSizing,
    currentColumnVisibility,
    currentDensity,
    currentExpanded,
    currentPagination,
    currentRowSelection,
    currentShowHiddenRows,
    currentSorting,
    currentViewMode,
    effectiveColumnVisibility,
    globalFilterValue,
    handleDensityChange,
    handleShowHiddenRowsChange,
    handleViewModeChange,
    localSearchValue,
    resolvedLoadingRowCount,
    resolvedToolbarQueryPlaceholder,
    selectedRows,
    setCurrentColumnFilters,
    setCurrentColumnOrder,
    setCurrentColumnPinning,
    setCurrentColumnVisibility,
    setCurrentExpanded,
    setCurrentRowSelection,
    setCurrentSorting,
    setLocalColumnSizing: setCurrentColumnSizing,
    setLocalPagination,
    setLocalSearchValue,
    shouldRenderInitialLoading,
    tableData,
    tableGetRowId,
    /**
     * @deprecated Read the filtered TanStack row model from the table
     * instance. This alias remains for advanced 4.x callers.
     */
    toolbarFilteredData: visibleData,
    visibleData,
  };
}
