import { SortingState } from '@tanstack/react-table';
import { DataTableViewMode } from './types.js';
import 'react';

type UseDataTableUrlStateOptions = {
    keyPrefix: string;
    defaultPageSize?: number;
    defaultSort?: {
        id: string;
        desc?: boolean;
    };
    defaultViewMode?: DataTableViewMode;
};
declare function useDataTableUrlState({ keyPrefix, defaultPageSize, defaultSort, defaultViewMode, }: UseDataTableUrlStateOptions): {
    toolbarQueryValue: string;
    setToolbarQueryValue: (query: string) => void;
    pageIndex: number;
    setPageIndex: (pageIndex: number) => void;
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    sorting: SortingState;
    setSorting: (nextSorting: SortingState) => void;
    viewMode: NonNullable<"table" | "card" | null>;
    setViewMode: (view: DataTableViewMode) => void;
    showHiddenRows: NonNullable<boolean | null>;
    setShowHiddenRows: (showHidden: boolean) => void;
};

export { useDataTableUrlState };
