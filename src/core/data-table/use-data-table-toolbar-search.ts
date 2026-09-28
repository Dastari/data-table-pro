import * as React from "react";

const MIN_SEARCH_WIDTH = 160;

export function useDataTableToolbarSearch(
  controlsRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const [isSearchCollapsed, setIsSearchCollapsed] = React.useState(false);

  React.useEffect(() => {
    const controls = controlsRef.current;
    if (!enabled || !controls) return;

    const update = () => {
      if (!controls.clientWidth) return;

      const style = getComputedStyle(controls);
      const siblings = Array.from(controls.children).filter(
        (child) =>
          child.getAttribute("data-dtp-slot") !== "data-table-toolbar-search" &&
          getComputedStyle(child).display !== "none",
      );
      const occupiedWidth = siblings.reduce((width, child) => {
        // The spacer gives its space back to the search field when needed.
        if (child.getAttribute("data-dtp-slot") === "data-table-toolbar-spacer") {
          return width;
        }
        return width + child.getBoundingClientRect().width;
      }, 0);
      const availableWidth =
        controls.clientWidth -
        parseFloat(style.paddingLeft || "0") -
        parseFloat(style.paddingRight || "0") -
        occupiedWidth -
        (parseFloat(style.columnGap) || 0) * siblings.length;

      setIsSearchCollapsed(availableWidth < MIN_SEARCH_WIDTH);
    };

    update();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(update);
    const observe = () => {
      observer.disconnect();
      observer.observe(controls);
      // Actions, selection controls, and custom content can change width
      // without the table itself resizing.
      for (const child of controls.children) observer.observe(child);
      update();
    };
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(controls, { childList: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [controlsRef, enabled]);

  return isSearchCollapsed;
}
