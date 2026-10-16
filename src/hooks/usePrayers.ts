"use client";

import { useCallback, useMemo } from "react";
import type { Prayer } from "@/types/prayer";
import { readLocalStorageValue, useLocalStorageValue, writeLocalStorageValue } from "./useLocalStorageValue";

const STORAGE_KEY = "hle-prayer-prayers";

function parsePrayers(raw: string | null): Prayer[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw).map((p: Prayer & { createdAt: string }) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }));
  } catch {
    return [];
  }
}

export function usePrayers() {
  const raw = useLocalStorageValue(STORAGE_KEY);
  const prayers = useMemo(() => parsePrayers(raw), [raw]);

  const addPrayer = useCallback((name: string, content: string) => {
    const colors = ["#f27220", "#ff8c42", "#ffb691", "#ffd700", "#b8babd"];
    const newPrayer: Prayer = {
      id: crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      content,
      createdAt: new Date(),
      flameColor: colors[Math.floor(Math.random() * colors.length)],
    };
    const updated = [newPrayer, ...parsePrayers(readLocalStorageValue(STORAGE_KEY))];
    writeLocalStorageValue(STORAGE_KEY, JSON.stringify(updated));
    return newPrayer;
  }, []);

  return { prayers, addPrayer };
}
