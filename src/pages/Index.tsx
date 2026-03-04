import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BountyCard } from "@/components/BountyCard";
import { LearningTrackCard } from "@/components/LearningTrackCard";
import { TechBackground, GlowLine } from "@/components/TechBackground";
import { HeroTerminal } from "@/components/HeroTerminal";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { featuredBounties, learningTracks } from "@/data/placeholder-data";
import { ArrowRight, Zap, BookOpen, Trophy, Users, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  { label: "Active Bounties", value: "500+" },
  { label: "Total Paid", value: "$2.5M+" },
  { label: "Active Learners", value: "25K+" },
  { label: "Companies", value: "150+" },
];

const features = [
  { icon: Zap, title: "Earn Real Money", description: "Complete bounties and get paid in crypto or fiat. No middleman." },
  { icon: BookOpen, title: "Learn by Doing", description: "Structured learning paths with hands-on projects." },
  { icon: Trophy, title: "Build Reputation", description: "Earn badges and showcase verified skills to companies." },
  { icon: Users, title: "Join the Community", description: "Connect with builders, mentors, and companies." },
  { icon: Shield, title: "Verified Skills", description: "On-chain credentials that prove your expertise." },
  { icon: Globe, title: "Work Anywhere", description: "Remote-first opportunities from around the world." },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Index() {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div variants={container} initial="hidden" animate="visible">
              <motion.div variants={item}>
                <Badge variant="outline" className="mb-6 px-3 py-1 text-xs font-mono border-primary/30">
                  v2.0 — The future of work
                </Badge>
              </motion.div>

              <motion.h1 variants={item} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1]">
                <span className="text-gradient">Learn.</span>{" "}
                <span className="text-foreground">Build.</span>{" "}
                <span className="text-gradient">Earn.</span>
              </motion.h1>

              <motion.p variants={item} className="text-lg text-muted-foreground max-w-md mb-8">
                The learn-and-earn platform for Web2 and Web3. Master skills, complete bounties, get paid.
              </motion.p>

              <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
                <Link to="/explore">
                  <Button variant="default" size="lg" className="w-full sm:w-auto gap-2 group">
                    Explore Bounties
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/learn">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Start Learning
                  </Button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={container} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
                {stats.map((stat) => (
                  <motion.div key={stat.label} variants={item}>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Globe */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <InteractiveGlobe
                size={500}
                dotColor="rgba(74, 222, 128, ALPHA)"
                arcColor="rgba(74, 222, 128, 0.4)"
                markerColor="rgba(74, 222, 128, 1)"
                autoRotateSpeed={0.003}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <GlowLine />

      {/* Featured Bounties */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-xs font-mono text-primary mb-2 uppercase tracking-wider">Featured</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Hot Bounties</h2>
            </div>
            <Link to="/explore">
              <Button variant="ghost" size="sm" className="gap-2 group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {featuredBounties.slice(0, 3).map((bounty) => (
              <motion.div key={bounty.id} variants={item}>
                <BountyCard {...bounty} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-md mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono text-primary mb-2 uppercase tracking-wider">Why Shaenx?</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Everything you need to succeed</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* Learning Tracks */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-xs font-mono text-primary mb-2 uppercase tracking-wider">Learn Hub</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Popular Learning Tracks</h2>
            </div>
            <Link to="/learn">
              <Button variant="ghost" size="sm" className="gap-2 group">
                Browse All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {learningTracks.slice(0, 3).map((track) => (
              <motion.div key={track.id} variants={item}>
                <LearningTrackCard {...track} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="rounded-2xl border border-border bg-card p-10 md:p-16 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Ready to start earning?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join thousands of builders earning real money while building their skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="w-full sm:w-auto gap-2 group" onClick={handleGetStarted}>
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
