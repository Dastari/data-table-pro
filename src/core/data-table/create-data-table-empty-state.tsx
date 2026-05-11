import { IconInbox } from "@tabler/icons-react";
import type { DataTableUiKit } from "../ui-kit";

export function createDataTableEmptyState(ui: DataTableUiKit) {
  const uiClassNames = ui.classNames ?? {};
  const {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } = ui;

  return function DataTableEmptyState({
    title = "No rows found",
    description = "Adjust your filters or create a new record to populate this table.",
  }: {
    title?: string;
    description?: string;
  }) {
    return (
      <Empty
        className={`min-h-60 rounded-2xl ${uiClassNames.emptyState ?? "border-border/60 bg-background/70"}`}
      >
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconInbox />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    );
  };
}
