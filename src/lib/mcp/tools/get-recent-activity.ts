import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_recent_activity",
  title: "Get recent activity",
  description: "Read the signed-in builder's latest learning and bounty activity.",
  inputSchema: { limit: z.number().int().min(1).max(20).default(10).describe("Maximum number of activity items to return.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to read your activity.");
    const userId = ctx.getUserId();
    if (!userId) throw new ToolError("Your account identity could not be verified.");

    const { data, error } = await supabaseForUser(ctx)
      .from("user_activity")
      .select("type, title, reward, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new ToolError("Unable to load your recent activity right now.");

    return { content: [{ type: "text", text: JSON.stringify(data ?? []) }], structuredContent: { activity: data ?? [] } };
  },
});