import { heroUiKit } from "../adapters/heroui";
import { createDataTable } from "../core/data-table/create-data-table";

export const DataTable = createDataTable(heroUiKit);

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
} from "../core/types";
