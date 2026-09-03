import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Globe,
  Zap,
  Heart,
  ArrowRight,
  Twitter,
  MessageCircle,
  Mail,
} from "lucide-react";
import { usePlatformStats } from "@/hooks/usePlatformStats";

const team = [
  { name: "Sarah Chen", role: "Founder & CEO", avatar: "SC" },
  { name: "Marcus Rivera", role: "CTO", avatar: "MR" },
  { name: "Aisha Patel", role: "Head of Community", avatar: "AP" },
  { name: "David Kim", role: "Lead Developer", avatar: "DK" },
];

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe in the power of community-driven growth and collaboration.",
  },
  {
    icon: Globe,
    title: "Borderless Opportunities",
    description: "Talent has no borders. We connect skilled individuals with global opportunities.",
  },
  {
    icon: Zap,
    title: "Learn by Doing",
    description: "The best way to learn is by building real projects and solving real problems.",
  },
  {
    icon: Heart,
    title: "Fair Compensation",
    description: "Everyone deserves to be paid fairly for their contributions and skills.",
  },
];

export default function About() {
  const { data: stats } = usePlatformStats();

  const communityStats = [
    { value: String(stats?.community_members ?? 0), label: "Community Members" },
    { value: String(stats?.companies ?? 0), label: "Partner Companies" },
    { value: `$${(stats?.total_paid ?? 0).toLocaleString()}`, label: "Paid to Contributors" },
    { value: String(stats?.lessons_completed ?? 0), label: "Lessons Completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Badge variant="secondary" className="mb-4">About Shaenx</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Building the future of{" "}
              <span className="text-gradient">work</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Shaenx is on a mission to democratize access to opportunities in the Web2 and Web3 space.
              We believe everyone should have the chance to learn, build, and earn.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
            {communityStats.map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <section className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">
                The principles that guide everything we do at Shaenx.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="glass-card-hover p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
              <p className="text-muted-foreground">
                A passionate team building the future of decentralized work.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="glass-card p-6 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground text-xl font-display font-bold">
                    {member.avatar}
                  </div>
                  <h3 className="font-display font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Join Community */}
          <section className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Join Our Community
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Connect with thousands of builders, learners, and earners. Be part of the future of work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="gradient" size="lg" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Join Discord
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Twitter className="w-5 h-5" />
                  Follow on X
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>Questions? Email us at</span>
                <a href="mailto:hello@shaenx.com" className="text-primary hover:underline">
                  hello@shaenx.com
                </a>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of builders earning while learning.
            </p>
            <Link to="/auth">
              <Button variant="gradient" size="xl" className="gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
