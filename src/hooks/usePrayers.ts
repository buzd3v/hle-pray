"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { limitToLast, onValue, push, query, ref, serverTimestamp } from "firebase/database";
import { getDb } from "@/lib/firebase";
import type { Prayer } from "@/types/prayer";
import { readLocalStorageValue, useLocalStorageValue, writeLocalStorageValue } from "./useLocalStorageValue";

const STORAGE_KEY = "hle-prayer-prayers";
const WISHES_PATH = "wishes";
const FLAME_COLORS = ["#f27220", "#ff8c42", "#ffb691", "#ffd700", "#b8babd"];

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
  const db = useMemo(() => getDb(), []);
  const raw = useLocalStorageValue(STORAGE_KEY);
  const localPrayers = useMemo(() => parsePrayers(raw), [raw]);
  const [remotePrayers, setRemotePrayers] = useState<Prayer[]>([]);

  useEffect(() => {
    if (!db) return;
    // Push ids are chronological, so the last 50 keys are the 50 newest wishes.
    const latest = query(ref(db, WISHES_PATH), limitToLast(50));
    return onValue(
      latest,
      (snapshot) => {
        const wishes: Prayer[] = [];
        snapshot.forEach((child) => {
          const data = child.val();
          wishes.push({
            id: child.key,
            name: data.name,
            content: data.content,
            createdAt: new Date(data.createdAt),
            flameColor: data.flameColor,
          });
        });
        setRemotePrayers(wishes.reverse());
      },
      (error) => console.error("Failed to load wishes", error),
    );
  }, [db]);

  const addPrayer = useCallback(
    (name: string, content: string) => {
      const author = name.trim() || "Anonymous";
      const flameColor = FLAME_COLORS[Math.floor(Math.random() * FLAME_COLORS.length)];

      if (db) {
        push(ref(db, WISHES_PATH), { name: author, content, flameColor, createdAt: serverTimestamp() }).catch((error) =>
          console.error("Failed to save wish", error),
        );
        return;
      }

      const newPrayer: Prayer = { id: crypto.randomUUID(), name: author, content, createdAt: new Date(), flameColor };
      const updated = [newPrayer, ...parsePrayers(readLocalStorageValue(STORAGE_KEY))];
      writeLocalStorageValue(STORAGE_KEY, JSON.stringify(updated));
    },
    [db],
  );

  return { prayers: db ? remotePrayers : localPrayers, addPrayer };
}
