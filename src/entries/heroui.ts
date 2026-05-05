import { heroUiKit } from "../adapters/heroui";
import { createDataTable } from "../core/data-table/create-data-table";

export const DataTable = createDataTable(heroUiKit);

export { useDataTableUrlState } from "../core/data-table/use-data-table-url-state";
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
  DataTableViewMode,
} from "../core/types";
