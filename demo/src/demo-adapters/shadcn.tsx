import * as React from "react";
import { DataTable } from "data-table-pro";
import type { DataTableProps } from "data-table-pro";
import { shadcnUiKit } from "../../../src/adapters/shadcn";

export default function ShadcnDemoDataTable<TData>(
  props: DataTableProps<TData>,
) {
  const TooltipProvider = shadcnUiKit.TooltipProvider ?? React.Fragment;
  return (
    <TooltipProvider>
      <DataTable {...props} />
    </TooltipProvider>
  );
}
