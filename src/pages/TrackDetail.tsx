import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TechBackground } from "@/components/TechBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useSkillTrack, useLessonProgress, useCandidateSkills } from "@/hooks/useSkillTracks";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Circle, Award, Loader2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface TestQuestion {
  question: string;
  options: string[];
}

export default function TrackDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: track, isLoading } = useSkillTrack(id);
  const { data: completed } = useLessonProgress(user?.id);
  const { data: skills } = useCandidateSkills(user?.id);

  const [test, setTest] = useState<{ questions: TestQuestion[]; passing_score: number } | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const lessons = track?.lessons ?? [];
  const doneCount = lessons.filter((l) => completed?.has(l.id)).length;
  const allDone = lessons.length > 0 && doneCount === lessons.length;
  const verified = !!skills?.some((s) => s.skill_track_id === track?.id);




  const startTest = async () => {
    setLoadingTest(true);
    setResult(null);
    const { data, error } = await supabase.functions.invoke("screening-test", {
      body: { action: "get", skill_track_id: track?.id },
    });
    setLoadingTest(false);
    if (error || data?.error) {
      toast({ title: "Screening test unavailable", variant: "destructive" });
      return;
    }
    setTest({ questions: data.questions, passing_score: data.passing_score });
    setAnswers(new Array(data.questions.length).fill(-1));
  };

  const submitTest = async () => {
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("screening-test", {
      body: { action: "submit", skill_track_id: track?.id, answers },
    });
    setSubmitting(false);
    if (error || data?.error) {
      toast({ title: "Could not submit test", variant: "destructive" });
      return;
    }
    setResult({ score: data.score, passed: data.passed });
    setTest(null);
    queryClient.invalidateQueries({ queryKey: ["candidate_skills", user?.id] });
    toast({
      title: data.passed ? "Skill verified!" : "Not passed yet",
      description: `You scored ${data.score}%.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Learn Hub
          </Link>

          {isLoading ? (
            <div className="neon-card p-12 text-center text-muted-foreground font-mono">Loading track…</div>
          ) : !track ? (
            <div className="neon-card p-12 text-center text-muted-foreground">Track not found.</div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="secondary" className="mb-3 font-mono">{track.slug}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{track.title}</h1>
              <p className="text-muted-foreground mb-8">{track.description}</p>

              <div className="neon-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-lg">Lessons</h2>
                  <span className="text-sm font-mono text-muted-foreground">{doneCount}/{lessons.length} complete</span>
                </div>
                <div className="space-y-3">
                  {lessons.map((lesson, i) => {
                    const done = completed?.has(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/learn/${track.id}/lesson/${lesson.id}`}
                        className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors group"
                      >
                        {done ? (
                          <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium group-hover:text-primary transition-colors">
                            <span className="font-mono text-muted-foreground mr-2">{String(i + 1).padStart(2, "0")}</span>
                            {lesson.title}
                          </p>
                          {lesson.content && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                      </Link>
                    );
                  })}
                </div>
                {!user && (
                  <p className="text-sm text-muted-foreground mt-4 font-mono">
                    <Link to="/auth" className="text-primary">Sign in</Link> to track your progress and take the screening test.
                  </p>
                )}
              </div>

              {/* Screening test */}
              {user && (
                <div className="neon-card p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-primary" />
                    <h2 className="font-display font-semibold text-lg">Screening Test</h2>
                  </div>

                  {verified ? (
                    <p className="text-sm text-success font-mono">Skill verified — you can apply to matching bounties.</p>
                  ) : !allDone ? (
                    <p className="text-sm text-muted-foreground">
                      Complete all lessons to unlock the screening test.
                    </p>
                  ) : test ? (
                    <div className="space-y-6 mt-4">
                      {test.questions.map((q, qi) => (
                        <div key={qi}>
                          <p className="font-medium mb-2">{qi + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <label key={oi} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="radio"
                                  name={`q-${qi}`}
                                  checked={answers[qi] === oi}
                                  onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                                  className="accent-primary"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button onClick={submitTest} disabled={submitting || answers.some((a) => a < 0)}>
                        {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Submit Test
                      </Button>
                    </div>
                  ) : (
                    <>
                      {result && (
                        <p className={`text-sm mb-3 font-mono ${result.passed ? "text-success" : "text-destructive"}`}>
                          Last attempt: {result.score}% — {result.passed ? "passed" : "not passed"}
                        </p>
                      )}
                      <Button onClick={startTest} disabled={loadingTest} className="gap-2">
                        {loadingTest && <Loader2 className="w-4 h-4 animate-spin" />}
                        Take Screening Test
                      </Button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
