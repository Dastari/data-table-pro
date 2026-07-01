import { theGridcnUiKit } from "../adapters/thegridcn";
import { createDataTable } from "../core/data-table/create-data-table";

export const DataTable = createDataTable(theGridcnUiKit);

export type * from "../core/types";
