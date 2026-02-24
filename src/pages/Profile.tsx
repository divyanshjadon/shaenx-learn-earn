import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { userProfile, userStats, recentActivity } from "@/data/placeholder-data";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Twitter,
  Github,
  Linkedin,
  Wallet,
  Edit,
  Share2,
  Star,
  Trophy,
  Target,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const profileDisplayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || userProfile.name;
  const profileUsername = user?.email ? `@${user.email.split("@")[0]}` : userProfile.username;
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
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-3xl md:text-4xl font-display font-bold">
                  {profileDisplayName.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">
                      {profileDisplayName}
                    </h1>
                    <p className="text-muted-foreground mb-3">{profileUsername}</p>
                    <p className="text-sm max-w-lg mb-4">{userProfile.bio}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {userProfile.location}
                      </div>
                      <a
                        href={userProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {userProfile.website.replace("https://", "")}
                      </a>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Joined {userProfile.joinedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 mt-4">
                  <a
                    href={`https://twitter.com/${userProfile.socialLinks.twitter}`}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://github.com/${userProfile.socialLinks.github}`}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://linkedin.com/in/${userProfile.socialLinks.linkedin}`}
                    className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Wallet */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center text-primary">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Connected Wallet</p>
                  <p className="font-mono text-sm">{userProfile.walletAddress}</p>
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
                  <p className="font-display text-xl font-bold">{userStats.completedBounties}</p>
                  <p className="text-xs text-muted-foreground">Bounties</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Star className="w-6 h-6 text-warning mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">{userStats.reputation}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Target className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">{userStats.totalEarnings}</p>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="font-display text-xl font-bold">{userStats.learningHours}h</p>
                  <p className="text-xs text-muted-foreground">Learning</p>
                </div>
              </div>

              {/* Skills */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-4">Completed Bounties</h2>
                <div className="space-y-4">
                  {recentActivity
                    .filter((a) => a.type === "bounty_completed")
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        <Badge variant="outline" className="badge-reward">
                          {activity.reward}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Badges</h3>
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

              {/* Activity */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold mb-4">Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
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
