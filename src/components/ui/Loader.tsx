import React from "react";
import { motion } from "framer-motion";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2.5 w-2.5 rounded-full bg-primary"
          initial={{ x: 0 }}
          animate={{ x: [0, 8, 0], opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}
