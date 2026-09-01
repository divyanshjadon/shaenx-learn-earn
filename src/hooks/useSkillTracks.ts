import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LearningTrackCardProps } from "@/components/LearningTrackCard";

export interface LessonRow {
  id: string;
  title: string;
  content: string | null;
  order_index: number;
}

export interface SkillTrackRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  lessons: LessonRow[];
}

const WEB3_HINTS = ["web3", "solana", "blockchain", "defi", "nft", "rust", "solidity"];

export function trackCategory(track: SkillTrackRow): LearningTrackCardProps["category"] {
  const haystack = `${track.title} ${track.slug} ${track.description ?? ""}`.toLowerCase();
  return WEB3_HINTS.some((h) => haystack.includes(h)) ? "Web3" : "Web2";
}

export function toTrackCard(
  track: SkillTrackRow,
  progress?: number,
): LearningTrackCardProps {
  const modules = track.lessons?.length ?? 0;
  return {
    id: track.id,
    title: track.title,
    description: track.description ?? "",
    duration: `${Math.max(modules, 1) * 30} min`,
    modules,
    enrolled: 0,
    category: trackCategory(track),
    level: "Beginner",
    progress,
  };
}

async function fetchTracks(): Promise<SkillTrackRow[]> {
  const { data, error } = await supabase
    .from("skill_tracks")
    .select("id, title, slug, description, lessons(id, title, content, order_index)")
    .eq("is_published", true)
    .order("created_at", { ascending: true })
    .order("order_index", { referencedTable: "lessons", ascending: true })
    .returns<SkillTrackRow[]>();
  if (error) throw error;
  return data ?? [];
}

export function useSkillTracks() {
  return useQuery({ queryKey: ["skill_tracks"], queryFn: fetchTracks });
}

export function useSkillTrack(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: ["skill_track", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_tracks")
        .select("id, title, slug, description, lessons(id, title, content, order_index)")
        .eq("id", id!)
        .eq("is_published", true)
        .order("order_index", { referencedTable: "lessons", ascending: true })
        .maybeSingle<SkillTrackRow>();
      if (error) throw error;
      return data;
    },
  });
}

export function useLessonProgress(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["lesson_progress", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.lesson_id));
    },
  });
}

export function useCandidateSkills(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["candidate_skills", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_skills")
        .select("id, skill_track_id, verified_at, skill_tracks(id, title, slug)")
        .eq("user_id", userId!)
        .returns<
          {
            id: string;
            skill_track_id: string;
            verified_at: string;
            skill_tracks: { id: string; title: string; slug: string } | null;
          }[]
        >();
      if (error) throw error;
      return data ?? [];
    },
  });
}
