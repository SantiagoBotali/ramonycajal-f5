"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Pencil, Trash2, AlertTriangle, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Match } from "@/lib/types";
import { getMatchResult, getMVPImage } from "@/lib/data";
import PlayerAvatar from "./PlayerAvatar";
import SoccerField from "./SoccerField";

interface Props {
  match: Match;
  onDelete?: (id: string) => void;
}

export default function MatchCard({ match, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const result = getMatchResult(match);
  const isDraw = result === "draw";

  function handleDelete() {
    onDelete?.(match.id);
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <button
        className="w-full p-4 flex items-center gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-1.5 text-white/60 text-xs flex-shrink-0">
          <Calendar size={12} />
          <span>{match.date}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Team 1 */}
            <div className={`flex-1 min-w-0 text-right ${result === "team1" ? "text-text-primary" : "text-white/70"}`}>
              <p className="text-xs font-semibold truncate leading-tight">{match.team1.name}</p>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 flex-shrink-0 px-2">
              <span className={`text-lg font-black ${result === "team1" ? "text-primary" : isDraw ? "text-yellow-400" : "text-white/70"}`}>
                {match.team1.score}
              </span>
              <span className="text-white/60 text-sm font-light">–</span>
              <span className={`text-lg font-black ${result === "team2" ? "text-primary" : isDraw ? "text-yellow-400" : "text-white/70"}`}>
                {match.team2.score}
              </span>
            </div>

            {/* Team 2 */}
            <div className={`flex-1 min-w-0 text-left ${result === "team2" ? "text-text-primary" : "text-white/70"}`}>
              <p className="text-xs font-semibold truncate leading-tight">{match.team2.name}</p>
            </div>
          </div>
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-white/60">
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {/* Score header */}
              <div className="flex items-center justify-center gap-6 p-4 pb-2">
                <div className="text-center">
                  <p className="text-xs text-white/60 truncate max-w-[120px]">{match.team1.name}</p>
                  <p className={`text-3xl font-black ${result === "team1" ? "text-primary" : isDraw ? "text-yellow-400" : "text-white/70"}`}>
                    {match.team1.score}
                  </p>
                </div>
                <div className="text-white/60 text-lg font-light">–</div>
                <div className="text-center">
                  <p className="text-xs text-white/60 truncate max-w-[120px]">{match.team2.name}</p>
                  <p className={`text-3xl font-black ${result === "team2" ? "text-primary" : isDraw ? "text-yellow-400" : "text-white/70"}`}>
                    {match.team2.score}
                  </p>
                </div>
              </div>

              {/* Field */}
              <div className="px-4 pb-2">
                <SoccerField
                  team1Players={match.team1.players}
                  team2Players={match.team2.players}
                  team1Name={match.team1.name}
                  team2Name={match.team2.name}
                />
              </div>

              {/* Players list */}
              <div className="grid grid-cols-2 gap-px bg-border mx-4 mb-4 rounded-xl overflow-hidden">
                <div className="bg-surface p-3">
                  <p className="text-[10px] font-bold text-accent mb-2 uppercase tracking-wide truncate">{match.team1.name}</p>
                  <div className="flex flex-col gap-1.5">
                    {match.team1.players.map((name) => (
                      <div key={name} className="flex items-center gap-2">
                        <PlayerAvatar name={name} size={24} />
                        <span className="text-xs text-white/70 truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface p-3">
                  <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide truncate">{match.team2.name}</p>
                  <div className="flex flex-col gap-1.5">
                    {match.team2.players.map((name) => (
                      <div key={name} className="flex items-center gap-2">
                        <PlayerAvatar name={name} size={24} />
                        <span className="text-xs text-white/70 truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MVP */}
              {match.mvp && (
                <div className="mx-4 mb-4 border border-gold/25 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(to bottom, rgba(245,158,11,0.08), rgba(245,158,11,0.04))" }}>
                  <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                    <Trophy size={14} className="text-gold flex-shrink-0" />
                    <p className="text-[10px] font-bold text-gold uppercase tracking-widest">MVP del partido</p>
                  </div>
                  <div className="relative w-full">
                    <Image
                      src={getMVPImage(match.mvp)}
                      alt={match.mvp}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto block"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
                      <p className="text-white font-black text-base leading-tight">{match.mvp}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <AnimatePresence mode="wait">
                {!confirming ? (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 mx-4 mb-4"
                  >
                    <Link
                      href={`/editar-partido/${match.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-2 border border-border text-white/80 text-xs font-semibold hover:border-accent/50 hover:text-accent transition-colors"
                    >
                      <Pencil size={13} />
                      Editar
                    </Link>
                    <button
                      onClick={() => setConfirming(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-2 border border-border text-white/80 text-xs font-semibold hover:border-red-500/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                      Eliminar
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mx-4 mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-300 font-medium">
                        ¿Eliminar este partido? Los rankings se actualizarán.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirming(false)}
                        className="flex-1 py-2 rounded-lg bg-surface-2 border border-border text-white/70 text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold"
                      >
                        Sí, eliminar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
