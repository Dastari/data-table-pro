import { describe, expect, it } from "vitest";
import type { DataTableColumnDef } from "../types";
import {
  getColumnId,
  validateDataTableColumnIds,
} from "./data-table-utils";
import { quantizeDataTableContainerWidth } from "./use-data-table-container-width";

type TestRow = {
  name: string;
  profile: {
    name: string;
  };
};

describe("data table correctness contracts", () => {
  it("uses the same canonical column ids as TanStack Table", () => {
    expect(
      getColumnId<TestRow>({ accessorKey: "profile.name" }, 0),
    ).toBe("profile_name");
    expect(
      getColumnId<TestRow>(
        { accessorFn: (row) => row.name, header: "Display name" },
        0,
      ),
    ).toBe("Display name");
    const missingIdColumn = {
      accessorFn: (row: TestRow) => row.name,
      header: () => "Name",
    } as unknown as DataTableColumnDef<TestRow, unknown>;
    expect(() => getColumnId(missingIdColumn, 0)).toThrow(
      /must define a unique id/i,
    );
  });

  it("rejects duplicate and package-reserved column ids", () => {
    const duplicateColumns: Array<DataTableColumnDef<TestRow, unknown>> = [
      { id: "identity", header: "Identity", columns: [
        { accessorKey: "name", id: "duplicate" },
      ] },
      { accessorKey: "profile.name", id: "duplicate" },
    ];

    expect(() => validateDataTableColumnIds(duplicateColumns)).toThrow(
      'Duplicate data table column id "duplicate".',
    );
    expect(() =>
      validateDataTableColumnIds<TestRow>([
        { accessorKey: "name", id: "__actions__" },
      ]),
    ).toThrow(/reserved for an internal column/i);
  });

  it("switches responsive buckets at the exact package breakpoints", () => {
    expect(quantizeDataTableContainerWidth(0)).toBe(0);
    expect(quantizeDataTableContainerWidth(639.99)).toBe(1);
    expect(quantizeDataTableContainerWidth(640)).toBe(640);
    expect(quantizeDataTableContainerWidth(767.99)).toBe(640);
    expect(quantizeDataTableContainerWidth(768)).toBe(768);
    expect(quantizeDataTableContainerWidth(1023.99)).toBe(768);
    expect(quantizeDataTableContainerWidth(1024)).toBe(1024);
    expect(quantizeDataTableContainerWidth(1536)).toBe(1536);
  });
});
