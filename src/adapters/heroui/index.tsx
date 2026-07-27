import * as React from "react";
import type { DataTableUiKit } from "../../core/ui-kit";
import {
  Button as PrimitiveButton,
  Card as PrimitiveCard,
  CardContent as PrimitiveCardContent,
  CardHeader as PrimitiveCardHeader,
  Checkbox as PrimitiveCheckbox,
  DropdownMenuCheckboxItem as PrimitiveDropdownMenuCheckboxItem,
  DropdownMenuContent as PrimitiveDropdownMenuContent,
  DropdownMenuItem as PrimitiveDropdownMenuItem,
  DropdownMenuLabel as PrimitiveDropdownMenuLabel,
  DropdownMenuRadioItem as PrimitiveDropdownMenuRadioItem,
  DropdownMenuSeparator as PrimitiveDropdownMenuSeparator,
  DropdownMenuSubContent as PrimitiveDropdownMenuSubContent,
  DropdownMenuSubTrigger as PrimitiveDropdownMenuSubTrigger,
  Empty as PrimitiveEmpty,
  EmptyContent as PrimitiveEmptyContent,
  EmptyDescription as PrimitiveEmptyDescription,
  EmptyHeader as PrimitiveEmptyHeader,
  EmptyMedia as PrimitiveEmptyMedia,
  EmptyTitle as PrimitiveEmptyTitle,
  Input as PrimitiveInput,
  InputGroup as PrimitiveInputGroup,
  InputGroupAddon as PrimitiveInputGroupAddon,
  InputGroupInput as PrimitiveInputGroupInput,
  Pagination as PrimitivePagination,
  PaginationFirst as PrimitivePaginationFirst,
  PaginationLast as PrimitivePaginationLast,
  PaginationLink as PrimitivePaginationLink,
  PaginationNext as PrimitivePaginationNext,
  PaginationPrevious as PrimitivePaginationPrevious,
  ScrollArea as PrimitiveScrollArea,
  ScrollBar as PrimitiveScrollBar,
  SelectContent as PrimitiveSelectContent,
  SelectItem as PrimitiveSelectItem,
  SelectTrigger as PrimitiveSelectTrigger,
  Separator as PrimitiveSeparator,
  Skeleton as PrimitiveSkeleton,
  Table as PrimitiveTable,
  TableBody as PrimitiveTableBody,
  TableCell as PrimitiveTableCell,
  TableFooter as PrimitiveTableFooter,
  TableHead as PrimitiveTableHead,
  TableHeader as PrimitiveTableHeader,
  TableRow as PrimitiveTableRow,
  TooltipContent as PrimitiveTooltipContent,
  primitiveUiKit,
} from "../../core/primitive-ui-kit";
import { cn } from "../../lib/utils";

function withClassName<TProps extends { className?: string }>(
  Component: React.ComponentType<TProps>,
  defaultClassName: string,
) {
  return function Wrapped({ className, ...props }: TProps) {
    return (
      <Component
        className={cn(defaultClassName, className)}
        {...(props as TProps)}
      />
    );
  };
}

