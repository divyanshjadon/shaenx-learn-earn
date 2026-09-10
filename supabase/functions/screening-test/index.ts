import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Question {
  question: string;
  options: string[];
  correct_index: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();

    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, skill_track_id, answers } = body as {
      action: "get" | "submit";
      skill_track_id: string;
      answers?: number[];
    };

    const { data: test, error: testError } = await admin
      .from("screening_tests")
      .select("id, questions, passing_score, skill_track_id")
      .eq("skill_track_id", skill_track_id)
      .maybeSingle();

    if (testError) throw testError;
    if (!test) {
      return new Response(JSON.stringify({ error: "No screening test for this track" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: lessons, error: lessonsError } = await admin
      .from("lessons")
      .select("id")
      .eq("skill_track_id", test.skill_track_id);

    if (lessonsError) throw lessonsError;
    if (!lessons?.length) {
      return new Response(JSON.stringify({ error: "Complete the track lessons before taking the screening test" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lessonIds = lessons.map((lesson) => lesson.id);
    const { data: completedLessons, error: progressError } = await admin
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);

    if (progressError) throw progressError;
    const completedLessonIds = new Set((completedLessons ?? []).map((lesson) => lesson.lesson_id));
    if (lessonIds.some((lessonId) => !completedLessonIds.has(lessonId))) {
      return new Response(JSON.stringify({ error: "Complete all track lessons before taking the screening test" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const questions = (test.questions ?? []) as Question[];

    if (action === "get") {
      return new Response(
        JSON.stringify({
          test_id: test.id,
          passing_score: test.passing_score,
          questions: questions.map((q) => ({ question: q.question, options: q.options })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "submit") {
      const given = Array.isArray(answers) ? answers : [];
      const correct = questions.reduce(
        (acc, q, i) => acc + (given[i] === q.correct_index ? 1 : 0),
        0,
      );
      const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
      const passed = score >= (test.passing_score ?? 70);

      const { data: attempt, error: attemptError } = await admin
        .from("test_attempts")
        .insert({ user_id: user.id, test_id: test.id, score, passed })
        .select("id")
        .single();
      if (attemptError) throw attemptError;

      if (passed) {
        const { data: existing } = await admin
          .from("candidate_skills")
          .select("id")
          .eq("user_id", user.id)
          .eq("skill_track_id", test.skill_track_id)
          .maybeSingle();

        if (existing) {
          await admin
            .from("candidate_skills")
            .update({ test_attempt_id: attempt.id, verified_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await admin.from("candidate_skills").insert({
            user_id: user.id,
            skill_track_id: test.skill_track_id,
            test_attempt_id: attempt.id,
          });
        }
      }

      return new Response(
        JSON.stringify({ score, passed, passing_score: test.passing_score, total: questions.length, correct }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("screening-test error", e);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
