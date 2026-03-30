import * as React from "react";
import { IconDots, IconEdit, IconX } from "@tabler/icons-react";
import type { DataTableEditableRowsConfig, DataTableRowAction } from "./types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { canEditRow, canUseRowAction, resolveRowActionLabel } from "./types";

type DataTableRowActionsProps<TData> = {
  row: TData;
  rowActions: Array<DataTableRowAction<TData>>;
  editableRows?: DataTableEditableRowsConfig<TData>;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
};

export function DataTableRowActions<TData>({
  row,
  rowActions,
  editableRows,
  isEditing,
  onStartEditing,
  onCancelEditing,
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
            <span className="sr-only">Cancel editing</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cancel editing</TooltipContent>
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
              <span className="sr-only">Open row actions</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Row actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-52">
        {allowEdit ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onStartEditing();
              }}
            >
              <IconEdit data-icon="inline-start" />
              Edit row
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
        {allowEdit && actions.length ? <DropdownMenuSeparator /> : null}
        {actions.length ? (
          <DropdownMenuGroup>
            {actions.map((action) => {
              const Icon = action.icon;
              const destructive = action.variant === "destructive";
              return (
                <DropdownMenuItem
                  key={action.key}
                  disabled={action.disabled?.(row)}
                  className={
                    destructive
                      ? "text-destructive focus:text-destructive"
                      : undefined
                  }
                  onClick={(event) => {
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
}
