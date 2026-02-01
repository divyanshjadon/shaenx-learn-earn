import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsCard } from "@/components/StatsCard";
import { BountyCard } from "@/components/BountyCard";
import { LearningTrackCard } from "@/components/LearningTrackCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { userStats, userProfile, featuredBounties, learningTracks, recentActivity } from "@/data/placeholder-data";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Trophy,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Briefcase,
} from "lucide-react";

const activeBounties = featuredBounties.slice(0, 2);
const inProgressTracks = learningTracks.slice(0, 2).map((track, i) => ({
  ...track,
  progress: i === 0 ? 65 : 30,
}));

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                Welcome back, {userProfile.name.split(" ")[0]}! 👋
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
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            <StatsCard
              label="Total Earnings"
              value={userStats.totalEarnings}
              icon={<DollarSign className="w-6 h-6" />}
              change="+$2,450 this month"
              changeType="positive"
            />
            <StatsCard
              label="Completed Bounties"
              value={userStats.completedBounties}
              icon={<Trophy className="w-6 h-6" />}
              change="+3 this week"
              changeType="positive"
            />
            <StatsCard
              label="Active Bounties"
              value={userStats.activeBounties}
              icon={<Target className="w-6 h-6" />}
            />
            <StatsCard
              label="Reputation"
              value={`${userStats.reputation}/5.0`}
              icon={<Star className="w-6 h-6" />}
              change={`Rank #${userStats.rank}`}
              changeType="neutral"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Bounties */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Active Bounties
                  </h2>
                  <Link to="/explore">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {activeBounties.map((bounty) => (
                    <BountyCard key={bounty.id} {...bounty} />
                  ))}
                </div>
              </section>

              {/* Learning Progress */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Learning Progress
                  </h2>
                  <Link to="/learn">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Browse Tracks
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {inProgressTracks.map((track) => (
                    <LearningTrackCard key={track.id} {...track} />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Your Badges</h3>
                <div className="grid grid-cols-2 gap-3">
                  {userStats.badges.map((badge) => (
                    <div
                      key={badge.name}
                      className="glass-card p-3 text-center hover:scale-105 transition-transform"
                    >
                      <span className="text-2xl mb-1 block">{badge.icon}</span>
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === "bounty_completed"
                          ? "bg-success/10 text-success"
                          : activity.type === "badge_earned"
                          ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {activity.type === "bounty_completed" && <CheckCircle className="w-4 h-4" />}
                        {activity.type === "learning_completed" && <Award className="w-4 h-4" />}
                        {activity.type === "badge_earned" && <Trophy className="w-4 h-4" />}
                        {activity.type === "bounty_started" && <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      {activity.reward && (
                        <Badge variant="outline" className="badge-reward text-xs">
                          {activity.reward}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Verified Skills</span>
                    <span className="font-medium">{userStats.skillsVerified}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Learning Hours</span>
                    <span className="font-medium">{userStats.learningHours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Global Rank</span>
                    <span className="font-medium">#{userStats.rank}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
