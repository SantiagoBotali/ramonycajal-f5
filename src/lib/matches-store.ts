import "server-only";

import { Redis } from "@upstash/redis";
import { MATCHES } from "./data";
import { Match } from "./types";

const MATCHES_KEY = "ryc:matches:v1";

function findEnvPair(): { url?: string; token?: string } {
  const explicitPairs = [
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    ["UPSTASH_REDIS_REST_KV_REST_API_URL", "UPSTASH_REDIS_REST_KV_REST_API_TOKEN"],
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["STORAGE_URL", "STORAGE_TOKEN"],
    ["UPSTASH_KV_REST_API_URL", "UPSTASH_KV_REST_API_TOKEN"],
  ] as const;

  for (const [urlKey, tokenKey] of explicitPairs) {
    if (process.env[urlKey] && process.env[tokenKey]) {
      return { url: process.env[urlKey], token: process.env[tokenKey] };
    }
  }

  const upstashUrlKey = Object.keys(process.env).find((key) => {
    const value = process.env[key];
    return key.endsWith("_URL") && typeof value === "string" && value.includes("upstash.io");
  });

  if (!upstashUrlKey) {
    return {};
  }

  const prefix = upstashUrlKey.slice(0, -"_URL".length);
  return {
    url: process.env[upstashUrlKey],
    token: process.env[`${prefix}_TOKEN`] ?? process.env[`${prefix}_REST_API_TOKEN`],
  };
}

function getRedis(): Redis {
  const { url, token } = findEnvPair();

  if (!url || !token) {
    throw new Error("Faltan las variables de Redis/Upstash");
  }

  return new Redis({ url, token });
}

function assertMatch(value: unknown): asserts value is Match {
  const match = value as Match;

  if (
    !match ||
    typeof match.id !== "string" ||
    typeof match.date !== "string" ||
    !match.team1 ||
    !match.team2 ||
    typeof match.team1.name !== "string" ||
    typeof match.team2.name !== "string" ||
    typeof match.team1.score !== "number" ||
    typeof match.team2.score !== "number" ||
    !Array.isArray(match.team1.players) ||
    !Array.isArray(match.team2.players)
  ) {
    throw new Error("Formato de partido invalido");
  }
}

async function readMatches(redis = getRedis()): Promise<Match[]> {
  const stored = await redis.get<Match[]>(MATCHES_KEY);

  if (Array.isArray(stored)) {
    if (stored.length === 0) {
      await redis.set(MATCHES_KEY, MATCHES);
      return MATCHES;
    }

    return stored;
  }

  await redis.set(MATCHES_KEY, MATCHES, { nx: true });
  return (await redis.get<Match[]>(MATCHES_KEY)) ?? MATCHES;
}

async function writeMatches(matches: Match[]): Promise<void> {
  const redis = getRedis();
  await redis.set(MATCHES_KEY, matches);
}

export async function getMatches(): Promise<Match[]> {
  return readMatches();
}

export async function createMatch(match: unknown): Promise<Match> {
  assertMatch(match);

  const matches = await readMatches();
  const next = matches.filter((existing) => existing.id !== match.id);
  next.unshift(match);
  await writeMatches(next);
  return match;
}

export async function importMatches(importedMatches: unknown): Promise<Match[]> {
  if (!Array.isArray(importedMatches)) {
    throw new Error("Formato de partidos invalido");
  }

  importedMatches.forEach(assertMatch);

  const matches = await readMatches();
  const existingIds = new Set(matches.map((match) => match.id));
  const toImport = importedMatches.filter((match) => !existingIds.has(match.id));

  if (toImport.length === 0) {
    return matches;
  }

  const next = [...toImport, ...matches];
  await writeMatches(next);
  return next;
}

export async function replaceMatch(id: string, match: unknown): Promise<Match | null> {
  assertMatch(match);

  const matches = await readMatches();
  const index = matches.findIndex((existing) => existing.id === id);

  if (index === -1) {
    return null;
  }

  matches[index] = { ...match, id };
  await writeMatches(matches);
  return matches[index];
}

export async function removeMatch(id: string): Promise<boolean> {
  const matches = await readMatches();
  const next = matches.filter((match) => match.id !== id);

  if (next.length === matches.length) {
    return false;
  }

  await writeMatches(next);
  return true;
}
