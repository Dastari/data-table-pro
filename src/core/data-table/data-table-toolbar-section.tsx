import * as React from "react";
import type {
  DataTableLabels,
  DataTableProps,
  DataTableSavedView,
} from "../types";
import type { DataTableTanStackTable as TanStackTable } from "./tanstack-v9";

type DataTableToolbarSectionProps<TData> = {
  allRows: Array<TData>;
  columnFilters: Array<unknown>;
  columnVisibilityOptions: Array<unknown>;
  compactToolbar: React.ReactNode;
  customToolbar: React.ReactNode;
  DataTableToolbar: React.ElementType;
  description: string | undefined;
  descriptionId: string | undefined;
  effectiveToolbarActions: Array<unknown>;
  enableColumnPinning: boolean;
  enableGrouping: boolean;
  enableToolbarColumnChooser: boolean;
  enableToolbarFilterChips: boolean;
  enableToolbarResetLayout: boolean;
  enableToolbarSavedViews: boolean;
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
  reorderColumn: (sourceColumnId: string, targetColumnId: string) => void;
  onResetColumnLayout: () => void;
  onCreateSavedView: (name: string) => DataTableSavedView | undefined;
  onApplySavedView: (id: string) => boolean;
  onRenameSavedView: (id: string, name: string) => DataTableSavedView | undefined;
  onDeleteSavedView: (id: string) => boolean;
  onViewModeChange: (viewMode: "table" | "card") => void;
  openFileDialog: (() => void) | undefined;
  selectedRowIds: Array<string>;
  selectedRows: Array<TData>;
  selectionActions: DataTableProps<TData>["selectionActions"];
  savedViews: Array<DataTableSavedView>;
  showHiddenRows: boolean;
  table: TanStackTable<TData>;
  title: string | undefined;
  titleId: string | undefined;
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
  descriptionId,
  effectiveToolbarActions,
  enableColumnPinning,
  enableGrouping,
  enableToolbarColumnChooser,
  enableToolbarFilterChips,
  enableToolbarResetLayout,
  enableToolbarSavedViews,
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
  reorderColumn,
  onResetColumnLayout,
  onCreateSavedView,
  onApplySavedView,
  onRenameSavedView,
  onDeleteSavedView,
  onViewModeChange,
  openFileDialog,
  selectedRowIds,
  selectedRows,
  selectionActions,
  savedViews,
  showHiddenRows,
  table,
  title,
  titleId,
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
        titleId={titleId}
        description={description}
        descriptionId={descriptionId}
        toolbarQueryValue={toolbarQueryValue}
        toolbarQueryPlaceholder={toolbarQueryPlaceholder}
        onToolbarQueryValueChange={onToolbarQueryValueChange}
        reorderColumn={reorderColumn}
        customToolbar={customToolbar}
        compactToolbar={compactToolbar}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        enableViewToggle={enableViewToggle}
        toolbarActions={effectiveToolbarActions}
        selectionActions={selectionActions}
        selectedRowIds={selectedRowIds}
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
        enableGrouping={enableGrouping}
        enableToolbarColumnChooser={enableToolbarColumnChooser}
        enableToolbarFilterChips={enableToolbarFilterChips}
        enableToolbarResetLayout={enableToolbarResetLayout}
        enableToolbarSavedViews={enableToolbarSavedViews}
        onColumnPinningChange={onColumnPinningChange}
        columnFilters={columnFilters}
        onColumnFilterChange={onColumnFilterChange}
        onClearColumnFilters={onClearColumnFilters}
        onResetColumnLayout={onResetColumnLayout}
        onCreateSavedView={onCreateSavedView}
        onApplySavedView={onApplySavedView}
        onRenameSavedView={onRenameSavedView}
        onDeleteSavedView={onDeleteSavedView}
        density={density}
        onDensityChange={onDensityChange}
        enableDensityToggle={enableDensityToggle}
        labels={labels}
        toolbarVisibility={toolbarVisibility}
        openFileDialog={openFileDialog}
        savedViews={savedViews}
        table={table}
      />
    </div>
  );
}
