import * as React from "react";
import type { CellContext } from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableColumnType,
  DataTableEditableRowsConfig,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";

export function useRowEditing<TData>({
  columns,
  editableRows,
}: {
  columns: Array<DataTableColumnDef<TData, unknown>>;
  editableRows: DataTableEditableRowsConfig<TData> | undefined;
}) {
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [draftValues, setDraftValues] = React.useState<
    Record<string, unknown>
  >({});
  const draftValuesRef = React.useRef(draftValues);
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);

  React.useEffect(() => {
    draftValuesRef.current = draftValues;
  }, [draftValues]);

  const cancelEditing = React.useCallback(() => {
    setEditingRowId(null);
    setDraftValues({});
  }, []);

  const startEditingRow = React.useCallback(
    (row: TData, rowId: string) => {
      const initialValues =
        editableRows?.getInitialValues?.(row) ??
        defaultDraftValues(row, columns);
      setDraftValues(initialValues);
      setEditingRowId(rowId);
    },
    [columns, editableRows],
  );

  const saveEdit = React.useCallback(
    async (row: TData) => {
      if (!editableRows) {
        return;
      }

      setIsSavingEdit(true);
      try {
        await editableRows.onSaveRow(row, draftValuesRef.current);
        React.startTransition(cancelEditing);
      } finally {
        setIsSavingEdit(false);
      }
    },
    [cancelEditing, editableRows],
  );

  return {
    cancelEditing,
    draftValues,
    editingRowId,
    isSavingEdit,
    saveEdit,
    setDraftValues,
    setEditingRowId,
    startEditingRow,
  };
}

function defaultDraftValues<TData>(
  row: TData,
  columns: Array<DataTableColumnDef<TData, unknown>>,
) {
  return columns.reduce<Record<string, unknown>>((draft, column) => {
    if ("accessorKey" in column && typeof column.accessorKey === "string") {
      draft[column.accessorKey] = (row as Record<string, unknown>)[
        column.accessorKey
      ];
    }
    return draft;
  }, {});
}

export function renderEditableCell<TData>(
  context: CellContext<TData, unknown>,
  draftValues: Record<string, unknown>,
  setDraftValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  components: Pick<DataTableUiKit, "Checkbox" | "Input">,
) {
  const { Checkbox, Input } = components;
  const column = context.column.columnDef as DataTableColumnDef<TData, unknown>;
  const meta = column.meta;
  const accessorKey =
    "accessorKey" in column && typeof column.accessorKey === "string"
      ? column.accessorKey
      : context.column.id;
  const draftValue = draftValues[accessorKey];
  const setDraftValue = (value: unknown) => {
    setDraftValues((current) => ({
      ...current,
      [accessorKey]: value,
    }));
  };

  if (meta?.renderEditCell) {
    return meta.renderEditCell({
      cell: context,
      row: context.row.original,
      value: context.getValue(),
      draftValue,
      setDraftValue,
    });
  }

  const inputType = getEditableInputType(meta?.type, draftValue);

  if (typeof draftValue === "boolean") {
    return (
      <Checkbox
        checked={draftValue}
        onCheckedChange={(checked: boolean | "indeterminate") => {
          setDraftValue(checked === true);
        }}
      />
    );
  }

  return (
    <Input
      type={inputType}
      value={
        meta?.formatEditValue
          ? meta.formatEditValue(draftValue, context)
          : getEditableInputValue(draftValue, inputType)
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value;
        const parsedValue = meta?.parseEditValue
          ? meta.parseEditValue(rawValue, context)
          : parseEditableInputValue(rawValue, inputType, draftValue);
        setDraftValue(parsedValue);
      }}
    />
  );
}

function getEditableInputType(
  type: DataTableColumnType | undefined,
  value: unknown,
) {
  if (type === "numeric" || typeof value === "number") {
    return "number";
  }

  if (type === "date" || value instanceof Date) {
    return "datetime-local";
  }

  return "text";
}

function getEditableInputValue(value: unknown, inputType = "text") {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return inputType === "datetime-local"
      ? value.toISOString().slice(0, 16)
      : value.toISOString();
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  return "";
}

function parseEditableInputValue(
  value: string,
  inputType: string,
  previousValue: unknown,
) {
  if (inputType === "number") {
    return value === "" ? null : Number(value);
  }

  if (inputType === "datetime-local") {
    if (!value) {
      return null;
    }
    return previousValue instanceof Date ? new Date(value) : value;
  }

  return value;
}
