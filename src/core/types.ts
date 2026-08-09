import type * as React from "react";
import type {
  CellContext,
  ColumnFiltersState,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFnOption,
  HeaderContext,
  PaginationState,
  Row,
  RowPinningState,
  SortingState,
  Table as TanStackTable,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";

export type DataTableViewMode = "table" | "card";

export type DataTableAlign = "start" | "center" | "end";
export type DataTableColumnType = "text" | "numeric" | "date";
export type DataTableColumnFixed = "left" | "right";
export type DataTableContainerBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
export type DataTableDensity = "compact" | "comfortable" | "spacious";
export type DataTableCardSizing = "fixed" | "content" | "fluid";
export type DataTableCellOverflow =
  | "truncate"
  | "clip"
  | "wrap"
  | "visible";
export type DataTableColumnFilterType =
  | "text"
  | "select"
  | "multi"
  | "boolean"
  | "numberRange"
  | "dateRange";
export type DataTableColumnFilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith";
export type DataTableCsvExportScope =
  | "filtered"
  | "page"
  | "selected"
  | "all";
export type DataTableActionErrorSource =
  | "toolbarAction"
  | "selectionAction"
  | "rowAction"
  | "rowClick"
  | "edit"
  | "fileUpload"
  | "infiniteScroll";

export const DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS: Record<
  DataTableContainerBreakpoint,
  number
> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type DataTableRowLoadingState = {
  isLoading: boolean;
  skeleton?: React.ReactNode;
};

export type DataTableLoadingState = {
  isLoading: boolean;
  loadingRowCount?: number;
};

export type DataTableCellEditRenderProps<TData, TValue> = {
  cell: CellContext<TData, TValue>;
  row: TData;
  value: TValue | undefined;
  draftValue: unknown;
  setDraftValue: (value: unknown) => void;
};

export type DataTableColumnFilterOption = {
  label: string;
  value: string;
};

export type DataTableColumnFilterRangeValue<TValue extends number | string> = {
  from?: TValue;
  to?: TValue;
};

export type DataTableColumnFilterConfig<TData, TValue> = {
  type: DataTableColumnFilterType;
  label?: string;
  placeholder?: string;
  options?:
    | Array<DataTableColumnFilterOption | string>
    | ((context: { rows: Array<TData> }) => Array<DataTableColumnFilterOption | string>);
  getOptionValue?: (value: TValue | undefined, row: TData) => string;
  operator?: DataTableColumnFilterOperator;
  trueLabel?: string;
  falseLabel?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
};

export type DataTableColumnMeta<TData, TValue> = {
  type?: DataTableColumnType;
  fixed?: DataTableColumnFixed;
  cardTitle?: boolean;
  hideOn?: DataTableContainerBreakpoint | Array<DataTableContainerBreakpoint>;
  minWidth?: number;
  align?: DataTableAlign;
  overflow?:
    | DataTableCellOverflow
    | ((args: {
        row: TData;
        value: TValue | undefined;
      }) => DataTableCellOverflow | undefined);
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
  cellClassName?:
    | string
    | ((args: { row: TData; value: TValue | undefined }) => string | undefined);
  responsiveClassName?: string;
  skeleton?: (context: CellContext<TData, TValue>) => React.ReactNode;
  filter?: DataTableColumnFilterConfig<TData, TValue>;
  parseEditValue?: (value: unknown, context: CellContext<TData, TValue>) => unknown;
  formatEditValue?: (
    value: unknown,
    context: CellContext<TData, TValue>,
  ) => string;
  renderEditCell?: (
    props: DataTableCellEditRenderProps<TData, TValue>,
  ) => React.ReactNode;
};

export type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: DataTableColumnMeta<TData, TValue>;
  columns?: Array<DataTableColumnDef<TData, unknown>>;
};

export type DataTableColumnGroupDef<TData> = DataTableColumnDef<
  TData,
  unknown
> & {
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

export type DataTableToolbarAction<TData> = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconOnly?: boolean;
  placement?: "primary" | "trailing";
  onClick: (context: {
    rows: Array<TData>;
    openFileDialog?: () => void;
  }) => void | Promise<void>;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
};

export type DataTableSelectionAction<TData> = {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconOnly?: boolean;
  onClick: (context: { rows: Array<TData> }) => void | Promise<void>;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  disabled?: boolean | ((rows: Array<TData>) => boolean);
};

export type DataTableRowAction<TData> = {
  key: string;
  label: string | ((row: TData) => string);
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: TData) => void | Promise<void>;
  variant?: "default" | "secondary" | "destructive";
  hidden?: (row: TData) => boolean;
  disabled?: (row: TData) => boolean;
};

export type DataTableColumnVisibilityOption = {
  id: string;
  label: string;
  visible: boolean;
  canHide: boolean;
  pinned?: false | DataTableColumnFixed;
};

export type DataTableToolbarVisibility = {
  title?: boolean;
  search?: boolean;
  actions?: boolean;
  trailingActions?: boolean;
  options?: boolean;
  viewToggle?: boolean;
  customToolbar?: boolean;
};

