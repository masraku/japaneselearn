"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Card({ children, className, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      onClick={onClick}
      className={cn(
        "bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
