import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformStats {
  open_bounties: number;
  total_paid: number;
  active_learners: number;
  companies: number;
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform_stats"],
    queryFn: async (): Promise<PlatformStats> => {
      const { data, error } = await supabase.rpc("get_platform_stats");
      if (error) throw error;
      const row = (data ?? [])[0] as PlatformStats | undefined;
      return {
        open_bounties: Number(row?.open_bounties ?? 0),
        total_paid: Number(row?.total_paid ?? 0),
        active_learners: Number(row?.active_learners ?? 0),
        companies: Number(row?.companies ?? 0),
      };
    },
  });
}
