import * as React from "react";

export function useDataTableInfiniteScroll({
  enabled,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onError,
}: {
  enabled: boolean;
  hasMore: boolean;
  isLoadingMore?: boolean;
  onLoadMore: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const isRequestInFlightRef = React.useRef(false);
  const onLoadMoreEvent = React.useEffectEvent(onLoadMore);
  const onErrorEvent = React.useEffectEvent((error: unknown) => {
    onError?.(error);
  });

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
        if (entry.isIntersecting && !isRequestInFlightRef.current) {
          isRequestInFlightRef.current = true;

          let result: void | Promise<void>;
          try {
            result = onLoadMoreEvent();
          } catch (error) {
            isRequestInFlightRef.current = false;
            onErrorEvent(error);
            return;
          }

          void Promise.resolve(result)
            .catch((error: unknown) => {
              onErrorEvent(error);
            })
            .finally(() => {
              isRequestInFlightRef.current = false;
            });
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
