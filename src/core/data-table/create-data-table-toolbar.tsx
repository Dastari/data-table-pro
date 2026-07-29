import * as React from "react";
import {
  IconAdjustmentsHorizontal,
  IconLayoutGrid,
  IconList,
  IconSearch,
  IconX,
} from "../icons";
import type {
  DataTableColumnFilterType,
  DataTableColumnFixed,
  DataTableColumnVisibilityOption,
  DataTableDensity,
  DataTableLabels,
  DataTableSelectionAction,
  DataTableToolbarAction,
  DataTableToolbarVisibility,
  DataTableViewMode,
} from "../types";
import type { DataTableUiKit } from "../ui-kit";
import { DATA_TABLE_DEFAULT_LABELS } from "./data-table-labels";

export type DataTableToolbarColumnFilter = {
  id: string;
  label: string;
  type: DataTableColumnFilterType;
  value: unknown;
  placeholder?: string;
  options: Array<{ label: string; value: string }>;
};

type DataTableToolbarProps<TData> = {
  title?: string;
  description?: string;
  toolbarQueryValue: string;
  toolbarQueryPlaceholder: string;
  onToolbarQueryValueChange: (value: string) => void;
  customToolbar?: React.ReactNode;
  compactToolbar?: React.ReactNode;
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
  enableColumnPinning: boolean;
  onColumnPinningChange: (columnId: string, side: DataTableColumnFixed | false) => void;
  columnFilters: Array<DataTableToolbarColumnFilter>;
  onColumnFilterChange: (columnId: string, value: unknown) => void;
  onClearColumnFilters: () => void;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  enableDensityToggle: boolean;
  labels: DataTableLabels;
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
    DropdownMenuItem,
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
    compactToolbar,
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
    enableColumnPinning,
    onColumnPinningChange,
    columnFilters,
    onColumnFilterChange,
    onClearColumnFilters,
    density,
    onDensityChange,
    enableDensityToggle,
    labels,
    toolbarVisibility,
    openFileDialog,
  }: DataTableToolbarProps<TData>) {
    const compactSearchInputRef = React.useRef<HTMLInputElement | null>(null);
    const [isCompactSearchVisible, setIsCompactSearchVisible] =
      React.useState(false);
    const compactToolbarIconButtonClassName =
      uiClassNames.toolbarCompactIconButton ?? "";
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
        Boolean(onShowHiddenRowsChange && hiddenRowsLabel) ||
        enableColumnPinning ||
        enableDensityToggle);
    const hasVisibleViewToggle =
      showViewToggle && enableViewToggle && Boolean(onViewModeChange);
    const hasVisibleTrailingActions =
      showTrailingActions && trailingActions.length > 0;
    const hasVisibleCustomToolbar = showCustomToolbar && Boolean(customToolbar);
    const hasVisibleCompactToolbar =
      showCustomToolbar && Boolean(compactToolbar ?? customToolbar);
    const selectedRowCountLabel = labels.selectedRows(selectedRows.length);

    React.useEffect(() => {
      if (!isCompactSearchVisible) {
        return;
      }

      compactSearchInputRef.current?.focus();
    }, [isCompactSearchVisible]);

    if (
      !hasVisibleTitle &&
      !hasVisibleSearch &&
      !hasVisiblePrimaryActions &&
      !hasVisibleSelectionActions &&
      !hasVisibleOptions &&
      !hasVisibleViewToggle &&
      !hasVisibleTrailingActions &&
      !hasVisibleCustomToolbar &&
      !hasVisibleCompactToolbar
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

        <div className="flex flex-col gap-3">
          <div
            data-dtp-slot="data-table-toolbar-controls"
            className="flex items-center gap-2 overflow-x-auto px-1 @md/data-table:gap-3 @md/data-table:overflow-visible"
          >
            {showSearch ? (
              <>
                <div className="hidden min-w-0 grow max-w-md @md/data-table:block">
                  <InputGroup className="min-w-0">
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
                          aria-label={labels.clearSearch}
                          title={labels.clearSearch}
                        >
                          <IconX />
                        </button>
                      </InputGroupAddon>
                    ) : null}
                  </InputGroup>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={
                        isCompactSearchVisible || toolbarQueryValue
                          ? "secondary"
                          : "outline"
                      }
                      size="icon-sm"
                      aria-label={labels.searchTable}
                      aria-pressed={isCompactSearchVisible}
                      className={`shrink-0 @md/data-table:hidden ${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`}
                      onClick={() => {
                        setIsCompactSearchVisible((current) => !current);
                      }}
                    >
                      <IconSearch />
                      <span className="sr-only">{labels.searchTable}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{labels.searchTable}</TooltipContent>
                </Tooltip>
              </>
            ) : null}

            {showActions ? (
              <div className="flex shrink-0 items-center gap-2">
                {primaryActions.map((action) => {
                  const collapsesToIcon =
                    !action.iconOnly && Boolean(action.icon);
                  const button = (
                    <Button
                      key={action.key}
                      type="button"
                      className={
                        collapsesToIcon
                          ? `size-7 shrink-0 px-0 @md/data-table:h-8 @md/data-table:w-fit @md/data-table:px-2.5 ${compactToolbarIconButtonClassName}`
                          : action.iconOnly
                            ? `size-7 shrink-0 @md/data-table:size-8 ${compactToolbarIconButtonClassName}`
                            : "size-7 shrink-0 @md/data-table:h-8 @md/data-table:w-fit"
                      }
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
                      ) : collapsesToIcon ? (
                        <span className="hidden @md/data-table:inline">
                          {action.label}
                        </span>
                      ) : (
                        <span>{action.label}</span>
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

            {hasVisibleCompactToolbar ? (
              <div
                data-dtp-slot="data-table-toolbar-compact-custom"
                className="flex shrink-0 items-center gap-2 @lg/data-table:hidden"
              >
                {compactToolbar ?? customToolbar}
              </div>
            ) : null}

            <div className="grow" aria-hidden="true" />

            <div
              data-dtp-slot="data-table-toolbar-end-controls"
              className="flex shrink-0 items-center gap-2"
            >
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
                            className={compactToolbarIconButtonClassName}
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
                      aria-label={labels.tableOptions}
                      className={`${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`}
                      title={labels.tableOptions}
                    >
                      <IconAdjustmentsHorizontal />
                      <span className="sr-only">{labels.tableOptions}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{labels.tableOptions}</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      {onShowHiddenRowsChange && hiddenRowsLabel ? (
                        <DropdownMenuCheckboxItem
                          checked={showHiddenRows}
                          onCheckedChange={(
                            checked: boolean | "indeterminate",
                          ) => {
                            onShowHiddenRowsChange(checked === true);
                          }}
                        >
                          {labels.showHiddenRows(hiddenRowsLabel)}
                        </DropdownMenuCheckboxItem>
                      ) : null}
                    </DropdownMenuGroup>
                    {enableDensityToggle ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>{labels.density}</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {(
                            [
                              ["compact", labels.compactDensity],
                              ["comfortable", labels.comfortableDensity],
                              ["spacious", labels.spaciousDensity],
                            ] as const
                          ).map(([nextDensity, label]) => (
                            <DropdownMenuCheckboxItem
                              key={nextDensity}
                              checked={density === nextDensity}
                              onCheckedChange={() => {
                                onDensityChange(nextDensity);
                              }}
                            >
                              {label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuGroup>
                      </>
                    ) : null}
                    {columnVisibilityOptions.some((column) => column.canHide) ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>{labels.columns}</DropdownMenuLabel>
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
                    {enableColumnPinning ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                          {labels.pinLeft} / {labels.pinRight}
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {columnVisibilityOptions.map((column) => (
                            <DropdownMenuItem
                              key={`pin-${column.id}`}
                              onSelect={(event: Event) => {
                                event.preventDefault();
                              }}
                            >
                              <span className="min-w-0 flex-1 truncate">
                                {column.label}
                              </span>
                              <button
                                type="button"
                                className="px-1 text-xs"
                                aria-label={`${labels.pinLeft}: ${column.label}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onColumnPinningChange(column.id, "left");
                                }}
                              >
                                L
                              </button>
                              <button
                                type="button"
                                className="px-1 text-xs"
                                aria-label={`${labels.pinRight}: ${column.label}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onColumnPinningChange(column.id, "right");
                                }}
                              >
                                R
                              </button>
                              <button
                                type="button"
                                className="px-1 text-xs"
                                aria-label={`${labels.unpin}: ${column.label}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onColumnPinningChange(column.id, false);
                                }}
                              >
                                -
                              </button>
                            </DropdownMenuItem>
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
                            ? compactToolbarIconButtonClassName
                            : `${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`
                        }
                        size="icon-sm"
                        onClick={() => {
                          onViewModeChange("table");
                        }}
                      >
                        <IconList />
                        <span className="sr-only">
                          {labels.switchToTableView ??
                            DATA_TABLE_DEFAULT_LABELS.switchToTableView}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {labels.tableView ??
                        DATA_TABLE_DEFAULT_LABELS.tableView}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={viewMode === "card" ? "default" : "outline"}
                        aria-pressed={viewMode === "card"}
                        className={
                          viewMode === "table"
                            ? `${compactToolbarIconButtonClassName} ${uiClassNames.toolbarInputButton ?? ""}`
                            : compactToolbarIconButtonClassName
                        }
                        size="icon-sm"
                        onClick={() => {
                          onViewModeChange("card");
                        }}
                      >
                        <IconLayoutGrid />
                        <span className="sr-only">
                          {labels.switchToCardView ??
                            DATA_TABLE_DEFAULT_LABELS.switchToCardView}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {labels.cardView ??
                        DATA_TABLE_DEFAULT_LABELS.cardView}
                    </TooltipContent>
                  </Tooltip>
                </ButtonGroup>
              ) : null}

              {showTrailingActions
                ? trailingActions.map((action) => {
                    const collapsesToIcon =
                      !action.iconOnly && Boolean(action.icon);
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
                        className={`size-7 shrink-0 ${action.iconOnly ? "" : `${collapsesToIcon ? "px-0 @md/data-table:px-2.5" : ""} @md/data-table:h-8 @md/data-table:w-fit`} ${action.iconOnly || collapsesToIcon ? compactToolbarIconButtonClassName : ""} ${uiClassNames.toolbarInputButton ?? ""}`}
                      >
                        {action.icon ? (
                          <action.icon
                            data-icon={
                              action.iconOnly ? undefined : "inline-start"
                            }
                          />
                        ) : null}
                        {action.iconOnly ? (
                          <span className="sr-only">{action.label}</span>
                        ) : collapsesToIcon ? (
                          <span className="hidden @md/data-table:inline">
                            {action.label}
                          </span>
                        ) : (
                          <span>{action.label}</span>
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

          {showSearch && isCompactSearchVisible ? (
            <div
              data-dtp-slot="data-table-toolbar-compact-search"
              className="min-w-0 @md/data-table:hidden"
            >
              <InputGroup>
                <InputGroupInput
                  ref={compactSearchInputRef}
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
                      aria-label={labels.clearSearch}
                      title={labels.clearSearch}
                    >
                      <IconX />
                    </button>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>
            </div>
          ) : null}

          {columnFilters.length ? (
            <div
              data-dtp-slot="data-table-toolbar-filters"
              className="flex min-w-0 flex-wrap items-center gap-2"
            >
              {columnFilters.map((filter) => (
                <ToolbarColumnFilterControl
                  key={filter.id}
                  filter={filter}
                  labels={labels}
                  onColumnFilterChange={onColumnFilterChange}
                />
              ))}
              {columnFilters.some((filter) =>
                hasColumnFilterValue(filter.value),
              ) ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearColumnFilters}
                >
                  {labels.clearFilters}
                </Button>
              ) : null}
            </div>
          ) : null}

        </div>

        {showCustomToolbar && customToolbar ? (
          <div
            data-dtp-slot="data-table-toolbar-desktop-custom"
            className="hidden flex-row items-center gap-3 @lg/data-table:flex"
          >
            {customToolbar}
          </div>
        ) : null}
      </div>
    );
  };

  function ToolbarColumnFilterControl({
    filter,
    labels,
    onColumnFilterChange,
  }: {
    filter: DataTableToolbarColumnFilter;
    labels: DataTableLabels;
    onColumnFilterChange: (columnId: string, value: unknown) => void;
  }) {
    if (filter.type === "text") {
      return (
        <InputGroup className="min-w-48 max-w-64">
          <InputGroupInput
            value={typeof filter.value === "string" ? filter.value : ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onColumnFilterChange(filter.id, event.target.value);
            }}
            placeholder={filter.placeholder ?? filter.label}
            aria-label={`${labels.filters}: ${filter.label}`}
          />
          <InputGroupAddon align="inline-start" aria-hidden="true">
            <IconSearch />
          </InputGroupAddon>
        </InputGroup>
      );
    }

    const selectedValues = Array.isArray(filter.value)
      ? filter.value.map(String)
      : typeof filter.value === "string" && filter.value
        ? [filter.value]
        : [];
    const selectedLabel =
      selectedValues.length === 0
        ? filter.label
        : `${filter.label}: ${
            selectedValues.length === 1
              ? (filter.options.find(
                  (option) => option.value === selectedValues[0],
                )?.label ?? selectedValues[0])
              : selectedValues.length
          }`;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            {selectedLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
          <DropdownMenuGroup>
            {filter.type === "select" ? (
              <DropdownMenuItem
                onClick={() => {
                  onColumnFilterChange(filter.id, "");
                }}
              >
                {labels.allFilterOptions ??
                  DATA_TABLE_DEFAULT_LABELS.allFilterOptions}
              </DropdownMenuItem>
            ) : null}
            {filter.options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  if (filter.type === "select") {
                    onColumnFilterChange(
                      filter.id,
                      checked === true ? option.value : "",
                    );
                    return;
                  }

                  const nextValues = new Set(selectedValues);
                  if (checked === true) {
                    nextValues.add(option.value);
                  } else {
                    nextValues.delete(option.value);
                  }
                  onColumnFilterChange(filter.id, Array.from(nextValues));
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}

function hasColumnFilterValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}
