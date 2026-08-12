import * as React from "react";
import { IconDownload } from "../icons";
import type {
  ColumnFiltersState,
  ColumnVisibilityState as VisibilityState,
  OnChangeFn,
} from "@tanstack/react-table";
import type {
  DataTableColumnFixed,
  DataTableColumnPinningState as ColumnPinningState,
  DataTableLabels,
  DataTableProps,
} from "../types";
import type { DataTableTanStackTable as TanStackTable } from "./tanstack-v9";
import {
  exportDataTableCsv,
  getAccessorKey,
  getColumnId,
  getDataTableLeafColumns,
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
    return getDataTableLeafColumns(columns).map(({ column, index }) => {
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

    return getDataTableLeafColumns(columns).flatMap(({ column, index }) => {
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
      const configuredFacetOptions = filter.faceting?.options;
      const facetedMinMax =
        filter.type === "numberRange"
          ? table.getColumn(id)?.getFacetedMinMaxValues()
          : undefined;
      const rawOptions =
        filter.type === "faceted" && configuredFacetOptions
          ? typeof configuredFacetOptions === "function"
            ? configuredFacetOptions({ rows: visibleData })
            : configuredFacetOptions
          : filter.type === "faceted"
            ? Array.from(table.getColumn(id)?.getFacetedUniqueValues() ?? []).map(
                ([value, count]) => ({
                  label:
                    filter.faceting?.getOptionLabel?.(value as never) ??
                    String(value),
                  value: String(value),
                  count,
                }),
              )
            : typeof filter.options === "function"
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
          searchable: filter.faceting?.searchable,
          searchPlaceholder: filter.faceting?.searchPlaceholder,
          trueLabel: filter.trueLabel,
          falseLabel: filter.falseLabel,
          min: filter.min ?? facetedMinMax?.[0],
          max: filter.max ?? facetedMinMax?.[1],
          step: filter.step,
        },
      ];
    });
  }, [
    columns,
    currentColumnFilters,
    enableColumnFilters,
    table,
    visibleData,
  ]);

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

    return exportDataTableCsv({
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
