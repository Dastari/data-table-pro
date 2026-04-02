import type * as React from "react";
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export type DataTableViewMode = "table" | "card";

export type DataTableAlign = "start" | "center" | "end";
export type DataTableColumnType = "text" | "numeric" | "date";
export type DataTableColumnFixed = "left" | "right";
export type DataTableContainerBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

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

export type DataTableCellEditRenderProps<TData, TValue> = {
  cell: CellContext<TData, TValue>;
  row: TData;
  value: TValue | undefined;
  draftValue: unknown;
  setDraftValue: (value: unknown) => void;
};

export type DataTableColumnMeta<TData, TValue> = {
  type?: DataTableColumnType;
  fixed?: DataTableColumnFixed;
  cardTitle?: boolean;
  hideOn?: DataTableContainerBreakpoint | Array<DataTableContainerBreakpoint>;
  align?: DataTableAlign;
  headerClassName?: string;
  cellClassName?:
    | string
    | ((args: { row: TData; value: TValue | undefined }) => string | undefined);
  responsiveClassName?: string;
  skeleton?: (context: CellContext<TData, TValue>) => React.ReactNode;
  renderEditCell?: (
    props: DataTableCellEditRenderProps<TData, TValue>,
  ) => React.ReactNode;
};

export type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: DataTableColumnMeta<TData, TValue>;
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
  searchValue: string;
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

export type DataTableProps<TData> = {
  columns: Array<DataTableColumnDef<TData, any>>;
  data: Array<TData>;
  getRowId: (row: TData, index: number) => string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchDebounceMs?: number;
  customToolbar?: React.ReactNode;
  rowsPerPageOptions?: Array<number>;
  totalRowCount?: number;
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
  toolbarActions?: Array<DataTableToolbarAction<TData>>;
  selectionActions?: Array<DataTableSelectionAction<TData>>;
  rowActions?: Array<DataTableRowAction<TData>>;
  cardRenderer?: (props: DataTableCardRendererProps<TData>) => React.ReactNode;
  viewMode?: DataTableViewMode;
  onViewModeChange?: (viewMode: DataTableViewMode) => void;
  enableViewToggle?: boolean;
  emptyState?:
    | React.ReactNode
    | ((context: DataTableEmptyStateContext<TData>) => React.ReactNode);
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
  enableColumnResizing?: boolean;
  columnResizeMode?: "onChange" | "onEnd";
  layoutMode?: "fill" | "fit";
  stickyHeader?: boolean;
  showFooter?: boolean;
  showToolbar?: boolean;
  toolbarVisibility?: DataTableToolbarVisibility;
  className?: string;
  tableClassName?: string;
  tableContainerClassName?: string;
  getRowClassName?: (row: TData) => string | undefined;
  onRowClick?: (context: { row: TData; rowId: string }) => void | Promise<void>;
  dragAndDrop?: DataTableDragAndDropConfig<TData>;
  fileUpload?: DataTableFileUploadConfig;
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
