import type {
  DataTableSavedView,
  DataTableSavedViewSlice,
  DataTableSavedViewsChangeOperation,
  DataTableSavedViewsConfig,
  DataTableSavedViewsPayload,
  DataTableState,
} from "../types";

const STORAGE_PREFIX = "data-table-pro:saved-views:";
const DEFAULT_VERSION = 1;
const DEFAULT_SLICES: Array<DataTableSavedViewSlice> = [
  "sorting",
  "columnVisibility",
  "columnFilters",
  "columnOrder",
  "columnPinning",
  "rowPinning",
  "columnSizing",
  "density",
  "viewMode",
  "showHiddenRows",
  "globalFilter",
];
let fallbackId = 0;

export function readDataTableSavedViews(
  config: DataTableSavedViewsConfig | undefined,
): Array<DataTableSavedView> {
  const storage = resolveStorage(config);
  if (!config || !storage) {
    return [];
  }

  let serialized: string | null;
  try {
    serialized = storage.getItem(getStorageKey(config.key));
  } catch (error) {
    config.onError?.({ error, operation: "read" });
    return [];
  }
  if (!serialized) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = (config.deserialize ?? JSON.parse)(serialized);
  } catch (error) {
    config.onError?.({ error, operation: "deserialize" });
    return [];
  }

  if (!isRecord(parsed) || !("version" in parsed) || !("views" in parsed)) {
    return [];
  }

  const targetVersion = config.version ?? DEFAULT_VERSION;
  let candidate: unknown = parsed.views;
  if (parsed.version !== targetVersion) {
    if (!config.migrate) {
      return [];
    }
    try {
      candidate = config.migrate(
        { version: parsed.version, views: parsed.views },
        targetVersion,
      );
    } catch (error) {
      config.onError?.({ error, operation: "migrate" });
      return [];
    }
  }

  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate
    .map((view) => validateSavedView(view, config.slices))
    .filter((view): view is DataTableSavedView => Boolean(view));
}

export function createDataTableSavedView(
  config: DataTableSavedViewsConfig | undefined,
  name: string,
  state: DataTableState,
) {
  const normalizedName = name.trim();
  if (!config || !normalizedName) {
    return undefined;
  }

  const now = new Date().toISOString();
  const view: DataTableSavedView = {
    id: createSavedViewId(),
    name: normalizedName,
    createdAt: now,
    updatedAt: now,
    state: selectSavedViewSlices(state, config.slices),
  };
  const views = [...readDataTableSavedViews(config), view];
  return writeViews(config, views, "create") ? cloneSavedView(view) : undefined;
}

export function renameDataTableSavedView(
  config: DataTableSavedViewsConfig | undefined,
  id: string,
  name: string,
) {
  const normalizedName = name.trim();
  if (!config || !normalizedName) {
    return undefined;
  }

  let renamed: DataTableSavedView | undefined;
  const views = readDataTableSavedViews(config).map((view) => {
    if (view.id !== id) {
      return view;
    }
    renamed = {
      ...view,
      name: normalizedName,
      updatedAt: new Date().toISOString(),
    };
    return renamed;
  });
  if (!renamed) {
    return undefined;
  }

  return writeViews(config, views, "rename")
    ? cloneSavedView(renamed)
    : undefined;
}

export function deleteDataTableSavedView(
  config: DataTableSavedViewsConfig | undefined,
  id: string,
) {
  if (!config) {
    return false;
  }

  const current = readDataTableSavedViews(config);
  const views = current.filter((view) => view.id !== id);
  return views.length !== current.length && writeViews(config, views, "delete");
}

export function clearDataTableSavedViews(
  config: DataTableSavedViewsConfig | undefined,
) {
  const storage = resolveStorage(config);
  if (!config || !storage) {
    return false;
  }

  try {
    storage.removeItem(getStorageKey(config.key));
  } catch (error) {
    config.onError?.({ error, operation: "remove" });
    return false;
  }
  config.onChange?.([], "clear");
  return true;
}

function writeViews(
  config: DataTableSavedViewsConfig,
  views: Array<DataTableSavedView>,
  operation: DataTableSavedViewsChangeOperation,
) {
  const storage = resolveStorage(config);
  if (!storage) {
    return false;
  }

  let serialized: string;
  try {
    const payload: DataTableSavedViewsPayload = {
      version: config.version ?? DEFAULT_VERSION,
      views,
    };
    serialized = (config.serialize ?? JSON.stringify)(payload);
  } catch (error) {
    config.onError?.({ error, operation: "serialize" });
    return false;
  }

  try {
    storage.setItem(getStorageKey(config.key), serialized);
  } catch (error) {
    config.onError?.({ error, operation: "write" });
    return false;
  }
  const snapshots = views.map(cloneSavedView);
  config.onChange?.(snapshots, operation);
  return true;
}

function selectSavedViewSlices(
  state: DataTableState,
  slices: Array<DataTableSavedViewSlice> | undefined,
) {
  const selected = new Set(slices ?? DEFAULT_SLICES);
  const snapshot: Partial<DataTableState> = {};
  for (const slice of Object.keys(state) as Array<DataTableSavedViewSlice>) {
    if (selected.has(slice)) {
      Object.assign(snapshot, {
        [slice]: cloneStateSlice(slice, state[slice]),
      });
    }
  }
  return snapshot;
}

function validateSavedView(
  value: unknown,
  slices: Array<DataTableSavedViewSlice> | undefined,
): DataTableSavedView | undefined {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !value.id ||
    typeof value.name !== "string" ||
    !value.name.trim() ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string"
  ) {
    return undefined;
  }

  return {
    id: value.id,
    name: value.name.trim(),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    state: validateState(value.state, slices),
  };
}

