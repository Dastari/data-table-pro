import * as React from "react";
import type { Table as TanStackTable } from "@tanstack/react-table";
import type { DataTableLabels, DataTableProps } from "../types";

type DataTableToolbarSectionProps<TData> = {
  allRows: Array<TData>;
  columnFilters: Array<unknown>;
  columnVisibilityOptions: Array<unknown>;
  compactToolbar: React.ReactNode;
  customToolbar: React.ReactNode;
  DataTableToolbar: React.ElementType;
  description: string | undefined;
  effectiveToolbarActions: Array<unknown>;
  enableColumnPinning: boolean;
  enableDensityToggle: boolean;
  enableViewToggle: boolean;
  hiddenRowsLabel: string | undefined;
  labels: DataTableLabels;
  onClearColumnFilters: () => void;
  onColumnFilterChange: (columnId: string, value: unknown) => void;
  onColumnPinningChange: (columnId: string, side: "left" | "right" | false) => void;
  onDensityChange: (density: "compact" | "comfortable" | "spacious") => void;
  onShowHiddenRowsChange: (showHiddenRows: boolean) => void;
  onToolbarQueryValueChange: (value: string) => void;
  onViewModeChange: (viewMode: "table" | "card") => void;
  openFileDialog: (() => void) | undefined;
  selectedRows: Array<TData>;
  selectionActions: DataTableProps<TData>["selectionActions"];
  showHiddenRows: boolean;
  table: TanStackTable<TData>;
  title: string | undefined;
  toolbarQueryPlaceholder: string;
  toolbarQueryValue: string;
  toolbarVisibility: DataTableProps<TData>["toolbarVisibility"];
  density: "compact" | "comfortable" | "spacious";
  viewMode: "table" | "card";
};

export function DataTableToolbarSection<TData>({
  allRows,
  columnFilters,
  columnVisibilityOptions,
  compactToolbar,
  customToolbar,
  DataTableToolbar,
  description,
  effectiveToolbarActions,
  enableColumnPinning,
  enableDensityToggle,
  enableViewToggle,
  hiddenRowsLabel,
  labels,
  onClearColumnFilters,
  onColumnFilterChange,
  onColumnPinningChange,
  onDensityChange,
  onShowHiddenRowsChange,
  onToolbarQueryValueChange,
  onViewModeChange,
  openFileDialog,
  selectedRows,
  selectionActions,
  showHiddenRows,
  table,
  title,
  toolbarQueryPlaceholder,
  toolbarQueryValue,
  toolbarVisibility,
  density,
  viewMode,
}: DataTableToolbarSectionProps<TData>) {
  return (
    <div data-dtp-slot="data-table-toolbar" className="shrink-0">
      <DataTableToolbar
        title={title}
        description={description}
        toolbarQueryValue={toolbarQueryValue}
        toolbarQueryPlaceholder={toolbarQueryPlaceholder}
        onToolbarQueryValueChange={onToolbarQueryValueChange}
        customToolbar={customToolbar}
        compactToolbar={compactToolbar}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        enableViewToggle={enableViewToggle}
        toolbarActions={effectiveToolbarActions}
        selectionActions={selectionActions}
        selectedRows={selectedRows}
        showHiddenRows={showHiddenRows}
        hiddenRowsLabel={hiddenRowsLabel}
        onShowHiddenRowsChange={onShowHiddenRowsChange}
        allRows={allRows}
        columnVisibilityOptions={columnVisibilityOptions}
        onColumnVisibilityChange={(columnId: string, visible: boolean) => {
          table.getColumn(columnId)?.toggleVisibility(visible);
        }}
        enableColumnPinning={enableColumnPinning}
        onColumnPinningChange={onColumnPinningChange}
        columnFilters={columnFilters}
        onColumnFilterChange={onColumnFilterChange}
        onClearColumnFilters={onClearColumnFilters}
        density={density}
        onDensityChange={onDensityChange}
        enableDensityToggle={enableDensityToggle}
        labels={labels}
        toolbarVisibility={toolbarVisibility}
        openFileDialog={openFileDialog}
      />
    </div>
  );
}
