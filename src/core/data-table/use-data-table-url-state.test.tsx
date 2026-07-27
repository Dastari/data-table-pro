import * as React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  NuqsTestingAdapter,
  type OnUrlUpdateFunction,
  type UrlUpdateEvent,
} from "nuqs/adapters/testing";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  useDataTableUrlState,
  type UseDataTableUrlStateOptions,
} from "./use-data-table-url-state";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useDataTableUrlState", () => {
  it("decodes expanded state only for explicitly enabled slices", () => {
    const searchParams = {
      dtv: "2",
      dtfilters: JSON.stringify([{ id: "status", value: ["active"] }]),
      dtvisibility: JSON.stringify({ email: false }),
      dtdensity: "compact",
      dtcolumns: JSON.stringify(["name", "email"]),
      dtpinning: JSON.stringify({ left: ["name"], right: [] }),
      dtgrouping: JSON.stringify(["department"]),
      dtselection: JSON.stringify({ "row-1": true }),
    };
    const options: UseDataTableUrlStateOptions = {
      keyPrefix: "dt",
      version: 2,
      enabled: [
        "columnFilters",
        "columnVisibility",
        "density",
        "columnOrder",
        "columnPinning",
        "grouping",
      ],
    };
    renderHarness(options, searchParams);

    expect(readState()).toMatchObject({
      columnFilters: [{ id: "status", value: ["active"] }],
      columnVisibility: { email: false },
      density: "compact",
      columnOrder: ["name", "email"],
      columnPinning: { left: ["name"], right: [] },
      grouping: ["department"],
      rowSelection: {},
    });
    expect(readState().tableState.rowSelection).toBeUndefined();
  });

  it("writes versioned filter and selection state and resets the page", async () => {
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
    const options: UseDataTableUrlStateOptions = {
      keyPrefix: "dt",
      version: 3,
      enabled: ["columnFilters", "rowSelection"],
    };
    renderHarness(
      options,
      { dtpage: "4" },
      {
        hasMemory: true,
        onUrlUpdate,
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Set filters" }));
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    let event: UrlUpdateEvent | undefined =
      onUrlUpdate.mock.calls.at(-1)?.[0];
    let params = event?.searchParams ?? new URLSearchParams();
    expect(params.get("dtv")).toBe("3");
    expect(JSON.parse(params.get("dtfilters") ?? "")).toEqual([
      { id: "status", value: "active" },
    ]);
    expect(params.get("dtpage")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Set selection" }));
    await waitFor(() => {
      const latestEvent: UrlUpdateEvent | undefined =
        onUrlUpdate.mock.calls.at(-1)?.[0];
      const latest = latestEvent?.searchParams ?? new URLSearchParams();
      expect(latest.get("dtselection")).not.toBeNull();
    });
    event = onUrlUpdate.mock.calls.at(-1)?.[0];
    params = event?.searchParams ?? new URLSearchParams();
    expect(JSON.parse(params.get("dtselection") ?? "")).toEqual({
      "row-1": true,
    });
  });

  it("migrates mismatched enhanced state and safely discards it without a migration", () => {
    const migrate = vi.fn(
      (payload: Parameters<
        NonNullable<UseDataTableUrlStateOptions["migrate"]>
      >[0]) => ({
        columnVisibility: payload.state.columnVisibility,
        density: "spacious" as const,
      }),
    );
    const searchParams = {
      dtv: "1",
      dtvisibility: JSON.stringify({ legacy: false }),
      dtdensity: "compact",
    };
    const options: UseDataTableUrlStateOptions = {
      keyPrefix: "dt",
      version: 2,
      enabled: ["columnVisibility", "density"],
      migrate,
    };
    const view = renderHarness(options, searchParams);

    expect(readState()).toMatchObject({
      columnVisibility: { legacy: false },
      density: "spacious",
    });
    expect(migrate).toHaveBeenCalledWith(
      {
        version: "1",
        state: {
          columnVisibility: { legacy: false },
          density: "compact",
        },
      },
      2,
    );

    view.unmount();
    renderHarness(
      {
        keyPrefix: "dt",
        version: 2,
        enabled: ["columnVisibility", "density"],
      },
      searchParams,
    );
    expect(readState()).toMatchObject({
      columnVisibility: {},
      density: "comfortable",
    });
  });

  it("keeps legacy multi-sort and single-sort URL decoding compatible", () => {
    const view = renderHarness(
      { keyPrefix: "dt" },
      {
        dtsort: JSON.stringify([
          { id: "name", desc: true },
          { id: "email", desc: false },
        ]),
      },
    );
    expect(readState().sorting).toEqual([
      { id: "name", desc: true },
      { id: "email", desc: false },
    ]);

    view.unmount();
    renderHarness(
      { keyPrefix: "dt" },
      { dtsort: "name", dtorder: "desc" },
    );
    expect(readState().sorting).toEqual([{ id: "name", desc: true }]);
  });
});

function Harness({ options }: { options: UseDataTableUrlStateOptions }) {
  const state = useDataTableUrlState(options);
  return (
    <>
      <output data-testid="state">{JSON.stringify(state)}</output>
      <button
        type="button"
        onClick={() =>
          state.setColumnFilters([{ id: "status", value: "active" }])
        }
      >
        Set filters
      </button>
      <button
        type="button"
        onClick={() => state.setRowSelection({ "row-1": true })}
      >
        Set selection
      </button>
    </>
  );
}

function renderHarness(
  options: UseDataTableUrlStateOptions,
  searchParams?: Record<string, string>,
  adapterOptions?: {
    hasMemory?: boolean;
    onUrlUpdate?: OnUrlUpdateFunction;
  },
) {
  return render(
    <NuqsTestingAdapter
      searchParams={searchParams}
      hasMemory={adapterOptions?.hasMemory}
      onUrlUpdate={adapterOptions?.onUrlUpdate}
    >
      <Harness options={options} />
    </NuqsTestingAdapter>,
  );
}

function readState() {
  return JSON.parse(screen.getByTestId("state").textContent ?? "{}") as {
    sorting: Array<{ id: string; desc: boolean }>;
    columnFilters: Array<{ id: string; value: unknown }>;
    columnVisibility: Record<string, boolean>;
    density: string;
    columnOrder: Array<string>;
    columnPinning: { left?: Array<string>; right?: Array<string> };
    grouping: Array<string>;
    rowSelection: Record<string, boolean>;
    tableState: Record<string, unknown>;
  };
}
