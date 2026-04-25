"use client";
import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  gradientColors?: string;
  gradientAnimationDuration?: number;
  hoverEffect?: boolean;
  className?: string;
  textClassName?: string;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      gradientColors = "linear-gradient(90deg, #f8fafc 0%, #10b981 40%, #3b82f6 70%, #f8fafc 100%)",
      gradientAnimationDuration = 2.5,
      hoverEffect = false,
      className,
      textClassName,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const textVariants: Variants = {
      initial: { backgroundPosition: "0% 0" },
      animate: {
        backgroundPosition: "200% 0",
        transition: {
          duration: gradientAnimationDuration,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "linear",
        },
      },
    };

    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        <motion.h1
          className={cn("font-black leading-tight", textClassName)}
          style={{
            background: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: isHovered ? "0 0 12px rgba(16,185,129,0.4)" : "none",
          }}
          variants={textVariants}
          initial="initial"
          animate="animate"
          onHoverStart={() => hoverEffect && setIsHovered(true)}
          onHoverEnd={() => hoverEffect && setIsHovered(false)}
        >
          {text}
        </motion.h1>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";
export { AnimatedText };
