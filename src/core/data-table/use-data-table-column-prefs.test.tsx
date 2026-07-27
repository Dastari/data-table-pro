import * as React from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  DataTableColumnPrefs,
  DataTablePersistenceConfig,
  DataTablePersistenceStorage,
} from "../types";
import {
  readDataTableColumnPrefs,
  usePersistDataTableColumnPrefs,
} from "./use-data-table-column-prefs";

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

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("data-table persistence", () => {
  it("reads legacy column preferences and drops invalid fields", () => {
    const storage = new MemoryStorage();
    storage.values.set(
      "data-table-pro:column-prefs:people",
      JSON.stringify({
        visibility: { name: true, secret: "no" },
        sizing: { name: 240, invalid: -1 },
        order: ["name", 3],
        pinning: { left: ["name"], right: [false] },
        density: "compact",
        ignored: "value",
      }),
    );

    expect(
      readDataTableColumnPrefs({
        key: "people",
        storage,
      }),
    ).toEqual({
      visibility: { name: true },
      sizing: { name: 240 },
      order: ["name"],
      pinning: { left: ["name"], right: [] },
      density: "compact",
    });
  });

  it("applies configured slices from a matching versioned payload", () => {
    const storage = new MemoryStorage();
    storage.values.set(
      "data-table-pro:column-prefs:people",
      JSON.stringify({
        version: 3,
        state: {
          visibility: { email: false },
          sizing: { email: 320 },
          density: "spacious",
        },
      }),
    );

    expect(
      readDataTableColumnPrefs({
        key: "people",
        version: 3,
        slices: ["visibility", "density"],
        storage,
      }),
    ).toEqual({
      visibility: { email: false },
      density: "spacious",
    });
  });

  it("migrates version mismatches and reports migration failures", () => {
    const storage = new MemoryStorage();
    const onError = vi.fn();
    storage.values.set(
      "data-table-pro:column-prefs:people",
      JSON.stringify({
        version: 1,
        state: { density: "compact" },
      }),
    );

    const migrate = vi.fn(() => ({
      density: "comfortable" as const,
    }));
    const config: DataTablePersistenceConfig = {
      key: "people",
      version: 2,
      storage,
      migrate,
      onError,
    };

    expect(readDataTableColumnPrefs(config)).toEqual({
      density: "comfortable",
    });
    expect(migrate).toHaveBeenCalledWith(
      {
        version: 1,
        state: { density: "compact" },
      },
      2,
    );
    expect(onError).not.toHaveBeenCalled();

    migrate.mockImplementation(() => {
      throw new Error("Migration failed");
    });
    expect(readDataTableColumnPrefs(config)).toEqual({});
    const errorContext = onError.mock.calls.at(-1)?.[0] as
      | { error: unknown; operation: string }
      | undefined;
    expect(errorContext?.error).toBeInstanceOf(Error);
    expect(errorContext?.operation).toBe("migrate");
  });

  it("debounces writes, selects slices, and skips unchanged payloads", () => {
    vi.useFakeTimers();
    const storage = new MemoryStorage();
    const config: DataTablePersistenceConfig = {
      key: "people",
      version: 4,
      slices: ["visibility", "density"],
      debounceMs: 50,
      storage,
    };

    function Harness({ prefs }: { prefs: DataTableColumnPrefs }) {
      usePersistDataTableColumnPrefs({
        persistence: config,
        prefs,
      });
      return null;
    }

    const firstPrefs: DataTableColumnPrefs = {
      visibility: { email: false },
      sizing: { email: 300 },
      density: "compact",
    };
    const view = render(<Harness prefs={firstPrefs} />);

    expect(storage.setItem).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(
      JSON.parse(
        storage.values.get("data-table-pro:column-prefs:people") ?? "",
      ),
    ).toEqual({
      version: 4,
      state: {
        visibility: { email: false },
        density: "compact",
      },
    });

    view.rerender(
      <Harness
        prefs={{
          visibility: { email: false },
          sizing: { email: 480 },
          density: "compact",
        }}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("reports serialization and storage failures without throwing", () => {
    vi.useFakeTimers();
    const error = new Error("Storage failed");
    const onError = vi.fn();
    const storage: DataTablePersistenceStorage = {
      getItem: () => null,
      setItem: () => {
        throw error;
      },
      removeItem: () => {},
    };

    function Harness() {
      usePersistDataTableColumnPrefs({
        persistence: {
          key: "people",
          debounceMs: 0,
          storage,
          onError,
        },
        prefs: { density: "compact" },
      });
      return null;
    }

    expect(() => render(<Harness />)).not.toThrow();
    act(() => {
      vi.runAllTimers();
    });
    expect(onError).toHaveBeenCalledWith({
      error,
      operation: "write",
    });
  });
});
