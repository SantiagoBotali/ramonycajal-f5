import { Player, Match } from "./types";

export const RYC_SLUGS = new Set([
  "agustin-beninca",
  "agustin-fraire",
  "andres-serafino",
  "emiliano-gongora",
  "federico-otterstedt",
  "francisco-altina",
  "francisco-franco",
  "julio-chapo",
  "lucas-vaillard",
  "luciano-blatter",
  "luis-maria-burgi",
  "mateo-corrado",
  "matias-celiz",
  "santiago-botali",
  "santino-ferrero",
  "valentin-lopez",
]);

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getPlayerImage(nameOrSlug: string): string {
  const slug = nameOrSlug.includes(" ") ? nameToSlug(nameOrSlug) : nameOrSlug;
  if (RYC_SLUGS.has(slug)) return `/jugadores/${slug}.png`;
  return "/jugadores/DefaultImage.png";
}

export function getMVPImage(nameOrSlug: string): string {
  const slug = nameOrSlug.includes(" ") ? nameToSlug(nameOrSlug) : nameOrSlug;
  if (RYC_SLUGS.has(slug)) return `/jugadores-mvps/${slug}-mvp.png`;
  return "/jugadores-mvps/default-mvp.png";
}

export function isRYCPlayer(nameOrSlug: string): boolean {
  const slug = nameOrSlug.includes(" ") ? nameToSlug(nameOrSlug) : nameOrSlug;
  return RYC_SLUGS.has(slug);
}

