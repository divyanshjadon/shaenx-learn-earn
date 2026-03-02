import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { useProfile } from "@/hooks/useProfile";
import { useDashboardData } from "@/hooks/useDashboardData";
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
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { stats, activity, badges, isLoading: dataLoading } = useDashboardData();
  const [editOpen, setEditOpen] = useState(false);

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Builder";
  const username = user?.email ? `@${user.email.split("@")[0]}` : "@builder";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const isLoading = profileLoading || dataLoading;

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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
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
