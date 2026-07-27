import { heroUiKit } from "../adapters/heroui";
import { createVirtualDataTable } from "../core/data-table/create-virtual-data-table";

export const DataTable = createVirtualDataTable(heroUiKit);

export type * from "../core/types";
