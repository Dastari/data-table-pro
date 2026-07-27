import * as React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DataTable as ShadcnDataTable } from "../../index";
import { DataTable as HeroDataTable } from "../../entries/heroui";
import { DataTable as GridDataTable } from "../../entries/thegridcn";
import type { DataTableColumnDef } from "../types";

type TestRow = {
  id: string;
  name: string;
};

const columns: Array<DataTableColumnDef<TestRow, unknown>> = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
const rows = [{ id: "1", name: "Ada" }];

describe.each([
  ["shadcn", ShadcnDataTable],
  ["HeroUI", HeroDataTable],
  ["The Gridcn", GridDataTable],
])("DataTable SSR (%s)", (_adapter, DataTable) => {
  it("renders table content without browser effects", () => {
    const html = renderToString(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />,
    );

    expect(html).toContain("Ada");
    expect(html).toContain('data-dtp-slot="data-table-root"');
  });
});
