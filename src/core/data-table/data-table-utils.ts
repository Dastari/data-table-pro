import type {
  Column,
  ColumnDef,
  ColumnPinningState,
  Row,
  Table as TanStackTable,
} from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableColumnFilterOption,
  DataTableCsvExportOptions,
  DataTableCsvExportScope,
  DataTableDensity,
  DataTableLabels,
} from "../types";
import type { DataTableUiClassNames } from "../ui-kit";
import { cn } from "../../lib/utils";

const DATA_TABLE_LOADING_ROW = Symbol("data-table-loading-row");

export const UTILITY_COLUMN_SIZE = 50;

type DataTableLoadingRow = {
  [DATA_TABLE_LOADING_ROW]: true;
  index: number;
};

export function createDataTableLoadingRows<TData>(count: number) {
  return Array.from({ length: count }, (_, index) => {
    return {
      [DATA_TABLE_LOADING_ROW]: true,
      index,
    } as DataTableLoadingRow as TData;
  });
}

export function isDataTableLoadingRow(
  row: unknown,
): row is DataTableLoadingRow {
  return Boolean(
    row &&
      typeof row === "object" &&
      DATA_TABLE_LOADING_ROW in (row as Record<PropertyKey, unknown>),
  );
}

export function getDataTableLoadingRowId(index: number) {
  return `__loading__${index}`;
}

