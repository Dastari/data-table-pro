import { ColumnFiltersState, VisibilityState, ColumnOrderState, ColumnPinningState, GroupingState, RowSelectionState, SortingState, Updater } from '@tanstack/react-table';
import { DataTableDensity, DataTableViewMode, DataTableState } from './types.js';
import 'react';

type DataTableUrlStateSlice = "columnFilters" | "columnVisibility" | "density" | "columnOrder" | "columnPinning" | "grouping" | "rowSelection";
type DataTableUrlEnhancedState = {
    columnFilters: ColumnFiltersState;
    columnVisibility: VisibilityState;
    density: DataTableDensity;
    columnOrder: ColumnOrderState;
    columnPinning: ColumnPinningState;
    grouping: GroupingState;
    rowSelection: RowSelectionState;
};
type DataTableUrlStateMigrationPayload = {
    version: unknown;
    state: Partial<DataTableUrlEnhancedState>;
};
type UseDataTableUrlStateOptions = {
    keyPrefix: string;
    defaultPageSize?: number;
    defaultSort?: {
        id: string;
        desc?: boolean;
    };
    defaultViewMode?: DataTableViewMode;
    version?: string | number;
    enabled?: Array<DataTableUrlStateSlice>;
    defaults?: Partial<DataTableUrlEnhancedState>;
    migrate?: (payload: DataTableUrlStateMigrationPayload, targetVersion: string | number) => Partial<DataTableUrlEnhancedState> | undefined;
    onError?: (context: {
        error: unknown;
        operation: "migrate";
    }) => void;
};
declare function useDataTableUrlState({ keyPrefix, defaultPageSize, defaultSort, defaultViewMode, version, enabled, defaults, migrate, onError, }: UseDataTableUrlStateOptions): {
    toolbarQueryValue: string;
    setToolbarQueryValue: (query: string) => void;
    pageIndex: number;
    setPageIndex: (pageIndex: number) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    sorting: SortingState;
    setSorting: (updater: Updater<SortingState>) => void;
    viewMode: NonNullable<"table" | "card" | null>;
    setViewMode: (view: DataTableViewMode) => void;
    showHiddenRows: NonNullable<boolean | null>;
    setShowHiddenRows: (showHidden: boolean) => void;
    columnFilters: ColumnFiltersState;
    setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
    columnVisibility: VisibilityState;
    setColumnVisibility: (updater: Updater<VisibilityState>) => void;
    density: DataTableDensity;
    setDensity: (updater: Updater<DataTableDensity>) => void;
    columnOrder: ColumnOrderState;
    setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
    columnPinning: ColumnPinningState;
    setColumnPinning: (updater: Updater<ColumnPinningState>) => void;
    grouping: GroupingState;
    setGrouping: (updater: Updater<GroupingState>) => void;
    rowSelection: RowSelectionState;
    setRowSelection: (updater: Updater<RowSelectionState>) => void;
    tableState: Partial<DataTableState>;
    schemaVersion: string;
    clearEnhancedState: () => void;
};

export { type DataTableUrlEnhancedState, type DataTableUrlStateMigrationPayload, type DataTableUrlStateSlice, type UseDataTableUrlStateOptions, useDataTableUrlState };
