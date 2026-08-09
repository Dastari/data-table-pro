import * as React from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronLeft,
  IconChevronRight,
  IconDots,
} from "../../core/icons";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  variant?: React.ComponentProps<typeof Button>["variant"];
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  disabled = false,
  variant,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={variant ?? (isActive ? "outline" : "ghost")}
      size={size}
      className={cn(disabled && "pointer-events-none opacity-50", className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        aria-disabled={disabled ? true : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        tabIndex={disabled ? -1 : props.tabIndex}
        {...props}
      />
    </Button>
  );
}

function PaginationPrevious({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  showText?: boolean;
  text?: string;
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      disabled={disabled}
      size={size}
      variant="outline"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <IconChevronLeft data-icon="inline-start" />
      {showText ? (
        <span className="hidden @min-[640px]/data-table:block">{text}</span>
      ) : null}
    </PaginationLink>
  );
}

function PaginationFirst({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "First",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  showText?: boolean;
  text?: string;
}) {
  return (
    <PaginationLink
      aria-label="Go to first page"
      disabled={disabled}
      size={size}
      variant="outline"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <IconChevronsLeft data-icon="inline-start" />
      {showText ? (
        <span className="hidden @min-[640px]/data-table:block">{text}</span>
      ) : null}
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  showText?: boolean;
  text?: string;
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      disabled={disabled}
      size={size}
      variant="outline"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      {showText ? (
        <span className="hidden @min-[640px]/data-table:block">{text}</span>
      ) : null}
      <IconChevronRight data-icon="inline-end" />
    </PaginationLink>
  );
}

function PaginationLast({
  className,
  disabled,
  showText = true,
  size = "default",
  text = "Last",
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  showText?: boolean;
  text?: string;
}) {
  return (
    <PaginationLink
      aria-label="Go to last page"
      disabled={disabled}
      size={size}
      variant="outline"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      {showText ? (
        <span className="hidden @min-[640px]/data-table:block">{text}</span>
      ) : null}
      <IconChevronsRight data-icon="inline-end" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  text = "More pages",
  ...props
}: React.ComponentProps<"span"> & { text?: string }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <IconDots />
      <span className="sr-only">{text}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
