import { shadcnUiKit } from "./adapters/shadcn";
import { createDataTable } from "./core/data-table/create-data-table";

export const DataTable = createDataTable(shadcnUiKit);

export type * from "./core/types";
