"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

interface AnimatedRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedReveal({
  children,
  className,
  delay = 0,
}: AnimatedRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const visible = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={visible}
      animate={visible}
      whileInView={visible}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
