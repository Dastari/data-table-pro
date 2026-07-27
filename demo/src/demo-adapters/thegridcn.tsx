import * as React from "react";
import { DataTable } from "data-table-pro/thegridcn";
import type { DataTableProps } from "data-table-pro";
import { theGridcnUiKit } from "../../../src/adapters/thegridcn";

export default function TheGridcnDemoDataTable<TData>(
  props: DataTableProps<TData>,
) {
  const TooltipProvider = theGridcnUiKit.TooltipProvider ?? React.Fragment;
  return (
    <TooltipProvider>
      <DataTable {...props} />
    </TooltipProvider>
  );
}
