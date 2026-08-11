import * as React from 'react';
import { ColumnDef, CellContext, FilterFnOption, ColumnFiltersState, SortingState, GroupingState, AggregationFn, ExpandedState, Row, ColumnOrderState, ColumnPinningState, RowPinningState, Table, VisibilityState, PaginationState, ColumnSizingState, Updater, HeaderContext } from '@tanstack/react-table';

type DataTableViewMode = "table" | "card";
/** Accessibility behavior for the table view. Native table semantics remain the default. */
type DataTableAccessibilityOptions = {
    /**
     * `grid` enables spreadsheet-like roving focus and keyboard navigation.
     * `native` (the default) retains ordinary HTML table keyboard behavior.
     */
    mode?: "native" | "grid";
    /** Number of rows moved by PageUp/PageDown when layout cannot be measured. */
    pageSize?: number;
};
/** Shorthand configuration for the interactive ARIA grid mode. */
type DataTableInteractiveGridOptions = Omit<DataTableAccessibilityOptions, "mode">;
/** A stable grid coordinate used for cell and rectangular range selection. */
type DataTableCellCoordinate = {
    rowId: string;
    columnId: string;
};
/** The two corners of a cell selection. A single-cell selection has equal corners. */
type DataTableCellSelection = {
    anchor: DataTableCellCoordinate;
    focus: DataTableCellCoordinate;
};
type DataTableGridCommandContext<TData> = {
    table: Table<TData>;
    cellSelection: DataTableCellSelection | null;
};
/** Commands are delegated to the application; the table never records app data. */
type DataTableGridCommands<TData> = {
    undo?: (context: DataTableGridCommandContext<TData>) => void | Promise<void>;
    redo?: (context: DataTableGridCommandContext<TData>) => void | Promise<void>;
};
type DataTableAlign = "start" | "center" | "end";
type DataTableColumnType = "text" | "numeric" | "date";
type DataTableColumnFixed = "left" | "right";
type DataTableContainerBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
type DataTableDensity = "compact" | "comfortable" | "spacious";
type DataTableCardSizing = "fixed" | "content" | "fluid";
type DataTableCellOverflow = "truncate" | "clip" | "wrap" | "visible";
type DataTableColumnFilterType = "text" | "select" | "multi" | "faceted" | "boolean" | "numberRange" | "dateRange";
type DataTableColumnFilterOperator = "contains" | "equals" | "startsWith" | "endsWith";
type DataTableCsvExportScope = "filtered" | "page" | "selected" | "all";
type DataTableClipboardCopyScope = DataTableCsvExportScope | "cellSelection";
type DataTableClipboardCopyOptions<TData> = {
    includeHeaders?: boolean;
    columns?: Array<string>;
    scope?: DataTableClipboardCopyScope;
    /** Defaults to tab-separated text. */
    delimiter?: "\t" | ",";
    escapeFormulaValues?: boolean;
    getCellValue?: (context: {
        row: TData;
        rowId: string;
        columnId: string;
        value: unknown;
    }) => unknown;
    /** Host-owned clipboard delivery for non-browser or permission-managed apps. */
    onCopy?: (context: {
        text: string;
        rows: Array<TData>;
        scope: DataTableClipboardCopyScope;
    }) => void | Promise<void>;
};
type DataTableClipboardPasteContext<TData> = {
    text: string;
    values: Array<Array<string>>;
    table: Table<TData>;
};
type DataTableClipboardConfig<TData> = {
    copy?: boolean | DataTableClipboardCopyOptions<TData>;
    paste?: {
        enabled?: boolean;
        preventDefault?: boolean;
        onPaste: (context: DataTableClipboardPasteContext<TData>) => void | Promise<void>;
    };
};
type DataTableActionErrorSource = "toolbarAction" | "selectionAction" | "rowAction" | "rowClick" | "edit" | "undo" | "redo" | "clipboardCopy" | "clipboardPaste" | "fileUpload" | "infiniteScroll" | "retry";
declare const DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS: Record<DataTableContainerBreakpoint, number>;
type DataTableRowLoadingState = {
    isLoading: boolean;
    skeleton?: React.ReactNode;
};
type DataTableLoadingState = {
    isLoading: boolean;
    loadingRowCount?: number;
};
type DataTableAutoPageSizeConfig = {
    minRows?: number;
    maxRows?: number;
    estimateRowHeight?: number;
};
type DataTableStateOverlayContext<TData> = {
    rows: Array<TData>;
    toolbarQueryValue: string;
    error: unknown;
    isRetrying: boolean;
    retry: (() => void | Promise<void>) | undefined;
};
type DataTableStateOverlay<TData> = {
    empty?: React.ReactNode | ((context: DataTableEmptyStateContext<TData>) => React.ReactNode);
    error?: unknown;
    isRetrying?: boolean;
    onRetry?: () => void | Promise<void>;
    renderError?: (context: DataTableStateOverlayContext<TData>) => React.ReactNode;
};
type DataTableCellEditRenderProps<TData, TValue> = {
    cell: CellContext<TData, TValue>;
    row: TData;
    value: TValue | undefined;
    draftValue: unknown;
    setDraftValue: (value: unknown) => void;
    error?: string;
    isDirty: boolean;
    isPending: boolean;
};
type DataTableColumnFilterOption = {
    label: string;
    value: string;
    /** Number of matching records. Omit when the count is not known. */
    count?: number;
    disabled?: boolean;
};
type DataTableFacetedFilterOptions<TData, TValue> = {
    /**
     * Server-provided facet values. When supplied, these take precedence over
     * locally calculated unique values and their counts.
     */
    options?: Array<DataTableColumnFilterOption | string> | ((context: {
        rows: Array<TData>;
    }) => Array<DataTableColumnFilterOption | string>);
    /** Render a readable label for values discovered from the local row model. */
    getOptionLabel?: (value: TValue | undefined) => string;
    /** Enables an in-menu search input. Defaults to true. */
    searchable?: boolean;
    searchPlaceholder?: string;
};
type DataTableColumnFilterRangeValue<TValue extends number | string> = {
    from?: TValue;
    to?: TValue;
};
type DataTableColumnFilterConfig<TData, TValue> = {
    type: DataTableColumnFilterType;
    label?: string;
    placeholder?: string;
    options?: Array<DataTableColumnFilterOption | string> | ((context: {
        rows: Array<TData>;
    }) => Array<DataTableColumnFilterOption | string>);
    getOptionValue?: (value: TValue | undefined, row: TData) => string;
    /** Settings for `type: "faceted"`, including server-provided facet data. */
    faceting?: DataTableFacetedFilterOptions<TData, TValue>;
    operator?: DataTableColumnFilterOperator;
    trueLabel?: string;
    falseLabel?: string;
    min?: number | string;
    max?: number | string;
    step?: number;
};
type DataTableColumnMeta<TData, TValue> = {
    type?: DataTableColumnType;
    fixed?: DataTableColumnFixed;
    cardTitle?: boolean;
    hideOn?: DataTableContainerBreakpoint | Array<DataTableContainerBreakpoint>;
    minWidth?: number;
    align?: DataTableAlign;
    overflow?: DataTableCellOverflow | ((args: {
        row: TData;
        value: TValue | undefined;
    }) => DataTableCellOverflow | undefined);
    headerClassName?: string;
    headerStyle?: React.CSSProperties;
    cellClassName?: string | ((args: {
        row: TData;
        value: TValue | undefined;
    }) => string | undefined);
    responsiveClassName?: string;
    skeleton?: (context: CellContext<TData, TValue>) => React.ReactNode;
    filter?: DataTableColumnFilterConfig<TData, TValue>;
    parseEditValue?: (value: unknown, context: CellContext<TData, TValue>) => unknown;
    formatEditValue?: (value: unknown, context: CellContext<TData, TValue>) => string;
    renderEditCell?: (props: DataTableCellEditRenderProps<TData, TValue>) => React.ReactNode;
};
type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
    meta?: DataTableColumnMeta<TData, TValue>;
    columns?: Array<DataTableColumnDef<TData, unknown>>;
};
type DataTableColumnGroupDef<TData> = DataTableColumnDef<TData, unknown> & {
    id: string;
    columns: Array<DataTableColumnDef<TData, unknown>>;
    /**
     * A concise explanation of the columns in this group. It is exposed as an
     * accessible description and native tooltip on the shared header.
     */
    description?: string;
    /**
     * Allows leaves to cross this group's boundary during column reordering.
     * Groups are locked by default so a shared heading remains intact.
     */
    freeReordering?: boolean;
    /** Additional class name for this shared group header. */
    headerClassName?: string;
    /** Additional inline styles for this shared group header. */
    headerStyle?: React.CSSProperties;
    /** Height for this shared group header, overriding `columnGroupHeaderHeight`. */
    headerHeight?: React.CSSProperties["height"];
};
type DataTableToolbarAction<TData> = {
    key: string;
    label: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    iconOnly?: boolean;
    placement?: "primary" | "trailing";
    onClick: (context: {
        rows: Array<TData>;
        openFileDialog?: () => void;
    }) => void | Promise<void>;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    disabled?: boolean;
};
type DataTableSelectionActionContext<TData> = {
    /** Selected row objects that are present in the currently loaded data. */
    rows: Array<TData>;
    /** Every selected row id, including ids retained across server pages. */
    rowIds: Array<string>;
};
type DataTableSelectionAction<TData> = {
    key: string;
    label: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    iconOnly?: boolean;
    onClick: (context: DataTableSelectionActionContext<TData>) => void | Promise<void>;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    disabled?: boolean | ((rows: Array<TData>, context: DataTableSelectionActionContext<TData>) => boolean);
};
type DataTableRowAction<TData> = {
    key: string;
    label: string | ((row: TData) => string);
    icon?: React.ComponentType<{
        className?: string;
    }>;
    onClick: (row: TData) => void | Promise<void>;
    variant?: "default" | "secondary" | "destructive";
    hidden?: (row: TData) => boolean;
    disabled?: (row: TData) => boolean;
};
type DataTableColumnVisibilityOption = {
    id: string;
    label: string;
    visible: boolean;
    canHide: boolean;
    pinned?: false | DataTableColumnFixed;
};
type DataTableToolbarVisibility = {
    title?: boolean;
    search?: boolean;
    actions?: boolean;
    trailingActions?: boolean;
    options?: boolean;
    viewToggle?: boolean;
    customToolbar?: boolean;
};
/** Optional toolbar controls for working with the current table layout and views. */
type DataTableToolbarDataOperations = {
    /** Search, bulk show/hide, pin, and keyboard-accessible column move controls. */
    columnChooser?: boolean;
    /** Create, apply, rename, and delete saved views when `savedViews` is configured. */
    savedViews?: boolean;
    /** Adds a reset-layout action using the table's initial layout. */
    resetLayout?: boolean;
};
type DataTableCardRendererProps<TData> = {
    row: TData;
    rowId: string;
    depth: number;
    canExpandSubRows: boolean;
    isSubRowsExpanded: boolean;
    toggleSubRowsExpanded: () => void;
    isSelected: boolean;
    onSelectedChange: (nextValue: boolean) => void;
    actions: Array<DataTableRowAction<TData>>;
    isEditing: boolean;
    startEditing: () => void;
    cancelEditing: () => void;
};
type DataTableEditableRowsConfig<TData> = {
    canEditRow?: (row: TData) => boolean;
    getInitialValues?: (row: TData) => Record<string, unknown>;
    validateRow?: (row: TData, draftValues: Record<string, unknown>) => void | string | Record<string, string> | Promise<void | string | Record<string, string>>;
    /** Apply an optimistic host update and optionally return a rollback callback. */
    onOptimisticUpdate?: (row: TData, draftValues: Record<string, unknown>) => void | (() => void);
    onSaveRow: (row: TData, draftValues: Record<string, unknown>) => void | Promise<void>;
    onSaveSuccess?: (row: TData, draftValues: Record<string, unknown>) => void;
    onSaveError?: (error: unknown, row: TData, draftValues: Record<string, unknown>) => void;
    /** Defaults to true for inputs owned by the table. */
    commitOnEnter?: boolean;
    /** Defaults to true for inputs owned by the table. */
    cancelOnEscape?: boolean;
};
type DataTableInfiniteScroll = {
    enabled: boolean;
    hasMore: boolean;
    isLoadingMore?: boolean;
    onLoadMore: () => void | Promise<void>;
};
type DataTableHiddenRowsConfig<TData> = {
    getIsHidden: (row: TData) => boolean;
    label?: string;
};
type DataTableEmptyStateContext<TData> = {
    rows: Array<TData>;
    toolbarQueryValue: string;
};
type DataTableDragAndDropConfig<TData> = {
    isDragging?: boolean;
    onDragEnter?: React.DragEventHandler<HTMLDivElement>;
    onDragOver?: React.DragEventHandler<HTMLDivElement>;
    onDragLeave?: React.DragEventHandler<HTMLDivElement>;
    onDrop?: React.DragEventHandler<HTMLDivElement>;
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
};
type DataTableFileUploadConfig = {
    accept?: string;
    disabled?: boolean;
    multiple?: boolean;
    onFilesSelected: (files: FileList | Array<File>) => void | Promise<void>;
};
type DataTableVirtualizationConfig = {
    enabled?: boolean;
    estimateRowHeight?: number;
    fallbackRowCount?: number;
    overscan?: number;
    card?: DataTableCardVirtualizationConfig;
};
type DataTableCardVirtualizationConfig = {
    enabled?: boolean;
    estimateCardHeight?: number;
    fallbackCardCount?: number;
    overscan?: number;
    lanes?: number | "auto";
};
type DataTableExpandedRowProps<TData> = {
    row: TData;
    rowId: string;
    tableRow: Row<TData>;
};
/** A separately controlled application detail panel rendered beneath a row. */
type DataTableDetailPanel<TData> = {
    expanded?: ExpandedState;
    onExpandedChange?: (expanded: ExpandedState) => void;
    getRowCanExpand?: (row: TData) => boolean;
    render: (props: DataTableExpandedRowProps<TData>) => React.ReactNode;
};
type DataTableCsvExportOptions<TData> = {
    filename?: string;
    includeHeaders?: boolean;
    columns?: Array<string>;
    scope?: DataTableCsvExportScope;
    escapeFormulaValues?: boolean;
    lineEnding?: "\n" | "\r\n";
    getCellValue?: (context: {
        row: TData;
        rowId: string;
        columnId: string;
        value: unknown;
    }) => unknown;
    onExport?: (context: {
        csv: string;
        filename: string;
        rows: Array<TData>;
        scope: DataTableCsvExportScope;
    }) => void | Promise<void>;
};
type DataTableActionErrorContext<TData> = {
    source: DataTableActionErrorSource;
    error: unknown;
    actionKey?: string;
    row?: TData;
};
type DataTableColumnPrefs = {
    visibility?: VisibilityState;
    sizing?: Record<string, number>;
    order?: ColumnOrderState;
    pinning?: ColumnPinningState;
    rowPinning?: RowPinningState;
    density?: DataTableDensity;
};
type DataTablePersistenceSlice = keyof DataTableColumnPrefs;
type DataTablePersistenceStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type DataTablePersistenceOperation = "read" | "write" | "remove" | "serialize" | "deserialize" | "migrate";
type DataTablePersistencePayload = {
    version: string | number;
    state: DataTableColumnPrefs;
};
type DataTablePersistenceConfig = {
    key: string;
    version?: string | number;
    slices?: Array<DataTablePersistenceSlice>;
    storage?: DataTablePersistenceStorage;
    serialize?: (payload: DataTablePersistencePayload) => string;
    deserialize?: (value: string) => unknown;
    migrate?: (payload: {
        version: unknown;
        state: unknown;
    }, targetVersion: string | number) => DataTableColumnPrefs | undefined;
    debounceMs?: number;
    onError?: (context: {
        error: unknown;
        operation: DataTablePersistenceOperation;
    }) => void;
};
type DataTableState = {
    sorting: SortingState;
    pagination: PaginationState;
    rowSelection: Record<string, boolean>;
    columnVisibility: VisibilityState;
    columnFilters: ColumnFiltersState;
    expanded: ExpandedState;
    columnOrder: ColumnOrderState;
    columnPinning: ColumnPinningState;
    rowPinning: RowPinningState;
    columnSizing: ColumnSizingState;
    /** Present in snapshots produced by 4.4+; optional for 4.x object-literal compatibility. */
    grouping?: GroupingState;
    density: DataTableDensity;
    viewMode: DataTableViewMode;
    showHiddenRows: boolean;
    globalFilter: string;
};
type DataTableInitialState = Partial<DataTableState>;
type DataTableSavedViewSlice = keyof DataTableState;
type DataTableSavedView = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    state: Partial<DataTableState>;
};
type DataTableSavedViewsPayload = {
    version: string | number;
    views: Array<DataTableSavedView>;
};
type DataTableSavedViewsChangeOperation = "create" | "rename" | "delete" | "clear";
type DataTableSavedViewsConfig = {
    key: string;
    version?: string | number;
    slices?: Array<DataTableSavedViewSlice>;
    storage?: DataTablePersistenceStorage;
    serialize?: (payload: DataTableSavedViewsPayload) => string;
    deserialize?: (value: string) => unknown;
    migrate?: (payload: {
        version: unknown;
        views: unknown;
    }, targetVersion: string | number) => Array<DataTableSavedView> | undefined;
    onChange?: (views: Array<DataTableSavedView>, operation: DataTableSavedViewsChangeOperation) => void;
    onApply?: (view: DataTableSavedView) => void;
    onError?: (context: {
        error: unknown;
        operation: DataTablePersistenceOperation;
    }) => void;
};
type DataTableResetOptions = {
    clearPersistence?: boolean;
};
type DataTableApi<TData> = {
    getTable: () => Table<TData> | null;
    getState: () => DataTableState;
    snapshot: () => DataTableState;
    restore: (state: Partial<DataTableState>) => void;
    resetColumnLayout: (options?: DataTableResetOptions) => void;
    resetState: (options?: DataTableResetOptions) => void;
    clearPersistedState: () => boolean;
    getSavedViews: () => Array<DataTableSavedView>;
    createSavedView: (name: string) => DataTableSavedView | undefined;
    applySavedView: (id: string) => boolean;
    renameSavedView: (id: string, name: string) => DataTableSavedView | undefined;
    deleteSavedView: (id: string) => boolean;
    clearSavedViews: () => boolean;
    pinRow: (rowId: string, position?: "top" | "bottom") => boolean;
    unpinRow: (rowId: string) => boolean;
    focus: () => void;
    scrollToRow: (rowId: string) => boolean;
    scrollToColumn: (columnId: string) => boolean;
    exportCsv: (options?: boolean | DataTableCsvExportOptions<TData>) => Promise<void>;
    copyToClipboard: (options?: boolean | DataTableClipboardCopyOptions<TData>) => Promise<string | undefined>;
    getCellSelection: () => DataTableCellSelection | null;
    setCellSelection: (selection: DataTableCellSelection | null) => void;
    clearCellSelection: () => void;
    print: () => boolean;
    toggleFullscreen: () => Promise<boolean>;
};
type DataTableLabels = {
    searchPlaceholder: string;
    searchTable: string;
    clearSearch: string;
    noRowsTitle: string;
    noRowsDescription: string;
    noMatchingRowsTitle: string;
    noMatchingRowsDescription: string;
    tableOptions: string;
    columns: string;
    filters: string;
    clearFilters: string;
    filterFrom?: string;
    filterTo?: string;
    filterTrue?: string;
    filterFalse?: string;
    selectedRows: (count: number) => string;
    showHiddenRows: (label: string) => string;
    recordsPerPage: string;
    totalRecords: (count: number) => string;
    pageStatus: (pageIndex: number, pageCount: number) => string;
    pageStatusUnknown?: (pageIndex: number) => string;
    pagination?: string;
    morePages?: string;
    firstPage: string;
    previousPage: string;
    nextPage: string;
    lastPage: string;
    selectAllVisibleRows?: string;
    selectAllFilteredRows?: string;
    selectRow?: string;
    selectCardRow?: (rowId: string) => string;
    switchToTableView?: string;
    switchToCardView?: string;
    tableView?: string;
    cardView?: string;
    allFilterOptions?: string;
    actions: string;
    rowActions: string;
    editRow: string;
    saveEdit: string;
    cancelEdit: string;
    expandRow: string;
    collapseRow: string;
    expandRowDetails?: string;
    collapseRowDetails?: string;
    exportCsv: string;
    print?: string;
    enterFullscreen?: string;
    exitFullscreen?: string;
    errorTitle?: string;
    errorDescription?: string;
    retry?: string;
    density: string;
    compactDensity: string;
    comfortableDensity: string;
    spaciousDensity: string;
    pinLeft: string;
    pinRight: string;
    unpin: string;
    pinRowToTop: string;
    pinRowToBottom: string;
    unpinRow: string;
    resizeColumn: (columnLabel: string) => string;
    grouping?: string;
    groupBy?: (columnLabel: string) => string;
    ungroup?: (columnLabel: string) => string;
    removeGrouping?: (columnLabel: string) => string;
    moveGroupingEarlier?: (columnLabel: string) => string;
    moveGroupingLater?: (columnLabel: string) => string;
    facetSearch?: (columnLabel: string) => string;
    searchColumns?: string;
    showAllColumns?: string;
    hideAllColumns?: string;
    moveColumnEarlier?: (columnLabel: string) => string;
    moveColumnLater?: (columnLabel: string) => string;
    resetColumnLayout?: string;
    savedViews?: string;
    createSavedView?: string;
    savedViewName?: string;
    applySavedView?: (name: string) => string;
    renameSavedView?: (name: string) => string;
    deleteSavedView?: (name: string) => string;
    saveSavedView?: string;
};
type DataTableSummaryRow<TData> = {
    key: string;
    label?: React.ReactNode;
    cells: Record<string, React.ReactNode | ((context: {
        rows: Array<TData>;
        columnId: string;
    }) => React.ReactNode)>;
};
type DataTableRowClassNameContext<TData> = {
    row: TData;
    rowId: string;
    rowIndex: number;
    isEditing: boolean;
    isExpanded: boolean;
    isLoading: boolean;
    isSelected: boolean;
    pinnedPosition: false | "top" | "bottom";
};
type DataTableScrollbarVisibility = "auto" | "always" | "scroll" | "hover";
type DataTableProps<TData> = {
    columns: Array<DataTableColumnDef<TData, unknown>>;
    data: Array<TData>;
    getRowId: (row: TData, index: number) => string;
    children?: React.ReactNode;
    title?: string;
    description?: string;
    toolbarQueryValue?: string;
    onToolbarQueryValueChange?: (value: string) => void;
    toolbarQueryPlaceholder?: string;
    toolbarQueryDebounceMs?: number;
    manualFiltering?: boolean;
    enableToolbarQueryFiltering?: boolean;
    globalFilterFn?: FilterFnOption<TData>;
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    enableColumnFilters?: boolean;
    customToolbar?: React.ReactNode;
    compactToolbar?: React.ReactNode;
    rowsPerPageOptions?: Array<number>;
    totalRowCount?: number;
    hasNextPage?: boolean;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
    manualSorting?: boolean;
    grouping?: GroupingState;
    onGroupingChange?: (grouping: GroupingState) => void;
    /** Use rows already grouped by the server instead of TanStack's grouping model. */
    manualGrouping?: boolean;
    /** Show group/ungroup controls in the table options menu and grouping bar. */
    enableGrouping?: boolean;
    /** Controls whether grouped columns are reordered, removed, or left in place. */
    groupedColumnMode?: false | "reorder" | "remove";
    /** Named aggregation functions available to column `aggregationFn` definitions. */
    aggregationFns?: Record<string, AggregationFn<TData>>;
    pageIndex?: number;
    pageSize?: number;
    /** Sizes an opt-in page from the measurable table scroll viewport. */
    autoPageSize?: boolean | DataTableAutoPageSizeConfig;
    onPageIndexChange?: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageCount?: number;
    manualPagination?: boolean;
    rowSelection?: Record<string, boolean>;
    onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
    enableRowSelection?: boolean;
    /** Allows multiple selected rows globally or per row. Defaults to true. */
    enableMultiRowSelection?: boolean | ((row: TData) => boolean);
    /** Cascades parent selection to sub-rows globally or per row. Defaults to true. */
    enableSubRowSelection?: boolean | ((row: TData) => boolean);
    /** Prevents individual rows from being selected. */
    getRowCanSelect?: (row: TData) => boolean;
    /** Select-all affects the current page or all loaded filtered rows. */
    rowSelectionSelectAllScope?: "page" | "filtered";
    expanded?: ExpandedState;
    onExpandedChange?: (expanded: ExpandedState) => void;
    /** Resolve nested records for tree expansion. */
    getSubRows?: (row: TData, index: number) => Array<TData> | undefined;
    /** Keep expansion state controlled by the host; useful for server-loaded children. */
    manualExpanding?: boolean;
    /** Keep child rows with their parent when paginating. Defaults to TanStack's behavior. */
    paginateExpandedRows?: boolean;
    /** Include parents when a descendant matches a filter. */
    filterFromLeafRows?: boolean;
    /** Limit descendant traversal while filtering. */
    maxLeafRowFilterDepth?: number;
    /** New, independently controlled detail-panel contract. */
    detailPanel?: DataTableDetailPanel<TData>;
    getRowCanExpand?: (row: TData) => boolean;
    /** @deprecated Use `detailPanel={{ render }}`. Kept as a detail-panel bridge. */
    renderExpandedRow?: (props: DataTableExpandedRowProps<TData>) => React.ReactNode;
    columnOrder?: ColumnOrderState;
    onColumnOrderChange?: (columnOrder: ColumnOrderState) => void;
    enableColumnReordering?: boolean;
    /** Default height for shared column-group header cells. */
    columnGroupHeaderHeight?: React.CSSProperties["height"];
    columnPinning?: ColumnPinningState;
    onColumnPinningChange?: (columnPinning: ColumnPinningState) => void;
    enableColumnPinning?: boolean;
    rowPinning?: RowPinningState;
    onRowPinningChange?: (rowPinning: RowPinningState) => void;
    /** Enables row actions that pin a row to the top or bottom of the table. */
    enableRowPinning?: boolean | ((row: TData) => boolean);
    /** Keep pinned rows visible when filtering or paginating them out. */
    keepPinnedRows?: boolean;
    toolbarActions?: Array<DataTableToolbarAction<TData>>;
    selectionActions?: Array<DataTableSelectionAction<TData>>;
    rowActions?: Array<DataTableRowAction<TData>>;
    csvExport?: boolean | DataTableCsvExportOptions<TData>;
    /** Opt-in TSV/CSV copy and application-owned paste handling. */
    clipboard?: DataTableClipboardConfig<TData>;
    /** Enables pointer and Shift+keyboard rectangular cell selection in grid mode. */
    enableCellSelection?: boolean;
    /** Controlled cell/range selection. Supplying a value also enables it in grid mode. */
    cellSelection?: DataTableCellSelection | null;
    /** Initial cell/range selection when uncontrolled. */
    defaultCellSelection?: DataTableCellSelection | null;
    onCellSelectionChange?: (selection: DataTableCellSelection | null) => void;
    /** Host-owned undo/redo commands invoked by Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z. */
    gridCommands?: DataTableGridCommands<TData>;
    density?: DataTableDensity;
    onDensityChange?: (density: DataTableDensity) => void;
    enableDensityToggle?: boolean;
    columnPrefsKey?: string;
    persistence?: DataTablePersistenceConfig;
    savedViews?: DataTableSavedViewsConfig;
    initialState?: DataTableInitialState;
    state?: Partial<DataTableState>;
    onStateChange?: (updater: Updater<DataTableState>) => void;
    apiRef?: React.Ref<DataTableApi<TData>>;
    labels?: Partial<DataTableLabels>;
    summaryRows?: Array<DataTableSummaryRow<TData>>;
    cardRenderer?: (props: DataTableCardRendererProps<TData>) => React.ReactNode;
    cardSizing?: DataTableCardSizing;
    cardGridClassName?: string;
    cardClassName?: string;
    viewMode?: DataTableViewMode;
    onViewModeChange?: (viewMode: DataTableViewMode) => void;
    enableViewToggle?: boolean;
    enablePrint?: boolean;
    enableFullscreen?: boolean;
    emptyState?: React.ReactNode | ((context: DataTableEmptyStateContext<TData>) => React.ReactNode);
    /** Explicit empty/error/retry rendering contract. */
    stateOverlay?: DataTableStateOverlay<TData>;
    isLoading?: boolean;
    loadingRowCount?: number;
    getRowLoadingState?: (row: TData, index: number) => boolean | DataTableRowLoadingState;
    hiddenRows?: DataTableHiddenRowsConfig<TData>;
    showHiddenRows?: boolean;
    onShowHiddenRowsChange?: (showHiddenRows: boolean) => void;
    infiniteScroll?: DataTableInfiniteScroll;
    editableRows?: DataTableEditableRowsConfig<TData>;
    columnVisibility?: VisibilityState;
    onColumnVisibilityChange?: (visibility: VisibilityState) => void;
    columnSizing?: ColumnSizingState;
    onColumnSizingChange?: (sizing: ColumnSizingState) => void;
    enableColumnResizing?: boolean;
    columnResizeMode?: "onChange" | "onEnd";
    layoutMode?: "fill" | "fit";
    stickyHeader?: boolean;
    /** Controls when scrollbars are visible. Defaults to `"hover"`. */
    scrollbarVisibility?: DataTableScrollbarVisibility;
    showFooter?: boolean;
    showToolbar?: boolean;
    dir?: "ltr" | "rtl";
    flexGrow?: boolean;
    toolbarVisibility?: DataTableToolbarVisibility;
    /** Opts into enhanced layout and saved-view toolbar controls. */
    toolbarDataOperations?: boolean | DataTableToolbarDataOperations;
    className?: string;
    tableClassName?: string;
    tableContainerClassName?: string;
    stripedRows?: boolean;
    getRowClassName?: (row: TData, context: DataTableRowClassNameContext<TData>) => string | undefined;
    onRowClick?: (context: {
        row: TData;
        rowId: string;
    }) => void | Promise<void>;
    onActionError?: (context: DataTableActionErrorContext<TData>) => void;
    dragAndDrop?: DataTableDragAndDropConfig<TData>;
    fileUpload?: DataTableFileUploadConfig;
    virtualization?: boolean | DataTableVirtualizationConfig;
    /** Opt in to ARIA grid semantics and roving keyboard navigation. */
    accessibility?: DataTableAccessibilityOptions;
    /** Shorthand for `accessibility={{ mode: "grid" }}`. */
    interactiveGrid?: boolean | DataTableInteractiveGridOptions;
};
declare function isRowVisible<TData>(row: TData, hiddenRows: DataTableHiddenRowsConfig<TData> | undefined, showHiddenRows: boolean): boolean;
declare function resolveRowActionLabel<TData>(label: DataTableRowAction<TData>["label"], row: TData): string;
declare function canUseRowAction<TData>(action: DataTableRowAction<TData>, row: TData): boolean;
declare function canEditRow<TData>(editableRows: DataTableEditableRowsConfig<TData> | undefined, row: TData): boolean;
declare function alignClassName(align: DataTableAlign | undefined): "text-center" | "text-right" | "text-left";
declare function resolveColumnAlign(align: DataTableAlign | undefined, type: DataTableColumnType | undefined): DataTableAlign;
declare function headerAlignClassName<TData, TValue>(context: HeaderContext<TData, TValue>): "text-center" | "text-right" | "text-left";
declare function cellAlignClassName<TData, TValue>(context: CellContext<TData, TValue>): "text-center" | "text-right" | "text-left";
declare function hideOnClassName(hideOn: DataTableContainerBreakpoint | Array<DataTableContainerBreakpoint> | undefined): string | undefined;
declare function isHiddenAtContainerWidth(hideOn: DataTableContainerBreakpoint | Array<DataTableContainerBreakpoint> | undefined, containerWidth: number): boolean;
declare function rowSelectionStateFromRows<TData>(rows: Array<Row<TData>>): TData[];

export { DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS, type DataTableAccessibilityOptions, type DataTableActionErrorContext, type DataTableActionErrorSource, type DataTableAlign, type DataTableApi, type DataTableAutoPageSizeConfig, type DataTableCardRendererProps, type DataTableCardSizing, type DataTableCardVirtualizationConfig, type DataTableCellCoordinate, type DataTableCellEditRenderProps, type DataTableCellOverflow, type DataTableCellSelection, type DataTableClipboardConfig, type DataTableClipboardCopyOptions, type DataTableClipboardCopyScope, type DataTableClipboardPasteContext, type DataTableColumnDef, type DataTableColumnFilterConfig, type DataTableColumnFilterOperator, type DataTableColumnFilterOption, type DataTableColumnFilterRangeValue, type DataTableColumnFilterType, type DataTableColumnFixed, type DataTableColumnGroupDef, type DataTableColumnMeta, type DataTableColumnPrefs, type DataTableColumnType, type DataTableColumnVisibilityOption, type DataTableContainerBreakpoint, type DataTableCsvExportOptions, type DataTableCsvExportScope, type DataTableDensity, type DataTableDetailPanel, type DataTableDragAndDropConfig, type DataTableEditableRowsConfig, type DataTableEmptyStateContext, type DataTableExpandedRowProps, type DataTableFacetedFilterOptions, type DataTableFileUploadConfig, type DataTableGridCommandContext, type DataTableGridCommands, type DataTableHiddenRowsConfig, type DataTableInfiniteScroll, type DataTableInitialState, type DataTableInteractiveGridOptions, type DataTableLabels, type DataTableLoadingState, type DataTablePersistenceConfig, type DataTablePersistenceOperation, type DataTablePersistencePayload, type DataTablePersistenceSlice, type DataTablePersistenceStorage, type DataTableProps, type DataTableResetOptions, type DataTableRowAction, type DataTableRowClassNameContext, type DataTableRowLoadingState, type DataTableSavedView, type DataTableSavedViewSlice, type DataTableSavedViewsChangeOperation, type DataTableSavedViewsConfig, type DataTableSavedViewsPayload, type DataTableScrollbarVisibility, type DataTableSelectionAction, type DataTableSelectionActionContext, type DataTableState, type DataTableStateOverlay, type DataTableStateOverlayContext, type DataTableSummaryRow, type DataTableToolbarAction, type DataTableToolbarDataOperations, type DataTableToolbarVisibility, type DataTableViewMode, type DataTableVirtualizationConfig, alignClassName, canEditRow, canUseRowAction, cellAlignClassName, headerAlignClassName, hideOnClassName, isHiddenAtContainerWidth, isRowVisible, resolveColumnAlign, resolveRowActionLabel, rowSelectionStateFromRows };
