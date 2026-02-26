import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserStats {
  total_earnings: number;
  completed_bounties: number;
  active_bounties: number;
  reputation: number;
  rank: number;
  skills_verified: number;
  learning_hours: number;
}

export interface UserActivity {
  id: string;
  type: string;
  title: string;
  reward: string | null;
  created_at: string;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  earned_at: string;
}

const defaultStats: UserStats = {
  total_earnings: 0,
  completed_bounties: 0,
  active_bounties: 0,
  reputation: 0,
  rank: 0,
  skills_verified: 0,
  learning_hours: 0,
};

export function useDashboardData() {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as UserStats) ?? defaultStats;
    },
    enabled: !!user,
  });

  const activityQuery = useQuery({
    queryKey: ["user-activity", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activity")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data as UserActivity[]) ?? [];
    },
    enabled: !!user,
  });

  const badgesQuery = useQuery({
    queryKey: ["user-badges", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", user!.id)
        .order("earned_at", { ascending: false });
      if (error) throw error;
      return (data as UserBadge[]) ?? [];
    },
    enabled: !!user,
  });

  return {
    stats: statsQuery.data ?? defaultStats,
    activity: activityQuery.data ?? [],
    badges: badgesQuery.data ?? [],
    isLoading: statsQuery.isLoading || activityQuery.isLoading || badgesQuery.isLoading,
  };
}
