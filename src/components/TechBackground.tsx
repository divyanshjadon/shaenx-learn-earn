import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function TechBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated grid */}
      <div className="absolute inset-0 tech-grid opacity-[0.03] dark:opacity-[0.06]" />

      {/* Scan line */}
      <div className="absolute inset-0 scan-line" />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(187 85% 43% / 0.12) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(250 60% 60% / 0.1) 0%, transparent 70%)",
          bottom: "5%",
          right: "0%",
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 50, -70, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(24 95% 58% / 0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function GlowLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
  );
}
