import type { Column, Table as TanStackTable } from "@tanstack/react-table";
import type {
  DataTableCellSelection,
  DataTableClipboardCopyOptions,
} from "../types";
import {
  getDataTableExportRows,
  isUtilityColumnId,
  normalizeFilterValue,
  startCase,
} from "./data-table-utils";

export async function copyDataTableToClipboard<TData>({
  clipboard,
  cellSelection,
  table,
}: {
  clipboard: boolean | DataTableClipboardCopyOptions<TData>;
  cellSelection?: DataTableCellSelection | null;
  table: TanStackTable<TData>;
}) {
  if (clipboard === false) return undefined;

  const options: DataTableClipboardCopyOptions<TData> =
    clipboard === true ? {} : clipboard;
  const scope = options.scope ?? "page";
  const requestedColumnIds = options.columns
    ? new Set(options.columns)
    : undefined;
  const allVisibleColumns = table.getVisibleLeafColumns();
  const visibleColumns = allVisibleColumns.filter(
    (column) =>
      !isUtilityColumnId(column.id) &&
      column.id !== "__spacer__" &&
      (!requestedColumnIds || requestedColumnIds.has(column.id)),
  );
  const selectedRange =
    scope === "cellSelection"
      ? getDataTableCellSelectionRange(table, allVisibleColumns, cellSelection)
      : undefined;
  const columns = selectedRange?.columns ?? visibleColumns;
  const rows =
    scope === "cellSelection"
      ? (selectedRange?.rows ?? [])
      : getDataTableExportRows(table, scope);
  const values: Array<Array<unknown>> = [];

  if (options.includeHeaders ?? scope !== "cellSelection") {
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

function getDataTableCellSelectionRange<TData>(
  table: TanStackTable<TData>,
  columns: Array<Column<TData, unknown>>,
  selection: DataTableCellSelection | null | undefined,
) {
  if (!selection) return undefined;
  const rows = table.getRowModel().flatRows;
  const anchorRow = rows.findIndex((row) => row.id === selection.anchor.rowId);
  const focusRow = rows.findIndex((row) => row.id === selection.focus.rowId);
  const anchorColumn = columns.findIndex(
    (column) => column.id === selection.anchor.columnId,
  );
  const focusColumn = columns.findIndex(
    (column) => column.id === selection.focus.columnId,
  );
  if (anchorRow < 0 || focusRow < 0 || anchorColumn < 0 || focusColumn < 0) {
    return undefined;
  }
  return {
    rows: rows.slice(
      Math.min(anchorRow, focusRow),
      Math.max(anchorRow, focusRow) + 1,
    ),
    columns: columns
      .slice(
        Math.min(anchorColumn, focusColumn),
        Math.max(anchorColumn, focusColumn) + 1,
      )
      .filter(
        (column) =>
          !isUtilityColumnId(column.id) && column.id !== "__spacer__",
      ),
  };
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
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }
    value += character;
  }

  row.push(value);
  if (row.length > 1 || row[0] || rows.length === 0) rows.push(row);
  return rows;
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
