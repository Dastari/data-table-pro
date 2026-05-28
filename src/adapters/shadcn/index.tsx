import * as React from "react";
import type { DataTableUiKit } from "../../core/ui-kit";
import {
  Button as PrimitiveButton,
  Card as PrimitiveCard,
  CardDescription as PrimitiveCardDescription,
  CardFooter as PrimitiveCardFooter,
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
  EmptyDescription as PrimitiveEmptyDescription,
  EmptyMedia as PrimitiveEmptyMedia,
  Input as PrimitiveInput,
  InputGroup as PrimitiveInputGroup,
  InputGroupAddon as PrimitiveInputGroupAddon,
  InputGroupInput as PrimitiveInputGroupInput,
  ScrollBar as PrimitiveScrollBar,
  SelectContent as PrimitiveSelectContent,
  SelectItem as PrimitiveSelectItem,
  SelectLabel as PrimitiveSelectLabel,
  SelectSeparator as PrimitiveSelectSeparator,
  SelectTrigger as PrimitiveSelectTrigger,
  Separator as PrimitiveSeparator,
  Skeleton as PrimitiveSkeleton,
  TableFooter as PrimitiveTableFooter,
  TableHead as PrimitiveTableHead,
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

const ShadcnButton = withClassName(
  PrimitiveButton,
  "rounded-md border-border bg-input text-foreground data-[variant=default]:border-primary data-[variant=default]:bg-primary data-[variant=default]:text-primary-foreground data-[variant=outline]:hover:bg-accent data-[variant=outline]:hover:text-accent-foreground data-[variant=secondary]:border-secondary data-[variant=secondary]:bg-secondary data-[variant=secondary]:text-secondary-foreground data-[variant=ghost]:border-transparent data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-accent data-[variant=ghost]:hover:text-accent-foreground data-[variant=destructive]:border-destructive data-[variant=destructive]:bg-destructive data-[variant=destructive]:text-destructive-foreground data-[variant=link]:border-transparent data-[variant=link]:bg-transparent",
);
const ShadcnCard = withClassName(
  PrimitiveCard,
  "rounded-xl border-border bg-card text-card-foreground shadow-sm ring-0",
);
const ShadcnCardDescription = withClassName(
  PrimitiveCardDescription,
  "text-muted-foreground",
);
const ShadcnCardFooter = withClassName(
  PrimitiveCardFooter,
  "border-t border-border/60 bg-muted/50",
);
const ShadcnCheckbox = withClassName(
  PrimitiveCheckbox,
  "border-border bg-input ring-ring/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:ring-primary",
);
const ShadcnDropdownMenuContent = withClassName(
  PrimitiveDropdownMenuContent,
  "border-border bg-popover text-popover-foreground shadow-md",
);
const ShadcnDropdownMenuItem = withClassName(
  PrimitiveDropdownMenuItem,
  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10",
);
const ShadcnDropdownMenuCheckboxItem = withClassName(
  PrimitiveDropdownMenuCheckboxItem,
  "focus:bg-accent focus:text-accent-foreground",
);
const ShadcnDropdownMenuRadioItem = withClassName(
  PrimitiveDropdownMenuRadioItem,
  "focus:bg-accent focus:text-accent-foreground",
);
const ShadcnDropdownMenuLabel = withClassName(
  PrimitiveDropdownMenuLabel,
  "text-muted-foreground",
);
const ShadcnDropdownMenuSeparator = withClassName(
  PrimitiveDropdownMenuSeparator,
  "bg-border",
);
const ShadcnDropdownMenuSubContent = withClassName(
  PrimitiveDropdownMenuSubContent,
  "border-border bg-popover text-popover-foreground shadow-md",
);
const ShadcnDropdownMenuSubTrigger = withClassName(
  PrimitiveDropdownMenuSubTrigger,
  "focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground",
);
const ShadcnEmpty = withClassName(
  PrimitiveEmpty,
  "rounded-2xl border-border/60 bg-background/70",
);
const ShadcnEmptyDescription = withClassName(
  PrimitiveEmptyDescription,
  "text-muted-foreground",
);
const ShadcnEmptyMedia = withClassName(
  PrimitiveEmptyMedia,
  "[&[data-variant=icon]]:bg-muted [&[data-variant=icon]]:text-foreground",
);
const ShadcnInput = withClassName(
  PrimitiveInput,
  "rounded-md border-border bg-input text-foreground placeholder:text-muted-foreground",
);
const ShadcnInputGroup = withClassName(
  PrimitiveInputGroup,
  "rounded-md border-border bg-input text-foreground",
);
const ShadcnInputGroupAddon = withClassName(
  PrimitiveInputGroupAddon,
  "text-muted-foreground",
);
const ShadcnInputGroupInput = withClassName(
  PrimitiveInputGroupInput,
  "bg-transparent",
);
const ShadcnScrollBar = withClassName(
  PrimitiveScrollBar,
  "[&>[data-slot=scroll-area-thumb]]:bg-border",
);
const ShadcnSelectTrigger = withClassName(
  PrimitiveSelectTrigger,
  "rounded-md border-border bg-input text-foreground",
);
const ShadcnSelectContent = withClassName(
  PrimitiveSelectContent,
  "border-border bg-popover text-popover-foreground shadow-md",
);
const ShadcnSelectItem = withClassName(
  PrimitiveSelectItem,
  "focus:bg-accent focus:text-accent-foreground",
);
const ShadcnSelectLabel = withClassName(
  PrimitiveSelectLabel,
  "text-muted-foreground",
);
const ShadcnSelectSeparator = withClassName(
  PrimitiveSelectSeparator,
  "bg-border",
);
const ShadcnSeparator = withClassName(PrimitiveSeparator, "bg-border");
const ShadcnSkeleton = withClassName(PrimitiveSkeleton, "bg-muted");
const ShadcnTableFooter = withClassName(
  PrimitiveTableFooter,
  "border-border bg-muted/50",
);
const ShadcnTableHead = withClassName(
  PrimitiveTableHead,
  "text-foreground",
);
const ShadcnTooltipContent = withClassName(
  PrimitiveTooltipContent,
  "bg-foreground text-background ring-1 ring-foreground/10 [&>svg]:bg-foreground [&>svg]:fill-foreground",
);

export const shadcnUiKit: DataTableUiKit = {
  ...primitiveUiKit,
  rootClassName: "dtp-shadcn",
  classNames: {
    card: "hover:bg-muted/50 data-[state=selected]:bg-primary/10",
    cardGrid: "bg-transparent",
    cardItem: "min-w-0",
    cardOverlay: "from-background/95 via-background/85 to-transparent",
    cardScrollArea: "bg-transparent",
    cardSelected: "bg-primary/10 ring-primary",
    cardUnselected: "border-border",
    cardViewport: "bg-transparent",
    cellBorder: "border-border/40",
    dragActive: "rounded-md border-dashed border-primary",
    emptyState: "border-border/60 bg-background/70",
    footer: "border-border bg-card",
    headerSortIcon: "text-muted-foreground",
    mutedText: "text-muted-foreground",
    paginationSelectTrigger: "border-border bg-input",
    paginationTotal: "bg-input text-muted-foreground",
    pinnedColumn: "border-border",
    pinnedUtilityColumn: "bg-card",
    resizeHandle: "after:bg-border hover:after:bg-primary",
    resizeHandleActive: "after:bg-primary",
    row: "hover:bg-muted/50 data-[state=selected]:!bg-primary/10",
    rowSelected: "!bg-primary/10",
    tableContainer: "border-border bg-card text-card-foreground",
    tableStickyHeader:
      "sticky top-0 z-30 bg-card/95 backdrop-blur [&_th]:border-border [&_th]:bg-card/95",
    toolbarIconButton: "text-muted-foreground hover:text-foreground",
    toolbarInputButton: "border-border bg-input",
  },
  Button: ShadcnButton,
  Card: ShadcnCard,
  CardDescription: ShadcnCardDescription,
  CardFooter: ShadcnCardFooter,
  Checkbox: ShadcnCheckbox,
  DropdownMenuCheckboxItem: ShadcnDropdownMenuCheckboxItem,
  DropdownMenuContent: ShadcnDropdownMenuContent,
  DropdownMenuItem: ShadcnDropdownMenuItem,
  DropdownMenuLabel: ShadcnDropdownMenuLabel,
  DropdownMenuRadioItem: ShadcnDropdownMenuRadioItem,
  DropdownMenuSeparator: ShadcnDropdownMenuSeparator,
  DropdownMenuSubContent: ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger: ShadcnDropdownMenuSubTrigger,
  Empty: ShadcnEmpty,
  EmptyDescription: ShadcnEmptyDescription,
  EmptyMedia: ShadcnEmptyMedia,
  Input: ShadcnInput,
  InputGroup: ShadcnInputGroup,
  InputGroupAddon: ShadcnInputGroupAddon,
  InputGroupInput: ShadcnInputGroupInput,
  ScrollBar: ShadcnScrollBar,
  SelectContent: ShadcnSelectContent,
  SelectItem: ShadcnSelectItem,
  SelectLabel: ShadcnSelectLabel,
  SelectSeparator: ShadcnSelectSeparator,
  SelectTrigger: ShadcnSelectTrigger,
  Separator: ShadcnSeparator,
  Skeleton: ShadcnSkeleton,
  TableFooter: ShadcnTableFooter,
  TableHead: ShadcnTableHead,
  TooltipContent: ShadcnTooltipContent,
};
