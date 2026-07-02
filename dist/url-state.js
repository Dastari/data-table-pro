import * as React from 'react';
import { useQueryStates, parseAsBoolean, parseAsStringLiteral, parseAsString, parseAsInteger } from 'nuqs';

// src/core/data-table/use-data-table-url-state.ts
function useDataTableUrlState({
  keyPrefix,
  defaultPageSize = 20,
  defaultSort,
  defaultViewMode = "table"
}) {
  const [state, setState] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
      sort: parseAsString.withDefault(
        defaultSort ? encodeSorting([{ id: defaultSort.id, desc: Boolean(defaultSort.desc) }]) : ""
      ),
      order: parseAsStringLiteral(["asc", "desc"]).withDefault(
        defaultSort?.desc ? "desc" : "asc"
      ),
      view: parseAsStringLiteral(["table", "card"]).withDefault(
        defaultViewMode
      ),
      showHidden: parseAsBoolean.withDefault(false)
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
        showHidden: `${keyPrefix}showHidden`
      }
    }
  );
  const sorting = React.useMemo(() => {
    if (!state.sort) {
      return [];
    }
    return decodeSorting(state.sort, state.order);
  }, [state.order, state.sort]);
  const setSorting = React.useCallback(
    (nextSorting) => {
      if (nextSorting.length === 0) {
        void setState({
          page: 1,
          sort: "",
          order: "asc"
        });
        return;
      }
      const next = nextSorting[0];
      void setState({
        page: 1,
        sort: encodeSorting(nextSorting),
        order: next.desc ? "desc" : "asc"
      });
    },
    [setState]
  );
  const setQuery = React.useCallback(
    (query) => {
      void setState({ page: 1, query });
    },
    [setState]
  );
  const setPageIndex = React.useCallback(
    (pageIndex) => {
      void setState({ page: pageIndex + 1 });
    },
    [setState]
  );
  const setPageSize = React.useCallback(
    (pageSize) => {
      void setState({ page: 1, pageSize });
    },
    [setState]
  );
  const setViewMode = React.useCallback(
    (view) => {
      void setState({ view });
    },
    [setState]
  );
  const setShowHidden = React.useCallback(
    (showHidden) => {
      void setState({ showHidden });
    },
    [setState]
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
    setShowHiddenRows: setShowHidden
  };
}
function encodeSorting(sorting) {
  return JSON.stringify(
    sorting.map((sort) => ({
      id: sort.id,
      desc: Boolean(sort.desc)
    }))
  );
}
function decodeSorting(value, order) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error("Expected sorting array");
    }
    return parsed.map((item) => {
      if (!item || typeof item !== "object" || typeof item.id !== "string") {
        return void 0;
      }
      return {
        id: item.id,
        desc: Boolean(item.desc)
      };
    }).filter((item) => Boolean(item));
  } catch {
    return [{ id: value, desc: order === "desc" }];
  }
}

export { useDataTableUrlState };
//# sourceMappingURL=url-state.js.map
//# sourceMappingURL=url-state.js.map