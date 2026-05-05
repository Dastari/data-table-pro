import * as React from "react";

export function useDataTableContainerWidth(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const widthRef = React.useRef(0);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    let frameId: number | null = null;
    const updateWidth = () => {
      const nextWidth = element.clientWidth;
      if (nextWidth === widthRef.current) {
        return;
      }

      widthRef.current = nextWidth;
      setWidth(nextWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateWidth();
      });
    });

    observer.observe(element);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, [containerRef]);

  return width;
}
