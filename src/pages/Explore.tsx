import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BountyCard } from "@/components/BountyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { featuredBounties } from "@/data/placeholder-data";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const categories = ["All", "Web2", "Web3"];
const skillFilters = ["React", "TypeScript", "Solana", "Rust", "Node.js", "Design", "Security"];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const filteredBounties = featuredBounties.filter((bounty) => {
    const matchesSearch = bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || bounty.category === selectedCategory;
    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some((skill) => bounty.skills.includes(skill));

    return matchesSearch && matchesCategory && matchesSkills;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="max-w-3xl mb-12">
            <Badge variant="secondary" className="mb-3">Opportunities</Badge>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Explore Gigs & Bounties
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your next opportunity. Apply to bounties, complete tasks, and earn rewards.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass-card p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search bounties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Skill Filters */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by skills:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillFilters.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
                {selectedSkills.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setSelectedSkills([])}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredBounties.length}</span> bounties
            </p>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Sort by: Newest
            </Button>
          </div>

          {/* Bounty Grid */}
          {filteredBounties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBounties.map((bounty, index) => (
                <div
                  key={bounty.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <BountyCard {...bounty} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground mb-4">No bounties found matching your criteria.</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedSkills([]);
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
