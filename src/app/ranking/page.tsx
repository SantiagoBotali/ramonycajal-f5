"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Filter } from "lucide-react";
import { getRankedPlayersFromMatches } from "@/lib/data";
import { loadStoredMatches } from "@/lib/storage";
import { Match } from "@/lib/types";
import RankingCard from "@/components/RankingCard";
import { AnimatedText } from "@/components/ui/AnimatedShinyText";

export default function RankingPage() {
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [showRYCOnly, setShowRYCOnly] = useState(false);

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
  const filtered = showRYCOnly ? ranked.filter((p) => p.isRYC) : ranked;

  return (
    <div className="max-w-lg mx-auto px-4 pt-10 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={16} className="text-white" />
          <span className="text-xs font-semibold text-white uppercase tracking-widest">Temporada 2026</span>
        </div>
        <AnimatedText
          text="Ranking General"
          textClassName="text-2xl sm:text-3xl font-black"
        />
        <p className="text-white/70 text-xs mt-1">Ordenado por índice (Puntos × Tasa de Victoria)</p>
      </motion.div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {["PJ", "G/E/P", "Pts", "Índice"].map((label) => (
          <div key={label} className="bg-surface border border-border rounded-lg p-2 text-center">
            <p className="text-[11px] font-bold text-white">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-white font-medium">{filtered.length} jugadores</p>
        <button
          onClick={() => setShowRYCOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
            showRYCOnly
              ? "bg-primary/20 border-primary text-primary"
              : "bg-surface border-border text-white"
          }`}
        >
          <Filter size={11} />
          {showRYCOnly ? "Solo RYC" : "Todos"}
        </button>
      </div>

      {/* Rankings */}
      <div className="flex flex-col gap-2">
        {filtered.map((player, i) => {
          const globalPos = ranked.indexOf(player) + 1;
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <RankingCard player={player} position={showRYCOnly ? i + 1 : globalPos} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
