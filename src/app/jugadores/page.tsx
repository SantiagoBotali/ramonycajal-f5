"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PLAYERS } from "@/lib/data";
import { getPlayerImage } from "@/lib/data";

export default function JugadoresPage() {
  const [showRYCOnly, setShowRYCOnly] = useState(false);

  const sorted = [...PLAYERS]
    .filter((p) => !showRYCOnly || p.isRYC)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <div className="max-w-lg mx-auto px-4 pt-10 pb-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Plantel</span>
            </div>
            <h1 className="text-2xl font-black text-text-primary">Jugadores</h1>
            <p className="text-text-muted text-xs mt-1">{sorted.length} jugadores</p>
          </div>
          <button
            onClick={() => setShowRYCOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              showRYCOnly
                ? "bg-primary/20 border-primary text-primary"
                : "bg-surface border-border text-text-secondary"
            }`}
          >
            <Filter size={11} />
            {showRYCOnly ? "Solo RYC" : "Todos"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        {sorted.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link href={`/jugadores/${player.id}`} className="block active:scale-95 transition-transform duration-150">
              <div className="rounded-2xl overflow-hidden border border-border bg-surface group">
                {/* Square photo */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={getPlayerImage(player.name)}
                    alt={player.name}
                    fill
                    className="object-cover object-top"
                    sizes="33vw"
                  />
                  {player.isRYC && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-md" />
                  )}
                </div>
                {/* Name */}
                <div className="px-2 py-2 bg-surface-2">
                  <p className="text-[11px] font-semibold text-text-primary leading-tight text-center line-clamp-2">
                    {player.name}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
