"use client";
import PlayerAvatar from "./PlayerAvatar";

interface Props {
  team1Players: string[];
  team2Players: string[];
  team1Name: string;
  team2Name: string;
}

function getPositions(count: number): Array<{ top: string; left: string }> {
  if (count <= 5) {
    return [
      { top: "50%", left: "8%" },
      { top: "25%", left: "28%" },
      { top: "50%", left: "28%" },
      { top: "75%", left: "28%" },
      { top: "50%", left: "45%" },
    ].slice(0, count);
  }
  const positions: Array<{ top: string; left: string }> = [];
  for (let i = 0; i < count; i++) {
    positions.push({ top: `${15 + (i * 70) / (count - 1)}%`, left: `${8 + (i % 3) * 16}%` });
  }
  return positions;
}

function getPositionsRight(count: number): Array<{ top: string; left: string }> {
  const mirrored = getPositions(count);
  return mirrored.map((p) => ({
    top: p.top,
    left: `${100 - parseFloat(p.left)}%`,
  }));
}

export default function SoccerField({ team1Players, team2Players, team1Name, team2Name }: Props) {
  const t1 = team1Players.slice(0, 7);
  const t2 = team2Players.slice(0, 7);
  const pos1 = getPositions(t1.length);
  const pos2 = getPositionsRight(t2.length);

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: "56%" }}>
      {/* Field background */}
      <div className="absolute inset-0 bg-field">
        {/* Stripes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${i * 12.5}%`,
              width: "12.5%",
              background: i % 2 === 0 ? "rgba(0,0,0,0.08)" : "transparent",
            }}
          />
        ))}

        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square rounded-full border border-white/20" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />

        {/* Left goal area */}
        <div className="absolute top-[30%] left-0 w-[12%] h-[40%] border border-white/20 border-l-0" />
        <div className="absolute top-[40%] left-0 w-[6%] h-[20%] border border-white/20 border-l-0" />

        {/* Right goal area */}
        <div className="absolute top-[30%] right-0 w-[12%] h-[40%] border border-white/20 border-r-0" />
        <div className="absolute top-[40%] right-0 w-[6%] h-[20%] border border-white/20 border-r-0" />

        {/* Team 1 players (left side) */}
        {t1.map((name, i) => (
          <div
            key={name + i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos1[i].top, left: pos1[i].left }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <div className="ring-2 ring-accent rounded-full">
                <PlayerAvatar name={name} size={28} />
              </div>
              <span className="text-[8px] font-semibold text-white bg-accent/80 px-1 rounded leading-tight max-w-[52px] truncate text-center">
                {name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}

        {/* Team 2 players (right side) */}
        {t2.map((name, i) => (
          <div
            key={name + i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos2[i].top, left: pos2[i].left }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <div className="ring-2 ring-red-400 rounded-full">
                <PlayerAvatar name={name} size={28} />
              </div>
              <span className="text-[8px] font-semibold text-white bg-red-500/80 px-1 rounded leading-tight max-w-[52px] truncate text-center">
                {name.split(" ")[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Team name overlays */}
      <div className="absolute bottom-1 left-2 text-[9px] font-bold text-accent/80">{team1Name.split(" ").slice(0, 2).join(" ")}</div>
      <div className="absolute bottom-1 right-2 text-[9px] font-bold text-red-400/80 text-right">{team2Name.split(" ").slice(0, 2).join(" ")}</div>
    </div>
  );
}