export type DataTableCardRendererProps<TData> = {
  row: TData;
  rowId: string;
  isSelected: boolean;
  onSelectedChange: (nextValue: boolean) => void;
  actions: Array<DataTableRowAction<TData>>;
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
};

export type DataTableEditableRowsConfig<TData> = {
  canEditRow?: (row: TData) => boolean;
  getInitialValues?: (row: TData) => Record<string, unknown>;
  onSaveRow: (
    row: TData,
    draftValues: Record<string, unknown>,
  ) => void | Promise<void>;
};

export type DataTableInfiniteScroll = {
  enabled: boolean;
  hasMore: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void | Promise<void>;
};

export type DataTableHiddenRowsConfig<TData> = {
  getIsHidden: (row: TData) => boolean;
  label?: string;
};

export type DataTableEmptyStateContext<TData> = {
  rows: Array<TData>;
  toolbarQueryValue: string;
};

export type DataTableDragAndDropConfig<TData> = {
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

export type DataTableFileUploadConfig = {
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
  onFilesSelected: (files: FileList | Array<File>) => void | Promise<void>;
};

export type DataTableVirtualizationConfig = {
  enabled?: boolean;
  estimateRowHeight?: number;
  fallbackRowCount?: number;
  overscan?: number;
  card?: DataTableCardVirtualizationConfig;
};

export type DataTableCardVirtualizationConfig = {
  enabled?: boolean;
  estimateCardHeight?: number;
  fallbackCardCount?: number;
  overscan?: number;
  lanes?: number | "auto";
};

export type DataTableExpandedRowProps<TData> = {
  row: TData;
  rowId: string;
  tableRow: Row<TData>;
};

export type DataTableCsvExportOptions<TData> = {
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

export type DataTableActionErrorContext<TData> = {
  source: DataTableActionErrorSource;
  error: unknown;
  actionKey?: string;
  row?: TData;
};

export type DataTableColumnPrefs = {
  visibility?: VisibilityState;
  sizing?: Record<string, number>;
  order?: ColumnOrderState;
  pinning?: ColumnPinningState;
  rowPinning?: RowPinningState;
  density?: DataTableDensity;
};

export type DataTablePersistenceSlice = keyof DataTableColumnPrefs;

export type DataTablePersistenceStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

export type DataTablePersistenceOperation =
  | "read"
  | "write"
  | "remove"
  | "serialize"
  | "deserialize"
  | "migrate";

export type DataTablePersistencePayload = {
  version: string | number;
  state: DataTableColumnPrefs;
};

export type DataTablePersistenceConfig = {
  key: string;
  version?: string | number;
  slices?: Array<DataTablePersistenceSlice>;
  storage?: DataTablePersistenceStorage;
  serialize?: (payload: DataTablePersistencePayload) => string;
  deserialize?: (value: string) => unknown;
  migrate?: (
    payload: { version: unknown; state: unknown },
    targetVersion: string | number,
  ) => DataTableColumnPrefs | undefined;
  debounceMs?: number;
  onError?: (context: {
    error: unknown;
    operation: DataTablePersistenceOperation;
  }) => void;
};

export type DataTableState = {
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
  density: DataTableDensity;
  viewMode: DataTableViewMode;
  showHiddenRows: boolean;
  globalFilter: string;
};

export type DataTableInitialState = Partial<DataTableState>;

export type DataTableSavedViewSlice = keyof DataTableState;

export type DataTableSavedView = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  state: Partial<DataTableState>;
};

export type DataTableSavedViewsPayload = {
  version: string | number;
  views: Array<DataTableSavedView>;
};

export type DataTableSavedViewsChangeOperation =
  | "create"
  | "rename"
  | "delete"
  | "clear";

export type DataTableSavedViewsConfig = {
  key: string;
  version?: string | number;
  slices?: Array<DataTableSavedViewSlice>;
  storage?: DataTablePersistenceStorage;
  serialize?: (payload: DataTableSavedViewsPayload) => string;
  deserialize?: (value: string) => unknown;
  migrate?: (
    payload: { version: unknown; views: unknown },
    targetVersion: string | number,
  ) => Array<DataTableSavedView> | undefined;
  onChange?: (
    views: Array<DataTableSavedView>,
    operation: DataTableSavedViewsChangeOperation,
  ) => void;
  onApply?: (view: DataTableSavedView) => void;
  onError?: (context: {
    error: unknown;
    operation: DataTablePersistenceOperation;
  }) => void;
};

export type DataTableResetOptions = {
  clearPersistence?: boolean;
};

export type DataTableApi<TData> = {
  getTable: () => TanStackTable<TData> | null;
  getState: () => DataTableState;
  snapshot: () => DataTableState;
  restore: (state: Partial<DataTableState>) => void;
  resetColumnLayout: (options?: DataTableResetOptions) => void;
  resetState: (options?: DataTableResetOptions) => void;
  clearPersistedState: () => boolean;
  getSavedViews: () => Array<DataTableSavedView>;
  createSavedView: (name: string) => DataTableSavedView | undefined;
  applySavedView: (id: string) => boolean;
  renameSavedView: (
    id: string,
    name: string,
  ) => DataTableSavedView | undefined;
  deleteSavedView: (id: string) => boolean;
  clearSavedViews: () => boolean;
  pinRow: (rowId: string, position?: "top" | "bottom") => boolean;
  unpinRow: (rowId: string) => boolean;
  focus: () => void;
  scrollToRow: (rowId: string) => boolean;
  scrollToColumn: (columnId: string) => boolean;
  exportCsv: (
    options?: boolean | DataTableCsvExportOptions<TData>,
  ) => Promise<void>;
};

export type DataTableLabels = {
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
  pinRowToTop: string;
  pinRowToBottom: string;
  unpinRow: string;
  resizeColumn: (columnLabel: string) => string;
};

export type DataTableSummaryRow<TData> = {
  key: string;
  label?: React.ReactNode;
  cells: Record<
    string,
    React.ReactNode | ((context: { rows: Array<TData>; columnId: string }) => React.ReactNode)
  >;
};

export type DataTableRowClassNameContext<TData> = {
  row: TData;
  rowId: string;
  rowIndex: number;
  isEditing: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  isSelected: boolean;
  pinnedPosition: false | "top" | "bottom";
};

export type DataTableProps<TData> = {
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
  renderExpandedRow?: (
    props: DataTableExpandedRowProps<TData>,
  ) => React.ReactNode;
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
  emptyState?:
    | React.ReactNode
    | ((context: DataTableEmptyStateContext<TData>) => React.ReactNode);
  isLoading?: boolean;
  loadingRowCount?: number;
  getRowLoadingState?: (
    row: TData,
    index: number,
  ) => boolean | DataTableRowLoadingState;
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
  stripedRows?: boolean;
  getRowClassName?: (
    row: TData,
    context: DataTableRowClassNameContext<TData>,
  ) => string | undefined;
  onRowClick?: (context: { row: TData; rowId: string }) => void | Promise<void>;
  onActionError?: (context: DataTableActionErrorContext<TData>) => void;
  dragAndDrop?: DataTableDragAndDropConfig<TData>;
  fileUpload?: DataTableFileUploadConfig;
  virtualization?: boolean | DataTableVirtualizationConfig;
};

export function isRowVisible<TData>(
  row: TData,
  hiddenRows: DataTableHiddenRowsConfig<TData> | undefined,
  showHiddenRows: boolean,
) {
  if (!hiddenRows) {
    return true;
  }

  if (showHiddenRows) {
    return true;
  }

  return !hiddenRows.getIsHidden(row);
}

export function resolveRowActionLabel<TData>(
  label: DataTableRowAction<TData>["label"],
  row: TData,
) {
  return typeof label === "function" ? label(row) : label;
}

export function canUseRowAction<TData>(
  action: DataTableRowAction<TData>,
  row: TData,
) {
  return !action.hidden?.(row);
}

export function canEditRow<TData>(
  editableRows: DataTableEditableRowsConfig<TData> | undefined,
  row: TData,
) {
  return editableRows?.canEditRow
    ? editableRows.canEditRow(row)
    : Boolean(editableRows);
}

export function alignClassName(align: DataTableAlign | undefined) {
  switch (align) {
    case "center":
      return "text-center";
    case "end":
      return "text-right";
    default:
      return "text-left";
  }
}

export function resolveColumnAlign(
  align: DataTableAlign | undefined,
  type: DataTableColumnType | undefined,
) {
  if (align) {
    return align;
  }

  if (type === "numeric") {
    return "end";
  }

  return "start";
}

export function headerAlignClassName<TData, TValue>(
  context: HeaderContext<TData, TValue>,
) {
  const meta = (context.column.columnDef as DataTableColumnDef<TData, TValue>)
    .meta;
  return alignClassName(resolveColumnAlign(meta?.align, meta?.type));
}

export function cellAlignClassName<TData, TValue>(
  context: CellContext<TData, TValue>,
) {
  const meta = (context.column.columnDef as DataTableColumnDef<TData, TValue>)
    .meta;
  return alignClassName(resolveColumnAlign(meta?.align, meta?.type));
}

export function hideOnClassName(
  hideOn:
    | DataTableContainerBreakpoint
    | Array<DataTableContainerBreakpoint>
    | undefined,
) {
  if (!hideOn) {
    return undefined;
  }

  const values = Array.isArray(hideOn) ? hideOn : [hideOn];
  return values.map((value) => `dt-hide-on-${value}`).join(" ");
}

export function isHiddenAtContainerWidth(
  hideOn:
    | DataTableContainerBreakpoint
    | Array<DataTableContainerBreakpoint>
    | undefined,
  containerWidth: number,
) {
  if (!hideOn || containerWidth <= 0) {
    return false;
  }

  const values = Array.isArray(hideOn) ? hideOn : [hideOn];
  return values.some(
    (value) => containerWidth < DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS[value],
  );
}

export function rowSelectionStateFromRows<TData>(rows: Array<Row<TData>>) {
  return rows.map((row) => row.original);
}
