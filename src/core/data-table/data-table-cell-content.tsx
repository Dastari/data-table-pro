import { flexRender, type CellContext } from "@tanstack/react-table";
import { IconClock } from "@tabler/icons-react";
import type { DataTableColumnDef } from "../types";
import type { DataTableUiClassNames } from "../ui-kit";

export function renderDataTableCellContent<TData>(
  context: CellContext<TData, unknown>,
  classNames?: DataTableUiClassNames,
) {
  const column = context.column.columnDef as DataTableColumnDef<TData, unknown>;
  const meta = column.meta;
  const hasCustomCell =
    Object.prototype.hasOwnProperty.call(column, "cell") &&
    typeof column.cell === "function";

  const value = context.getValue();

  if (meta?.type === "date" && !hasCustomCell) {
    return (
      <div className="inline-flex items-center justify-end gap-2">
        <IconClock className={classNames?.mutedText ?? "opacity-70"} />
        <span>{formatDateValue(value)}</span>
      </div>
    );
  }

  if (column.cell) {
    return flexRender(column.cell, context);
  }

  if (value == null || value === "") {
    return <span className={classNames?.mutedText ?? "opacity-70"}>-</span>;
  }

  return formatCellValue(value);
}

function formatDateValue(value: unknown) {
  if (typeof value === "number") {
    return new Date(value * 1000).toLocaleString();
  }

  if (typeof value === "string" && value) {
    return value;
  }

  return "-";
}

function formatCellValue(value: unknown) {
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "-";
  }
}
