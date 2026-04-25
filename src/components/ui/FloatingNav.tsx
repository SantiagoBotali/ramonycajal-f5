"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Trophy, Plus, Clock, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: <Home size={20} />, label: "Inicio" },
  { href: "/ranking", icon: <Trophy size={20} />, label: "Ranking" },
  { href: "/nuevo-partido", icon: <Plus size={22} />, label: "Nuevo" },
  { href: "/historial", icon: <Clock size={20} />, label: "Historial" },
  { href: "/jugadores", icon: <Users size={20} />, label: "Jugadores" },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((i) => i.href === pathname);
  const active = activeIndex === -1 ? 0 : activeIndex;

  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      const btn = btnRefs.current[active];
      const container = containerRef.current;
      if (!btn || !container) return;
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({ width: btnRect.width, left: btnRect.left - containerRect.left });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div
        ref={containerRef}
        className="relative flex items-center justify-between bg-surface border border-border rounded-2xl px-1 py-2 shadow-2xl shadow-black/60 backdrop-blur-md"
      >
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center justify-center flex-1 py-1 gap-0.5"
          >
            <button
              ref={(el) => { btnRefs.current[index] = el; }}
              className={`relative flex flex-col items-center justify-center w-full py-1.5 gap-0.5 z-10 transition-colors duration-200 ${
                active === index ? "text-primary" : "text-text-muted"
              }`}
            >
              {item.href === "/nuevo-partido" ? (
                <span className={`flex items-center justify-center w-9 h-9 rounded-xl ${active === index ? "bg-primary text-bg" : "bg-surface-2 text-text-secondary"} transition-colors duration-200`}>
                  {item.icon}
                </span>
              ) : (
                item.icon
              )}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          </Link>
        ))}

        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-primary/10"
        />
      </div>
    </div>
  );
}
