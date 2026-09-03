import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformStats {
  open_bounties: number;
  total_paid: number;
  active_learners: number;
  companies: number;
  community_members: number;
  lessons_completed: number;
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform_stats"],
    queryFn: async (): Promise<PlatformStats> => {
      const { data: row, error } = await supabase
        .from("platform_totals" as never)
        .select("*")
        .maybeSingle();
      if (error) throw error;
      const stats = row as unknown as PlatformStats | null;
      return {
        open_bounties: Number(row?.open_bounties ?? 0),
        total_paid: Number(row?.total_paid ?? 0),
        active_learners: Number(row?.active_learners ?? 0),
        companies: Number(row?.companies ?? 0),
        community_members: Number(row?.community_members ?? 0),
        lessons_completed: Number(row?.lessons_completed ?? 0),
      };
    },
  });
}
