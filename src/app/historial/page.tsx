"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";
import { MATCHES } from "@/lib/data";
import { loadStoredMatches } from "@/lib/storage";
import { Match } from "@/lib/types";
import MatchCard from "@/components/MatchCard";

export default function HistorialPage() {
  const [userMatches, setUserMatches] = useState<Match[]>([]);

  useEffect(() => {
    setUserMatches(loadStoredMatches());
  }, []);

  const allMatches = [...userMatches, ...MATCHES].sort((a, b) => {
    const parseDate = (d: string) => {
      const [day, month, year] = d.split("/").map(Number);
      return new Date(year, month - 1, day).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div className="max-w-lg mx-auto px-4 pt-10 pb-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">2026</span>
            </div>
            <h1 className="text-2xl font-black text-white">Historial</h1>
            <p className="text-white text-xs mt-1">{allMatches.length} partidos jugados</p>
          </div>
          <Link
            href="/nuevo-partido"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-sm font-semibold"
          >
            <Plus size={14} />
            Nuevo
          </Link>
        </div>
      </motion.div>

      {allMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Clock size={36} className="text-white/30" />
          <p className="text-white text-sm">No hay partidos registrados</p>
          <Link href="/nuevo-partido" className="px-4 py-2 bg-primary rounded-xl text-bg text-sm font-bold">
            Crear primer partido
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allMatches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MatchCard match={match} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
