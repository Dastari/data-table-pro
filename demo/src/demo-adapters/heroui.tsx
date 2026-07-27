import * as React from "react";
import { DataTable } from "data-table-pro/heroui";
import type { DataTableProps } from "data-table-pro";
import { heroUiKit } from "../../../src/adapters/heroui";

export default function HeroUiDemoDataTable<TData>(
  props: DataTableProps<TData>,
) {
  const TooltipProvider = heroUiKit.TooltipProvider ?? React.Fragment;
  return (
    <TooltipProvider>
      <DataTable {...props} />
    </TooltipProvider>
  );
}
