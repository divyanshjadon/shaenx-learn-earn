import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const lines = [
  { type: "comment", text: "// Connect your wallet & start earning" },
  { type: "code", text: "const bounty = await shaenx.find({" },
  { type: "code", text: '  skill: "react",' },
  { type: "code", text: '  reward: "> $500",' },
  { type: "code", text: "});" },
  { type: "blank", text: "" },
  { type: "output", text: "→ Found 12 bounties matching your skills" },
  { type: "code", text: "await bounty.accept();" },
  { type: "output", text: "✓ Bounty accepted! Reward: $750 USDC" },
  { type: "blank", text: "" },
  { type: "code", text: "const submission = await bounty.submit({" },
  { type: "code", text: '  repo: "github.com/you/project",' },
  { type: "code", text: "});" },
  { type: "output", text: "✓ Submitted! Funds released to wallet." },
];

export function HeroTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const delay = lines[visibleLines]?.type === "blank" ? 300 : 120 + Math.random() * 180;
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), delay);
      return () => clearTimeout(timer);
    }
    // Loop after a pause
    const timer = setTimeout(() => setVisibleLines(0), 3000);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <motion.div
      className="w-full max-w-lg mx-auto rounded-2xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-lg)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">shaenx-cli</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-sm leading-relaxed h-[320px] overflow-hidden">
        <AnimatePresence mode="sync">
          {lines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={`${i}-${visibleLines > lines.length ? "loop" : "init"}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={
                line.type === "comment"
                  ? "text-muted-foreground"
                  : line.type === "output"
                  ? "text-primary"
                  : line.type === "blank"
                  ? "h-4"
                  : "text-foreground"
              }
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleLines < lines.length && (
          <motion.span
            className="inline-block w-2 h-4 bg-primary/80 ml-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}
