import {
  IconAdjustmentsHorizontal,
  IconLayoutGrid,
  IconList,
  IconSearch,
} from "@tabler/icons-react";
import type {
  DataTableColumnVisibilityOption,
  DataTableSelectionAction,
  DataTableToolbarAction,
  DataTableToolbarVisibility,
  DataTableViewMode,
} from "./types";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type DataTableToolbarProps<TData> = {
  title?: string;
  description?: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchValueChange: (value: string) => void;
  customToolbar?: React.ReactNode;
  viewMode: DataTableViewMode;
  onViewModeChange?: (viewMode: DataTableViewMode) => void;
  enableViewToggle: boolean;
  toolbarActions: Array<DataTableToolbarAction<TData>>;
  selectionActions: Array<DataTableSelectionAction<TData>>;
  selectedRows: Array<TData>;
  totalRowCount?: number;
  showHiddenRows: boolean;
  hiddenRowsLabel?: string;
  onShowHiddenRowsChange?: (showHiddenRows: boolean) => void;
  allRows: Array<TData>;
  columnVisibilityOptions: Array<DataTableColumnVisibilityOption>;
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  toolbarVisibility?: DataTableToolbarVisibility;
  openFileDialog?: () => void;
};

export function DataTableToolbar<TData>({
  title,
  description,
  searchValue,
  searchPlaceholder,
  onSearchValueChange,
  customToolbar,
  viewMode,
  onViewModeChange,
  enableViewToggle,
  toolbarActions,
  selectionActions,
  selectedRows,
  totalRowCount,
  showHiddenRows,
  hiddenRowsLabel,
  onShowHiddenRowsChange,
  allRows,
  columnVisibilityOptions,
  onColumnVisibilityChange,
  toolbarVisibility,
  openFileDialog,
}: DataTableToolbarProps<TData>) {
  const primaryActions = toolbarActions.filter(
    (action) => (action.placement ?? "primary") === "primary",
  );
  const trailingActions = toolbarActions.filter(
    (action) => action.placement === "trailing",
  );
  const showTitle = toolbarVisibility?.title ?? true;
  const showSearch = toolbarVisibility?.search ?? true;
  const showActions = toolbarVisibility?.actions ?? true;
  const showTrailingActions = toolbarVisibility?.trailingActions ?? true;
  const showViewToggle = toolbarVisibility?.viewToggle ?? true;

  return (
    <div className="flex flex-col gap-4 p-2 pb-0">
      {showTitle && (title || description) ? (
        <div className="flex flex-col gap-1">
          {title ? (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          ) : null}
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-row gap-3 md:flex-row md:items-center px-1">
          {showSearch ? (
            <div className="min-w-0 grow max-w-md">
              <InputGroup>
                <InputGroupInput
                  value={searchValue}
                  onChange={(event) => {
                    onSearchValueChange(event.target.value);
                  }}
                  placeholder={searchPlaceholder}
                />
                <InputGroupAddon align="inline-start" aria-hidden="true">
                  <IconSearch />
                </InputGroupAddon>
              </InputGroup>
            </div>
          ) : null}

          {showActions ? (
            <div className="flex flex-wrap items-center gap-2">
              {primaryActions.map((action) => {
                const button = (
                  <Button
                    key={action.key}
                    type="button"
                    variant={action.variant ?? "outline"}
                    size={action.iconOnly ? "icon-sm" : "default"}
                    onClick={() => {
                      void action.onClick({
                        rows: allRows,
                        openFileDialog,
                      });
                    }}
                    disabled={action.disabled}
                    aria-label={action.label}
                    title={action.iconOnly ? undefined : action.label}
                  >
                    {action.icon ? (
                      <action.icon
                        data-icon={action.iconOnly ? undefined : "inline-start"}
                      />
                    ) : null}
                    {action.iconOnly ? (
                      <span className="sr-only">{action.label}</span>
                    ) : (
                      <span className="hidden @md/data-table:inline">
                        {action.label}
                      </span>
                    )}
                  </Button>
                );

                return action.iconOnly ? (
                  <Tooltip key={action.key}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent>{action.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  button
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {typeof totalRowCount === "number" ? (
            <div className="hidden text-sm text-muted-foreground">
              {totalRowCount} total
              {" • "}
              {selectedRows.length} selected
            </div>
          ) : null}
          <div className="block grow md:hidden" />
          {selectedRows.length
            ? selectionActions.map((action) => {
                const Icon = action.icon;
                const disabled =
                  typeof action.disabled === "function"
                    ? action.disabled(selectedRows)
                    : action.disabled;

                return (
                  <Tooltip key={action.key}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={action.variant ?? "secondary"}
                        size="icon-sm"
                        disabled={disabled}
                        onClick={() => {
                          void action.onClick({ rows: selectedRows });
                        }}
                        aria-label={action.label}
                      >
                        {Icon ? <Icon /> : null}
                        <span className="sr-only">{action.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{action.label}</TooltipContent>
                  </Tooltip>
                );
              })
            : null}

          {columnVisibilityOptions.length ||
          (onShowHiddenRowsChange && hiddenRowsLabel) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Show table options"
                  className="bg-input"
                  title="Show table options"
                >
                  <IconAdjustmentsHorizontal />
                  <span className="sr-only">Show table options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Table options</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {onShowHiddenRowsChange && hiddenRowsLabel ? (
                    <DropdownMenuCheckboxItem
                      checked={showHiddenRows}
                      onCheckedChange={(checked) => {
                        onShowHiddenRowsChange(checked === true);
                      }}
                    >
                      Show {hiddenRowsLabel}
                    </DropdownMenuCheckboxItem>
                  ) : null}
                </DropdownMenuGroup>
                {columnVisibilityOptions.length ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Columns</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {columnVisibilityOptions.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={column.visible}
                          disabled={!column.canHide}
                          onCheckedChange={(checked) => {
                            onColumnVisibilityChange?.(
                              column.id,
                              checked === true,
                            );
                          }}
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {showViewToggle && enableViewToggle && onViewModeChange ? (
            <ButtonGroup>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={viewMode === "table" ? "default" : "outline"}
                    className={viewMode === "table" ? "" : "bg-input"}
                    size="icon-sm"
                    onClick={() => {
                      onViewModeChange("table");
                    }}
                  >
                    <IconList />
                    <span className="sr-only">Switch to table view</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Table view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={viewMode === "card" ? "default" : "outline"}
                    className={viewMode === "table" ? "bg-input" : ""}
                    size="icon-sm"
                    onClick={() => {
                      onViewModeChange("card");
                    }}
                  >
                    <IconLayoutGrid />
                    <span className="sr-only">Switch to card view</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Card view</TooltipContent>
              </Tooltip>
            </ButtonGroup>
          ) : null}

          {showTrailingActions
            ? trailingActions.map((action) => {
                const button = (
                  <Button
                    key={action.key}
                    type="button"
                    variant={action.variant ?? "outline"}
                    size={action.iconOnly ? "icon-sm" : "default"}
                    onClick={() => {
                      void action.onClick({ rows: allRows });
                    }}
                    disabled={action.disabled}
                    aria-label={action.label}
                    title={action.iconOnly ? undefined : action.label}
                    className="bg-input"
                  >
                    {action.icon ? (
                      <action.icon
                        data-icon={action.iconOnly ? undefined : "inline-start"}
                      />
                    ) : null}
                    {action.iconOnly ? (
                      <span className="sr-only">{action.label}</span>
                    ) : (
                      <span className="hidden @3xl/data-table:inline">
                        {action.label}
                      </span>
                    )}
                  </Button>
                );

                return action.iconOnly ? (
                  <Tooltip key={action.key}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent>{action.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  button
                );
              })
            : null}
        </div>
      </div>

      {customToolbar ? (
        <div className="flex flex-row items-center gap-3">{customToolbar}</div>
      ) : null}
    </div>
  );
}
