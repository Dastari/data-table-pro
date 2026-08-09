import type { DataTableLabels } from "../types";

type ResolvedDataTableLabels = Required<DataTableLabels>;

export const DATA_TABLE_DEFAULT_LABELS: ResolvedDataTableLabels = {
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
  pageStatusUnknown: (pageIndex) => `Page ${pageIndex + 1}`,
  pagination: "Pagination",
  morePages: "More pages",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  selectAllVisibleRows: "Select all visible rows",
  selectRow: "Select row",
  selectCardRow: (rowId) => `Select row ${rowId}`,
  switchToTableView: "Switch to table view",
  switchToCardView: "Switch to card view",
  tableView: "Table view",
  cardView: "Card view",
  allFilterOptions: "All",
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
  resizeColumn: (columnLabel) => `Resize ${columnLabel}`,
};

export function resolveDataTableLabels(
  labels?: Partial<DataTableLabels>,
): ResolvedDataTableLabels {
  return {
    ...DATA_TABLE_DEFAULT_LABELS,
    ...labels,
  } as ResolvedDataTableLabels;
}
