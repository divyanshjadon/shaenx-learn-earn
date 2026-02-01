import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LearningTrackCard } from "@/components/LearningTrackCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { learningTracks } from "@/data/placeholder-data";
import { Search, BookOpen, Target, Award } from "lucide-react";

const categories = ["All", "Web2", "Web3", "Full Stack"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const highlights = [
  {
    icon: BookOpen,
    value: "50+",
    label: "Learning Tracks",
  },
  {
    icon: Target,
    value: "500+",
    label: "Hands-on Projects",
  },
  {
    icon: Award,
    value: "25K+",
    label: "Certificates Issued",
  },
];

export default function LearnHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const filteredTracks = learningTracks.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || track.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || track.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="max-w-3xl mb-12">
            <Badge variant="secondary" className="mb-3">Learn Hub</Badge>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Master In-Demand Skills
            </h1>
            <p className="text-lg text-muted-foreground">
              Structured learning paths to help you go from beginner to professional.
              Learn, build projects, and earn certifications.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12">
            {highlights.map((item) => (
              <div key={item.label} className="glass-card p-4 md:p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-display text-xl md:text-2xl font-bold text-gradient">{item.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="glass-card p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search learning tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50"
                />
              </div>

              {/* Category Filter */}
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

            {/* Level Filters */}
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
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredTracks.length}</span> learning tracks
            </p>
          </div>

          {/* Tracks Grid */}
          {filteredTracks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <LearningTrackCard {...track} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
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
