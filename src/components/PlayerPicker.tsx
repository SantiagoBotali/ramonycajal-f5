"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PlayerAvatar from "./PlayerAvatar";
import { Player } from "@/lib/types";

interface Props {
  allPlayers: Player[];
  team1: string[];
  team2: string[];
  activeTeam: 1 | 2;
  onSelect: (name: string) => void;
  onRemove: (name: string, team: 1 | 2) => void;
  onSwitchTeam: (team: 1 | 2) => void;
}

export default function PlayerPicker({ allPlayers, team1, team2, activeTeam, onSelect, onRemove, onSwitchTeam }: Props) {
  const selected = new Set([...team1, ...team2]);

  return (
    <div>
      {/* Team tabs */}
      <div className="flex gap-2 mb-4">
        {([1, 2] as const).map((t) => {
          const count = t === 1 ? team1.length : team2.length;
          return (
            <button
              key={t}
              onClick={() => onSwitchTeam(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTeam === t
                  ? t === 1 ? "bg-accent text-white" : "bg-red-500 text-white"
                  : "bg-surface-2 text-white border border-border"
              }`}
            >
              Equipo {t}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTeam === t ? "bg-white/20" : "bg-border"}`}>
                {count}/5
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected players for active team */}
      {(activeTeam === 1 ? team1 : team2).length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <AnimatePresence>
            {(activeTeam === 1 ? team1 : team2).map((name) => (
              <motion.div
                key={name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="relative"
              >
                <PlayerAvatar name={name} size={44} />
                <button
                  onClick={() => onRemove(name, activeTeam)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center z-10"
                >
                  <X size={9} strokeWidth={3} className="text-white" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {(activeTeam === 1 ? team1 : team2).length === 0 && (
        <div className="flex items-center justify-center h-12 mb-4 rounded-xl border border-dashed border-border">
          <span className="text-white text-xs">Seleccioná 5 jugadores</span>
        </div>
      )}

      {/* Player grid */}
      <div className="grid grid-cols-4 gap-2">
        {allPlayers.map((player) => {
          const inTeam1 = team1.includes(player.name);
          const inTeam2 = team2.includes(player.name);
          const isSelected = inTeam1 || inTeam2;
          const isCurrentTeam = activeTeam === 1 ? inTeam1 : inTeam2;
          const isFull = (activeTeam === 1 ? team1 : team2).length >= 5;
          const disabled = (isSelected && !isCurrentTeam) || (!isCurrentTeam && isFull);

          return (
            <motion.button
              key={player.id}
              whileTap={!disabled ? { scale: 0.92 } : {}}
              onClick={() => !disabled && !isCurrentTeam && onSelect(player.name)}
              disabled={disabled}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-150 ${
                isCurrentTeam
                  ? activeTeam === 1
                    ? "border-accent bg-accent/10"
                    : "border-red-400 bg-red-400/10"
                  : disabled
                  ? "border-border bg-surface opacity-30"
                  : "border-border bg-surface-2 hover:border-primary/40 active:bg-primary/5"
              }`}
            >
              <PlayerAvatar name={player.name} size={40} />
              <span className="text-[9px] font-medium text-white leading-tight text-center line-clamp-2">
                {player.name.split(" ")[0]}
              </span>
              {isCurrentTeam && (
                <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${activeTeam === 1 ? "bg-accent" : "bg-red-500"}`} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