export const PLAYERS: Player[] = [
  { id: "andres-serafino", name: "Andrés Serafino", isRYC: true, stats: { pj: 5, pg: 4, pe: 1, pp: 0, tasa: 80.0, puntos: 13, indice: 10.4 } },
  { id: "santiago-botali", name: "Santiago Botali", isRYC: true, stats: { pj: 6, pg: 4, pe: 1, pp: 1, tasa: 66.67, puntos: 13, indice: 8.67 } },
  { id: "sergio-picard", name: "Sergio Picard", isRYC: false, stats: { pj: 2, pg: 2, pe: 0, pp: 0, tasa: 100.0, puntos: 6, indice: 6.0 } },
  { id: "gabriel-jorge", name: "Gabriel Jorge", isRYC: false, stats: { pj: 2, pg: 2, pe: 0, pp: 0, tasa: 100.0, puntos: 6, indice: 6.0 } },
  { id: "francisco-altina", name: "Francisco Altina", isRYC: true, stats: { pj: 6, pg: 3, pe: 1, pp: 2, tasa: 50.0, puntos: 10, indice: 5.0 } },
  { id: "valentin-lopez", name: "Valentín Lopez", isRYC: true, stats: { pj: 7, pg: 3, pe: 1, pp: 3, tasa: 42.86, puntos: 10, indice: 4.29 } },
  { id: "emiliano-gongora", name: "Emiliano Góngora", isRYC: true, stats: { pj: 4, pg: 2, pe: 1, pp: 1, tasa: 50.0, puntos: 7, indice: 3.5 } },
  { id: "francisco-franco", name: "Francisco Franco", isRYC: true, stats: { pj: 1, pg: 1, pe: 0, pp: 0, tasa: 100.0, puntos: 3, indice: 3.0 } },
  { id: "lucas-vaillard", name: "Lucas Vaillard", isRYC: true, stats: { pj: 1, pg: 1, pe: 0, pp: 0, tasa: 100.0, puntos: 3, indice: 3.0 } },
  { id: "julio-chapo", name: "Julio Chapo", isRYC: true, stats: { pj: 1, pg: 1, pe: 0, pp: 0, tasa: 100.0, puntos: 3, indice: 3.0 } },
  { id: "matias-celiz", name: "Matías Celiz", isRYC: true, stats: { pj: 5, pg: 2, pe: 1, pp: 2, tasa: 40.0, puntos: 7, indice: 2.8 } },
  { id: "agustin-beninca", name: "Agustín Beninca", isRYC: true, stats: { pj: 5, pg: 2, pe: 0, pp: 3, tasa: 40.0, puntos: 6, indice: 2.4 } },
  { id: "santino-ferrero", name: "Santino Ferrero", isRYC: true, stats: { pj: 3, pg: 1, pe: 0, pp: 2, tasa: 33.33, puntos: 3, indice: 1.0 } },
  { id: "rafael-garcia", name: "Rafael García", isRYC: false, stats: { pj: 5, pg: 1, pe: 1, pp: 3, tasa: 20.0, puntos: 4, indice: 0.8 } },
  { id: "luciano-blatter", name: "Luciano Blatter", isRYC: true, stats: { pj: 6, pg: 1, pe: 1, pp: 4, tasa: 16.67, puntos: 4, indice: 0.67 } },
  { id: "federico-otterstedt", name: "Federico Otterstedt", isRYC: true, stats: { pj: 7, pg: 1, pe: 1, pp: 5, tasa: 14.29, puntos: 4, indice: 0.57 } },
  { id: "mateo-corrado", name: "Mateo Corrado", isRYC: true, stats: { pj: 5, pg: 0, pe: 1, pp: 4, tasa: 0.0, puntos: 1, indice: 0.0 } },
  { id: "agustin-fraire", name: "Agustín Fraire", isRYC: true, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "alvaro-ochoa", name: "Álvaro Ochoa", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "melli-1", name: "Melli 1", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "tomas-perassi", name: "Tomás Perassi", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "ander-calvillo", name: "Ander Calvillo", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "agustin-trevisan", name: "Agustín Trevisán", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "luis-maria-burgi", name: "Luis María Burgi", isRYC: true, stats: { pj: 1, pg: 0, pe: 0, pp: 1, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "melli-2", name: "Melli 2", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
  { id: "maximo-nocete", name: "Máximo Nocete", isRYC: false, stats: { pj: 0, pg: 0, pe: 0, pp: 0, tasa: 0.0, puntos: 0, indice: 0.0 } },
];

export const PLAYERS_BY_ID = new Map(PLAYERS.map((p) => [p.id, p]));
export const PLAYERS_BY_NAME = new Map(PLAYERS.map((p) => [p.name, p]));

export const MATCHES: Match[] = [
  {
    id: "match-1",
    date: "03/01/2026",
    team1: {
      name: "ANOTALO AL EXCEL",
      score: 5,
      players: ["Santiago Botali", "Lucas Vaillard", "Santino Ferrero", "Sergio Picard", "Julio Chapo", "Andrés Serafino", "Francisco Franco"],
    },
    team2: {
      name: "NO CUENTA PORQUE NO TERMINO",
      score: 2,
      players: ["Rafael García", "Luciano Blatter", "Agustín Beninca", "Valentín Lopez", "Emiliano Góngora", "Luis María Burgi", "Federico Otterstedt"],
    },
  },
  {
    id: "match-2",
    date: "10/01/2026",
    team1: {
      name: "LA MALDICIÓN DEL MATI",
      score: 8,
      players: ["Rafael García", "Mateo Corrado", "Federico Otterstedt", "Luciano Blatter", "Francisco Altina"],
    },
    team2: {
      name: "LISANDRO MÁRSICO",
      score: 10,
      players: ["Nico", "Sergio Picard", "Valentín Lopez", "Gabriel Jorge", "Santiago Botali"],
    },
  },
  {
    id: "match-3",
    date: "07/03/2026",
    team1: {
      name: "AHORA NO BOQUEAS MÁS (PIDIÓ EL TAS)",
      score: 11,
      players: ["Rafael García", "Valentín Lopez", "Luciano Blatter", "Mateo Corrado", "Francisco Altina"],
    },
    team2: {
      name: "VENDADO LOS BAILO, IMAGINATE SI NO TENDRIA VENDA",
      score: 11,
      players: ["Matías Celiz", "Santiago Botali", "Emiliano Góngora", "Federico Otterstedt", "Andrés Serafino"],
    },
  },
  {
    id: "match-4",
    date: "28/03/2026",
    team1: {
      name: "NO SE OLVIDAN DE ANOTAR NINGUNO Y ESTE SI",
      score: 16,
      players: ["Santiago Botali", "Francisco Altina", "Valentín Lopez", "Gabriel Jorge", "Rafael García"],
    },
    team2: {
      name: "LA SEGUNDA VUELTA DE MC9 + THERIAN",
      score: 13,
      players: ["Matías Celiz", "Agustín Beninca", "Luciano Blatter", "Federico Otterstedt", "Santiago Borgeattino"],
    },
  },
  {
    id: "match-5",
    date: "04/04/2026",
    team1: {
      name: "LEÑADORES FC",
      score: 8,
      players: ["Andrés Serafino", "Francisco Altina", "Luciano Blatter", "Emiliano Góngora", "Agustín Beninca"],
    },
    team2: {
      name: "HOY JUGUÉ MAL",
      score: 7,
      players: ["Matías Celiz", "Mateo Corrado", "Santiago Botali", "Valentín Lopez", "Federico Otterstedt"],
    },
  },
  {
    id: "match-6",
    date: "11/04/2026",
    team1: {
      name: "YO NO JUEGO A HACER GOLES, YO JUEGO A GANAR",
      score: 9,
      players: ["Matías Celiz", "Agustín Beninca", "Francisco Altina", "Andrés Serafino", "Emiliano Góngora"],
    },
    team2: {
      name: "DISCAPACITADOS FC",
      score: 8,
      players: ["Federico Otterstedt", "Mateo Corrado", "Valentín Lopez", "Rafael García", "Santino Ferrero"],
    },
  },
  {
    id: "match-7",
    date: "18/04/2026",
    team1: {
      name: "ONANA MASTERCLASS",
      score: 11,
      players: ["Andrés Serafino", "Matías Celiz", "Santiago Botali", "Valentín Lopez", "Federico Otterstedt"],
    },
    team2: {
      name: "LUCHO AL ÁNGULO",
      score: 9,
      players: ["Agustín Beninca", "Santino Ferrero", "Mateo Corrado", "Luciano Blatter", "Francisco Altina"],
    },
  },
];

export function getMatchResult(match: Match): "team1" | "team2" | "draw" {
  if (match.team1.score > match.team2.score) return "team1";
  if (match.team2.score > match.team1.score) return "team2";
  return "draw";
}

/** @deprecated Use getRankedPlayersFromMatches for live data */
export function getRankedPlayers(): Player[] {
  return [...PLAYERS].sort((a, b) => {
    if (b.stats.indice !== a.stats.indice) return b.stats.indice - a.stats.indice;
    return b.stats.puntos - a.stats.puntos;
  });
}

/** Calculates a single player's stats from all matches dynamically. */
export function calculatePlayerStats(allMatches: Match[], playerName: string): import("./types").PlayerStats {
  let pj = 0, pg = 0, pe = 0, pp = 0;
  for (const match of allMatches) {
    const inTeam1 = match.team1.players.includes(playerName);
    const inTeam2 = match.team2.players.includes(playerName);
    if (!inTeam1 && !inTeam2) continue;
    pj++;
    const result = getMatchResult(match);
    if (result === "draw") pe++;
    else if ((result === "team1" && inTeam1) || (result === "team2" && inTeam2)) pg++;
    else pp++;
  }
  const tasa = pj > 0 ? parseFloat(((pg / pj) * 100).toFixed(2)) : 0;
  const puntos = pg * 3 + pe;
  const indice = parseFloat(((puntos * tasa) / 100).toFixed(2));
  return { pj, pg, pe, pp, tasa, puntos, indice };
}

/** Returns all players with stats dynamically computed from the given match list. */
export function getRankedPlayersFromMatches(allMatches: Match[]): Player[] {
  const players = PLAYERS.map((p) => ({
    ...p,
    stats: calculatePlayerStats(allMatches, p.name),
  }));
  return players.sort((a, b) => {
    if (b.stats.indice !== a.stats.indice) return b.stats.indice - a.stats.indice;
    return b.stats.puntos - a.stats.puntos;
  });
}
