import type { DataTableUiKit } from "../ui-kit";
import { createDataTableWithPanels } from "./create-data-table";
import { DataTableVirtualCardPanel } from "./data-table-virtual-card-panel";
import { DataTableVirtualTablePanel } from "./data-table-virtual-table-panel";

export function createVirtualDataTable(ui: DataTableUiKit) {
  return createDataTableWithPanels(ui, {
    CardPanel: DataTableVirtualCardPanel,
    TablePanel: DataTableVirtualTablePanel,
  });
}
