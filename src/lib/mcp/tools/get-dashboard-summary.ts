import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_dashboard_summary",
  title: "Get dashboard summary",
  description: "Read the signed-in builder's personal learning, bounty, earnings, and reputation metrics.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to read your dashboard summary.");
    const userId = ctx.getUserId();
    if (!userId) throw new ToolError("Your account identity could not be verified.");

    const { data, error } = await supabaseForUser(ctx)
      .from("user_stats")
      .select("total_earnings, completed_bounties, active_bounties, reputation, rank, skills_verified, learning_hours, updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new ToolError("Unable to load your dashboard summary right now.");

    const summary = data ?? {
      total_earnings: 0,
      completed_bounties: 0,
      active_bounties: 0,
      reputation: 0,
      rank: 0,
      skills_verified: 0,
      learning_hours: 0,
    };
    return { content: [{ type: "text", text: JSON.stringify(summary) }], structuredContent: { summary } };
  },
});