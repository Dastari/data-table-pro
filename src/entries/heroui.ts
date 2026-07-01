import { heroUiKit } from "../adapters/heroui";
import { createDataTable } from "../core/data-table/create-data-table";

export const DataTable = createDataTable(heroUiKit);

export type * from "../core/types";
