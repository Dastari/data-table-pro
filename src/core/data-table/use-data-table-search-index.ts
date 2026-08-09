import * as React from "react";
import type { FilterFn, Row } from "@tanstack/react-table";
import { normalizeDataTableSearchText } from "./data-table-utils";

/**
 * Caches each searchable cell against the application-owned row object and
 * stable column id. WeakMap entries disappear with immutable rows and never
 * retain removed data. Mutable rows are deliberately unsupported because a
 * cache cannot safely observe deep changes without defeating its purpose.
 */
export function useDataTableSearchIndex<TData>(
) {
  // eslint-disable-next-line react-hooks/immutability -- This weak cache is deliberately populated by TanStack's filter pass, never read during React render.
  return React.useMemo<FilterFn<TData>>(() => {
    const valuesByRow = new WeakMap<object, Map<string, string>>();

    return (row: Row<TData>, columnId: string, filterValue: unknown) => {
      const query = normalizeDataTableSearchText(filterValue);
      if (!query) {
        return true;
      }

      const original = row.original;
      if (typeof original !== "object" || original === null) {
        return normalizeDataTableSearchText(row.getValue(columnId)).includes(
          query,
        );
      }

      let valuesByColumn = valuesByRow.get(original);
      if (!valuesByColumn) {
        valuesByColumn = new Map();
        valuesByRow.set(original, valuesByColumn);
      }

      let text = valuesByColumn.get(columnId);
      if (text === undefined) {
        const value = row.getValue(columnId);
        text = normalizeDataTableSearchText(value);
        valuesByColumn.set(columnId, text);
      }

      return text.includes(query);
    };
  }, []);
}
