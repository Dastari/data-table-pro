import { useDataTableAutoPageSize } from "./use-data-table-auto-page-size";

export default function DataTableAutoPageSize(
  props: Parameters<typeof useDataTableAutoPageSize>[0],
) {
  useDataTableAutoPageSize(props);
  return null;
}
