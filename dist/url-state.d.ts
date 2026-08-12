import { ColumnFiltersState, ColumnVisibilityState, ColumnOrderState, GroupingState, SortingState, Updater } from '@tanstack/react-table';
import { K as DataTableDensity, C as DataTableColumnPinningState, am as DataTableViewMode, af as DataTableState } from './types-BGNR6Ymh.js';
import 'react';

type DataTableUrlStateSlice = "columnFilters" | "columnVisibility" | "density" | "columnOrder" | "columnPinning" | "grouping" | "rowSelection";
type DataTableUrlRowSelectionState = Record<string, boolean>;
type DataTableUrlEnhancedState = {
    columnFilters: ColumnFiltersState;
    columnVisibility: ColumnVisibilityState;
    density: DataTableDensity;
    columnOrder: ColumnOrderState;
    columnPinning: DataTableColumnPinningState;
    grouping: GroupingState;
    rowSelection: DataTableUrlRowSelectionState;
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
    columnVisibility: ColumnVisibilityState;
    setColumnVisibility: (updater: Updater<ColumnVisibilityState>) => void;
    density: DataTableDensity;
    setDensity: (updater: Updater<DataTableDensity>) => void;
    columnOrder: ColumnOrderState;
    setColumnOrder: (updater: Updater<ColumnOrderState>) => void;
    columnPinning: DataTableColumnPinningState;
    setColumnPinning: (updater: Updater<DataTableColumnPinningState>) => void;
    grouping: GroupingState;
    setGrouping: (updater: Updater<GroupingState>) => void;
    rowSelection: DataTableUrlRowSelectionState;
    setRowSelection: (updater: Updater<DataTableUrlRowSelectionState>) => void;
    tableState: Partial<DataTableState>;
    schemaVersion: string;
    clearEnhancedState: () => void;
};

export { type DataTableUrlEnhancedState, type DataTableUrlStateMigrationPayload, type DataTableUrlStateSlice, type UseDataTableUrlStateOptions, useDataTableUrlState };
