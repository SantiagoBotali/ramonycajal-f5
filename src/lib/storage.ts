"use client";

import { Match } from "./types";

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

export async function loadStoredMatches(): Promise<Match[]> {
  const data = await request<{ matches: Match[] }>("/api/matches");
  return data.matches;
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
