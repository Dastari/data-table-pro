import * as React from 'react';
import { ColumnDef, CellContext, FilterFnOption, ColumnFiltersState, SortingState, ExpandedState, Row, ColumnOrderState, ColumnPinningState, VisibilityState, PaginationState, ColumnSizingState, Updater, Table, HeaderContext } from '@tanstack/react-table';

type DataTableViewMode = "table" | "card";
type DataTableAlign = "start" | "center" | "end";
type DataTableColumnType = "text" | "numeric" | "date";
type DataTableColumnFixed = "left" | "right";
type DataTableContainerBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
type DataTableDensity = "compact" | "comfortable" | "spacious";
type DataTableCardSizing = "fixed" | "content" | "fluid";
type DataTableCellOverflow = "truncate" | "clip" | "wrap" | "visible";
type DataTableColumnFilterType = "text" | "select" | "multi";
type DataTableCsvExportScope = "filtered" | "page" | "selected" | "all";
type DataTableActionErrorSource = "toolbarAction" | "selectionAction" | "rowAction" | "rowClick" | "edit" | "fileUpload" | "infiniteScroll";
declare const DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS: Record<DataTableContainerBreakpoint, number>;
type DataTableRowLoadingState = {
    isLoading: boolean;
    skeleton?: React.ReactNode;
};
type DataTableLoadingState = {
    isLoading: boolean;
    loadingRowCount?: number;
};
type DataTableCellEditRenderProps<TData, TValue> = {
    cell: CellContext<TData, TValue>;
    row: TData;
    value: TValue | undefined;
    draftValue: unknown;
    setDraftValue: (value: unknown) => void;
};
type DataTableColumnFilterOption = {
    label: string;
    value: string;
};
type DataTableColumnFilterConfig<TData, TValue> = {
    type: DataTableColumnFilterType;
    label?: string;
    placeholder?: string;
    options?: Array<DataTableColumnFilterOption | string> | ((context: {
        rows: Array<TData>;
    }) => Array<DataTableColumnFilterOption | string>);
    getOptionValue?: (value: TValue | undefined, row: TData) => string;
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
type DataTableSelectionAction<TData> = {
    key: string;
    label: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    iconOnly?: boolean;
    onClick: (context: {
        rows: Array<TData>;
    }) => void | Promise<void>;
    variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    disabled?: boolean | ((rows: Array<TData>) => boolean);
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
type DataTableCardRendererProps<TData> = {
    row: TData;
    rowId: string;
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
    onSaveRow: (row: TData, draftValues: Record<string, unknown>) => void | Promise<void>;
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
    overscan?: number;
    card?: DataTableCardVirtualizationConfig;
};
type DataTableCardVirtualizationConfig = {
    enabled?: boolean;
    estimateCardHeight?: number;
    overscan?: number;
    lanes?: number | "auto";
};
type DataTableExpandedRowProps<TData> = {
    row: TData;
    rowId: string;
    tableRow: Row<TData>;
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
    density?: DataTableDensity;
};
type DataTablePersistenceSlice = keyof DataTableColumnPrefs;
type DataTablePersistenceStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type DataTablePersistenceOperation = "read" | "write" | "serialize" | "deserialize" | "migrate";
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
    columnSizing: ColumnSizingState;
    density: DataTableDensity;
    viewMode: DataTableViewMode;
    showHiddenRows: boolean;
    globalFilter: string;
};
type DataTableInitialState = Partial<DataTableState>;
type DataTableApi<TData> = {
    getTable: () => Table<TData> | null;
    getState: () => DataTableState;
    snapshot: () => DataTableState;
    restore: (state: Partial<DataTableState>) => void;
    resetColumnLayout: () => void;
    resetState: () => void;
    focus: () => void;
    scrollToRow: (rowId: string) => boolean;
    scrollToColumn: (columnId: string) => boolean;
    exportCsv: (options?: boolean | DataTableCsvExportOptions<TData>) => Promise<void>;
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
    exportCsv: string;
    density: string;
    compactDensity: string;
    comfortableDensity: string;
    spaciousDensity: string;
    pinLeft: string;
    pinRight: string;
    unpin: string;
};
type DataTableSummaryRow<TData> = {
    key: string;
    label?: React.ReactNode;
    cells: Record<string, React.ReactNode | ((context: {
        rows: Array<TData>;
        columnId: string;
    }) => React.ReactNode)>;
};
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
    pageIndex?: number;
    pageSize?: number;
    onPageIndexChange?: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageCount?: number;
    manualPagination?: boolean;
    rowSelection?: Record<string, boolean>;
    onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
    enableRowSelection?: boolean;
    expanded?: ExpandedState;
    onExpandedChange?: (expanded: ExpandedState) => void;
    getRowCanExpand?: (row: TData) => boolean;
    renderExpandedRow?: (props: DataTableExpandedRowProps<TData>) => React.ReactNode;
    columnOrder?: ColumnOrderState;
    onColumnOrderChange?: (columnOrder: ColumnOrderState) => void;
    enableColumnReordering?: boolean;
    columnPinning?: ColumnPinningState;
    onColumnPinningChange?: (columnPinning: ColumnPinningState) => void;
    enableColumnPinning?: boolean;
    toolbarActions?: Array<DataTableToolbarAction<TData>>;
    selectionActions?: Array<DataTableSelectionAction<TData>>;
    rowActions?: Array<DataTableRowAction<TData>>;
    csvExport?: boolean | DataTableCsvExportOptions<TData>;
    density?: DataTableDensity;
    onDensityChange?: (density: DataTableDensity) => void;
    enableDensityToggle?: boolean;
    columnPrefsKey?: string;
    persistence?: DataTablePersistenceConfig;
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
    emptyState?: React.ReactNode | ((context: DataTableEmptyStateContext<TData>) => React.ReactNode);
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
    showFooter?: boolean;
    showToolbar?: boolean;
    dir?: "ltr" | "rtl";
    flexGrow?: boolean;
    toolbarVisibility?: DataTableToolbarVisibility;
    className?: string;
    tableClassName?: string;
    tableContainerClassName?: string;
    getRowClassName?: (row: TData) => string | undefined;
    onRowClick?: (context: {
        row: TData;
        rowId: string;
    }) => void | Promise<void>;
    onActionError?: (context: DataTableActionErrorContext<TData>) => void;
    dragAndDrop?: DataTableDragAndDropConfig<TData>;
    fileUpload?: DataTableFileUploadConfig;
    virtualization?: boolean | DataTableVirtualizationConfig;
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

export { DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS, type DataTableActionErrorContext, type DataTableActionErrorSource, type DataTableAlign, type DataTableApi, type DataTableCardRendererProps, type DataTableCardSizing, type DataTableCardVirtualizationConfig, type DataTableCellEditRenderProps, type DataTableCellOverflow, type DataTableColumnDef, type DataTableColumnFilterConfig, type DataTableColumnFilterOption, type DataTableColumnFilterType, type DataTableColumnFixed, type DataTableColumnMeta, type DataTableColumnPrefs, type DataTableColumnType, type DataTableColumnVisibilityOption, type DataTableContainerBreakpoint, type DataTableCsvExportOptions, type DataTableCsvExportScope, type DataTableDensity, type DataTableDragAndDropConfig, type DataTableEditableRowsConfig, type DataTableEmptyStateContext, type DataTableExpandedRowProps, type DataTableFileUploadConfig, type DataTableHiddenRowsConfig, type DataTableInfiniteScroll, type DataTableInitialState, type DataTableLabels, type DataTableLoadingState, type DataTablePersistenceConfig, type DataTablePersistenceOperation, type DataTablePersistencePayload, type DataTablePersistenceSlice, type DataTablePersistenceStorage, type DataTableProps, type DataTableRowAction, type DataTableRowLoadingState, type DataTableSelectionAction, type DataTableState, type DataTableSummaryRow, type DataTableToolbarAction, type DataTableToolbarVisibility, type DataTableViewMode, type DataTableVirtualizationConfig, alignClassName, canEditRow, canUseRowAction, cellAlignClassName, headerAlignClassName, hideOnClassName, isHiddenAtContainerWidth, isRowVisible, resolveColumnAlign, resolveRowActionLabel, rowSelectionStateFromRows };
