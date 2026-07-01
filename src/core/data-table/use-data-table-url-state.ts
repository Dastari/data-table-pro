import * as React from "react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import type { SortingState } from "@tanstack/react-table";
import type { DataTableViewMode } from "../types";

type UseDataTableUrlStateOptions = {
  keyPrefix: string;
  defaultPageSize?: number;
  defaultSort?: { id: string; desc?: boolean };
  defaultViewMode?: DataTableViewMode;
};

export function useDataTableUrlState({
  keyPrefix,
  defaultPageSize = 20,
  defaultSort,
  defaultViewMode = "table",
}: UseDataTableUrlStateOptions) {
  const [state, setState] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
      sort: parseAsString.withDefault(
        defaultSort ? encodeSorting([{ id: defaultSort.id, desc: Boolean(defaultSort.desc) }]) : "",
      ),
      order: parseAsStringLiteral(["asc", "desc"] as const).withDefault(
        defaultSort?.desc ? "desc" : "asc",
      ),
      view: parseAsStringLiteral(["table", "card"] as const).withDefault(
        defaultViewMode,
      ),
      showHidden: parseAsBoolean.withDefault(false),
    },
    {
      clearOnDefault: true,
      history: "replace",
      urlKeys: {
        query: `${keyPrefix}q`,
        page: `${keyPrefix}page`,
        pageSize: `${keyPrefix}size`,
        sort: `${keyPrefix}sort`,
        order: `${keyPrefix}order`,
        view: `${keyPrefix}view`,
        showHidden: `${keyPrefix}showHidden`,
      },
    },
  );

  const sorting = React.useMemo<SortingState>(() => {
    if (!state.sort) {
      return [];
    }

    return decodeSorting(state.sort, state.order);
  }, [state.order, state.sort]);

  const setSorting = React.useCallback(
    (nextSorting: SortingState) => {
      if (nextSorting.length === 0) {
        void setState({
          page: 1,
          sort: "",
          order: "asc",
        });
        return;
      }

      const next = nextSorting[0];
      void setState({
        page: 1,
        sort: encodeSorting(nextSorting),
        order: next.desc ? "desc" : "asc",
      });
    },
    [setState],
  );

  const setQuery = React.useCallback(
    (query: string) => {
      void setState({ page: 1, query });
    },
    [setState],
  );

  const setPageIndex = React.useCallback(
    (pageIndex: number) => {
      void setState({ page: pageIndex + 1 });
    },
    [setState],
  );

  const setPageSize = React.useCallback(
    (pageSize: number) => {
      void setState({ page: 1, pageSize });
    },
    [setState],
  );

  const setViewMode = React.useCallback(
    (view: DataTableViewMode) => {
      void setState({ view });
    },
    [setState],
  );

  const setShowHidden = React.useCallback(
    (showHidden: boolean) => {
      void setState({ showHidden });
    },
    [setState],
  );

  return {
    toolbarQueryValue: state.query,
    setToolbarQueryValue: setQuery,
    pageIndex: Math.max(0, state.page - 1),
    setPageIndex,
    pageSize: state.pageSize,
    setPageSize,
    sorting,
    setSorting,
    viewMode: state.view,
    setViewMode,
    showHiddenRows: state.showHidden,
    setShowHiddenRows: setShowHidden,
  };
}

function encodeSorting(sorting: SortingState) {
  return JSON.stringify(
    sorting.map((sort) => ({
      id: sort.id,
      desc: Boolean(sort.desc),
    })),
  );
}

function decodeSorting(value: string, order: "asc" | "desc"): SortingState {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("Expected sorting array");
    }

    return parsed
      .map((item) => {
        if (
          !item ||
          typeof item !== "object" ||
          typeof (item as { id?: unknown }).id !== "string"
        ) {
          return undefined;
        }

        return {
          id: (item as { id: string }).id,
          desc: Boolean((item as { desc?: unknown }).desc),
        };
      })
      .filter((item): item is SortingState[number] => Boolean(item));
  } catch {
    return [{ id: value, desc: order === "desc" }];
  }
}
