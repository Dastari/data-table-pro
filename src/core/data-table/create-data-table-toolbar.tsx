import {
  IconAdjustmentsHorizontal,
  IconLayoutGrid,
  IconList,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import type {
  DataTableColumnVisibilityOption,
  DataTableSelectionAction,
  DataTableToolbarAction,
  DataTableToolbarVisibility,
  DataTableViewMode,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";

type DataTableToolbarProps<TData> = {
  title?: string;
  description?: string;
  toolbarQueryValue: string;
  toolbarQueryPlaceholder: string;
  onToolbarQueryValueChange: (value: string) => void;
  customToolbar?: React.ReactNode;
  viewMode: DataTableViewMode;
  onViewModeChange?: (viewMode: DataTableViewMode) => void;
  enableViewToggle: boolean;
  toolbarActions: Array<DataTableToolbarAction<TData>>;
  selectionActions: Array<DataTableSelectionAction<TData>>;
  selectedRows: Array<TData>;
  showHiddenRows: boolean;
  hiddenRowsLabel?: string;
  onShowHiddenRowsChange?: (showHiddenRows: boolean) => void;
  allRows: Array<TData>;
  columnVisibilityOptions: Array<DataTableColumnVisibilityOption>;
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  toolbarVisibility?: DataTableToolbarVisibility;
  openFileDialog?: () => void;
};

export function createDataTableToolbar(ui: DataTableUiKit) {
  const uiClassNames = ui.classNames ?? {};
  const {
    Button,
    ButtonGroup,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } = ui;

  return function DataTableToolbar<TData>({
    title,
    description,
    toolbarQueryValue,
    toolbarQueryPlaceholder,
    onToolbarQueryValueChange,
    customToolbar,
    viewMode,
    onViewModeChange,
    enableViewToggle,
    toolbarActions,
    selectionActions,
    selectedRows,
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
    const showOptions = toolbarVisibility?.options ?? true;
    const showViewToggle = toolbarVisibility?.viewToggle ?? true;
    const showCustomToolbar = toolbarVisibility?.customToolbar ?? true;
    const hasVisibleTitle = showTitle && Boolean(title || description);
    const hasVisibleSearch = showSearch;
    const hasVisiblePrimaryActions = showActions && primaryActions.length > 0;
    const hasVisibleSelectionActions =
      selectedRows.length > 0 && selectionActions.length > 0;
    const hasVisibleOptions =
      showOptions &&
      (columnVisibilityOptions.some((column) => column.canHide) ||
        Boolean(onShowHiddenRowsChange && hiddenRowsLabel));
    const hasVisibleViewToggle =
      showViewToggle && enableViewToggle && Boolean(onViewModeChange);
    const hasVisibleTrailingActions =
      showTrailingActions && trailingActions.length > 0;
    const hasVisibleCustomToolbar = showCustomToolbar && Boolean(customToolbar);
    const selectedRowCountLabel = `${selectedRows.length} record${selectedRows.length === 1 ? "" : "s"} selected`;

    if (
      !hasVisibleTitle &&
      !hasVisibleSearch &&
      !hasVisiblePrimaryActions &&
      !hasVisibleSelectionActions &&
      !hasVisibleOptions &&
      !hasVisibleViewToggle &&
      !hasVisibleTrailingActions &&
      !hasVisibleCustomToolbar
    ) {
      return null;
    }

    return (
      <div className="flex flex-col gap-4 pb-0">
        {showTitle && (title || description) ? (
          <div className="flex flex-col gap-1">
            {title ? (
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            ) : null}
            {description ? (
              <p
                className={`max-w-3xl text-sm ${uiClassNames.mutedText ?? "opacity-70"}`}
              >
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
                    value={toolbarQueryValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onToolbarQueryValueChange(event.target.value);
                    }}
                    placeholder={toolbarQueryPlaceholder}
                  />
                  <InputGroupAddon align="inline-start" aria-hidden="true">
                    <IconSearch />
                  </InputGroupAddon>
                  {toolbarQueryValue ? (
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        className={`inline-flex size-5 items-center justify-center rounded-md transition-colors focus-visible:outline-none ${uiClassNames.toolbarIconButton ?? "opacity-70 hover:opacity-100"}`}
                        onClick={() => {
                          onToolbarQueryValueChange("");
                        }}
                        aria-label="Clear search"
                        title="Clear search"
                      >
                        <IconX />
                      </button>
                    </InputGroupAddon>
                  ) : null}
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
                      className="size-7 @md/data-table:w-fit @md/data-table:h-8 "
                      variant={action.variant ?? "outline"}
                      size={action.iconOnly ? "icon" : "default"}
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
                      {action.icon ? <action.icon /> : null}
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
            <div className="block grow md:hidden" />
            {selectedRows.length ? (
              <div
                className={`hidden text-sm @md/data-table:block ${uiClassNames.mutedText ?? "opacity-70"}`}
              >
                {selectedRowCountLabel}
              </div>
            ) : null}
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

            {hasVisibleOptions ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Show table options"
                    className={uiClassNames.toolbarInputButton}
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
                        onCheckedChange={(checked: boolean | "indeterminate") => {
                          onShowHiddenRowsChange(checked === true);
                        }}
                      >
                        Show {hiddenRowsLabel}
                      </DropdownMenuCheckboxItem>
                    ) : null}
                  </DropdownMenuGroup>
                  {columnVisibilityOptions.some((column) => column.canHide) ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Columns</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {columnVisibilityOptions
                          .filter((column) => column.canHide)
                          .map((column) => (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              checked={column.visible}
                              onCheckedChange={(
                                checked: boolean | "indeterminate",
                              ) => {
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
                      aria-pressed={viewMode === "table"}
                      className={
                        viewMode === "table"
                          ? ""
                          : uiClassNames.toolbarInputButton
                      }
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
                      aria-pressed={viewMode === "card"}
                      className={
                        viewMode === "table"
                          ? uiClassNames.toolbarInputButton
                          : ""
                      }
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
                        void action.onClick({
                          rows: allRows,
                          openFileDialog,
                        });
                      }}
                      disabled={action.disabled}
                      aria-label={action.label}
                      title={action.iconOnly ? undefined : action.label}
                      className={uiClassNames.toolbarInputButton}
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

        {showCustomToolbar && customToolbar ? (
          <div className="flex flex-row items-center gap-3">{customToolbar}</div>
        ) : null}
      </div>
    );
  };
}
