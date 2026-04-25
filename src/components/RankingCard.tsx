import { Player } from "@/lib/types";
import PlayerAvatar from "./PlayerAvatar";
import { Crown } from "lucide-react";

interface Props {
  player: Player;
  position: number;
}

const medalColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

export default function RankingCard({ player, position }: Props) {
  const isTop3 = position <= 3;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
        isTop3
          ? "bg-surface-2 border-primary/20"
          : "bg-surface border-border"
      }`}
    >
      <div className={`w-8 text-center font-bold text-sm flex-shrink-0 ${medalColors[position] ?? "text-white"}`}>
        {position === 1 ? <Crown size={16} className="mx-auto text-yellow-400" /> : `#${position}`}
      </div>

      <PlayerAvatar name={player.name} size={40} showRing />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={`font-semibold text-sm truncate ${isTop3 ? "text-text-primary" : "text-text-primary"}`}>
            {player.name}
          </p>
          {player.isRYC && (
            <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
              RYC
            </span>
          )}
        </div>
        <div className="flex gap-3 mt-0.5">
          <span className="text-[11px] text-white/70">PJ {player.stats.pj}</span>
          <span className="text-[11px] text-green-400">G {player.stats.pg}</span>
          <span className="text-[11px] text-yellow-400">E {player.stats.pe}</span>
          <span className="text-[11px] text-red-400">P {player.stats.pp}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`text-base font-bold ${isTop3 ? "text-primary" : "text-text-primary"}`}>
          {player.stats.indice.toFixed(2)}
        </p>
        <p className="text-[10px] text-white/70">{player.stats.puntos} pts</p>
      </div>
    </div>
  );
}
