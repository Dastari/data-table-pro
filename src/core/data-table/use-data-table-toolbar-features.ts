import * as React from "react";
import { IconDownload } from "../icons";
import type {
  ColumnFiltersState,
  ColumnPinningState,
  OnChangeFn,
  Table as TanStackTable,
  VisibilityState,
} from "@tanstack/react-table";
import type {
  DataTableColumnFixed,
  DataTableLabels,
  DataTableProps,
} from "../types";
import {
  exportDataTableCsv,
  getAccessorKey,
  getColumnId,
  hasFilterValue,
  normalizeColumnFilterOptions,
  startCase,
} from "./data-table-utils";

export function useDataTableToolbarFeatures<TData>({
  columns,
  currentColumnFilters,
  currentColumnPinning,
  effectiveColumnVisibility,
  enableColumnFilters,
  handleColumnFiltersChange,
  handleColumnPinningChange,
  labels,
  table,
  toolbarActions,
  visibleData,
  csvExport,
}: {
  columns: DataTableProps<TData>["columns"];
  currentColumnFilters: ColumnFiltersState;
  currentColumnPinning: ColumnPinningState;
  effectiveColumnVisibility: VisibilityState;
  enableColumnFilters: boolean | undefined;
  handleColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  handleColumnPinningChange: OnChangeFn<ColumnPinningState>;
  labels: DataTableLabels;
  table: TanStackTable<TData>;
  toolbarActions: DataTableProps<TData>["toolbarActions"];
  visibleData: Array<TData>;
  csvExport: DataTableProps<TData>["csvExport"];
}) {
  const columnVisibilityOptions = React.useMemo(() => {
    return columns.map((column, index) => {
      const id = getColumnId(column, index);
      const header = column.header;
      const accessorKey = getAccessorKey(column);
      const label =
        typeof header === "string"
          ? header
          : accessorKey
            ? startCase(accessorKey)
            : startCase(id);

      const pinned: false | DataTableColumnFixed =
        currentColumnPinning.left?.includes(id) === true
          ? "left"
          : currentColumnPinning.right?.includes(id) === true
            ? "right"
            : false;

      return {
        id,
        label,
        visible: effectiveColumnVisibility[id] !== false,
        canHide: column.enableHiding !== false,
        pinned,
      };
    });
  }, [columns, currentColumnPinning, effectiveColumnVisibility]);

  const toolbarColumnFilters = React.useMemo(() => {
    if (enableColumnFilters === false) {
      return [];
    }

    return columns.flatMap((column, index) => {
      const filter = column.meta?.filter;
      if (!filter) {
        return [];
      }

      const id = getColumnId(column, index);
      const header = column.header;
      const accessorKey = getAccessorKey(column);
      const label =
        filter.label ??
        (typeof header === "string"
          ? header
          : accessorKey
            ? startCase(accessorKey)
            : startCase(id));
      const state = currentColumnFilters.find((item) => item.id === id);
      const rawOptions =
        typeof filter.options === "function"
          ? filter.options({ rows: visibleData })
          : (filter.options ?? []);

      return [
        {
          id,
          label,
          type: filter.type,
          value: state?.value,
          placeholder: filter.placeholder,
          options: normalizeColumnFilterOptions(rawOptions),
        },
      ];
    });
  }, [columns, currentColumnFilters, enableColumnFilters, visibleData]);

  const handleToolbarColumnFilterChange = React.useCallback(
    (columnId: string, value: unknown) => {
      handleColumnFiltersChange((current) => {
        const next = current.filter((filter) => filter.id !== columnId);
        if (hasFilterValue(value)) {
          next.push({ id: columnId, value });
        }
        return next;
      });
    },
    [handleColumnFiltersChange],
  );

  const handleClearColumnFilters = React.useCallback(() => {
    handleColumnFiltersChange([]);
  }, [handleColumnFiltersChange]);

  const handleToolbarColumnPinningChange = React.useCallback(
    (columnId: string, side: DataTableColumnFixed | false) => {
      handleColumnPinningChange((current) => {
        const left = (current.left ?? []).filter((id) => id !== columnId);
        const right = (current.right ?? []).filter((id) => id !== columnId);

        if (side === "left") {
          left.push(columnId);
        }
        if (side === "right") {
          right.push(columnId);
        }

        return { left, right };
      });
    },
    [handleColumnPinningChange],
  );

  const handleCsvExport = React.useCallback(() => {
    if (!csvExport) {
      return;
    }

    void exportDataTableCsv({
      csvExport,
      table,
      labels,
    });
  }, [csvExport, labels, table]);

  const effectiveToolbarActions = React.useMemo(() => {
    if (!csvExport) {
      return toolbarActions ?? [];
    }

    return [
      ...(toolbarActions ?? []),
      {
        key: "__csv_export__",
        label: labels.exportCsv,
        icon: IconDownload,
        placement: "trailing" as const,
        onClick: handleCsvExport,
      },
    ];
  }, [csvExport, handleCsvExport, labels.exportCsv, toolbarActions]);

  return {
    columnVisibilityOptions,
    effectiveToolbarActions,
    handleClearColumnFilters,
    handleToolbarColumnFilterChange,
    handleToolbarColumnPinningChange,
    toolbarColumnFilters,
  };
}
