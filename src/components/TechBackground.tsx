import { motion } from "framer-motion";

export function TechBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 tech-grid opacity-[0.03] dark:opacity-[0.05]" />
      <div className="absolute inset-0 scan-line" />

      {/* Subtle gradient orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(150 60% 40% / 0.06) 0%, transparent 70%)",
          top: "10%",
          right: "10%",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(150 50% 50% / 0.04) 0%, transparent 70%)",
          bottom: "10%",
          left: "5%",
        }}
        animate={{
          x: [0, -30, 15, 0],
          y: [0, 25, -35, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function GlowLine({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px bg-border ${className}`} />
  );
}
