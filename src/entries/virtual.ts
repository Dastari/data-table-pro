import { shadcnUiKit } from "../adapters/shadcn";
import { createVirtualDataTable } from "../core/data-table/create-virtual-data-table";

export const DataTable = createVirtualDataTable(shadcnUiKit);

export type * from "../core/types";
