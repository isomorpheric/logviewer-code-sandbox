import { useCallback, useLayoutEffect, useRef, useState } from "react";

export interface UseVirtualizationOptions {
  itemCount: number;
  estimatedRowHeight?: number;
  overscan?: number;
}

export interface UseVirtualizationResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  setRowHeight: (index: number, height: number) => void;
}

const DEFAULT_ROW_HEIGHT = 28;
const DEFAULT_OVERSCAN = 5;

export function useVirtualization({
  itemCount,
  estimatedRowHeight = DEFAULT_ROW_HEIGHT,
  overscan = DEFAULT_OVERSCAN,
}: UseVirtualizationOptions): UseVirtualizationResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Height map for variable row heights
  const heightMapRef = useRef<Map<number, number>>(new Map());

  // Calculate cumulative heights for fast offset lookup
  const getRowOffset = useCallback(
    (index: number): number => {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += heightMapRef.current.get(i) ?? estimatedRowHeight;
      }
      return offset;
    },
    [estimatedRowHeight]
  );

  // Calculate total height of all items
  const totalHeight = useCallback((): number => {
    let height = 0;
    for (let i = 0; i < itemCount; i++) {
      height += heightMapRef.current.get(i) ?? estimatedRowHeight;
    }
    return height;
  }, [itemCount, estimatedRowHeight]);

  // Find the first visible item index
  const findStartIndex = useCallback((): number => {
    let offset = 0;
    for (let i = 0; i < itemCount; i++) {
      const rowHeight = heightMapRef.current.get(i) ?? estimatedRowHeight;
      if (offset + rowHeight > scrollTop) {
        return Math.max(0, i - overscan);
      }
      offset += rowHeight;
    }
    return Math.max(0, itemCount - 1);
  }, [itemCount, scrollTop, estimatedRowHeight, overscan]);

  // Find the last visible item index
  const findEndIndex = useCallback(
    (startIndex: number): number => {
      const viewportBottom = scrollTop + containerHeight;
      let offset = getRowOffset(startIndex);

      for (let i = startIndex; i < itemCount; i++) {
        if (offset > viewportBottom) {
          return Math.min(itemCount, i + overscan);
        }
        offset += heightMapRef.current.get(i) ?? estimatedRowHeight;
      }
      return itemCount;
    },
    [itemCount, scrollTop, containerHeight, estimatedRowHeight, overscan, getRowOffset]
  );

  // Set height for a specific row
  const setRowHeight = useCallback((index: number, height: number) => {
    const currentHeight = heightMapRef.current.get(index);
    if (currentHeight !== height) {
      heightMapRef.current.set(index, height);
    }
  }, []);

  // Handle scroll events
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Track container height via ResizeObserver
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const startIndex = findStartIndex();
  const endIndex = findEndIndex(startIndex);
  const offsetY = getRowOffset(startIndex);

  return {
    containerRef,
    startIndex,
    endIndex,
    totalHeight: totalHeight(),
    offsetY,
    setRowHeight,
  };
}
