import { IconInbox } from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

export function DataTableEmptyState({
  title = "No rows found",
  description = "Adjust your filters or create a new record to populate this table.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Empty className="min-h-60 rounded-2xl border-border/60 bg-background/70">
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
}
