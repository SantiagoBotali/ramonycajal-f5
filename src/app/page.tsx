"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Filter } from "lucide-react";
import { getRankedPlayersFromMatches } from "@/lib/data";
import { loadStoredMatches } from "@/lib/storage";
import { Match } from "@/lib/types";
import RankingCard from "@/components/RankingCard";
import { AnimatedText } from "@/components/ui/AnimatedShinyText";

export default function HomePage() {
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
  const top5 = filtered.slice(0, 5);

  return (
    <div className="relative min-h-screen">
      <div className="max-w-lg mx-auto px-4 pt-10 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={16} className="text-white" />
            <span className="text-xs font-semibold text-white uppercase tracking-widest">Temporada 2026</span>
          </div>
          <AnimatedText
            text="Ramón y Cajal"
            className="justify-center"
            textClassName="text-3xl sm:text-4xl font-black"
          />
          <p className="text-white/70 text-sm mt-1">Fútbol 5</p>
        </motion.div>

        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-gold" />
            <span className="text-sm font-bold text-white uppercase tracking-wide">Top 5</span>
          </div>
          <button
            onClick={() => setShowRYCOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              showRYCOnly
                ? "bg-primary/20 border-primary text-primary"
                : "bg-surface border-border text-white"
            }`}
          >
            <Filter size={11} />
            RYC
          </button>
        </div>

        {/* Top 5 cards */}
        <div className="flex flex-col gap-2.5">
          {top5.map((player, i) => {
            const globalPos = ranked.indexOf(player) + 1;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <RankingCard player={player} position={globalPos} />
              </motion.div>
            );
          })}
        </div>

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          {[
            { label: "Partidos", value: allMatches.length.toString() },
            { label: "Jugadores", value: ranked.filter((p) => p.stats.pj > 0).length.toString() },
            { label: "Líderes RYC", value: ranked.filter((p) => p.isRYC && p.stats.pj > 0).length.toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-black text-text-primary">{stat.value}</p>
              <p className="text-[10px] text-white mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
