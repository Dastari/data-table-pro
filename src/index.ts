import { shadcnUiKit } from "./adapters/shadcn";
import { createDataTable } from "./core/data-table/create-data-table";

export const DataTable = createDataTable(shadcnUiKit);

export { useDataTableUrlState } from "./core/data-table/use-data-table-url-state";
export type {
  DataTableAlign,
  DataTableCardRendererProps,
  DataTableColumnDef,
  DataTableColumnFixed,
  DataTableColumnMeta,
  DataTableColumnType,
  DataTableColumnVisibilityOption,
  DataTableContainerBreakpoint,
  DataTableDragAndDropConfig,
  DataTableEditableRowsConfig,
  DataTableEmptyStateContext,
  DataTableFileUploadConfig,
  DataTableHiddenRowsConfig,
  DataTableInfiniteScroll,
  DataTableLoadingState,
  DataTableProps,
  DataTableRowAction,
  DataTableRowLoadingState,
  DataTableSelectionAction,
  DataTableToolbarAction,
  DataTableToolbarVisibility,
  DataTableVirtualizationConfig,
  DataTableViewMode,
} from "./core/types";
