"use client";
import { Match } from "./types";

const KEY = "ryc-matches";
const SEEDED_KEY = "ryc-seeded-v1";

export function loadStoredMatches(): Match[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Match[]) : [];
  } catch {
    return [];
  }
}

/** Seeds localStorage with static matches on first load. Idempotent. */
export function initializeMatches(staticMatches: Match[]): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;
  const existing = loadStoredMatches();
  const existingIds = new Set(existing.map((m) => m.id));
  const toAdd = staticMatches.filter((m) => !existingIds.has(m.id));
  localStorage.setItem(KEY, JSON.stringify([...existing, ...toAdd]));
  localStorage.setItem(SEEDED_KEY, "true");
}

export function saveMatch(match: Match): void {
  if (typeof window === "undefined") return;
  const existing = loadStoredMatches();
  existing.unshift(match);
  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function updateMatch(updated: Match): void {
  if (typeof window === "undefined") return;
  const matches = loadStoredMatches();
  const idx = matches.findIndex((m) => m.id === updated.id);
  if (idx >= 0) {
    matches[idx] = updated;
    localStorage.setItem(KEY, JSON.stringify(matches));
  }
}

export function deleteMatch(id: string): void {
  if (typeof window === "undefined") return;
  const matches = loadStoredMatches();
  localStorage.setItem(KEY, JSON.stringify(matches.filter((m) => m.id !== id)));
}

export function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
