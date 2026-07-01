import type { DataTableLabels } from "../types";

export const DATA_TABLE_DEFAULT_LABELS: DataTableLabels = {
  searchPlaceholder: "Search rows...",
  searchTable: "Search table",
  clearSearch: "Clear search",
  noRowsTitle: "No rows yet",
  noRowsDescription: "Create a record or refresh this view once data exists.",
  noMatchingRowsTitle: "No matching rows",
  noMatchingRowsDescription: "Try a different search term or clear filters.",
  tableOptions: "Show table options",
  columns: "Columns",
  filters: "Filters",
  clearFilters: "Clear filters",
  selectedRows: (count) =>
    `${count} record${count === 1 ? "" : "s"} selected`,
  showHiddenRows: (label) => `Show ${label}`,
  recordsPerPage: "Records per page",
  totalRecords: (count) => `Total records: ${count}`,
  pageStatus: (pageIndex, pageCount) => `Page ${pageIndex + 1} of ${pageCount}`,
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  actions: "Actions",
  rowActions: "Row actions",
  editRow: "Edit row",
  saveEdit: "Save",
  cancelEdit: "Cancel editing",
  expandRow: "Expand row",
  collapseRow: "Collapse row",
  exportCsv: "Export CSV",
  density: "Density",
  compactDensity: "Compact",
  comfortableDensity: "Comfortable",
  spaciousDensity: "Spacious",
  pinLeft: "Pin left",
  pinRight: "Pin right",
  unpin: "Unpin",
};

export function resolveDataTableLabels(labels?: Partial<DataTableLabels>) {
  return {
    ...DATA_TABLE_DEFAULT_LABELS,
    ...labels,
  };
}
