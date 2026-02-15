import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatsCard({ label, value, icon, change, changeType = "neutral" }: StatsCardProps) {
  const changeColors = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="neon-card-hover p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1 font-mono">{label}</p>
          <p className="font-display text-2xl md:text-3xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm mt-1 font-mono ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center text-primary shadow-glow">
          {icon}
        </div>
      </div>
    </div>
  );
}
