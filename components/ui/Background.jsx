"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-400/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />

      {/* Floating Particles/Grid (Optional for more flair) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
    </div>
  );
}
