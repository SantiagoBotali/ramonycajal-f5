"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar } from "lucide-react";
import { Match } from "@/lib/types";
import { getMatchResult } from "@/lib/data";
import PlayerAvatar from "./PlayerAvatar";
import SoccerField from "./SoccerField";

interface Props {
  match: Match;
}

export default function MatchCard({ match }: Props) {
  const [open, setOpen] = useState(false);
  const result = getMatchResult(match);
  const isDraw = result === "draw";

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
