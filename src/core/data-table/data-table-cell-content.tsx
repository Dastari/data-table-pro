import * as React from "react";
import { flexRender, type CellContext } from "@tanstack/react-table";
import { IconClock } from "../icons";
import type {
  DataTableCellOverflow,
  DataTableColumnDef,
} from "../types";
import type { DataTableUiClassNames } from "../ui-kit";
import { cn } from "../../lib/utils";

export function renderDataTableCellContent<TData>(
  context: CellContext<TData, unknown>,
  classNames?: DataTableUiClassNames,
  options?: {
    hasCustomCell?: boolean;
    useCustomOverflowDefaults?: boolean;
  },
) {
  const column = context.column.columnDef as DataTableColumnDef<TData, unknown>;
  const meta = column.meta;
  const value = context.getValue();
  const hasCustomCell = options?.hasCustomCell ?? false;
  const renderedCellContent = hasCustomCell && column.cell
    ? flexRender(column.cell, context)
    : undefined;
  const hasComplexRenderedContent = isComplexRenderedCellContent(
    renderedCellContent,
  );
  const resolvedOverflow = resolveDataTableCellOverflow({
    context,
    useCustomOverflowDefaults: options?.useCustomOverflowDefaults ?? false,
    value,
  });

  if (meta?.type === "date" && !hasCustomCell) {
    return (
      <div
        data-dtp-slot="data-table-cell-content"
        data-dtp-overflow={resolvedOverflow}
        className={cn(
          getCellOverflowClassName(resolvedOverflow),
          "flex w-full min-w-0 items-center justify-end gap-2",
        )}
      >
        <IconClock
          className={cn(
            "shrink-0",
            classNames?.mutedText ?? "opacity-70",
          )}
        />
        <span className="min-w-0 truncate">{formatDateValue(value)}</span>
      </div>
    );
  }

  const content =
    renderedCellContent !== undefined &&
    renderedCellContent !== null &&
    renderedCellContent !== ""
      ? renderedCellContent
      : value == null || value === ""
      ? <span className={classNames?.mutedText ?? "opacity-70"}>-</span>
      : formatCellValue(value);

  return (
    <div
      data-dtp-slot="data-table-cell-content"
      data-dtp-overflow={resolvedOverflow}
      className={cn(
        getCellOverflowClassName(resolvedOverflow),
        "w-full min-w-0 max-w-full",
        hasComplexRenderedContent && "[&>*]:max-w-full [&>*]:min-w-0",
      )}
    >
      {content}
    </div>
  );
}

function resolveDataTableCellOverflow<TData>({
  context,
  useCustomOverflowDefaults,
  value,
}: {
  context: CellContext<TData, unknown>;
  useCustomOverflowDefaults: boolean;
  value: unknown;
}): DataTableCellOverflow {
  const column = context.column.columnDef as DataTableColumnDef<TData, unknown>;
  const resolvedOverflow =
    typeof column.meta?.overflow === "function"
      ? column.meta.overflow({
          row: context.row.original,
          value,
        })
      : column.meta?.overflow;

  if (resolvedOverflow) {
    return resolvedOverflow;
  }

  return useCustomOverflowDefaults ? "clip" : "truncate";
}

function getCellOverflowClassName(overflow: DataTableCellOverflow) {
  switch (overflow) {
    case "clip":
      return "block overflow-hidden whitespace-nowrap";
    case "wrap":
      return "block overflow-hidden whitespace-normal break-words";
    case "visible":
      return "block overflow-visible whitespace-normal";
    case "truncate":
    default:
      return "block overflow-hidden text-ellipsis whitespace-nowrap";
  }
}

function isComplexRenderedCellContent(content: React.ReactNode) {
  if (content == null) {
    return false;
  }

  return (
    React.isValidElement(content) ||
    Array.isArray(content) ||
    typeof content === "object"
  );
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
