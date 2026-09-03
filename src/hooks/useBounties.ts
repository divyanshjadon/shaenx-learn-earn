import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BountyCardProps } from "@/components/BountyCard";

export interface BountyRow {
  id: string;
  title: string;
  description: string;
  category: string;
  skill_tags: string[];
  reward_amount: number;
  reward_currency: string;
  deadline: string | null;
  is_featured: boolean;
  company_id: string;
  companies: { name: string; logo_url: string | null } | null;
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "No deadline";
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Expired";
  if (days === 0) return "Ends today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export function toBountyCard(
  b: BountyRow,
  applicants: number,
): BountyCardProps {
  return {
    id: b.id,
    title: b.title,
    description: b.description,
    reward: Number(b.reward_amount).toLocaleString(),
    rewardType: (b.reward_currency?.toUpperCase() ?? "USD") as BountyCardProps["rewardType"],
    deadline: formatDeadline(b.deadline),
    applicants,
    category: b.category?.toLowerCase() === "web3" ? "Web3" : "Web2",
    skills: b.skill_tags ?? [],
    company: b.companies?.name ?? "Unknown",
    companyLogo: b.companies?.logo_url ?? undefined,
    featured: b.is_featured,
  };
}

export function useBounties() {
  return useQuery({
    queryKey: ["bounties"],
    queryFn: async () => {
      const [bountiesRes, countsRes] = await Promise.all([
        supabase
          .from("bounties")
          .select(
            "id, title, description, category, skill_tags, reward_amount, reward_currency, deadline, is_featured, company_id, companies(name, logo_url)",
          )
          .eq("status", "open")
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .returns<BountyRow[]>(),
        supabase.from("bounty_applicant_counts" as never).select("bounty_id, applicant_count"),
      ]);

      if (bountiesRes.error) throw bountiesRes.error;

      const counts = new Map<string, number>();
      (countsRes.data ?? []).forEach((row: { bounty_id: string; applicant_count: number }) => {
        counts.set(row.bounty_id, Number(row.applicant_count));
      });

      const rows = bountiesRes.data ?? [];
      return rows.map((b) => ({ row: b, card: toBountyCard(b, counts.get(b.id) ?? 0) }));
    },
  });
}

export function useBounty(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryKey: ["bounty", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bounties")
        .select(
          "id, title, description, category, skill_tags, reward_amount, reward_currency, deadline, is_featured, company_id, companies(name, logo_url)",
        )
        .eq("id", id!)
        .maybeSingle<BountyRow>();
      if (error) throw error;
      return data;
    },
  });
}
