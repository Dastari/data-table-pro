import * as React from "react";
import { DataTableTablePanel } from "./data-table-table-panel";
import type { DataTableTablePanelProps } from "./data-table-table-panel";

const LazyDataTableVirtualTablePanel = React.lazy(async () => {
  const module = await import("./data-table-virtual-table-panel");
  return { default: module.DataTableVirtualTablePanel };
}) as unknown as typeof DataTableTablePanel;

export function DataTableTablePanelRouter<TData>(
  props: DataTableTablePanelProps<TData>,
) {
  const config =
    typeof props.virtualization === "object"
      ? props.virtualization
      : undefined;
  const enabled =
    props.virtualization === true || config?.enabled === true;

  if (!enabled) {
    return <DataTableTablePanel {...props} />;
  }

  return (
    <React.Suspense fallback={<DataTableTablePanel {...props} />}>
      <LazyDataTableVirtualTablePanel {...props} />
    </React.Suspense>
  );
}
