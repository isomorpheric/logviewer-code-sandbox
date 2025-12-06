# useVirtualization

> [!IMPORTANT]
> In a real production application, I would have used a library for this - like [Tanstack Virtual](https://tanstack.com/virtual/latest).

## Overview

A custom virtualization engine designed to render large lists of items with variable heights efficiently. It ensures that only the visible items (plus a small overscan buffer) are rendered to the DOM, keeping the application responsive even with thousands of logs.

## How It Works

1. **Height Map**:
   - The engine maintains a `heightMap` (mapping index -> height in pixels).
   - Initial heights are estimated or measured.
   - As rows render or expand, `ResizeObserver` (or `useLayoutEffect`) updates the `heightMap`.

2. **Scroll Tracking**:
   - Listens to the `scroll` event on the container.
   - Calculates the `scrollTop` and visible viewport height.

3. **Range Calculation**:
   - Based on `scrollTop` and the `heightMap`, the hook iterates through the list to find the `startIndex` (first visible item).
   - The `endIndex` is determined by accumulating heights until the viewport is filled.
   - An **overscan** (e.g., 5 items) is added to the start and end to prevent white flashes during scrolling.

4. **Positioning**:
   - **Total Height**: The inner container is set to the sum of all item heights to preserve the scrollbar thumb size.
   - **Absolute/Transform**: Items are positioned absolutely or using `transform: translateY(...)` based on their calculated offset from the top.

## Dynamic Height Handling

Since log rows can be expanded (showing full JSON), their height is not constant.
- When a row expands, the component reports its new height.
- The `useVirtualization` hook updates the `heightMap`.
- The total height is recalculated.
- The `offset` for all subsequent items is adjusted automatically.