export function getConfiguredColumnMinWidth<TData>(
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

export function decorateFilterableColumn<TData>(
  column: DataTableColumnDef<TData, unknown>,
): ColumnDef<TData, unknown> {
  if ("columns" in column && Array.isArray(column.columns)) {
    return {
      ...column,
      columns: column.columns.map((childColumn) =>
        decorateFilterableColumn(
          childColumn as DataTableColumnDef<TData, unknown>,
        ),
      ),
    };
  }

  const filter = column.meta?.filter;
  if (!filter || column.filterFn) {
    return column;
  }

  return {
    ...column,
    filterFn: (row, columnId, filterValue) => {
      if (!hasFilterValue(filterValue)) {
        return true;
      }

      const value = row.getValue(columnId);
      const optionValue =
        filter.getOptionValue?.(value, row.original) ??
        normalizeFilterValue(value);

      if (filter.type === "multi") {
        return Array.isArray(filterValue)
          ? filterValue.map(String).includes(optionValue)
          : true;
      }

      if (filter.type === "select") {
        return optionValue === String(filterValue);
      }

      return normalizeFilterValue(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
  };
}

export function normalizeColumnFilterOptions(
  options: Array<DataTableColumnFilterOption | string>,
) {
  return options.map((option) =>
    typeof option === "string"
      ? { label: startCase(option), value: option }
      : option,
  );
}

export function normalizeFilterValue(value: unknown) {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  ) {
    return String(value);
  }

  return "";
}

export function hasFilterValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

export function dataTableGlobalFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown,
) {
  const normalizedQuery = normalizeFilterValue(filterValue)
    .trim()
    .toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return normalizeFilterValue(row.getValue(columnId))
    .toLowerCase()
    .includes(normalizedQuery);
}

export async function exportDataTableCsv<TData>({
  csvExport,
  table,
}: {
  csvExport: boolean | DataTableCsvExportOptions<TData>;
  table: TanStackTable<TData>;
  labels: DataTableLabels;
}) {
  if (csvExport === false) {
    return;
  }

  const options: DataTableCsvExportOptions<TData> =
    csvExport === true ? {} : csvExport;
  const filename = options.filename ?? "data-table.csv";
  const scope = options.scope ?? "filtered";
  const exportColumnIds = options.columns
    ? new Set(options.columns)
    : undefined;
  const columns = table
    .getVisibleLeafColumns()
    .filter(
      (column) =>
        !isUtilityColumnId(column.id) &&
        column.id !== "__spacer__" &&
        (!exportColumnIds || exportColumnIds.has(column.id)),
    );
  const rows = getCsvExportRows(table, scope);
  const csvRows: Array<Array<unknown>> = [];

  if (options.includeHeaders ?? true) {
    csvRows.push(
      columns.map((column) =>
        typeof column.columnDef.header === "string"
          ? column.columnDef.header
          : startCase(column.id),
      ),
    );
  }

  for (const row of rows) {
    csvRows.push(
      columns.map((column) => {
        const value = row.getValue(column.id);
        return options.getCellValue
          ? options.getCellValue({
              row: row.original,
              rowId: row.id,
              columnId: column.id,
              value,
            })
          : value;
      }),
    );
  }

  const lineEnding = options.lineEnding ?? "\r\n";
  const escapeFormulaValues = options.escapeFormulaValues ?? true;
  const csv = csvRows
    .map((row) =>
      row
        .map((value) => escapeCsvCell(value, escapeFormulaValues))
        .join(","),
    )
    .join(lineEnding);

  if (options.onExport) {
    await options.onExport({
      csv,
      filename,
      rows: rows.map((row) => row.original),
      scope,
    });
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

function getCsvExportRows<TData>(
  table: TanStackTable<TData>,
  scope: DataTableCsvExportScope,
) {
  switch (scope) {
    case "page":
      return table.getRowModel().rows;
    case "selected":
      return table
        .getPrePaginationRowModel()
        .rows.filter((row) => row.getIsSelected());
    case "all":
      return table.getCoreRowModel().rows;
    default:
      return table.getPrePaginationRowModel().rows;
  }
}

function escapeCsvCell(value: unknown, escapeFormulaValues: boolean) {
  let text = normalizeFilterValue(value);
  if (
    escapeFormulaValues &&
    typeof value === "string" &&
    /^[\t\r ]*[=+\-@]/.test(value)
  ) {
    text = `'${text}`;
  }
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function getInitialColumnPinning<TData>(
  columns: Array<DataTableColumnDef<TData, unknown>>,
): ColumnPinningState {
  const left: Array<string> = [];
  const right: Array<string> = [];

  for (const [index, column] of columns.entries()) {
    const columnId = getColumnId(column, index);
    if (column.meta?.fixed === "left") {
      left.push(columnId);
    }
    if (column.meta?.fixed === "right") {
      right.push(columnId);
    }
  }

  return { left, right };
}

export function getColumnId<TData>(
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

export function getAccessorKey<TData>(
  column: DataTableColumnDef<TData, unknown>,
) {
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey;
  }

  return undefined;
}

export function getFixedSide<TData>(column: Column<TData>) {
  const pinnedSide = column.getIsPinned();
  if (pinnedSide) {
    return pinnedSide;
  }

  if (column.id === "__select__") {
    return "left" as const;
  }

  if (column.id === "__expand__") {
    return "left" as const;
  }

  if (column.id === "__actions__") {
    return "right" as const;
  }

  const meta = (column.columnDef as DataTableColumnDef<TData, unknown>).meta;
  return meta?.fixed;
}

export function getPinnedColumnClassName(
  side: "left" | "right",
  uiClassNames: DataTableUiClassNames,
  options?: { isUtilityColumn?: boolean },
) {
  const isUtilityColumn = options?.isUtilityColumn ?? false;
  return cn(
    "sticky backdrop-blur box-border",
    uiClassNames.pinnedColumn,
    !isUtilityColumn && "border-dotted",
    isUtilityColumn ? uiClassNames.pinnedUtilityColumn : undefined,
    side === "left" ? "border-r-1" : "border-l",
  );
}

export function isUtilityColumnId(columnId: string) {
  return (
    columnId === "__select__" ||
    columnId === "__expand__" ||
    columnId === "__actions__"
  );
}

export function getDensityHeaderClassName(density: DataTableDensity) {
  switch (density) {
    case "compact":
      return "h-8 py-1";
    case "spacious":
      return "h-14 py-4";
    case "comfortable":
    default:
      return undefined;
  }
}

export function getDensityCellClassName(density: DataTableDensity) {
  switch (density) {
    case "compact":
      return "py-1.5";
    case "spacious":
      return "py-4";
    case "comfortable":
    default:
      return undefined;
  }
}

export function moveColumnInOrder(
  currentOrder: Array<string>,
  sourceColumnId: string,
  targetColumnId: string,
) {
  const order = currentOrder.includes(sourceColumnId)
    ? currentOrder.slice()
    : [...currentOrder, sourceColumnId];
  const sourceIndex = order.indexOf(sourceColumnId);
  const targetIndex = order.indexOf(targetColumnId);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return order;
  }

  const [source] = order.splice(sourceIndex, 1);
  order.splice(targetIndex, 0, source);
  return order;
}

export function startCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
