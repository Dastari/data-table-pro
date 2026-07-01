import * as React from "react";
import type { DataTableColumnPrefs } from "../types";

const STORAGE_PREFIX = "data-table-pro:column-prefs:";

export function readDataTableColumnPrefs(
  key: string | undefined,
): DataTableColumnPrefs {
  if (!key || typeof window === "undefined") {
    return {};
  }

  try {
    const value = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!value) {
      return {};
    }

    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as DataTableColumnPrefs)
      : {};
  } catch {
    return {};
  }
}

export function usePersistDataTableColumnPrefs({
  key,
  prefs,
}: {
  key: string | undefined;
  prefs: DataTableColumnPrefs;
}) {
  React.useEffect(() => {
    if (!key || typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(prefs),
      );
    } catch {
      // Persistence is best-effort and should never break table rendering.
    }
  }, [key, prefs]);
}
