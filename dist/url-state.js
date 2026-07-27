import * as React from 'react';
import { useQueryStates, parseAsString, parseAsJson, parseAsStringLiteral, parseAsBoolean, parseAsInteger } from 'nuqs';

// src/core/data-table/use-data-table-url-state.ts
var EMPTY_FILTERS = [];
var EMPTY_VISIBILITY = {};
var EMPTY_ORDER = [];
var EMPTY_PINNING = {};
var EMPTY_GROUPING = [];
var EMPTY_SELECTION = {};
function useDataTableUrlState({
  keyPrefix,
  defaultPageSize = 20,
  defaultSort,
  defaultViewMode = "table",
  version = 1,
  enabled = [],
  defaults,
  migrate,
  onError
}) {
  const [state, setState] = useQueryStates(
    {
      query: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
      sort: parseAsString.withDefault(
        defaultSort ? encodeSorting([
          { id: defaultSort.id, desc: Boolean(defaultSort.desc) }
        ]) : ""
      ),
      order: parseAsStringLiteral(["asc", "desc"]).withDefault(
        defaultSort?.desc ? "desc" : "asc"
      ),
      view: parseAsStringLiteral(["table", "card"]).withDefault(
        defaultViewMode
      ),
      showHidden: parseAsBoolean.withDefault(false),
      schema: parseAsString,
      filters: parseAsJson(validateColumnFilters),
      visibility: parseAsJson(validateBooleanRecord),
      density: parseAsStringLiteral(
        ["compact", "comfortable", "spacious"]
      ),
      columnOrder: parseAsJson(validateStringArray),
      pinning: parseAsJson(validateColumnPinning),
      grouping: parseAsJson(validateStringArray),
      selection: parseAsJson(validateBooleanRecord)
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
        schema: `${keyPrefix}v`,
        filters: `${keyPrefix}filters`,
        visibility: `${keyPrefix}visibility`,
        density: `${keyPrefix}density`,
        columnOrder: `${keyPrefix}columns`,
        pinning: `${keyPrefix}pinning`,
        grouping: `${keyPrefix}grouping`,
        selection: `${keyPrefix}selection`
      }
    }
  );
  const enabledSet = React.useMemo(() => new Set(enabled), [enabled]);
  const enhancedResolution = React.useMemo(() => {
    const raw = {};
    if (enabledSet.has("columnFilters") && state.filters !== null) {
      raw.columnFilters = state.filters;
    }
    if (enabledSet.has("columnVisibility") && state.visibility !== null) {
      raw.columnVisibility = state.visibility;
    }
    if (enabledSet.has("density") && state.density !== null) {
      raw.density = state.density;
    }
    if (enabledSet.has("columnOrder") && state.columnOrder !== null) {
      raw.columnOrder = state.columnOrder;
    }
    if (enabledSet.has("columnPinning") && state.pinning !== null) {
      raw.columnPinning = state.pinning;
    }
    if (enabledSet.has("grouping") && state.grouping !== null) {
      raw.grouping = state.grouping;
    }
    if (enabledSet.has("rowSelection") && state.selection !== null) {
      raw.rowSelection = state.selection;
    }
    if (Object.keys(raw).length === 0) {
      return { state: raw };
    }
    if (state.schema === String(version)) {
      return { state: raw };
    }
    if (!migrate) {
      return { state: {} };
    }
    try {
      return {
        state: validateEnhancedState(
          migrate(
            {
              version: state.schema,
              state: raw
            },
            version
          ),
          enabledSet
        )
      };
    } catch (error) {
      return { error, state: {} };
    }
  }, [
    enabledSet,
    migrate,
    state.columnOrder,
    state.density,
    state.filters,
    state.grouping,
    state.pinning,
    state.schema,
    state.selection,
    state.visibility,
    version
  ]);
  React.useEffect(() => {
    if (enhancedResolution.error !== void 0) {
      onError?.({
        error: enhancedResolution.error,
        operation: "migrate"
      });
    }
  }, [enhancedResolution.error, onError]);
  const sorting = React.useMemo(() => {
    if (!state.sort) {
      return [];
    }
    return decodeSorting(state.sort, state.order);
  }, [state.order, state.sort]);
  const columnFilters = enhancedResolution.state.columnFilters ?? defaults?.columnFilters ?? EMPTY_FILTERS;
  const columnVisibility = enhancedResolution.state.columnVisibility ?? defaults?.columnVisibility ?? EMPTY_VISIBILITY;
  const density = enhancedResolution.state.density ?? defaults?.density ?? "comfortable";
  const columnOrder = enhancedResolution.state.columnOrder ?? defaults?.columnOrder ?? EMPTY_ORDER;
  const columnPinning = enhancedResolution.state.columnPinning ?? defaults?.columnPinning ?? EMPTY_PINNING;
  const grouping = enhancedResolution.state.grouping ?? defaults?.grouping ?? EMPTY_GROUPING;
  const rowSelection = enhancedResolution.state.rowSelection ?? defaults?.rowSelection ?? EMPTY_SELECTION;
  const schemaVersion = String(version);
  const setSorting = React.useCallback(
    (updater) => {
      const nextSorting = resolveUpdater(updater, sorting);
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
    [setState, sorting]
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
  const setColumnFilters = React.useCallback(
    (updater) => {
      if (!enabledSet.has("columnFilters")) return;
      const next = resolveUpdater(updater, columnFilters);
      void setState({
        page: 1,
        schema: schemaVersion,
        filters: next.length > 0 ? next : null
      });
    },
    [columnFilters, enabledSet, schemaVersion, setState]
  );
  const setColumnVisibility = React.useCallback(
    (updater) => {
      if (!enabledSet.has("columnVisibility")) return;
      const next = resolveUpdater(updater, columnVisibility);
      void setState({
        schema: schemaVersion,
        visibility: hasKeys(next) ? next : null
      });
    },
    [columnVisibility, enabledSet, schemaVersion, setState]
  );
  const setDensity = React.useCallback(
    (updater) => {
      if (!enabledSet.has("density")) return;
      const next = resolveUpdater(updater, density);
      void setState({
        schema: schemaVersion,
        density: next === (defaults?.density ?? "comfortable") ? null : next
      });
    },
    [defaults?.density, density, enabledSet, schemaVersion, setState]
  );
  const setColumnOrder = React.useCallback(
    (updater) => {
      if (!enabledSet.has("columnOrder")) return;
      const next = resolveUpdater(updater, columnOrder);
      void setState({
        schema: schemaVersion,
        columnOrder: next.length > 0 ? next : null
      });
    },
    [columnOrder, enabledSet, schemaVersion, setState]
  );
  const setColumnPinning = React.useCallback(
    (updater) => {
      if (!enabledSet.has("columnPinning")) return;
      const next = resolveUpdater(updater, columnPinning);
      void setState({
        schema: schemaVersion,
        pinning: (next.left?.length ?? 0) > 0 || (next.right?.length ?? 0) > 0 ? next : null
      });
    },
    [columnPinning, enabledSet, schemaVersion, setState]
  );
  const setGrouping = React.useCallback(
    (updater) => {
      if (!enabledSet.has("grouping")) return;
      const next = resolveUpdater(updater, grouping);
      void setState({
        page: 1,
        schema: schemaVersion,
        grouping: next.length > 0 ? next : null
      });
    },
    [enabledSet, grouping, schemaVersion, setState]
  );
  const setRowSelection = React.useCallback(
    (updater) => {
      if (!enabledSet.has("rowSelection")) return;
      const next = resolveUpdater(updater, rowSelection);
      void setState({
        schema: schemaVersion,
        selection: hasKeys(next) ? next : null
      });
    },
    [enabledSet, rowSelection, schemaVersion, setState]
  );
  const clearEnhancedState = React.useCallback(() => {
    void setState({
      schema: null,
      filters: null,
      visibility: null,
      density: null,
      columnOrder: null,
      pinning: null,
      grouping: null,
      selection: null
    });
  }, [setState]);
  const tableState = React.useMemo(
    () => ({
      globalFilter: state.query,
      pagination: {
        pageIndex: Math.max(0, state.page - 1),
        pageSize: state.pageSize
      },
      sorting,
      viewMode: state.view,
      showHiddenRows: state.showHidden,
      ...enabledSet.has("columnFilters") ? { columnFilters } : {},
      ...enabledSet.has("columnVisibility") ? { columnVisibility } : {},
      ...enabledSet.has("density") ? { density } : {},
      ...enabledSet.has("columnOrder") ? { columnOrder } : {},
      ...enabledSet.has("columnPinning") ? { columnPinning } : {},
      ...enabledSet.has("rowSelection") ? { rowSelection } : {}
    }),
    [
      columnFilters,
      columnOrder,
      columnPinning,
      columnVisibility,
      density,
      enabledSet,
      rowSelection,
      sorting,
      state.page,
      state.pageSize,
      state.query,
      state.showHidden,
      state.view
    ]
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
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    density,
    setDensity,
    columnOrder,
    setColumnOrder,
    columnPinning,
    setColumnPinning,
    grouping,
    setGrouping,
    rowSelection,
    setRowSelection,
    tableState,
    schemaVersion,
    clearEnhancedState
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
function validateEnhancedState(value, enabled) {
  if (!value) return {};
  const state = {};
  const filters = validateColumnFilters(value.columnFilters);
  if (enabled.has("columnFilters") && filters) {
    state.columnFilters = filters;
  }
  const visibility = validateBooleanRecord(value.columnVisibility);
  if (enabled.has("columnVisibility") && visibility) {
    state.columnVisibility = visibility;
  }
  if (enabled.has("density") && (value.density === "compact" || value.density === "comfortable" || value.density === "spacious")) {
    state.density = value.density;
  }
  const order = validateStringArray(value.columnOrder);
  if (enabled.has("columnOrder") && order) state.columnOrder = order;
  const pinning = validateColumnPinning(value.columnPinning);
  if (enabled.has("columnPinning") && pinning) {
    state.columnPinning = pinning;
  }
  const grouping = validateStringArray(value.grouping);
  if (enabled.has("grouping") && grouping) state.grouping = grouping;
  const selection = validateBooleanRecord(value.rowSelection);
  if (enabled.has("rowSelection") && selection) {
    state.rowSelection = selection;
  }
  return state;
}
function validateColumnFilters(value) {
  if (!Array.isArray(value)) return null;
  return value.filter(
    (item) => isRecord(item) && typeof item.id === "string" && Object.prototype.hasOwnProperty.call(item, "value")
  ).map((item) => ({ id: item.id, value: item.value }));
}
function validateBooleanRecord(value) {
  if (!isRecord(value)) return null;
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry) => typeof entry[1] === "boolean"
    )
  );
}
function validateStringArray(value) {
  if (!Array.isArray(value)) return null;
  return value.filter((item) => typeof item === "string");
}
function validateColumnPinning(value) {
  if (!isRecord(value)) return null;
  return {
    left: validateStringArray(value.left) ?? [],
    right: validateStringArray(value.right) ?? []
  };
}
function resolveUpdater(updater, current) {
  return typeof updater === "function" ? updater(current) : updater;
}
function hasKeys(value) {
  return Object.keys(value).length > 0;
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export { useDataTableUrlState };
//# sourceMappingURL=url-state.js.map
//# sourceMappingURL=url-state.js.map