function validateState(
  value: unknown,
  slices: Array<DataTableSavedViewSlice> | undefined,
) {
  if (!isRecord(value)) {
    return {};
  }

  const selected = new Set(slices ?? DEFAULT_SLICES);
  const state: Partial<DataTableState> = {};
  const sorting = validateSorting(value.sorting);
  if (selected.has("sorting") && sorting) state.sorting = sorting;
  const pagination = validatePagination(value.pagination);
  if (selected.has("pagination") && pagination) state.pagination = pagination;
  const rowSelection = validateBooleanRecord(value.rowSelection);
  if (selected.has("rowSelection") && rowSelection) {
    state.rowSelection = rowSelection;
  }
  const visibility = validateBooleanRecord(value.columnVisibility);
  if (selected.has("columnVisibility") && visibility) {
    state.columnVisibility = visibility;
  }
  const filters = validateFilters(value.columnFilters);
  if (selected.has("columnFilters") && filters) state.columnFilters = filters;
  const expanded =
    value.expanded === true
      ? true
      : validateBooleanRecord(value.expanded);
  if (selected.has("expanded") && expanded !== undefined) {
    state.expanded = expanded;
  }
  const order = validateStringArray(value.columnOrder);
  if (selected.has("columnOrder") && order) state.columnOrder = order;
  const pinning = validatePinning(value.columnPinning);
  if (selected.has("columnPinning") && pinning) {
    state.columnPinning = pinning;
  }
  const rowPinning = validateRowPinning(value.rowPinning);
  if (selected.has("rowPinning") && rowPinning) {
    state.rowPinning = rowPinning;
  }
  const sizing = validateSizingRecord(value.columnSizing);
  if (selected.has("columnSizing") && sizing) state.columnSizing = sizing;
  if (
    selected.has("density") &&
    (value.density === "compact" ||
      value.density === "comfortable" ||
      value.density === "spacious")
  ) {
    state.density = value.density;
  }
  if (
    selected.has("viewMode") &&
    (value.viewMode === "table" || value.viewMode === "card")
  ) {
    state.viewMode = value.viewMode;
  }
  if (selected.has("showHiddenRows") && typeof value.showHiddenRows === "boolean") {
    state.showHiddenRows = value.showHiddenRows;
  }
  if (selected.has("globalFilter") && typeof value.globalFilter === "string") {
    state.globalFilter = value.globalFilter;
  }
  return state;
}

function cloneSavedView(view: DataTableSavedView): DataTableSavedView {
  return {
    ...view,
    state: validateState(view.state, Object.keys(view.state) as Array<DataTableSavedViewSlice>),
  };
}

function cloneStateSlice(
  slice: DataTableSavedViewSlice,
  value: unknown,
) {
  if (Array.isArray(value)) {
    return (value as Array<unknown>).map((item) =>
      isRecord(item) ? { ...item } : item,
    );
  }
  if (isRecord(value)) {
    if (slice === "columnPinning" || slice === "rowPinning") {
      return {
        ...(slice === "columnPinning"
          ? {
              left: Array.isArray(value.left)
                ? [...(value.left as Array<unknown>)]
                : undefined,
              right: Array.isArray(value.right)
                ? [...(value.right as Array<unknown>)]
                : undefined,
            }
          : {
              top: Array.isArray(value.top)
                ? [...(value.top as Array<unknown>)]
                : undefined,
              bottom: Array.isArray(value.bottom)
                ? [...(value.bottom as Array<unknown>)]
                : undefined,
            }),
      };
    }
    return { ...value };
  }
  return value;
}

function validateSorting(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter(
      (item): item is { id: string; desc?: boolean } =>
        isRecord(item) && typeof item.id === "string",
    )
    .map((item) => ({ id: item.id, desc: Boolean(item.desc) }));
}

function validatePagination(value: unknown) {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.pageIndex) ||
    (value.pageIndex as number) < 0 ||
    !Number.isInteger(value.pageSize) ||
    (value.pageSize as number) < 1
  ) {
    return undefined;
  }
  return {
    pageIndex: value.pageIndex as number,
    pageSize: value.pageSize as number,
  };
}

function validateFilters(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter(
      (item): item is { id: string; value: unknown } =>
        isRecord(item) &&
        typeof item.id === "string" &&
        Object.prototype.hasOwnProperty.call(item, "value"),
    )
    .map((item) => ({ id: item.id, value: item.value }));
}

function validatePinning(value: unknown) {
  if (!isRecord(value)) return undefined;
  return {
    left: validateStringArray(value.left) ?? [],
    right: validateStringArray(value.right) ?? [],
  };
}

function validateRowPinning(value: unknown) {
  if (!isRecord(value)) return undefined;
  return {
    top: validateStringArray(value.top) ?? [],
    bottom: validateStringArray(value.bottom) ?? [],
  };
}

function validateBooleanRecord(value: unknown) {
  if (!isRecord(value)) return undefined;
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === "boolean",
    ),
  );
}

function validateSizingRecord(value: unknown) {
  if (!isRecord(value)) return undefined;
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === "number" &&
        Number.isFinite(entry[1]) &&
        entry[1] >= 0,
    ),
  );
}

function validateStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string");
}

function resolveStorage(config: DataTableSavedViewsConfig | undefined) {
  if (!config) {
    return undefined;
  }
  if (config.storage) {
    return config.storage;
  }
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    return window.localStorage;
  } catch (error) {
    config.onError?.({ error, operation: "read" });
    return undefined;
  }
}

function createSavedViewId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  fallbackId += 1;
  return `view-${Date.now().toString(36)}-${fallbackId.toString(36)}`;
}

function getStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
