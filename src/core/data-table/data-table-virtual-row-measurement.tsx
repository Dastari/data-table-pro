import * as React from "react";

const DataTableVirtualRowMeasurementContext = React.createContext<
  ((element: HTMLTableRowElement | null) => void) | undefined
>(undefined);

export function DataTableVirtualRowMeasurementProvider({
  children,
  measureRow,
}: {
  children: React.ReactNode;
  measureRow: ((element: HTMLTableRowElement | null) => void) | undefined;
}) {
  return (
    <DataTableVirtualRowMeasurementContext.Provider value={measureRow}>
      {children}
    </DataTableVirtualRowMeasurementContext.Provider>
  );
}

export function useDataTableVirtualRowMeasurement():
  | ((element: HTMLTableRowElement | null) => void)
  | undefined {
  return React.useContext(DataTableVirtualRowMeasurementContext);
}
