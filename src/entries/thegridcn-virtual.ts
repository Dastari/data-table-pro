import { theGridcnUiKit } from "../adapters/thegridcn";
import { createVirtualDataTable } from "../core/data-table/create-virtual-data-table";

export const DataTable = createVirtualDataTable(theGridcnUiKit);

export type * from "../core/types";
