import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { useProfile } from "@/hooks/useProfile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

import {
  Calendar,
  Wallet,
  Edit,
  Share2,
  Star,
  Trophy,
  Target,
  Clock,
  Twitter,
  Github,
  Linkedin,
  BadgeCheck,
  BookOpen,
  FileText,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { badges } = useDashboardData();
  const {
    verifiedSkills,
    applications,
    completedApplications,
    trackProgress,
    activity,
    stats,
    isLoading: dataLoading,
  } = useUserProgress();
  const [editOpen, setEditOpen] = useState(false);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Builder";
  const username = user?.email ? `@${user.email.split("@")[0]}` : "@builder";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const isLoading = profileLoading || dataLoading;

  const lessonsCompleted = stats.lessons_completed;


  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Profile Header */}
          <div className="glass-card p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {isLoading ? (
                  <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-2xl" />
                ) : (
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-2xl">
                    {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} className="rounded-2xl" />}
                    <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground text-3xl md:text-4xl font-display font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-3" />
                        <Skeleton className="h-4 w-64 mb-4" />
                      </>
                    ) : (
                      <>
                        <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">{displayName}</h1>
                        <p className="text-muted-foreground mb-3">{username}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}
                          </div>
                        </div>
                        {/* Social Links */}
                        {(profile?.twitter || profile?.github || profile?.linkedin) && (
                          <div className="flex gap-2 mt-4">
                            {profile.twitter && (
                              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                                <Twitter className="w-4 h-4" />
                              </a>
                            )}
                            {profile.github && (
                              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {profile.linkedin && (
                              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wallet</p>
                  <p className="font-mono text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{verifiedSkills.length}</p>
                <p className="text-xs text-muted-foreground">Verified Skills</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{applications.length}</p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{lessonsCompleted}</p>
                <p className="text-xs text-muted-foreground">Lessons Completed</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Verified Skills */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Verified Skills</h2>
                {verifiedSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No verified skills yet. Complete a track and pass its screening test in the{" "}
                    <Link to="/learn" className="text-primary hover:underline">Learn Hub</Link>.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {verifiedSkills.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                        <BadgeCheck className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{s.skill_tracks?.title ?? "Skill"}</p>
                          <p className="text-xs text-muted-foreground">
                            Verified {new Date(s.verified_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Learning Progress */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Learning Progress</h2>
                {trackProgress.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You haven't started any tracks yet.{" "}
                    <Link to="/learn" className="text-primary hover:underline">Start learning</Link>.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {trackProgress.map(({ track, total, done }) => (
                      <div key={track.id}>
                        <div className="flex items-center justify-between mb-2">
                          <Link to={`/learn/${track.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                            {track.title}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">
                            {done}/{total} lessons
                          </span>
                        </div>
                        <Progress value={total > 0 ? (done / total) * 100 : 0} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Applications */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">My Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No applications yet.{" "}
                    <Link to="/explore" className="text-primary hover:underline">Explore bounties</Link>.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div>
                          <Link to={a.bounties ? `/explore/${a.bounties.id}` : "#"} className="font-medium hover:text-primary transition-colors">
                            {a.bounties?.title ?? "Bounty"}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {a.bounties?.companies?.name ?? "Unknown company"} · Applied {new Date(a.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {a.bounties && (
                            <span className="text-sm font-mono text-primary">
                              {Number(a.bounties.reward_amount).toLocaleString()} {a.bounties.reward_currency}
                            </span>
                          )}
                          <Badge variant={a.status === "accepted" || a.status === "completed" ? "default" : a.status === "rejected" ? "destructive" : "outline"} className="capitalize">
                            {a.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 text-center">
                  <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">{stats.completed_bounties}</p>
                  <p className="text-xs text-muted-foreground">Bounties</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Star className="w-6 h-6 text-warning mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">{stats.reputation}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Target className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">${stats.total_earnings}</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">{stats.learning_hours}h</p>
                  <p className="text-xs text-muted-foreground">Learning</p>
                </div>
              </div>

              {/* Completed Bounties */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Completed Bounties</h2>
                {activity.filter((a) => a.type === "bounty_completed").length === 0 ? (
                  <p className="text-sm text-muted-foreground">No completed bounties yet. Start exploring!</p>
                ) : (
                  <div className="space-y-4">
                    {activity
                      .filter((a) => a.type === "bounty_completed")
                      .map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                          <div>
                            <p className="font-medium">{a.title}</p>
                            <p className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</p>
                          </div>
                          {a.reward && <Badge variant="outline">{a.reward}</Badge>}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Badges</h3>
                {badges.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No badges earned yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <div key={badge.id} className="glass-card p-3 text-center hover:scale-105 transition-transform">
                        <span className="text-2xl mb-1 block">{badge.icon}</span>
                        <span className="text-xs font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Activity</h3>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((a) => (
                      <div key={a.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
