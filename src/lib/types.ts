export interface PlayerStats {
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  tasa: number;
  puntos: number;
  indice: number;
}

export interface Player {
  id: string;
  name: string;
  isRYC: boolean;
  stats: PlayerStats;
}

export interface MatchTeam {
  name: string;
  players: string[];
  score: number;
}

export interface Match {
  id: string;
  date: string;
  team1: MatchTeam;
  team2: MatchTeam;
  isUserCreated?: boolean;
  mvp?: string;
}
