import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TechBackground } from "@/components/TechBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useBounty, formatDeadline } from "@/hooks/useBounties";
import { useCandidateSkills } from "@/hooks/useSkillTracks";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, DollarSign, Lock, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function BountyDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: bounty, isLoading } = useBounty(id);
  const { data: skills } = useCandidateSkills(user?.id);
  const [applying, setApplying] = useState(false);

  const { data: existingApplication } = useQuery({
    enabled: !!user && !!id,
    queryKey: ["application", id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id, status")
        .eq("bounty_id", id!)
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const verifiedSlugs = (skills ?? []).map((s) => s.skill_tracks?.slug?.toLowerCase()).filter(Boolean) as string[];
  const tags = (bounty?.skill_tags ?? []).map((t) => t.toLowerCase());
  const eligible = tags.some((t) => verifiedSlugs.includes(t));

  const apply = async () => {
    if (!user || !bounty) return;
    setApplying(true);
    const { error } = await supabase
      .from("applications")
      .insert({ bounty_id: bounty.id, user_id: user.id });
    setApplying(false);
    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      toast({
        title: msg.includes("duplicate")
          ? "You already applied to this bounty"
          : msg.includes("row-level security") || error.code === "42501"
            ? "Verify a matching skill first"
            : "Could not apply",
        description: msg.includes("duplicate")
          ? "Check your profile for the status."
          : "Pass the screening test for one of the required skills, then try again.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["application", id, user.id] });
      return;
    }
    toast({ title: "Application submitted!" });
    queryClient.invalidateQueries({ queryKey: ["application", id, user.id] });
    queryClient.invalidateQueries({ queryKey: ["bounties"] });
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to bounties
          </Link>

          {isLoading ? (
            <div className="neon-card p-12 text-center text-muted-foreground font-mono">Loading bounty…</div>
          ) : !bounty ? (
            <div className="neon-card p-12 text-center text-muted-foreground">Bounty not found.</div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow">
                  {(bounty.companies?.name ?? "?").charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{bounty.companies?.name}</p>
                  <Badge variant="outline" className={bounty.category?.toLowerCase() === "web3" ? "badge-web3" : "badge-web2"}>
                    {bounty.category?.toLowerCase() === "web3" ? "Web3" : "Web2"}
                  </Badge>
                </div>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{bounty.title}</h1>
              <p className="text-muted-foreground mb-6 whitespace-pre-line">{bounty.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(bounty.skill_tags ?? []).map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs font-mono font-normal">{s}</Badge>
                ))}
              </div>

              <div className="neon-card p-6">
                <div className="flex flex-wrap items-center gap-6 mb-6 font-mono text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success" />
                    <span className="font-display font-bold text-lg text-foreground">
                      {Number(bounty.reward_amount).toLocaleString()}{" "}
                      <span className="text-sm font-normal text-muted-foreground">{bounty.reward_currency}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDeadline(bounty.deadline)}</span>
                  </div>
                </div>

                {!user ? (
                  <Link to="/auth">
                    <Button className="gap-2">Sign in to apply</Button>
                  </Link>
                ) : existingApplication ? (
                  <p className="flex items-center gap-2 text-success text-sm font-mono">
                    <CheckCircle className="w-4 h-4" /> Applied — status: {existingApplication.status}
                  </p>
                ) : eligible ? (
                  <Button onClick={apply} disabled={applying} className="gap-2">
                    {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                    Apply for this bounty
                  </Button>
                ) : (
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5">
                    <Lock className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Verify a matching skill first</p>
                      <p className="text-muted-foreground">
                        Pass the screening test for one of: {(bounty.skill_tags ?? []).join(", ")}.{" "}
                        <Link to="/learn" className="text-primary">Go to Learn Hub</Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
