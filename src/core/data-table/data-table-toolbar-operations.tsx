import * as React from "react";
import { IconSearch } from "../icons";
import type {
  DataTableColumnFixed,
  DataTableColumnVisibilityOption,
  DataTableLabels,
  DataTableSavedView,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import type { DataTableTanStackTable as Table } from "./tanstack-v9";

type ToolbarUi = Pick<
  DataTableUiKit,
  | "Button"
  | "DropdownMenuCheckboxItem"
  | "DropdownMenuGroup"
  | "DropdownMenuItem"
  | "DropdownMenuLabel"
  | "DropdownMenuSeparator"
  | "InputGroup"
  | "InputGroupAddon"
  | "InputGroupInput"
>;

type ActiveFilter = { id: string; label: string; value: unknown };

type ToolbarDataOperationsProps = {
  placement: "menu" | "chips";
  ui: ToolbarUi;
  labels: Required<DataTableLabels>;
  enableColumnChooser: boolean;
  enableFilterChips: boolean;
  enableResetLayout: boolean;
  enableSavedViews: boolean;
  enableColumnPinning: boolean;
  columnVisibilityOptions: Array<DataTableColumnVisibilityOption>;
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  onColumnPinningChange: (
    columnId: string,
    side: DataTableColumnFixed | false,
  ) => void;
  reorderColumn: (sourceColumnId: string, targetColumnId: string) => void;
  table: Table<unknown>;
  onResetColumnLayout: () => void;
  savedViews: Array<DataTableSavedView>;
  onCreateSavedView: (name: string) => DataTableSavedView | undefined;
  onApplySavedView: (id: string) => boolean;
  onRenameSavedView: (
    id: string,
    name: string,
  ) => DataTableSavedView | undefined;
  onDeleteSavedView: (id: string) => boolean;
  toolbarQueryValue: string;
  onToolbarQueryValueChange: (value: string) => void;
  activeColumnFilters: Array<ActiveFilter>;
  onColumnFilterChange: (columnId: string, value: unknown) => void;
  onClearColumnFilters: () => void;
};

export default function ToolbarDataOperations({
  placement,
  ui,
  labels,
  enableColumnChooser,
  enableFilterChips,
  enableResetLayout,
  enableSavedViews,
  enableColumnPinning,
  columnVisibilityOptions,
  onColumnVisibilityChange,
  onColumnPinningChange,
  reorderColumn,
  table,
  onResetColumnLayout,
  savedViews,
  onCreateSavedView,
  onApplySavedView,
  onRenameSavedView,
  onDeleteSavedView,
  toolbarQueryValue,
  onToolbarQueryValueChange,
  activeColumnFilters,
  onColumnFilterChange,
  onClearColumnFilters,
}: ToolbarDataOperationsProps) {
  const [columnQuery, setColumnQuery] = React.useState("");
  const [newSavedViewName, setNewSavedViewName] = React.useState("");
  const [renamingSavedViewId, setRenamingSavedViewId] = React.useState<
    string | null
  >(null);
  const [renamedSavedViewName, setRenamedSavedViewName] = React.useState("");
  const {
    Button,
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
  } = ui;
  const orderedIds = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !id.startsWith("__"));
  const columns = columnVisibilityOptions.filter((column) =>
    column.label.toLocaleLowerCase().includes(columnQuery.toLocaleLowerCase()),
  );
  const activeCount = activeColumnFilters.length + (toolbarQueryValue ? 1 : 0);

  if (placement === "chips") {
    if (!enableFilterChips || !activeCount) {
      return null;
    }
    return (
      <div
        data-dtp-slot="data-table-active-filters"
        aria-label={`${labels.filters}: ${activeCount}`}
        className="flex min-w-0 flex-wrap items-center gap-2"
      >
        <span className="text-sm opacity-70">
          {labels.filters} ({activeCount})
        </span>
        {toolbarQueryValue ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-label={labels.clearSearch}
            onClick={() => onToolbarQueryValueChange("")}
          >
            {toolbarQueryValue} <span aria-hidden="true">×</span>
          </Button>
        ) : null}
        {activeColumnFilters.map((filter) => (
          <Button
            key={filter.id}
            type="button"
            variant="secondary"
            size="sm"
            aria-label={`${labels.clearFilters}: ${filter.label}`}
            onClick={() => onColumnFilterChange(filter.id, "")}
          >
            {filter.label}: {formatValue(filter.value)}{" "}
            <span aria-hidden="true">×</span>
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onToolbarQueryValueChange("");
            onClearColumnFilters();
          }}
        >
          {labels.clearFilters}
        </Button>
      </div>
    );
  }

  if (!enableColumnChooser && !enableResetLayout && !enableSavedViews) {
    return null;
  }
  const setVisibility = (visible: boolean) =>
    table.setColumnVisibility((current) => {
      const next = { ...current };
      for (const column of table.getAllLeafColumns()) {
        if (!column.id.startsWith("__") && column.getCanHide()) {
          next[column.id] = visible;
        }
      }
      return next;
    });
  const move = (id: string, direction: -1 | 1) => {
    const index = orderedIds.indexOf(id);
    const target = orderedIds[index + direction];
    if (index >= 0 && target) {
      reorderColumn(id, target);
    }
  };
  return (
    <>
      {enableColumnChooser ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{labels.columns}</DropdownMenuLabel>
          <div className="px-2 pb-2">
            <InputGroup>
              <InputGroupInput
                value={columnQuery}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setColumnQuery(event.target.value)
                }
                placeholder={labels.searchColumns}
                aria-label={labels.searchColumns}
              />
              <InputGroupAddon align="inline-start" aria-hidden="true">
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(event: Event) => {
                event.preventDefault();
                setVisibility(true);
              }}
            >
              {labels.showAllColumns}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event: Event) => {
                event.preventDefault();
                setVisibility(false);
              }}
            >
              {labels.hideAllColumns}
            </DropdownMenuItem>
            {columns.map((column) => {
              const index = orderedIds.indexOf(column.id);
              return (
                <React.Fragment key={column.id}>
                  <DropdownMenuCheckboxItem
                    checked={column.visible}
                    disabled={!column.canHide}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      onColumnVisibilityChange?.(
                        column.id,
                        checked === true,
                      )
                    }
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuItem
                    disabled={index <= 0}
                    onSelect={(event: Event) => {
                      event.preventDefault();
                      move(column.id, -1);
                    }}
                  >
                    {labels.moveColumnEarlier(column.label)}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={index < 0 || index === orderedIds.length - 1}
                    onSelect={(event: Event) => {
                      event.preventDefault();
                      move(column.id, 1);
                    }}
                  >
                    {labels.moveColumnLater(column.label)}
                  </DropdownMenuItem>
                  {enableColumnPinning ? (
                    <>
                      <DropdownMenuItem
                        onSelect={(event: Event) => {
                          event.preventDefault();
                          onColumnPinningChange(column.id, "left");
                        }}
                      >
                        {labels.pinLeft}: {column.label}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(event: Event) => {
                          event.preventDefault();
                          onColumnPinningChange(column.id, "right");
                        }}
                      >
                        {labels.pinRight}: {column.label}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(event: Event) => {
                          event.preventDefault();
                          onColumnPinningChange(column.id, false);
                        }}
                      >
                        {labels.unpin}: {column.label}
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </React.Fragment>
              );
            })}
          </DropdownMenuGroup>
        </>
      ) : null}
      {enableResetLayout ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event: Event) => {
              event.preventDefault();
              onResetColumnLayout();
            }}
          >
            {labels.resetColumnLayout}
          </DropdownMenuItem>
        </>
      ) : null}
      {enableSavedViews ? (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{labels.savedViews}</DropdownMenuLabel>
          <div className="px-2 pb-2">
            <InputGroup>
              <InputGroupInput
                value={newSavedViewName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setNewSavedViewName(event.target.value)
                }
                placeholder={labels.savedViewName}
                aria-label={labels.savedViewName}
              />
            </InputGroup>
          </div>
          <DropdownMenuItem
            disabled={!newSavedViewName.trim()}
            onSelect={(event: Event) => {
              event.preventDefault();
              if (onCreateSavedView(newSavedViewName.trim())) {
                setNewSavedViewName("");
              }
            }}
          >
            {labels.createSavedView}
          </DropdownMenuItem>
          <DropdownMenuGroup>
            {savedViews.map((view) =>
              renamingSavedViewId === view.id ? (
                <div
                  key={view.id}
                  className="flex gap-1 px-2 py-1"
                  role="group"
                  aria-label={labels.renameSavedView(view.name)}
                >
                  <InputGroup>
                    <InputGroupInput
                      value={renamedSavedViewName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => setRenamedSavedViewName(event.target.value)}
                      aria-label={labels.savedViewName}
                    />
                  </InputGroup>
                  <DropdownMenuItem
                    onSelect={(event: Event) => {
                      event.preventDefault();
                      if (
                        renamedSavedViewName.trim() &&
                        onRenameSavedView(
                          view.id,
                          renamedSavedViewName.trim(),
                        )
                      ) {
                        setRenamingSavedViewId(null);
                      }
                    }}
                  >
                    {labels.saveSavedView}
                  </DropdownMenuItem>
                </div>
              ) : (
                <React.Fragment key={view.id}>
                  <DropdownMenuItem
                    onSelect={(event: Event) => {
                      event.preventDefault();
                      onApplySavedView(view.id);
                    }}
                  >
                    {view.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event: Event) => {
                      event.preventDefault();
                      setRenamingSavedViewId(view.id);
                      setRenamedSavedViewName(view.name);
                    }}
                  >
                    {labels.renameSavedView(view.name)}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event: Event) => {
                      event.preventDefault();
                      onDeleteSavedView(view.id);
                    }}
                  >
                    {labels.deleteSavedView(view.name)}
                  </DropdownMenuItem>
                </React.Fragment>
              ),
            )}
          </DropdownMenuGroup>
        </>
      ) : null}
    </>
  );
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }
  if (value && typeof value === "object") {
    const range = value as { from?: unknown; to?: unknown };
    if ("from" in range || "to" in range) {
      return [range.from, range.to]
        .filter(Boolean)
        .map(String)
        .join("–");
    }
  }
  return String(value);
}
