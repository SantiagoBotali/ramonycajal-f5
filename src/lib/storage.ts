"use client";

import { Match } from "./types";

const LEGACY_KEY = "ryc-matches";
const MIGRATED_KEY = "ryc-matches-migrated-to-redis";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "No se pudieron sincronizar los partidos");
  }

  return response.json() as Promise<T>;
}

function loadLegacyMatches(): Match[] {
  if (typeof window === "undefined" || localStorage.getItem(MIGRATED_KEY)) return [];

  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    const matches = raw ? JSON.parse(raw) : [];
    return Array.isArray(matches) ? (matches as Match[]) : [];
  } catch {
    return [];
  }
}

async function migrateLegacyMatches(serverMatches: Match[]): Promise<Match[]> {
  const legacyMatches = loadLegacyMatches();
  if (legacyMatches.length === 0) return serverMatches;

  const serverIds = new Set(serverMatches.map((match) => match.id));
  const missingMatches = legacyMatches.filter((match) => !serverIds.has(match.id));

  if (missingMatches.length === 0) {
    localStorage.setItem(MIGRATED_KEY, "true");
    return serverMatches;
  }

  const data = await request<{ matches: Match[] }>("/api/matches", {
    method: "PUT",
    body: JSON.stringify(missingMatches),
  });

  localStorage.setItem(MIGRATED_KEY, "true");
  return data.matches;
}

export async function loadStoredMatches(): Promise<Match[]> {
  const data = await request<{ matches: Match[] }>("/api/matches");
  return migrateLegacyMatches(data.matches);
}

export async function saveMatch(match: Match): Promise<Match> {
  const data = await request<{ match: Match }>("/api/matches", {
    method: "POST",
    body: JSON.stringify(match),
  });
  return data.match;
}

export async function updateMatch(updated: Match): Promise<Match> {
  const data = await request<{ match: Match }>(`/api/matches/${updated.id}`, {
    method: "PUT",
    body: JSON.stringify(updated),
  });
  return data.match;
}

export async function deleteMatch(id: string): Promise<void> {
  await request<{ ok: true }>(`/api/matches/${id}`, {
    method: "DELETE",
  });
}

export function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
