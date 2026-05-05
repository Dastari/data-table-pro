import * as React from "react";

export function useDataTableScrollViewport(
  containerRef: React.RefObject<HTMLElement | null>,
  refreshKey: unknown,
) {
  const [viewportElement, setViewportElement] =
    React.useState<HTMLElement | null>(null);
  const [viewportHeight, setViewportHeight] = React.useState(0);

  React.useEffect(() => {
    const element =
      containerRef.current?.querySelector<HTMLElement>(
        "[data-slot='scroll-area-viewport']",
      ) ?? null;

    setViewportElement(element);
    if (!element) {
      setViewportHeight(0);
      return;
    }

    let frameId: number | null = null;
    const updateHeight = () => {
      setViewportHeight((currentHeight) => {
        const nextHeight = element.clientHeight;
        return currentHeight === nextHeight ? currentHeight : nextHeight;
      });
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateHeight();
      });
    });

    observer.observe(element);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, [containerRef, refreshKey]);

  return { viewportElement, viewportHeight };
}
