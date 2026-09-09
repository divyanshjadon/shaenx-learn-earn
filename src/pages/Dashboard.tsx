import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsCard } from "@/components/StatsCard";
import { TechBackground } from "@/components/TechBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, Trophy, Target, Star, ArrowRight,
  CheckCircle, Clock, Award, Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { badges } = useDashboardData();
  const {
    stats,
    activity,
    trackProgress,
    activeApplications,
    isLoading,
  } = useUserProgress();
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Welcome Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your bounties and learning.
              </p>
            </div>
            <Link to="/profile">
              <Button variant="glass" className="gap-2">
                View Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              {isLoading ? <Skeleton className="h-32" /> : (
                <StatsCard label="Total Earnings" value={`$${stats.total_earnings.toLocaleString()}`} icon={<DollarSign className="w-6 h-6" />} />
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              {isLoading ? <Skeleton className="h-32" /> : (
                <StatsCard label="Completed Bounties" value={stats.completed_bounties} icon={<Trophy className="w-6 h-6" />} />
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              {isLoading ? <Skeleton className="h-32" /> : (
                <StatsCard label="Active Bounties" value={stats.active_bounties} icon={<Target className="w-6 h-6" />} />
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              {isLoading ? <Skeleton className="h-32" /> : (
                <StatsCard label="Verified Skills" value={stats.verified_skills} icon={<Star className="w-6 h-6" />} change={`${stats.lessons_completed} lessons done`} changeType="neutral" />
              )}
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Getting Started prompt for new users */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Active Bounties
                  </h2>
                  <Link to="/explore">
                    <Button variant="ghost" size="sm" className="gap-1">Browse Bounties<ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </div>
                {activeApplications.length === 0 ? (
                  <div className="neon-card p-8 text-center">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">You haven't started any bounties yet.</p>
                    <Link to="/explore">
                      <Button variant="glass" className="gap-2">
                        Explore Bounties <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeApplications.map((a) => (
                      <div key={a.id} className="neon-card p-5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <Link to={a.bounties ? `/explore/${a.bounties.id}` : "#"} className="font-medium hover:text-primary transition-colors">
                            {a.bounties?.title ?? "Bounty"}
                          </Link>
                          <p className="text-sm text-muted-foreground truncate">
                            {a.bounties?.companies?.name ?? "Unknown company"} · Applied {new Date(a.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {a.bounties && (
                            <span className="text-sm font-mono text-primary">
                              {Number(a.bounties.reward_amount).toLocaleString()} {a.bounties.reward_currency}
                            </span>
                          )}
                          <Badge variant="outline" className="capitalize">{a.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Learning Progress */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Learning Progress
                  </h2>
                  <Link to="/learn">
                    <Button variant="ghost" size="sm" className="gap-1">Browse Tracks<ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </div>
                {trackProgress.length === 0 ? (
                  <div className="neon-card p-8 text-center">
                    <Award className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Start a learning track to build your skills.</p>
                    <Link to="/learn">
                      <Button variant="glass" className="gap-2">
                        Start Learning <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="neon-card p-6 space-y-5">
                    {trackProgress.map(({ track, total, done }) => (
                      <div key={track.id}>
                        <div className="flex items-center justify-between mb-2">
                          <Link to={`/learn/${track.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                            {track.title}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">{done}/{total} lessons</span>
                        </div>
                        <Progress value={total > 0 ? (done / total) * 100 : 0} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            </div>


            {/* Sidebar */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Badges */}
              <div className="neon-card p-6">
                <h3 className="font-display font-semibold mb-4">Your Badges</h3>
                {badges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Complete bounties and learning tracks to earn badges.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <motion.div
                        key={badge.id}
                        className="neon-card p-3 text-center"
                        whileHover={{ scale: 1.08, boxShadow: "0 0 20px hsl(187 85% 43% / 0.2)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <span className="text-2xl mb-1 block">{badge.icon}</span>
                        <span className="text-xs font-medium font-mono">{badge.name}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="neon-card p-6">
                <h3 className="font-display font-semibold mb-4">Recent Activity</h3>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet. Start exploring bounties!</p>
                ) : (
                  <div className="space-y-4">
                    {activity.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === "bounty_completed" ? "bg-success/10 text-success"
                          : item.type === "skill_verified" ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                        }`}>
                          {item.type === "bounty_completed" && <CheckCircle className="w-4 h-4" />}
                          {item.type === "skill_verified" && <Award className="w-4 h-4" />}
                          {item.type === "bounty_applied" && <Clock className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {item.reward && (
                          <Badge variant="outline" className="badge-reward text-xs">{item.reward}</Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="neon-card p-6">
                <h3 className="font-display font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-mono">Verified Skills</span>
                    <span className="font-medium">{stats.skills_verified}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-mono">Learning Hours</span>
                    <span className="font-medium">{stats.learning_hours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-mono">Global Rank</span>
                    <span className="font-medium">{stats.rank > 0 ? `#${stats.rank}` : "—"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
