import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export interface LearningTrackCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  enrolled: number;
  category: "Web2" | "Web3" | "Full Stack";
  level: "Beginner" | "Intermediate" | "Advanced";
  progress?: number;
  image?: string;
}

const levelColors = {
  Beginner: "bg-success/10 text-success border-success/20",
  Intermediate: "bg-warning/10 text-warning border-warning/20",
  Advanced: "bg-secondary/10 text-secondary border-secondary/20",
};

export function LearningTrackCard({
  id, title, description, duration, modules,
  enrolled, category, level, progress,
}: LearningTrackCardProps) {
  return (
    <div className="neon-card-hover p-6 flex flex-col h-full">
      {/* Header with gradient bar */}
      <div className="h-1.5 w-full rounded-full bg-gradient-primary mb-4 shadow-glow" />

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className={category === "Web3" ? "badge-web3" : category === "Web2" ? "badge-web2" : "badge-reward"}>
          {category}
        </Badge>
        <Badge variant="outline" className={levelColors[level]}>{level}</Badge>
      </div>

      {/* Content */}
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{modules} modules</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{enrolled.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress or CTA */}
      {progress !== undefined ? (
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground font-mono">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-500 shadow-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <div className="flex items-center gap-1.5 mt-2 text-success text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-4 border-t border-border/50">
          <Link to={`/learn/${id}`}>
            <Button variant="outline" className="w-full gap-2 group">
              Start Learning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
