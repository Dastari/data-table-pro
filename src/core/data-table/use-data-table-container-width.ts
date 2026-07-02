import * as React from "react";
import { DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS } from "../types";

const BREAKPOINT_WIDTHS = Object.values(DATA_TABLE_CONTAINER_BREAKPOINT_WIDTHS)
  .slice()
  .sort((first, second) => first - second);

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
      const nextWidth = quantizeContainerWidth(element.clientWidth);
      if (nextWidth === widthRef.current) {
        return;
      }

      widthRef.current = nextWidth;
      setWidth(nextWidth);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

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

function quantizeContainerWidth(width: number) {
  if (width <= 0) {
    return 0;
  }

  let bucket = 1;
  for (const breakpointWidth of BREAKPOINT_WIDTHS) {
    if (width < breakpointWidth) {
      break;
    }
    bucket = breakpointWidth;
  }

  return bucket;
}
