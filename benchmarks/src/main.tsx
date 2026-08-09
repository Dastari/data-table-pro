import * as React from "react";
import { createRoot } from "react-dom/client";
import type { DataTableColumnDef } from "../../src";
import { DataTable } from "../../src";
import "../../styles.css";
import {
  benchmarkScenarios,
  makeBenchmarkRows,
  type BenchmarkScenario,
} from "../fixtures";

declare global {
  interface Window {
    __DTP_BENCHMARK__?: {
      initialRenderMs: number;
      readMetrics: () => {
        domNodes: number;
        heapBytes: number | null;
        longTaskCount: number;
        longTaskMs: number;
      };
    };
  }
}

const scenario = resolveScenario(new URLSearchParams(location.search).get("scenario"));
const rows = makeBenchmarkRows(scenario.rows, scenario.columns);
const columns: Array<DataTableColumnDef<Record<string, string>, unknown>> =
  Array.from({ length: scenario.columns }, (_, index) => ({
    accessorKey: `column-${index}`,
    header: `Column ${index}`,
    size: 160,
  }));
const renderStartedAt = performance.now();
let longTaskCount = 0;
let longTaskMs = 0;

try {
  new PerformanceObserver((entries) => {
    for (const entry of entries.getEntries()) {
      longTaskCount += 1;
      longTaskMs += entry.duration;
    }
  }).observe({ type: "longtask", buffered: true });
} catch {
  // Long Task timing is not exposed by every browser or privacy mode.
}

function Benchmark() {
  React.useEffect(() => {
    window.__DTP_BENCHMARK__ = {
      initialRenderMs: performance.now() - renderStartedAt,
      readMetrics: () => ({
        domNodes: document.querySelectorAll("*").length,
        heapBytes:
          "memory" in performance
            ? (performance as Performance & {
                memory?: { usedJSHeapSize?: number };
              }).memory?.usedJSHeapSize ?? null
            : null,
        longTaskCount,
        longTaskMs,
      }),
    };
  }, []);

  return (
    <main style={{ height: "720px", padding: "16px" }}>
      <h1>Benchmark: {scenario.name}</h1>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        pageSize={scenario.rows}
        rowsPerPageOptions={[scenario.rows]}
        virtualization={{ enabled: true, overscan: 8 }}
      />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Benchmark />);

function resolveScenario(name: string | null): BenchmarkScenario {
  return (
    benchmarkScenarios.find((candidate) => candidate.name === name) ??
    benchmarkScenarios[0]
  );
}