const HeroButton = withClassName(
  PrimitiveButton,
  "rounded-field border-field-border shadow-field data-[variant=default]:bg-accent data-[variant=default]:text-accent-foreground data-[variant=outline]:border-field-border data-[variant=outline]:bg-field data-[variant=outline]:hover:bg-field-hover data-[variant=secondary]:bg-default data-[variant=secondary]:text-default-foreground data-[variant=ghost]:hover:bg-default data-[variant=destructive]:bg-danger-soft data-[variant=destructive]:text-danger",
);
const HeroCard = withClassName(
  PrimitiveCard,
  "rounded-2xl border border-separator bg-surface text-surface-foreground shadow-surface ring-0",
);
const HeroCardHeader = withClassName(PrimitiveCardHeader, "px-5 pt-5 pb-3");
const HeroCardContent = withClassName(PrimitiveCardContent, "px-5 pb-5");
const HeroCheckbox = withClassName(
  PrimitiveCheckbox,
  "rounded-field border-field-border bg-field ring-focus/40 data-checked:bg-accent data-checked:text-accent-foreground data-checked:ring-focus",
);
const HeroDropdownMenuContent = withClassName(
  PrimitiveDropdownMenuContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden **:data-[slot$=-item]:focus:bg-default **:data-[slot$=-item]:data-highlighted:bg-default **:data-[slot$=-separator]:bg-separator **:data-[slot$=-trigger]:focus:bg-default",
);
const HeroDropdownMenuItem = withClassName(
  PrimitiveDropdownMenuItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground data-[variant=destructive]:text-danger data-[variant=destructive]:focus:bg-danger-soft",
);
const HeroDropdownMenuCheckboxItem = withClassName(
  PrimitiveDropdownMenuCheckboxItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground",
);
const HeroDropdownMenuRadioItem = withClassName(
  PrimitiveDropdownMenuRadioItem,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground",
);
const HeroDropdownMenuLabel = withClassName(
  PrimitiveDropdownMenuLabel,
  "text-muted",
);
const HeroDropdownMenuSeparator = withClassName(
  PrimitiveDropdownMenuSeparator,
  "bg-separator",
);
const HeroDropdownMenuSubContent = withClassName(
  PrimitiveDropdownMenuSubContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden",
);
const HeroDropdownMenuSubTrigger = withClassName(
  PrimitiveDropdownMenuSubTrigger,
  "rounded-xl text-overlay-foreground focus:bg-default focus:text-overlay-foreground data-open:bg-default data-open:text-overlay-foreground",
);
const HeroInput = withClassName(
  PrimitiveInput,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field placeholder:text-field-placeholder",
);
const HeroInputGroup = withClassName(
  PrimitiveInputGroup,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field",
);
const HeroInputGroupAddon = withClassName(
  PrimitiveInputGroupAddon,
  "text-muted",
);
const HeroInputGroupInput = withClassName(PrimitiveInputGroupInput, "bg-transparent");
const HeroPagination = withClassName(PrimitivePagination, "justify-end");
const HeroPaginationLink = withClassName(
  PrimitivePaginationLink,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
);
const HeroPaginationFirst = withClassName(
  PrimitivePaginationFirst,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroPaginationPrevious = withClassName(
  PrimitivePaginationPrevious,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroPaginationNext = withClassName(
  PrimitivePaginationNext,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroPaginationLast = withClassName(
  PrimitivePaginationLast,
  "rounded-xl border-field-border bg-field text-field-foreground hover:bg-field-hover",
);
const HeroScrollArea = withClassName(PrimitiveScrollArea, "rounded-2xl");
const HeroScrollBar = withClassName(
  PrimitiveScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-default-500",
);
const HeroSelectTrigger = withClassName(
  PrimitiveSelectTrigger,
  "rounded-field border-field-border bg-field text-field-foreground shadow-field",
);
const HeroSelectContent = withClassName(
  PrimitiveSelectContent,
  "rounded-2xl border border-separator bg-overlay text-overlay-foreground shadow-overlay ring-0 before:hidden",
);
const HeroSelectItem = withClassName(
  PrimitiveSelectItem,
  "rounded-xl focus:bg-default",
);
const HeroSeparator = withClassName(PrimitiveSeparator, "bg-separator");
const HeroSkeleton = withClassName(
  PrimitiveSkeleton,
  "rounded-xl bg-default",
);
const HeroTable = withClassName(PrimitiveTable, "rounded-2xl text-foreground");
const HeroTableHeader = withClassName(
  PrimitiveTableHeader,
  "[&_tr]:border-separator",
);
const HeroTableBody = withClassName(PrimitiveTableBody, "");
const HeroTableFooter = withClassName(
  PrimitiveTableFooter,
  "border-separator bg-surface-secondary",
);
const HeroTableHead = withClassName(
  PrimitiveTableHead,
  "h-11 border-separator text-muted font-semibold",
);
const HeroTableRow = withClassName(
  PrimitiveTableRow,
  "border-separator hover:bg-default data-[state=selected]:bg-accent-soft",
);
const HeroTableCell = withClassName(PrimitiveTableCell, "py-2.5");
const HeroTooltipContent = withClassName(
  PrimitiveTooltipContent,
  "rounded-xl bg-overlay text-overlay-foreground ring-1 ring-separator shadow-overlay [&>svg]:bg-overlay [&>svg]:fill-overlay",
);
const HeroEmpty = withClassName(
  PrimitiveEmpty,
  "rounded-2xl border-separator bg-surface shadow-surface",
);
const HeroEmptyHeader = withClassName(PrimitiveEmptyHeader, "");
const HeroEmptyMedia = withClassName(
  PrimitiveEmptyMedia,
  "[&[data-variant=icon]]:rounded-2xl [&[data-variant=icon]]:bg-accent-soft [&[data-variant=icon]]:text-accent-soft-foreground",
);
const HeroEmptyTitle = withClassName(PrimitiveEmptyTitle, "text-foreground");
const HeroEmptyDescription = withClassName(
  PrimitiveEmptyDescription,
  "text-muted",
);
const HeroEmptyContent = withClassName(PrimitiveEmptyContent, "");

export const heroUiKit: DataTableUiKit = {
  ...primitiveUiKit,
  rootClassName: "dtp-heroui",
  classNames: {
    card: "hover:bg-default data-[state=selected]:bg-accent-soft",
    cardGrid: "bg-transparent",
    cardItem: "min-w-0",
    cardOverlay: "from-surface/95 via-surface/85 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-accent-soft ring-accent",
    cardUnselected: "border-separator",
    cardViewport: "bg-transparent",
    cellBorder: "border-separator/70",
    dragActive: "rounded-2xl border-dashed border-accent",
    emptyState: "border-separator bg-surface",
    footer: "border-separator bg-surface text-surface-foreground",
    headerSortIcon: "text-muted",
    mutedText: "text-muted",
    paginationSelectTrigger: "border-field-border bg-field",
    paginationTotal: "text-muted",
    pinnedColumn: "border-separator",
    pinnedUtilityColumn: "bg-surface",
    resizeHandle: "after:bg-separator hover:after:bg-accent",
    resizeHandleActive: "after:bg-accent",
    row: "hover:bg-default data-[state=selected]:!bg-accent-soft",
    rowSelected: "!bg-accent-soft",
    tableContainer: "border-separator bg-surface text-surface-foreground",
    tableScrollArea: "bg-surface",
    tableStickyHeader:
      "sticky top-0 z-30 bg-surface/95 backdrop-blur [&_th]:border-separator [&_th]:bg-surface/95",
    toolbarCompactIconButton: "size-7",
    toolbarIconButton: "text-muted hover:text-foreground",
    toolbarInputButton: "bg-field",
  },
  Button: HeroButton,
  Card: HeroCard,
  CardContent: HeroCardContent,
  CardHeader: HeroCardHeader,
  Checkbox: HeroCheckbox,
  DropdownMenuCheckboxItem: HeroDropdownMenuCheckboxItem,
  DropdownMenuContent: HeroDropdownMenuContent,
  DropdownMenuItem: HeroDropdownMenuItem,
  DropdownMenuLabel: HeroDropdownMenuLabel,
  DropdownMenuRadioItem: HeroDropdownMenuRadioItem,
  DropdownMenuSeparator: HeroDropdownMenuSeparator,
  DropdownMenuSubContent: HeroDropdownMenuSubContent,
  DropdownMenuSubTrigger: HeroDropdownMenuSubTrigger,
  Empty: HeroEmpty,
  EmptyContent: HeroEmptyContent,
  EmptyDescription: HeroEmptyDescription,
  EmptyHeader: HeroEmptyHeader,
  EmptyMedia: HeroEmptyMedia,
  EmptyTitle: HeroEmptyTitle,
  Input: HeroInput,
  InputGroup: HeroInputGroup,
  InputGroupAddon: HeroInputGroupAddon,
  InputGroupInput: HeroInputGroupInput,
  Pagination: HeroPagination,
  PaginationFirst: HeroPaginationFirst,
  PaginationLast: HeroPaginationLast,
  PaginationLink: HeroPaginationLink,
  PaginationNext: HeroPaginationNext,
  PaginationPrevious: HeroPaginationPrevious,
  ScrollArea: HeroScrollArea,
  ScrollBar: HeroScrollBar,
  SelectContent: HeroSelectContent,
  SelectItem: HeroSelectItem,
  SelectTrigger: HeroSelectTrigger,
  Separator: HeroSeparator,
  Skeleton: HeroSkeleton,
  Table: HeroTable,
  TableBody: HeroTableBody,
  TableCell: HeroTableCell,
  TableFooter: HeroTableFooter,
  TableHead: HeroTableHead,
  TableHeader: HeroTableHeader,
  TableRow: HeroTableRow,
  TooltipContent: HeroTooltipContent,
};
