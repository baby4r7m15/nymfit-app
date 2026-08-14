"use client";

import { useCallback, useRef } from "react";

// fn does NOT include the dedupe key in its own signature — the key is just
// used to decide which pending timer to reset, e.g. one timer per block id.
export function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  return useCallback(
    (key: string, ...args: Parameters<T>) => {
      if (timers.current[key]) clearTimeout(timers.current[key]);
      timers.current[key] = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}
