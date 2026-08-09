import * as React from "react";
import type { DataTableProps } from "../types";

/** Development-only guardrails for identities used by row models and caches. */
export function useDataTablePerformanceDiagnostics<TData>({
  columns,
  data,
  getRowId,
}: Pick<DataTableProps<TData>, "columns" | "data" | "getRowId">) {
  const previous = React.useRef({ columns, data, getRowId });
  const warned = React.useRef(new Set<string>());

  React.useEffect(() => {
    if (!isDevelopmentEnvironment()) {
      return;
    }

    const last = previous.current;
    if (last.data !== data && !warned.current.has("data")) {
      warn(
        warned.current,
        "data",
        "The data array identity changed. Keep rows immutable and memoize unchanged data so filtering, row models, and virtual measurements can be reused.",
      );
    }
    if (last.columns !== columns && !warned.current.has("columns")) {
      warn(
        warned.current,
        "columns",
        "The columns array identity changed. Memoize stable column definitions so the search index and table column model can be reused.",
      );
    }
    if (last.getRowId !== getRowId && !warned.current.has("getRowId")) {
      warn(
        warned.current,
        "getRowId",
        "getRowId identity changed. Memoize it and return an immutable, unique id to preserve row state and virtual scroll anchoring.",
      );
    }

    const ids = new Set<string>();
    for (let index = 0; index < data.length; index += 1) {
      const id = getRowId(data[index]!, index);
      if (ids.has(id) && !warned.current.has("duplicate-row-id")) {
        warn(
          warned.current,
          "duplicate-row-id",
          `Duplicate row id "${id}" detected. Row ids must be unique and immutable.`,
        );
        break;
      }
      ids.add(id);
    }
    previous.current = { columns, data, getRowId };
  }, [columns, data, getRowId]);
}

function warn(warned: Set<string>, key: string, message: string) {
  warned.add(key);
  console.warn(`[data-table-pro] ${message}`);
}

function isDevelopmentEnvironment() {
  return (
    (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV !== "production"
  );
}
