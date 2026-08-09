import * as React from "react";
import type {
  DataTableColumnPrefs,
  DataTableDensity,
  DataTablePersistenceConfig,
  DataTablePersistencePayload,
  DataTablePersistenceSlice,
  DataTablePersistenceStorage,
} from "../types";
import type { RowPinningState } from "@tanstack/react-table";

const STORAGE_PREFIX = "data-table-pro:column-prefs:";
const DEFAULT_VERSION = 1;
const ALL_SLICES: Array<DataTablePersistenceSlice> = [
  "visibility",
  "sizing",
  "order",
  "pinning",
  "rowPinning",
  "density",
];

export function readDataTableColumnPrefs(
  input: string | DataTablePersistenceConfig | undefined,
): DataTableColumnPrefs {
  const config = resolvePersistenceConfig(input);
  if (!config) {
    return {};
  }

  const storage = resolveStorage(config);
  if (!storage) {
    return {};
  }
  const storageKey = getStorageKey(config.key);

  let value: string | null;
  try {
    value = storage.getItem(storageKey);
  } catch (error) {
    config.onError?.({ error, operation: "read" });
    return {};
  }
  if (!value) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = (config.deserialize ?? JSON.parse)(value);
  } catch (error) {
    config.onError?.({ error, operation: "deserialize" });
    return {};
  }

  const targetVersion = config.version ?? DEFAULT_VERSION;
  let candidate: unknown;
  if (isPersistencePayload(parsed)) {
    if (parsed.version === targetVersion) {
      candidate = parsed.state;
    } else if (config.migrate) {
      try {
        candidate = config.migrate(
          {
            version: parsed.version,
            state: parsed.state,
          },
          targetVersion,
        );
      } catch (error) {
        config.onError?.({ error, operation: "migrate" });
        return {};
      }
    } else {
      return {};
    }
  } else {
    // Raw objects are the legacy columnPrefsKey format. They are validated and
    // upgraded to a versioned envelope on the next successful write.
    candidate = parsed;
  }

  return selectPersistenceSlices(
    validateDataTableColumnPrefs(candidate),
    config.slices,
  );
}

export function clearDataTableColumnPrefs(
  input: string | DataTablePersistenceConfig | undefined,
) {
  const config = resolvePersistenceConfig(input);
  if (!config) {
    return false;
  }

  const storage = resolveStorage(config);
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(getStorageKey(config.key));
    return true;
  } catch (error) {
    config.onError?.({ error, operation: "remove" });
    return false;
  }
}

export function usePersistDataTableColumnPrefs({
  key,
  persistence,
  prefs,
}: {
  key?: string;
  persistence?: DataTablePersistenceConfig;
  prefs: DataTableColumnPrefs;
}) {
  const config = persistence ?? resolvePersistenceConfig(key);
  const storage = config ? resolveStorage(config) : undefined;
  const storageKey = config ? getStorageKey(config.key) : undefined;
  const version = config?.version ?? DEFAULT_VERSION;
  const debounceMs = Math.max(0, config?.debounceMs ?? 100);
  const selectedState = selectPersistenceSlices(prefs, config?.slices);
  const serialized = React.useMemo(() => {
    if (!config) {
      return { value: undefined };
    }

    try {
      const payload: DataTablePersistencePayload = {
        version,
        state: selectedState,
      };
      return {
        value: (config.serialize ?? JSON.stringify)(payload),
      };
    } catch (error) {
      return { error, value: undefined };
    }
  }, [config, selectedState, version]);
  const onErrorEvent = React.useEffectEvent(
    (
      error: unknown,
      operation: "serialize" | "write",
    ) => {
      config?.onError?.({ error, operation });
    },
  );

  React.useEffect(() => {
    if (serialized.error !== undefined) {
      onErrorEvent(serialized.error, "serialize");
    }
  }, [serialized.error]);

  React.useEffect(() => {
    if (!storage || !storageKey || serialized.value === undefined) {
      return;
    }

    const write = () => {
      try {
        if (storage.getItem(storageKey) === serialized.value) {
          return;
        }
        storage.setItem(storageKey, serialized.value);
      } catch (error) {
        onErrorEvent(error, "write");
      }
    };

    if (debounceMs === 0) {
      write();
      return;
    }

    const timeout = globalThis.setTimeout(write, debounceMs);
    return () => {
      globalThis.clearTimeout(timeout);
    };
  }, [debounceMs, serialized.value, storage, storageKey]);
}

function resolvePersistenceConfig(
  input: string | DataTablePersistenceConfig | undefined,
): DataTablePersistenceConfig | undefined {
  if (!input) {
    return undefined;
  }

  return typeof input === "string" ? { key: input } : input;
}

function resolveStorage(
  config: DataTablePersistenceConfig,
): DataTablePersistenceStorage | undefined {
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

function getStorageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function isPersistencePayload(
  value: unknown,
): value is { version: unknown; state: unknown } {
  return (
    isRecord(value) &&
    Object.prototype.hasOwnProperty.call(value, "version") &&
    Object.prototype.hasOwnProperty.call(value, "state")
  );
}

function selectPersistenceSlices(
  prefs: DataTableColumnPrefs,
  slices: Array<DataTablePersistenceSlice> | undefined,
) {
  const selected = new Set(slices ?? ALL_SLICES);
  const result: DataTableColumnPrefs = {};

  for (const slice of ALL_SLICES) {
    if (selected.has(slice) && prefs[slice] !== undefined) {
      Object.assign(result, { [slice]: prefs[slice] });
    }
  }

  return result;
}

function validateDataTableColumnPrefs(value: unknown): DataTableColumnPrefs {
  if (!isRecord(value)) {
    return {};
  }

  const prefs: DataTableColumnPrefs = {};
  const visibility = validateBooleanRecord(value.visibility);
  if (visibility) {
    prefs.visibility = visibility;
  }
  const sizing = validateSizingRecord(value.sizing);
  if (sizing) {
    prefs.sizing = sizing;
  }
  const order = validateStringArray(value.order);
  if (order) {
    prefs.order = order;
  }
  if (isRecord(value.pinning)) {
    const left = validateStringArray(value.pinning.left) ?? [];
    const right = validateStringArray(value.pinning.right) ?? [];
    prefs.pinning = { left, right };
  }
  const rowPinning = validateRowPinning(value.rowPinning);
  if (rowPinning) {
    prefs.rowPinning = rowPinning;
  }
  if (isDataTableDensity(value.density)) {
    prefs.density = value.density;
  }

  return prefs;
}

function validateBooleanRecord(value: unknown) {
  if (!isRecord(value)) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === "boolean",
    ),
  );
}

function validateSizingRecord(value: unknown) {
  if (!isRecord(value)) {
    return undefined;
  }

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
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item): item is string => typeof item === "string");
}

function validateRowPinning(value: unknown): RowPinningState | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    top: validateStringArray(value.top) ?? [],
    bottom: validateStringArray(value.bottom) ?? [],
  };
}

function isDataTableDensity(value: unknown): value is DataTableDensity {
  return (
    value === "compact" ||
    value === "comfortable" ||
    value === "spacious"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
