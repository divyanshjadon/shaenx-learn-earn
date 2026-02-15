import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BountyCard } from "@/components/BountyCard";
import { LearningTrackCard } from "@/components/LearningTrackCard";
import { TechBackground, GlowLine } from "@/components/TechBackground";
import { featuredBounties, learningTracks } from "@/data/placeholder-data";
import { ArrowRight, Zap, BookOpen, Trophy, Users, Shield, Globe, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Bounties", value: "500+" },
  { label: "Total Paid", value: "$2.5M+" },
  { label: "Active Learners", value: "25K+" },
  { label: "Companies", value: "150+" },
];

const features = [
  { icon: Zap, title: "Earn Real Money", description: "Complete bounties and get paid in crypto or fiat. No middleman, instant payouts." },
  { icon: BookOpen, title: "Learn by Doing", description: "Structured learning paths with hands-on projects. Learn skills that actually pay." },
  { icon: Trophy, title: "Build Reputation", description: "Earn badges, climb leaderboards, and showcase your verified skills to companies." },
  { icon: Users, title: "Join the Community", description: "Connect with builders, mentors, and companies. Collaborate on exciting projects." },
  { icon: Shield, title: "Verified Skills", description: "On-chain credentials that prove your expertise. Own your professional identity." },
  { icon: Globe, title: "Work Anywhere", description: "Remote-first opportunities from around the world. No borders, just talent." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-mono border-primary/30">
                <Terminal className="w-3 h-3 mr-1.5 inline" />
                v2.0 — The future of work is here
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-gradient glow-text">Learn.</span>{" "}
              <span className="text-gradient-accent glow-text">Build.</span>{" "}
              <span className="glow-text">Earn.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              The ultimate learn-and-earn platform for Web2 and Web3. Master in-demand skills,
              complete bounties, and get paid for your contributions.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2 group">
                  Explore Bounties
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Start Learning
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16"
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="neon-card-hover p-4 md:p-6">
                  <p className="font-display text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* Featured Bounties */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <Badge variant="secondary" className="mb-3 font-mono">Featured Opportunities</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Hot Bounties</h2>
              <p className="text-muted-foreground mt-2">Top opportunities handpicked for you</p>
            </div>
            <Link to="/explore">
              <Button variant="ghost" className="gap-2 group">
                View All Bounties
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredBounties.slice(0, 3).map((bounty) => (
              <motion.div key={bounty.id} variants={itemVariants}>
                <BountyCard {...bounty} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* Features */}
      <section className="py-20 md:py-28 bg-muted/30 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-3 font-mono">Why Shaenx?</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground">
              From learning new skills to earning real money, we've got you covered.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="neon-card-hover p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* Learning Tracks */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <Badge variant="secondary" className="mb-3 font-mono">Learn Hub</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Popular Learning Tracks</h2>
              <p className="text-muted-foreground mt-2">Structured paths to master in-demand skills</p>
            </div>
            <Link to="/learn">
              <Button variant="ghost" className="gap-2 group">
                Browse All Tracks
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {learningTracks.slice(0, 3).map((track) => (
              <motion.div key={track.id} variants={itemVariants}>
                <LearningTrackCard {...track} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine />

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="neon-card p-8 md:p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.15, 0.3] }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Ready to start earning?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of builders earning real money while building their skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2 group">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
