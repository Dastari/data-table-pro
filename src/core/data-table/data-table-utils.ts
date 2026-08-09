import type {
  Column,
  ColumnDef,
  ColumnPinningState,
  ExpandedState,
  Row,
  Table as TanStackTable,
} from "@tanstack/react-table";
import type {
  DataTableClipboardCopyOptions,
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

export function toggleDataTableExpandedState(
  current: ExpandedState,
  rowId: string,
  loadedRowIds: Array<string>,
): ExpandedState {
  if (current === true) {
    return Object.fromEntries(
      loadedRowIds.flatMap((loadedRowId) =>
        loadedRowId === rowId ? [] : [[loadedRowId, true]],
      ),
    );
  }

  const next = { ...current };
  if (next[rowId]) {
    delete next[rowId];
  } else {
    next[rowId] = true;
  }
  return next;
}

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

      if (filter.type === "boolean") {
        return optionValue === String(filterValue);
      }

      if (filter.type === "numberRange") {
        const range = normalizeRangeFilterValue(filterValue);
        const numericValue = Number(optionValue);
        const from = range.from === "" ? undefined : Number(range.from);
        const to = range.to === "" ? undefined : Number(range.to);

        if (Number.isNaN(numericValue)) {
          return false;
        }

        return (
          (from === undefined || Number.isNaN(from) || numericValue >= from) &&
          (to === undefined || Number.isNaN(to) || numericValue <= to)
        );
      }

      if (filter.type === "dateRange") {
        const range = normalizeRangeFilterValue(filterValue);
        const dateValue = normalizeDateFilterValue(optionValue);

        if (!dateValue) {
          return false;
        }

        return (
          (!range.from || dateValue >= String(range.from)) &&
          (!range.to || dateValue <= String(range.to))
        );
      }

      const normalizedValue = optionValue.toLowerCase();
      const normalizedQuery = String(filterValue).toLowerCase();

      switch (filter.operator ?? "contains") {
        case "equals":
          return normalizedValue === normalizedQuery;
        case "startsWith":
          return normalizedValue.startsWith(normalizedQuery);
        case "endsWith":
          return normalizedValue.endsWith(normalizedQuery);
        default:
          return normalizedValue.includes(normalizedQuery);
      }
    },
  };
}

export type DataTableLeafColumn<TData> = {
  column: DataTableColumnDef<TData, unknown>;
  index: number;
};

export type DataTableColumnGroupPathSegment = {
  id: string;
  freeReordering: boolean;
};

export type DataTableColumnGroupPaths = ReadonlyMap<
  string,
  ReadonlyArray<DataTableColumnGroupPathSegment>
>;

/**
 * Returns the nested shared-header path for every leaf. The path deliberately
 * uses stable column ids rather than header text so it also works with custom
 * header render functions.
 */
export function getDataTableColumnGroupPaths<TData>(
  columns: Array<DataTableColumnDef<TData, unknown>>,
): DataTableColumnGroupPaths {
  const paths = new Map<
    string,
    ReadonlyArray<DataTableColumnGroupPathSegment>
  >();

  const visit = (
    currentColumns: Array<DataTableColumnDef<TData, unknown>>,
    parentPath: ReadonlyArray<DataTableColumnGroupPathSegment>,
  ) => {
    currentColumns.forEach((column, index) => {
      if ("columns" in column && column.columns?.length) {
        const group = column as DataTableColumnDef<TData, unknown> & {
          freeReordering?: boolean;
        };
        visit(column.columns, [
          ...parentPath,
          {
            id: getColumnId(column, index),
            freeReordering: group.freeReordering === true,
          },
        ]);
        return;
      }

      paths.set(getColumnId(column, index), parentPath);
    });
  };

  visit(columns, []);
  return paths;
}

/**
 * Locked groups preserve their shared heading by default. Reordering within a
 * common group path is always allowed; leaving or entering a group requires
 * each crossed group to explicitly opt into `freeReordering`.
 */
export function canReorderDataTableColumn(
  sourceColumnId: string,
  targetColumnId: string,
  groupPaths: DataTableColumnGroupPaths,
) {
  const sourcePath = groupPaths.get(sourceColumnId) ?? [];
  const targetPath = groupPaths.get(targetColumnId) ?? [];
  let commonLength = 0;

  while (
    commonLength < sourcePath.length &&
    commonLength < targetPath.length &&
    sourcePath[commonLength]?.id === targetPath[commonLength]?.id
  ) {
    commonLength += 1;
  }

  return [
    ...sourcePath.slice(commonLength),
    ...targetPath.slice(commonLength),
  ].every((group) => group.freeReordering);
}

export function getDataTableLeafColumns<TData>(
  columns: Array<DataTableColumnDef<TData, unknown>>,
) {
  const leaves: Array<DataTableLeafColumn<TData>> = [];

  const visit = (currentColumns: Array<DataTableColumnDef<TData, unknown>>) => {
    currentColumns.forEach((column, index) => {
      if ("columns" in column && column.columns?.length) {
        visit(column.columns);
        return;
      }

      leaves.push({ column, index });
    });
  };

  visit(columns);
  return leaves;
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

  if (value && typeof value === "object") {
    if ("from" in value || "to" in value) {
      return Object.values(value).some(hasFilterValue);
    }

    return true;
  }

  return value !== undefined && value !== null && value !== "";
}

