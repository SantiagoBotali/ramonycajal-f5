"use client";
import { Match } from "./types";

const KEY = "ryc-matches";

export function loadStoredMatches(): Match[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Match[]) : [];
  } catch {
    return [];
  }
}

export function saveMatch(match: Match): void {
  if (typeof window === "undefined") return;
  const existing = loadStoredMatches();
  existing.unshift(match);
  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
