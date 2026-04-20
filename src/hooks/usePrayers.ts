"use client";

import { useState, useCallback } from "react";
import type { Prayer } from "@/types/prayer";

const STORAGE_KEY = "hle-prayer-prayers";

function loadPrayers(): Prayer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((p: Prayer & { createdAt: string }) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }));
  } catch {
    return [];
  }
}

function savePrayers(prayers: Prayer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
}

export function usePrayers() {
  const [prayers, setPrayers] = useState<Prayer[]>(() => loadPrayers());

  const addPrayer = useCallback((name: string, content: string) => {
    const colors = ["#f27220", "#ff8c42", "#ffb691", "#ffd700", "#b8babd"];
    const newPrayer: Prayer = {
      id: crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      content,
      createdAt: new Date(),
      flameColor: colors[Math.floor(Math.random() * colors.length)],
    };
    setPrayers((prev) => {
      const updated = [newPrayer, ...prev];
      savePrayers(updated);
      return updated;
    });
    return newPrayer;
  }, []);

  return { prayers, addPrayer };
}