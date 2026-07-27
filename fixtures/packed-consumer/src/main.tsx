import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  DataTable as ShadcnDataTable,
  type DataTableApi,
  type DataTableColumnDef,
} from "data-table-pro";
import { DataTable as HeroDataTable } from "data-table-pro/heroui";
import { DataTable as GridDataTable } from "data-table-pro/thegridcn";
import {
  primitiveUiKit,
  type DataTableUiKit,
} from "data-table-pro/advanced";
import {
  useDataTableUrlState,
  type UseDataTableUrlStateOptions,
} from "data-table-pro/url-state";
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
const urlOptions: UseDataTableUrlStateOptions = {
  keyPrefix: "people-",
  enabled: ["columnVisibility"],
};

function App() {
  const shadcnApi = React.useRef<DataTableApi<Person>>(null);

  React.useEffect(() => {
    if (
      typeof useDataTableUrlState !== "function" ||
      !urlOptions.keyPrefix ||
      !advancedUiKit.Button
    ) {
      throw new Error("A public package entrypoint was not packaged");
    }
  }, []);

  return (
    <main>
      <ShadcnDataTable
        apiRef={shadcnApi}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        initialState={initialState}
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
    </main>
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing root element");
}
createRoot(root).render(<App />);
