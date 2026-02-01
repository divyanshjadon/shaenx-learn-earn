import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface BountyCardProps {
  id: string;
  title: string;
  description: string;
  reward: string;
  rewardType: "USD" | "USDC" | "SOL" | "ETH";
  deadline: string;
  applicants: number;
  category: "Web2" | "Web3";
  skills: string[];
  company: string;
  companyLogo?: string;
  featured?: boolean;
}

export function BountyCard({
  id,
  title,
  description,
  reward,
  rewardType,
  deadline,
  applicants,
  category,
  skills,
  company,
  featured = false,
}: BountyCardProps) {
  return (
    <div
      className={`glass-card-hover p-6 flex flex-col h-full ${
        featured ? "ring-2 ring-primary/20 animate-pulse-glow" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {company.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{company}</p>
            <Badge
              variant="outline"
              className={category === "Web3" ? "badge-web3" : "badge-web2"}
            >
              {category}
            </Badge>
          </div>
        </div>
        {featured && (
          <Badge className="bg-gradient-accent text-accent-foreground border-0">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
        {description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs font-normal">
            {skill}
          </Badge>
        ))}
        {skills.length > 3 && (
          <Badge variant="secondary" className="text-xs font-normal">
            +{skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{deadline}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{applicants} applied</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-success" />
          <span className="font-display font-bold text-lg">
            {reward} <span className="text-sm font-normal text-muted-foreground">{rewardType}</span>
          </span>
        </div>
        <Link to={`/explore/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1 group">
            Apply
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
