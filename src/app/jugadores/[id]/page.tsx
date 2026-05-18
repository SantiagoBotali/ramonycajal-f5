"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Trophy, TrendingUp, Target, Swords } from "lucide-react";
import { PLAYERS_BY_ID, getRankedPlayersFromMatches } from "@/lib/data";
import { loadStoredMatches } from "@/lib/storage";
import { Match } from "@/lib/types";
import PlayerAvatar from "@/components/PlayerAvatar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const player = PLAYERS_BY_ID.get(id);

  const [allMatches, setAllMatches] = useState<Match[]>([]);

  useEffect(() => {
    let mounted = true;

    loadStoredMatches()
      .then((matches) => {
        if (mounted) setAllMatches(matches);
      })
      .catch((error) => console.error(error));

    return () => {
      mounted = false;
    };
  }, []);

  const ranked = useMemo(() => getRankedPlayersFromMatches(allMatches), [allMatches]);
  const dynamicPlayer = ranked.find((p) => p.id === id);
  const position = ranked.findIndex((p) => p.id === id) + 1;

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white/60">Jugador no encontrado</p>
        <button onClick={() => router.back()} className="text-primary text-sm font-semibold">Volver</button>
      </div>
    );
  }

  const stats = dynamicPlayer?.stats ?? player.stats;
  const rycRanked = ranked.filter((p) => p.isRYC);
  const rycPosition = rycRanked.findIndex((p) => p.id === id) + 1;

  const statBlocks = [
    { label: "Partidos Jugados", value: stats.pj, icon: <Swords size={16} />, color: "text-white" },
    { label: "Ganados", value: stats.pg, icon: <Trophy size={16} />, color: "text-green-400" },
    { label: "Empatados", value: stats.pe, icon: <Target size={16} />, color: "text-yellow-400" },
    { label: "Perdidos", value: stats.pp, icon: <TrendingUp size={16} />, color: "text-red-400" },
    { label: "Tasa de Victoria", value: `${stats.tasa.toFixed(1)}%`, icon: <TrendingUp size={16} />, color: "text-accent" },
    { label: "Puntos", value: stats.puntos, icon: <Trophy size={16} />, color: "text-gold" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-white/60 text-sm mb-6 hover:text-white transition-colors">
        <ChevronLeft size={18} />
        Jugadores
      </button>

      {/* Player hero */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <PlayerAvatar name={player.name} size={100} showRing />
          {position > 0 && position <= 3 && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold flex items-center justify-center border-2 border-bg">
              <Trophy size={12} className="text-bg" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-black text-white text-center">{player.name}</h1>

        <div className="flex items-center gap-2 mt-2">
          {player.isRYC && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
              Ramón y Cajal
            </span>
          )}
          {position > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-2 text-white/80 border border-border">
              #{position} Global
            </span>
          )}
          {player.isRYC && rycPosition > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-2 text-primary border border-primary/20">
              #{rycPosition} RYC
            </span>
          )}
        </div>
      </motion.div>

      {/* Index highlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 rounded-2xl p-5 mb-6 text-center"
      >
        <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Índice de Rendimiento</p>
        <p className="text-5xl font-black text-primary">{stats.indice.toFixed(2)}</p>
        <p className="text-xs text-white/60 mt-1">Puntos × Tasa de Victoria</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        {statBlocks.map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
            <div className={`mb-1 ${stat.color}`}>{stat.icon}</div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-white/60 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Win rate bar */}
      {stats.pj > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-xl p-4"
        >
          <p className="text-xs font-semibold text-white/80 mb-3 uppercase tracking-wide">Distribución de resultados</p>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {stats.pg > 0 && (
              <div
                className="bg-green-500 rounded-l-full"
                style={{ width: `${(stats.pg / stats.pj) * 100}%` }}
              />
            )}
            {stats.pe > 0 && (
              <div
                className="bg-yellow-400"
                style={{ width: `${(stats.pe / stats.pj) * 100}%` }}
              />
            )}
            {stats.pp > 0 && (
              <div
                className="bg-red-500 rounded-r-full"
                style={{ width: `${(stats.pp / stats.pj) * 100}%` }}
              />
            )}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-green-400">{stats.pg}G ({stats.pj > 0 ? ((stats.pg / stats.pj) * 100).toFixed(0) : 0}%)</span>
            <span className="text-[10px] text-yellow-400">{stats.pe}E ({stats.pj > 0 ? ((stats.pe / stats.pj) * 100).toFixed(0) : 0}%)</span>
            <span className="text-[10px] text-red-400">{stats.pp}P ({stats.pj > 0 ? ((stats.pp / stats.pj) * 100).toFixed(0) : 0}%)</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
