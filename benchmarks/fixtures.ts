export const benchmarkScenarios = [
  { name: "rows-1k", rows: 1_000, columns: 20 },
  { name: "rows-10k", rows: 10_000, columns: 20 },
  { name: "rows-50k", rows: 50_000, columns: 20 },
  { name: "rows-100k", rows: 100_000, columns: 20 },
  { name: "columns-20", rows: 1_000, columns: 20 },
  { name: "columns-100", rows: 1_000, columns: 100 },
  { name: "columns-500", rows: 1_000, columns: 500 },
] as const;

export type BenchmarkScenario = (typeof benchmarkScenarios)[number];

export function makeBenchmarkRows(rowCount: number, columnCount: number) {
  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row: Record<string, string> = { id: `row-${rowIndex}` };
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      row[`column-${columnIndex}`] =
        `Row ${rowIndex} column ${columnIndex} searchable ${rowIndex % 97}`;
    }
    return row;
  });
}
