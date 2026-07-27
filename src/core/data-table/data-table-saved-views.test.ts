import { describe, expect, it, vi } from "vitest";
import type {
  DataTablePersistenceStorage,
  DataTableSavedViewsConfig,
} from "../types";
import { readDataTableSavedViews } from "./data-table-saved-views";

class MemoryStorage implements DataTablePersistenceStorage {
  values = new Map<string, string>();
  getItem = vi.fn((key: string) => this.values.get(key) ?? null);
  setItem = vi.fn((key: string, value: string) => {
    this.values.set(key, value);
  });
  removeItem = vi.fn((key: string) => {
    this.values.delete(key);
  });
}

describe("data table saved-view persistence", () => {
  it("validates migrated views and applies configured slices", () => {
    const storage = new MemoryStorage();
    storage.values.set(
      "data-table-pro:saved-views:people",
      JSON.stringify({
        version: 1,
        views: [{ legacy: true }],
      }),
    );
    const migrate = vi.fn<
      NonNullable<DataTableSavedViewsConfig["migrate"]>
    >(
      () => [
        {
          id: "valid",
          name: "Operations",
          createdAt: "2026-07-27T00:00:00.000Z",
          updatedAt: "2026-07-27T00:00:00.000Z",
          state: {
            density: "compact",
            columnVisibility: { email: false },
            rowSelection: { "row-1": true },
          },
        },
        {
          id: "",
          name: "Invalid",
          createdAt: "",
          updatedAt: "",
          state: {},
        },
      ],
    );
    const config: DataTableSavedViewsConfig = {
      key: "people",
      version: 2,
      storage,
      slices: ["density", "columnVisibility"],
      migrate,
    };

    expect(readDataTableSavedViews(config)).toEqual([
      {
        id: "valid",
        name: "Operations",
        createdAt: "2026-07-27T00:00:00.000Z",
        updatedAt: "2026-07-27T00:00:00.000Z",
        state: {
          density: "compact",
          columnVisibility: { email: false },
        },
      },
    ]);
    expect(migrate).toHaveBeenCalledWith(
      {
        version: 1,
        views: [{ legacy: true }],
      },
      2,
    );
  });

  it("reports malformed codecs and migration failures without throwing", () => {
    const storage = new MemoryStorage();
    const onError = vi.fn();
    storage.values.set("data-table-pro:saved-views:people", "{invalid");
    const config: DataTableSavedViewsConfig = {
      key: "people",
      storage,
      onError,
    };

    expect(readDataTableSavedViews(config)).toEqual([]);
    let errorContext = onError.mock.calls.at(-1)?.[0] as
      | { error: unknown; operation: string }
      | undefined;
    expect(errorContext?.error).toBeInstanceOf(SyntaxError);
    expect(errorContext?.operation).toBe("deserialize");

    storage.values.set(
      "data-table-pro:saved-views:people",
      JSON.stringify({ version: 1, views: [] }),
    );
    config.version = 2;
    config.migrate = () => {
      throw new Error("Migration failed");
    };
    expect(readDataTableSavedViews(config)).toEqual([]);
    errorContext = onError.mock.calls.at(-1)?.[0] as
      | { error: unknown; operation: string }
      | undefined;
    expect(errorContext?.error).toBeInstanceOf(Error);
    expect(errorContext?.operation).toBe("migrate");
  });
});
