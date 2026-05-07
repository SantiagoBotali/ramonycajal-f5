"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Pencil, Trophy } from "lucide-react";
import { PLAYERS } from "@/lib/data";
import { loadStoredMatches, updateMatch } from "@/lib/storage";
import { Match } from "@/lib/types";
import PlayerPicker from "@/components/PlayerPicker";
import PlayerAvatar from "@/components/PlayerAvatar";
import MVPCelebration from "@/components/MVPCelebration";

type Step = "select" | "details" | "confirm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarPartidoPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [original, setOriginal] = useState<Match | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [step, setStep] = useState<Step>("select");
  const [activeTeam, setActiveTeam] = useState<1 | 2>(1);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  // MVP flow
  const [showMVPPicker, setShowMVPPicker] = useState(false);
  const [selectedMVP, setSelectedMVP] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const matches = loadStoredMatches();
    const match = matches.find((m) => m.id === id);
    if (!match) {
      setNotFound(true);
      return;
    }
    setOriginal(match);
    setTeam1(match.team1.players.slice(0, 5));
    setTeam2(match.team2.players.slice(0, 5));
    setTeam1Name(match.team1.name);
    setTeam2Name(match.team2.name);
    setScore1(match.team1.score.toString());
    setScore2(match.team2.score.toString());
    setDate(match.date);
    if (match.mvp) setSelectedMVP(match.mvp);
  }, [id]);

  function handleSelect(name: string) {
    if (activeTeam === 1) {
      if (team1.length < 5) setTeam1((p) => [...p, name]);
    } else {
      if (team2.length < 5) setTeam2((p) => [...p, name]);
    }
  }

  function handleRemove(name: string, team: 1 | 2) {
    if (team === 1) setTeam1((p) => p.filter((n) => n !== name));
    else setTeam2((p) => p.filter((n) => n !== name));
  }

  const canProceed = team1.length === 5 && team2.length === 5;
  const canSave = team1Name.trim() && team2Name.trim() && score1 !== "" && score2 !== "";

  function handleConfirmSave() {
    if (!canSave || saving || !original) return;
    setShowMVPPicker(true);
  }

  function handleMVPSelect(name: string) {
    setSelectedMVP(name);
    setShowCelebration(true);
  }

  function handleSkipMVP() {
    setShowMVPPicker(false);
    doSave(selectedMVP);
  }

  function handleCelebrationClose() {
    setShowCelebration(false);
    setShowMVPPicker(false);
    doSave(selectedMVP);
  }

  function doSave(mvp: string | null) {
    if (saving || !original) return;
    setSaving(true);
    const updated: Match = {
      ...original,
      date,
      team1: { name: team1Name.trim(), players: team1, score: parseInt(score1) },
      team2: { name: team2Name.trim(), players: team2, score: parseInt(score2) },
      mvp: mvp ?? undefined,
    };
    updateMatch(updated);
    setTimeout(() => router.push("/historial"), 400);
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white/60 text-sm">Partido no encontrado</p>
        <button onClick={() => router.back()} className="text-primary text-sm font-semibold">Volver</button>
      </div>
    );
  }

  if (!original) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white/40 text-sm">Cargando...</p>
      </div>
    );
  }

  const stepLabels: Record<Step, string> = {
    select: "Seleccioná jugadores",
    details: "Detalles del partido",
    confirm: "Confirmar cambios",
  };

  const allMatchPlayers = [...team1, ...team2];

  return (
    <div className="max-w-lg mx-auto px-4 pt-10 pb-6">
      {/* MVP Picker overlay */}
      <AnimatePresence>
        {showMVPPicker && !showCelebration && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "rgba(5, 11, 24, 0.97)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex-1 overflow-y-auto px-4 pt-10 pb-6 max-w-lg mx-auto w-full">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={18} className="text-gold" />
                <span className="text-xs font-semibold text-gold uppercase tracking-widest">Editar partido</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-1">¿Quién fue el MVP?</h2>
              <p className="text-white/50 text-xs mb-6">
                {selectedMVP ? `MVP actual: ${selectedMVP} — elegí otro para cambiarlo` : "Elegí el mejor jugador del partido"}
              </p>

              {/* Player grid */}
              <div className="grid grid-cols-4 gap-2">
                {allMatchPlayers.map((name) => {
                  const inTeam1 = team1.includes(name);
                  const isCurrent = selectedMVP === name;
                  return (
                    <motion.button
                      key={name}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleMVPSelect(name)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-150 ${
                        isCurrent
                          ? "border-gold bg-gold/10"
                          : "border-border bg-surface-2 hover:border-gold/50 hover:bg-gold/5"
                      }`}
                    >
                      <PlayerAvatar name={name} size={44} />
                      <span className={`text-[9px] font-semibold leading-tight text-center line-clamp-2 ${
                        isCurrent ? "text-gold" : inTeam1 ? "text-accent" : "text-red-400"
                      }`}>
                        {name.split(" ")[0]}
                      </span>
                      {isCurrent && (
                        <div className="w-3 h-3 rounded-full bg-gold absolute top-1 right-1" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Skip */}
              <button
                onClick={handleSkipMVP}
                className="mt-6 w-full py-3 rounded-xl bg-surface-2 border border-border text-white/50 text-sm font-semibold hover:text-white/80 transition-colors"
              >
                {selectedMVP ? `Mantener MVP: ${selectedMVP}` : "Saltear — guardar sin MVP"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MVP Celebration overlay */}
      <AnimatePresence>
        {showCelebration && selectedMVP && (
          <MVPCelebration
            playerName={selectedMVP}
            onClose={handleCelebrationClose}
            saveLabel="¡Listo! Guardar cambios"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/50 text-xs mb-3 hover:text-white/80 transition-colors"
        >
          <ChevronLeft size={14} />
          Volver al historial
        </button>
        <div className="flex items-center gap-2 mb-1">
          <Pencil size={16} className="text-accent" />
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">Editar partido</span>
        </div>
        <h1 className="text-2xl font-black text-white">Modificar Partido</h1>
        <p className="text-white/50 text-xs mt-0.5">{original.date}</p>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mt-3">
          {(["select", "details", "confirm"] as Step[]).map((s, i) => {
            const done = (step === "details" && i === 0) || (step === "confirm" && i <= 1);
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step === s ? "bg-accent text-bg" : done ? "bg-accent/30 text-accent" : "bg-surface-2 text-white"
                }`}>
                  {done ? <Check size={10} /> : i + 1}
                </div>
                {i < 2 && <div className={`flex-1 h-px w-6 ${done ? "bg-accent/40" : "bg-border"}`} />}
              </div>
            );
          })}
          <span className="ml-1 text-xs text-white">{stepLabels[step]}</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <PlayerPicker
              allPlayers={PLAYERS}
              team1={team1}
              team2={team2}
              activeTeam={activeTeam}
              onSelect={handleSelect}
              onRemove={handleRemove}
              onSwitchTeam={setActiveTeam}
            />
            <div className="mt-6">
              <button
                disabled={!canProceed}
                onClick={() => setStep("details")}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  canProceed ? "bg-accent text-bg" : "bg-surface-2 text-white/40 border border-border"
                }`}
              >
                Continuar
                <ChevronRight size={16} />
              </button>
              {!canProceed && (
                <p className="text-center text-xs text-white mt-2">
                  {team1.length < 5 ? `Equipo 1: faltan ${5 - team1.length}` : `Equipo 2: faltan ${5 - team2.length}`}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {step === "details" && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-accent uppercase tracking-wide block mb-1.5">Equipo 1</label>
                <input
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent"
                  maxLength={40}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-red-400 uppercase tracking-wide block mb-1.5">Equipo 2</label>
                <input
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-red-400"
                  maxLength={40}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white uppercase tracking-wide block mb-1.5">Resultado</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  value={score1}
                  onChange={(e) => setScore1(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-3 text-2xl font-black text-center text-accent focus:outline-none focus:border-accent"
                />
                <span className="text-white font-light text-xl">–</span>
                <input
                  type="number"
                  min={0}
                  value={score2}
                  onChange={(e) => setScore2(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-3 text-2xl font-black text-center text-red-400 focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white uppercase tracking-wide block mb-1.5">Fecha del partido</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep("select")}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-surface-2 border border-border text-white text-sm font-semibold"
              >
                <ChevronLeft size={16} />
                Volver
              </button>
              <button
                disabled={!canSave}
                onClick={() => setStep("confirm")}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  canSave ? "bg-accent text-bg" : "bg-surface-2 text-white/40 border border-border"
                }`}
              >
                Revisar
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="bg-surface-2 border border-border rounded-2xl p-4">
              <p className="text-xs text-white/70 text-center mb-3">{date}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center">
                  <p className="text-sm font-bold text-accent truncate">{team1Name}</p>
                  <p className="text-4xl font-black text-white mt-1">{score1}</p>
                </div>
                <div className="text-white text-lg font-light">vs</div>
                <div className="flex-1 text-center">
                  <p className="text-sm font-bold text-red-400 truncate">{team2Name}</p>
                  <p className="text-4xl font-black text-white mt-1">{score2}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface border border-border rounded-xl p-3">
                <p className="text-[10px] font-bold text-accent uppercase tracking-wide mb-2">{team1Name || "Equipo 1"}</p>
                {team1.map((n) => <p key={n} className="text-xs text-white py-0.5 truncate">{n}</p>)}
              </div>
              <div className="bg-surface border border-border rounded-xl p-3">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-2">{team2Name || "Equipo 2"}</p>
                {team2.map((n) => <p key={n} className="text-xs text-white py-0.5 truncate">{n}</p>)}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep("details")}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-surface-2 border border-border text-white text-sm font-semibold"
              >
                <ChevronLeft size={16} />
                Editar
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-accent text-bg transition-all duration-200 active:scale-95"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
                {!saving && <Check size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
