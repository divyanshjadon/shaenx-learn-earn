import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TechBackground } from "@/components/TechBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useSkillTrack, useLessonProgress } from "@/hooks/useSkillTracks";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LessonDetail() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: track, isLoading } = useSkillTrack(trackId);
  const { data: completed } = useLessonProgress(user?.id);
  const [saving, setSaving] = useState(false);

  const lessons = track?.lessons ?? [];
  const index = lessons.findIndex((l) => l.id === lessonId);
  const lesson = index >= 0 ? lessons[index] : undefined;
  const nextLesson = index >= 0 ? lessons[index + 1] : undefined;
  const prevLesson = index > 0 ? lessons[index - 1] : undefined;
  const done = !!lesson && !!completed?.has(lesson.id);

  const markComplete = async () => {
    if (!user || !lesson) return;
    setSaving(true);
    const { error } = await supabase
      .from("lesson_progress")
      .insert({ user_id: user.id, lesson_id: lesson.id });
    setSaving(false);
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast({ title: "Could not save progress", variant: "destructive" });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["lesson_progress", user.id] });
    toast({ title: "Lesson complete", description: lesson.title });
    navigate(nextLesson ? `/learn/${trackId}/lesson/${nextLesson.id}` : `/learn/${trackId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <TechBackground />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <Link
            to={`/learn/${trackId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {track?.title ?? "track"}
          </Link>

          {isLoading ? (
            <div className="neon-card p-12 text-center text-muted-foreground font-mono">Loading lesson…</div>
          ) : !lesson ? (
            <div className="neon-card p-12 text-center text-muted-foreground">Lesson not found.</div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="font-mono">
                  Lesson {index + 1} of {lessons.length}
                </Badge>
                {done && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-success">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{lesson.title}</h1>

              <div className="neon-card p-6 md:p-10">
                {lesson.content ? (
                  <div className="max-w-none space-y-5 text-base md:text-[17px] leading-8 text-foreground/90 whitespace-pre-line [&>p]:mb-5">
                    {lesson.content
                      .split(/\n{2,}/)
                      .filter((block) => block.trim().length > 0)
                      .map((block, i) => (
                        <p key={i}>{block.trim()}</p>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-mono text-sm">
                    Content for this lesson is coming soon.
                  </p>
                )}

                <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap items-center gap-3">
                  {!user ? (
                    <p className="text-sm text-muted-foreground font-mono">
                      <Link to="/auth" className="text-primary">Sign in</Link> to track your progress.
                    </p>
                  ) : done ? (
                    <Button
                      variant="gradient"
                      className="gap-2"
                      onClick={() =>
                        navigate(nextLesson ? `/learn/${trackId}/lesson/${nextLesson.id}` : `/learn/${trackId}`)
                      }
                    >
                      {nextLesson ? "Next Lesson" : "Back to Track"} <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="gradient" className="gap-2" onClick={markComplete} disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Mark as Complete <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}

                  {prevLesson && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => navigate(`/learn/${trackId}/lesson/${prevLesson.id}`)}
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
