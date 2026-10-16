"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorageValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable (private mode, quota); the in-memory notify below still runs.
  }
  listeners.forEach((listener) => listener());
}

// Returns null on the server and during hydration, then the stored value on the client,
// so server and client markup always match.
export function useLocalStorageValue(key: string): string | null {
  const getSnapshot = useCallback(() => readValue(key), [key]);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export { readValue as readLocalStorageValue };
