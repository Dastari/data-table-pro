import {
  aggregationFns as builtInAggregationFns,
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns as builtInFilterFns,
  globalFilteringFeature,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns as builtInSortFns,
  tableFeatures,
} from "@tanstack/react-table";
import type {
  AggregationFnDef,
  Cell,
  CellContext,
  Column,
  ColumnDef,
  FilterFn,
  FilterFnOption,
  Header,
  HeaderContext,
  Row,
  RowData,
  Table,
} from "@tanstack/react-table";

/**
 * The v9 feature surface used by every data-table adapter.
 *
 * Keeping this registry in one module makes the new feature generic an
 * implementation detail instead of leaking it through every public type.
 * Function registries remain broad during the migration so existing named
 * column definitions keep working. They can be narrowed once the v9 surface
 * is fully audited.
 */
type DataTableAggregationRegistry = Record<string, AggregationFnDef>;
type BuiltInFilterFn =
  (typeof builtInFilterFns)[keyof typeof builtInFilterFns];

export function createDataTableFeatures(
  customAggregationFns: DataTableAggregationRegistry = {},
) {
  return tableFeatures({
    columnFacetingFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    rowAggregationFeature,
    columnGroupingFeature,
    columnOrderingFeature,
    columnPinningFeature,
    columnSizingFeature,
    columnResizingFeature,
    columnVisibilityFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowPinningFeature,
    rowSelectionFeature,
    rowSortingFeature,
    expandedRowModel: createExpandedRowModel(),
    facetedMinMaxValues: createFacetedMinMaxValues(),
    facetedRowModel: createFacetedRowModel(),
    facetedUniqueValues: createFacetedUniqueValues(),
    filteredRowModel: createFilteredRowModel(),
    groupedRowModel: createGroupedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    aggregationFns: {
      ...(builtInAggregationFns as DataTableAggregationRegistry),
      ...customAggregationFns,
    },
    filterFns: builtInFilterFns as Record<string, BuiltInFilterFn>,
    sortFns: builtInSortFns,
  });
}

export const dataTableFeatures = createDataTableFeatures();

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableRowData<TData> = Extract<TData, RowData>;
export type DataTableTanStackTable<TData> = Table<
  DataTableFeatures,
  DataTableRowData<TData>
>;
export type DataTableTanStackRow<TData> = Row<
  DataTableFeatures,
  DataTableRowData<TData>
>;
export type DataTableTanStackColumn<TData, TValue = unknown> = Column<
  DataTableFeatures,
  DataTableRowData<TData>,
  TValue
>;
export type DataTableTanStackCell<TData, TValue = unknown> = Cell<
  DataTableFeatures,
  DataTableRowData<TData>,
  TValue
>;
export type DataTableTanStackHeader<TData, TValue = unknown> = Header<
  DataTableFeatures,
  DataTableRowData<TData>,
  TValue
>;
export type DataTableTanStackColumnDef<TData, TValue = unknown> = ColumnDef<
  DataTableFeatures,
  DataTableRowData<TData>,
  TValue
>;
export type DataTableTanStackCellContext<TData, TValue = unknown> = CellContext<
  DataTableFeatures,
  DataTableRowData<TData>,
  TValue
>;
export type DataTableTanStackHeaderContext<TData, TValue = unknown> =
  HeaderContext<DataTableFeatures, DataTableRowData<TData>, TValue>;
export type DataTableTanStackFilterFn<TData> = FilterFn<
  DataTableFeatures,
  DataTableRowData<TData>
>;
export type DataTableTanStackFilterFnOption<TData> = FilterFnOption<
  DataTableFeatures,
  DataTableRowData<TData>
>;
export type DataTableTanStackAggregationFn<TData> = AggregationFnDef<
  DataTableFeatures,
  DataTableRowData<TData>
>;
