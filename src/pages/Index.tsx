import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BountyCard } from "@/components/BountyCard";
import { LearningTrackCard } from "@/components/LearningTrackCard";
import { featuredBounties, learningTracks } from "@/data/placeholder-data";
import { ArrowRight, Zap, BookOpen, Trophy, Users, Shield, Globe } from "lucide-react";

const stats = [
  { label: "Active Bounties", value: "500+" },
  { label: "Total Paid", value: "$2.5M+" },
  { label: "Active Learners", value: "25K+" },
  { label: "Companies", value: "150+" },
];

const features = [
  {
    icon: Zap,
    title: "Earn Real Money",
    description: "Complete bounties and get paid in crypto or fiat. No middleman, instant payouts.",
  },
  {
    icon: BookOpen,
    title: "Learn by Doing",
    description: "Structured learning paths with hands-on projects. Learn skills that actually pay.",
  },
  {
    icon: Trophy,
    title: "Build Reputation",
    description: "Earn badges, climb leaderboards, and showcase your verified skills to companies.",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with builders, mentors, and companies. Collaborate on exciting projects.",
  },
  {
    icon: Shield,
    title: "Verified Skills",
    description: "On-chain credentials that prove your expertise. Own your professional identity.",
  },
  {
    icon: Globe,
    title: "Work Anywhere",
    description: "Remote-first opportunities from around the world. No borders, just talent.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm animate-fade-in">
              🚀 The future of work is here
            </Badge>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-gradient">Learn.</span>{" "}
              <span className="text-gradient-accent">Build.</span>{" "}
              <span>Earn.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              The ultimate learn-and-earn platform for Web2 and Web3. Master in-demand skills,
              complete bounties, and get paid for your contributions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/explore">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2">
                  Explore Bounties
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Start Learning
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card p-4 md:p-6">
                  <p className="font-display text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bounties */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-3">Featured Opportunities</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Hot Bounties</h2>
              <p className="text-muted-foreground mt-2">Top opportunities handpicked for you</p>
            </div>
            <Link to="/explore">
              <Button variant="ghost" className="gap-2 group">
                View All Bounties
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBounties.slice(0, 3).map((bounty, index) => (
              <div
                key={bounty.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BountyCard {...bounty} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3">Why Shaenx?</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground">
              From learning new skills to earning real money, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card-hover p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-3">Learn Hub</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Popular Learning Tracks</h2>
              <p className="text-muted-foreground mt-2">Structured paths to master in-demand skills</p>
            </div>
            <Link to="/learn">
              <Button variant="ghost" className="gap-2 group">
                Browse All Tracks
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningTracks.slice(0, 3).map((track, index) => (
              <div
                key={track.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LearningTrackCard {...track} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="glass-card p-8 md:p-16 text-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Ready to start earning?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of builders earning real money while building their skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
