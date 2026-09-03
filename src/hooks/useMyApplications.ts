import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MyApplication {
  id: string;
  status: string;
  applied_at: string;
  bounties: {
    id: string;
    title: string;
    reward_amount: number;
    reward_currency: string;
    companies: { name: string } | null;
  } | null;
}

export function useMyApplications(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["my_applications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(
          "id, status, applied_at, bounties(id, title, reward_amount, reward_currency, companies(name))",
        )
        .eq("user_id", userId!)
        .order("applied_at", { ascending: false })
        .returns<MyApplication[]>();
      if (error) throw error;
      return data ?? [];
    },
  });
}
