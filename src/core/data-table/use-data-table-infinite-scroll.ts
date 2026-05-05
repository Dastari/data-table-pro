import * as React from "react";

export function useDataTableInfiniteScroll({
  enabled,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  enabled: boolean;
  hasMore: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void | Promise<void>;
}) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const onLoadMoreEvent = React.useEffectEvent(onLoadMore);

  React.useEffect(() => {
    if (!enabled || !hasMore || isLoadingMore) {
      return;
    }

    const target = sentinelRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          void onLoadMoreEvent();
        }
      },
      {
        rootMargin: "200px 0px 200px 0px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, hasMore, isLoadingMore]);

  return sentinelRef;
}