function normalizeRangeFilterValue(value: unknown): {
  from?: string | number;
  to?: string | number;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const range = value as { from?: unknown; to?: unknown };
  return {
    ...(typeof range.from === "string" || typeof range.from === "number"
      ? { from: range.from }
      : {}),
    ...(typeof range.to === "string" || typeof range.to === "number"
      ? { to: range.to }
      : {}),
  };
}

function normalizeDateFilterValue(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const normalized = normalizeFilterValue(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(normalized)) {
    return normalized.slice(0, 10);
  }

  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp)
    ? ""
    : new Date(timestamp).toISOString().slice(0, 10);
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
  const rows = getDataTableExportRows(table, scope);
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

export async function copyDataTableToClipboard<TData>({
  clipboard,
  table,
}: {
  clipboard: boolean | DataTableClipboardCopyOptions<TData>;
  table: TanStackTable<TData>;
}) {
  if (clipboard === false) {
    return undefined;
  }

  const options: DataTableClipboardCopyOptions<TData> =
    clipboard === true ? {} : clipboard;
  const scope = options.scope ?? "page";
  const requestedColumnIds = options.columns
    ? new Set(options.columns)
    : undefined;
  const columns = table
    .getVisibleLeafColumns()
    .filter(
      (column) =>
        !isUtilityColumnId(column.id) &&
        column.id !== "__spacer__" &&
        (!requestedColumnIds || requestedColumnIds.has(column.id)),
    );
  const rows = getDataTableExportRows(table, scope);
  const values: Array<Array<unknown>> = [];

  if (options.includeHeaders ?? true) {
    values.push(
      columns.map((column) =>
        typeof column.columnDef.header === "string"
          ? column.columnDef.header
          : startCase(column.id),
      ),
    );
  }

  for (const row of rows) {
    values.push(
      columns.map((column) => {
        const value = row.getValue(column.id);
        return options.getCellValue
          ? options.getCellValue({
              columnId: column.id,
              row: row.original,
              rowId: row.id,
              value,
            })
          : value;
      }),
    );
  }

  const delimiter = options.delimiter ?? "\t";
  const text = values
    .map((row) =>
      row
        .map((value) =>
          escapeDelimitedCell(
            value,
            delimiter,
            options.escapeFormulaValues ?? true,
          ),
        )
        .join(delimiter),
    )
    .join("\n");

  if (options.onCopy) {
    await options.onCopy({
      rows: rows.map((row) => row.original),
      scope,
      text,
    });
  } else if (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  ) {
    await navigator.clipboard.writeText(text);
  }

  return text;
}

export function parseDataTableClipboardText(
  text: string,
  delimiter: "\t" | "," = "\t",
) {
  const rows: Array<Array<string>> = [];
  let row: Array<string> = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (!quoted && character === delimiter) {
      row.push(value);
      value = "";
      continue;
    }
    if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }
    value += character;
  }

  row.push(value);
  if (row.length > 1 || row[0] || rows.length === 0) {
    rows.push(row);
  }
  return rows;
}

function getDataTableExportRows<TData>(
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

function escapeDelimitedCell(
  value: unknown,
  delimiter: string,
  escapeFormulaValues: boolean,
) {
  let text = normalizeFilterValue(value);
  if (
    escapeFormulaValues &&
    typeof value === "string" &&
    /^[\t\r ]*[=+\-@]/.test(value)
  ) {
    text = `'${text}`;
  }
  if (
    text.includes(delimiter) ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
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

  for (const { column, index } of getDataTableLeafColumns(columns)) {
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
  _index?: number,
) {
  if (column.id) {
    return column.id;
  }

  const accessorKey = getAccessorKey(column);
  if (accessorKey) {
    return accessorKey.replace(/\./g, "_");
  }

  if (typeof column.header === "string") {
    return column.header;
  }

  throw new Error(
    "Data table columns using an accessor function or non-string header must define a unique id.",
  );
}

const RESERVED_DATA_TABLE_COLUMN_IDS = new Set([
  "__select__",
  "__expand__",
  "__actions__",
  "__spacer__",
]);

export function validateDataTableColumnIds<TData>(
  columns: Array<DataTableColumnDef<TData, unknown>>,
) {
  const ids = new Set<string>();

  const visit = (currentColumns: Array<DataTableColumnDef<TData, unknown>>) => {
    currentColumns.forEach((column, index) => {
      const id = getColumnId(column, index);
      if (RESERVED_DATA_TABLE_COLUMN_IDS.has(id)) {
        throw new Error(
          `Data table column id "${id}" is reserved for an internal column.`,
        );
      }
      if (ids.has(id)) {
        throw new Error(`Duplicate data table column id "${id}".`);
      }
      ids.add(id);

      if ("columns" in column && column.columns?.length) {
        visit(column.columns);
      }
    });
  };

  visit(columns);
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

const DATA_TABLE_INTERACTIVE_TARGET_SELECTOR = [
  "[data-row-click-ignore='true']",
  "a[href]",
  "button",
  "input",
  "select",
  "summary",
  "textarea",
  "[contenteditable='true']",
  "[role='button']",
  "[role='link']",
].join(",");

export function isDataTableInteractiveTarget(
  target: EventTarget | null,
  boundary: Element,
) {
  if (!(target instanceof Element)) {
    return false;
  }

  const interactiveTarget = target.closest(
    DATA_TABLE_INTERACTIVE_TARGET_SELECTOR,
  );
  return Boolean(
    interactiveTarget &&
      interactiveTarget !== boundary &&
      boundary.contains(interactiveTarget),
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
