import * as React from "react";
import { IconDots, IconEdit, IconX } from "../icons";
import type {
  DataTableEditableRowsConfig,
  DataTableLabels,
  DataTableRowAction,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { canEditRow, canUseRowAction, resolveRowActionLabel } from "../types";

type DataTableRowActionsProps<TData> = {
  row: TData;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  labels: DataTableLabels;
};

export function createDataTableRowActions(ui: DataTableUiKit) {
  const {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } = ui;

  return function DataTableRowActions<TData>({
    row,
    rowActions,
    editableRows,
    isEditing,
    onStartEditing,
    onCancelEditing,
    labels,
  }: DataTableRowActionsProps<TData>) {
    const actions = rowActions.filter((action) => canUseRowAction(action, row));
    const stopRowClickPropagation = React.useCallback(
      (event: React.SyntheticEvent) => {
        event.stopPropagation();
      },
      [],
    );

    if (isEditing) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onPointerDown={stopRowClickPropagation}
              onClick={onCancelEditing}
            >
              <IconX />
              <span className="sr-only">{labels.cancelEdit}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{labels.cancelEdit}</TooltipContent>
        </Tooltip>
      );
    }

    const allowEdit = canEditRow(editableRows, row);
    if (!actions.length && !allowEdit) {
      return null;
    }

    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onPointerDown={stopRowClickPropagation}
                onClick={stopRowClickPropagation}
              >
                <IconDots />
                <span className="sr-only">{labels.rowActions}</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{labels.rowActions}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-52">
          {allowEdit ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();
                  onStartEditing();
                }}
              >
                <IconEdit data-icon="inline-start" />
                {labels.editRow}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : null}
          {allowEdit && actions.length ? <DropdownMenuSeparator /> : null}
          {actions.length ? (
            <DropdownMenuGroup>
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <DropdownMenuItem
                    key={action.key}
                    disabled={action.disabled?.(row)}
                    variant={action.variant === "destructive" ? "destructive" : undefined}
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      event.stopPropagation();
                      void action.onClick(row);
                    }}
                  >
                    {Icon ? <Icon data-icon="inline-start" /> : null}
                    {resolveRowActionLabel(action.label, row)}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
}
