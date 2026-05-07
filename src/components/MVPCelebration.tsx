"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import Image from "next/image";
import { getMVPImage } from "@/lib/data";

interface Props {
  playerName: string;
  onClose: () => void;
  saveLabel?: string;
}

const COLORS = ["#f59e0b", "#fbbf24", "#10b981", "#3b82f6", "#f472b6", "#ffffff", "#fde68a"];

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function MVPCelebration({ playerName, onClose, saveLabel = "¡Listo! Guardar partido" }: Props) {
  const mvpImage = getMVPImage(playerName);

  const particles: Particle[] = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: rng() * 100,
      delay: rng() * 1.2,
      duration: 1.6 + rng() * 1.4,
      color: COLORS[Math.floor(rng() * COLORS.length)],
      size: 6 + rng() * 8,
      rotate: rng() * 360,
    }));
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050b18 0%, #1a0e00 60%, #0a1206 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.id % 3 === 0 ? "50%" : "2px",
            }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "-95vh", opacity: 0, rotate: p.rotate }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Glow ring behind image */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* MVP Badge */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 mb-5 z-10"
      >
        <Star size={18} className="text-gold fill-gold" />
        <Trophy size={26} className="text-gold" />
        <span className="text-gold text-3xl font-black tracking-[0.18em] drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
          MVP
        </span>
        <Trophy size={26} className="text-gold" />
        <Star size={18} className="text-gold fill-gold" />
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.35 }}
        className="relative z-10 w-full"
        style={{ maxWidth: 480 }}
      >
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: "3px solid #f59e0b",
            boxShadow: "0 0 40px rgba(245,158,11,0.55), 0 0 80px rgba(245,158,11,0.2)",
          }}
        >
          <Image
            src={mvpImage}
            alt={playerName}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto block"
            priority
          />
        </div>
      </motion.div>

      {/* Player name */}
      <motion.p
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="text-white text-xl font-black mt-5 z-10 drop-shadow-lg text-center px-4"
      >
        {playerName}
      </motion.p>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="text-gold/70 text-xs font-semibold uppercase tracking-widest mt-1 z-10"
      >
        Jugador del partido
      </motion.p>

      {/* Save button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onClose}
        whileTap={{ scale: 0.96 }}
        className="mt-8 z-10 px-8 py-4 rounded-2xl font-black text-sm text-bg"
        style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}
      >
        {saveLabel}
      </motion.button>
    </motion.div>
  );
}
