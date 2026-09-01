import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LearningTrackCard } from "@/components/LearningTrackCard";
import { TechBackground } from "@/components/TechBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSkillTracks, toTrackCard } from "@/hooks/useSkillTracks";
import { Search, BookOpen, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["All", "Web2", "Web3", "Full Stack"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function LearnHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const { data: tracks, isLoading } = useSkillTracks();
  const trackCards = (tracks ?? []).map((t) => toTrackCard(t));

  const highlights = [
    { icon: BookOpen, value: String(trackCards.length), label: "Learning Tracks" },
    { icon: Target, value: String(trackCards.reduce((n, t) => n + t.modules, 0)), label: "Lessons" },
    { icon: Award, value: String(trackCards.length), label: "Certifications" },
  ];

  const filteredTracks = trackCards.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || track.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || track.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <motion.div
            className="max-w-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-3 font-mono">Learn Hub</Badge>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Master In-Demand Skills
            </h1>
            <p className="text-lg text-muted-foreground">
              Structured learning paths to help you go from beginner to professional.
              Learn, build projects, and earn certifications.
            </p>
          </motion.div>

          

          {/* Highlights */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="neon-card-hover p-4 md:p-6 text-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-display text-xl md:text-2xl font-bold text-gradient">{item.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-mono">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="neon-card p-4 md:p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search learning tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50 font-mono"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="default"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <Badge
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground font-mono">
              Showing <span className="font-medium text-primary">{filteredTracks.length}</span> learning tracks
            </p>
          </div>

          {/* Tracks Grid */}
          {isLoading ? (
            <div className="neon-card p-12 text-center text-muted-foreground font-mono">Loading tracks…</div>
          ) : filteredTracks.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`${selectedCategory}-${selectedLevel}-${searchQuery}`}
            >
              {filteredTracks.map((track) => (
                <motion.div key={track.id} variants={itemVariants}>
                  <LearningTrackCard {...track} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="neon-card p-12 text-center">
              <p className="text-muted-foreground mb-4">No tracks found matching your criteria.</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All Levels");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
