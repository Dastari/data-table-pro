import * as React from "react";
import { act } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable as ShadcnDataTable } from "../../index";
import { DataTable as HeroDataTable } from "../../entries/heroui";
import { DataTable as VirtualHeroDataTable } from "../../entries/heroui-virtual";
import { DataTable as GridDataTable } from "../../entries/thegridcn";
import { DataTable as VirtualGridDataTable } from "../../entries/thegridcn-virtual";
import { DataTable as VirtualShadcnDataTable } from "../../entries/virtual";
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

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe.each([
  ["shadcn", ShadcnDataTable],
  ["virtual shadcn", VirtualShadcnDataTable],
  ["HeroUI", HeroDataTable],
  ["virtual HeroUI", VirtualHeroDataTable],
  ["The Gridcn", GridDataTable],
  ["virtual The Gridcn", VirtualGridDataTable],
])("DataTable SSR (%s)", (_adapter, DataTable) => {
  it("renders table content without browser effects", () => {
    const html = renderToString(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        virtualization={_adapter.startsWith("virtual")}
      />,
    );

    expect(html).toContain("Ada");
    expect(html).toContain('data-dtp-slot="data-table-root"');
  });

  it("hydrates its server markup without mismatch errors", async () => {
    const element = (
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        virtualization={_adapter.startsWith("virtual")}
      />
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(element);
    document.body.append(container);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: Root | undefined;

    await act(async () => {
      root = hydrateRoot(container, element);
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Ada");
    expect(
      error.mock.calls.filter((call) =>
        call.some(
          (value) =>
            typeof value === "string" &&
            /hydration|did not match|server rendered/i.test(value),
        ),
      ),
    ).toEqual([]);

    act(() => {
      root?.unmount();
    });
  });
});
