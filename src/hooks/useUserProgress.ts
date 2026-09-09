import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCandidateSkills, useLessonProgress, useSkillTracks } from "@/hooks/useSkillTracks";
import { useMyApplications } from "@/hooks/useMyApplications";
import type { SkillTrackRow } from "@/hooks/useSkillTracks";
import type { MyApplication } from "@/hooks/useMyApplications";

export interface TrackProgress {
  track: SkillTrackRow;
  total: number;
  done: number;
}

export interface ProgressActivity {
  id: string;
  type: "bounty_applied" | "bounty_completed" | "skill_verified";
  title: string;
  reward: string | null;
  created_at: string;
}

const ACTIVE_STATUSES = ["applied", "shortlisted", "accepted"];
const EARNED_STATUSES = ["accepted", "completed"];

/**
 * Single source of truth for a logged-in user's real progress.
 * Both Dashboard and Profile read from this so the numbers can never diverge.
 */
export function useUserProgress() {
  const { user } = useAuth();
  const skillsQuery = useCandidateSkills(user?.id);
  const lessonsQuery = useLessonProgress(user?.id);
  const tracksQuery = useSkillTracks();
  const applicationsQuery = useMyApplications(user?.id);

  const verifiedSkills = useMemo(() => skillsQuery.data ?? [], [skillsQuery.data]);
  const completedLessons = lessonsQuery.data;
  const tracks = useMemo(() => tracksQuery.data ?? [], [tracksQuery.data]);
  const applications: MyApplication[] = useMemo(
    () => applicationsQuery.data ?? [],
    [applicationsQuery.data],
  );

  const trackProgress: TrackProgress[] = useMemo(
    () =>
      tracks
        .map((track) => {
          const total = track.lessons?.length ?? 0;
          const done = track.lessons?.filter((l) => completedLessons?.has(l.id)).length ?? 0;
          return { track, total, done };
        })
        .filter((t) => t.done > 0),
    [tracks, completedLessons],
  );

  const activeApplications = useMemo(
    () => applications.filter((a) => ACTIVE_STATUSES.includes(a.status)),
    [applications],
  );
  const completedApplications = useMemo(
    () => applications.filter((a) => a.status === "completed"),
    [applications],
  );

  const totalEarnings = useMemo(
    () =>
      applications
        .filter((a) => EARNED_STATUSES.includes(a.status))
        .reduce((sum, a) => sum + Number(a.bounties?.reward_amount ?? 0), 0),
    [applications],
  );

  const activity: ProgressActivity[] = useMemo(() => {
    const items: ProgressActivity[] = [];
    for (const a of applications) {
      items.push({
        id: `app-${a.id}`,
        type: a.status === "completed" ? "bounty_completed" : "bounty_applied",
        title:
          a.status === "completed"
            ? `Completed "${a.bounties?.title ?? "bounty"}"`
            : `Applied to "${a.bounties?.title ?? "bounty"}"`,
        reward: a.bounties
          ? `${Number(a.bounties.reward_amount).toLocaleString()} ${a.bounties.reward_currency}`
          : null,
        created_at: a.applied_at,
      });
    }
    for (const s of verifiedSkills) {
      items.push({
        id: `skill-${s.id}`,
        type: "skill_verified",
        title: `Verified skill: ${s.skill_tracks?.title ?? "Skill"}`,
        reward: null,
        created_at: s.verified_at,
      });
    }
    return items.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [applications, verifiedSkills]);

  const lessonsCompleted = completedLessons?.size ?? 0;

  return {
    verifiedSkills,
    completedLessons,
    tracks,
    trackProgress,
    applications,
    activeApplications,
    completedApplications,
    activity,
    stats: {
      verified_skills: verifiedSkills.length,
      applications: applications.length,
      lessons_completed: lessonsCompleted,
      active_bounties: activeApplications.length,
      completed_bounties: completedApplications.length,
      total_earnings: totalEarnings,
    },
    isLoading:
      skillsQuery.isLoading ||
      lessonsQuery.isLoading ||
      tracksQuery.isLoading ||
      applicationsQuery.isLoading,
  };
}
