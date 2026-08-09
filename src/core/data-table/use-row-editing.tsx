import * as React from "react";
import type { CellContext } from "@tanstack/react-table";
import type {
  DataTableColumnDef,
  DataTableColumnType,
  DataTableEditableRowsConfig,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { getDataTableLeafColumns } from "./data-table-utils";

export function useRowEditing<TData>({
  columns,
  editableRows,
  onError,
}: {
  columns: Array<DataTableColumnDef<TData, unknown>>;
  editableRows: DataTableEditableRowsConfig<TData> | undefined;
  onError?: (error: unknown, row: TData) => void;
}) {
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [draftValues, setDraftValues] = React.useState<
    Record<string, unknown>
  >({});
  const draftValuesRef = React.useRef(draftValues);
  const [originalDraftValues, setOriginalDraftValues] = React.useState<
    Record<string, unknown>
  >({});
  const [editErrors, setEditErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);
  const isEditDirty = React.useMemo(
    () => !areDraftValuesEqual(draftValues, originalDraftValues),
    [draftValues, originalDraftValues],
  );

  React.useEffect(() => {
    draftValuesRef.current = draftValues;
  }, [draftValues]);

  const cancelEditing = React.useCallback(() => {
    setEditingRowId(null);
    setDraftValues({});
    setEditErrors({});
    setOriginalDraftValues({});
  }, []);

  const startEditingRow = React.useCallback(
    (row: TData, rowId: string) => {
      const initialValues =
        editableRows?.getInitialValues?.(row) ??
        defaultDraftValues(row, columns);
      setOriginalDraftValues({ ...initialValues });
      setDraftValues(initialValues);
      setEditErrors({});
      setEditingRowId(rowId);
    },
    [columns, editableRows],
  );

  const saveEdit = React.useCallback(
    async (row: TData) => {
      if (!editableRows) {
        return false;
      }

      setIsSavingEdit(true);
      const draftSnapshot = { ...draftValuesRef.current };
      let rollback: (() => void) | undefined;
      try {
        const validation = await editableRows.validateRow?.(
          row,
          draftSnapshot,
        );
        const validationErrors = normalizeEditValidationErrors(validation);
        if (Object.keys(validationErrors).length > 0) {
          setEditErrors(validationErrors);
          return false;
        }

        setEditErrors({});
        const optimisticResult = editableRows.onOptimisticUpdate?.(
          row,
          draftSnapshot,
        );
        rollback =
          typeof optimisticResult === "function"
            ? optimisticResult
            : undefined;
        await editableRows.onSaveRow(row, draftSnapshot);
        editableRows.onSaveSuccess?.(row, draftSnapshot);
        React.startTransition(cancelEditing);
        return true;
      } catch (error) {
        try {
          rollback?.();
        } catch {
          // Preserve the original save error for the public error callbacks.
        }
        editableRows.onSaveError?.(error, row, draftSnapshot);
        onError?.(error, row);
        return false;
      } finally {
        setIsSavingEdit(false);
      }
    },
    [cancelEditing, editableRows, onError],
  );
  const clearEditError = React.useCallback((columnId: string) => {
    setEditErrors((current) => {
      if (!current[columnId] && !current._row) {
        return current;
      }
      const next = { ...current };
      delete next[columnId];
      delete next._row;
      return next;
    });
  }, []);

  return {
    cancelEditing,
    clearEditError,
    draftValues,
    editErrors,
    editingRowId,
    isEditDirty,
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
  return getDataTableLeafColumns(columns).reduce<Record<string, unknown>>(
    (draft, { column }) => {
      if ("accessorKey" in column && typeof column.accessorKey === "string") {
        draft[column.accessorKey] = (row as Record<string, unknown>)[
          column.accessorKey
        ];
      }
      return draft;
    },
    {},
  );
}

export function renderEditableCell<TData>(
  context: CellContext<TData, unknown>,
  draftValues: Record<string, unknown>,
  setDraftValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  components: Pick<DataTableUiKit, "Checkbox" | "Input">,
  editing?: {
    cancel: () => void;
    commit: () => void;
    errors: Record<string, string>;
    isDirty: boolean;
    isPending: boolean;
    cancelOnEscape: boolean;
    commitOnEnter: boolean;
    onValueChange: (columnId: string) => void;
  },
) {
  const { Checkbox, Input } = components;
  const column = context.column.columnDef as DataTableColumnDef<TData, unknown>;
  const meta = column.meta;
  const accessorKey =
    "accessorKey" in column && typeof column.accessorKey === "string"
      ? column.accessorKey
      : context.column.id;
  const draftValue = draftValues[accessorKey];
  const error =
    editing?.errors[accessorKey] ??
    editing?.errors[context.column.id] ??
    editing?.errors._row;
  const setDraftValue = (value: unknown) => {
    editing?.onValueChange(accessorKey);
    setDraftValues((current) => ({
      ...current,
      [accessorKey]: value,
    }));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && editing?.cancelOnEscape) {
      event.preventDefault();
      editing.cancel();
    } else if (
      event.key === "Enter" &&
      !event.shiftKey &&
      editing?.commitOnEnter
    ) {
      event.preventDefault();
      editing.commit();
    }
  };

  if (meta?.renderEditCell) {
    return meta.renderEditCell({
      cell: context,
      row: context.row.original,
      value: context.getValue(),
      draftValue,
      error,
      isDirty: editing?.isDirty ?? false,
      isPending: editing?.isPending ?? false,
      setDraftValue,
    });
  }

  const inputType = getEditableInputType(meta?.type, draftValue);

  if (typeof draftValue === "boolean") {
    return (
      <div className="min-w-0">
        <Checkbox
          aria-invalid={Boolean(error) || undefined}
          checked={draftValue}
          disabled={editing?.isPending}
          onCheckedChange={(checked: boolean | "indeterminate") => {
            setDraftValue(checked === true);
          }}
          onKeyDown={handleKeyDown}
        />
        {error ? (
          <span className="mt-1 block text-xs text-destructive" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <Input
        aria-invalid={Boolean(error) || undefined}
        disabled={editing?.isPending}
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
        onKeyDown={handleKeyDown}
      />
      {error ? (
        <span className="mt-1 block text-xs text-destructive" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function normalizeEditValidationErrors(
  value: void | string | Record<string, string>,
) {
  if (!value) {
    return {};
  }
  return typeof value === "string" ? { _row: value } : value;
}

function areDraftValuesEqual(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return Array.from(keys).every((key) => Object.is(left[key], right[key]));
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
