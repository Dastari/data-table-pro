import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  DataTable as ShadcnDataTable,
  type DataTableApi,
  type DataTableColumnDef,
} from "data-table-pro";
import { DataTable as VirtualShadcnDataTable } from "data-table-pro/virtual";
import { DataTable as HeroDataTable } from "data-table-pro/heroui";
import { DataTable as VirtualHeroDataTable } from "data-table-pro/heroui/virtual";
import { DataTable as GridDataTable } from "data-table-pro/thegridcn";
import { DataTable as VirtualGridDataTable } from "data-table-pro/thegridcn/virtual";
import {
  primitiveUiKit,
  type DataTableUiKit,
} from "data-table-pro/advanced";
import {
  createDataTable,
  type DataTableUiKit as StableDataTableUiKit,
} from "data-table-pro/adapter";
import { createVirtualDataTable } from "data-table-pro/adapter/virtual";
import {
  useDataTableUrlState,
  type UseDataTableUrlStateOptions,
} from "data-table-pro/url-state";
import {
  useDataTableDataSource,
  type DataTableDataSource,
} from "data-table-pro/data-source";
import type { DataTableState } from "data-table-pro/types";
import "data-table-pro/styles.css";
import "./styles.css";

type Person = {
  id: string;
  name: string;
};

const columns: Array<DataTableColumnDef<Person>> = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
const rows: Array<Person> = [{ id: "1", name: "Ada" }];
const initialState: Partial<DataTableState> = {
  density: "compact",
};
const advancedUiKit: DataTableUiKit = primitiveUiKit;
const stableUiKit: StableDataTableUiKit = advancedUiKit;
const CustomDataTable = createDataTable(stableUiKit);
const CustomVirtualDataTable = createVirtualDataTable(stableUiKit);
const urlOptions: UseDataTableUrlStateOptions = {
  keyPrefix: "people-",
  enabled: ["columnVisibility"],
};
const dataSource: DataTableDataSource<Person> = () => ({
  rows,
  rowCount: rows.length,
});

function App() {
  const shadcnApi = React.useRef<DataTableApi<Person>>(null);
  const serverRows = useDataTableDataSource<Person>({
    columnFilters: [],
    enabled: false,
    initialData: rows,
    mode: "offset",
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    source: dataSource,
  });

  React.useEffect(() => {
    if (
      typeof useDataTableUrlState !== "function" ||
      typeof useDataTableDataSource !== "function" ||
      !serverRows.tableProps.manualPagination ||
      !urlOptions.keyPrefix ||
      !advancedUiKit.Button
    ) {
      throw new Error("A public package entrypoint was not packaged");
    }
  }, [serverRows.tableProps.manualPagination]);

  return (
    <main>
      <ShadcnDataTable
        apiRef={shadcnApi}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={initialState}
        {...serverRows.tableProps}
      />
      <HeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />
      <GridDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />
      <VirtualShadcnDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        virtualization
      />
      <VirtualHeroDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        virtualization
      />
      <VirtualGridDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        virtualization
      />
      <CustomDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
      />
      <CustomVirtualDataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        virtualization
      />
    </main>
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing root element");
}
createRoot(root).render(<App />);
