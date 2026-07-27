import * as React from "react";
import { DataTableBaseCardPanel } from "./data-table-base-card-panel";
import type { DataTableCardPanelProps } from "./data-table-card-panel-types";

const LazyDataTableVirtualCardPanel = React.lazy(async () => {
  const module = await import("./data-table-virtual-card-panel");
  return { default: module.DataTableVirtualCardPanel };
}) as unknown as typeof DataTableBaseCardPanel;

export function DataTableCardPanel<TData>(
  props: DataTableCardPanelProps<TData>,
) {
  const config =
    typeof props.virtualization === "object"
      ? props.virtualization.card
      : undefined;

  if (config?.enabled !== true) {
    return <DataTableBaseCardPanel {...props} />;
  }

  return (
    <React.Suspense fallback={<DataTableBaseCardPanel {...props} />}>
      <LazyDataTableVirtualCardPanel {...props} />
    </React.Suspense>
  );
}

export type { DataTableCardPanelProps };
