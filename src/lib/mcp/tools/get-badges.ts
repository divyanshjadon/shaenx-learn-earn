import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_badges",
  title: "Get earned badges",
  description: "Read the badges earned by the signed-in Shaenx builder.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to read your badges.");
    const userId = ctx.getUserId();
    if (!userId) throw new ToolError("Your account identity could not be verified.");

    const { data, error } = await supabaseForUser(ctx)
      .from("user_badges")
      .select("name, icon, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });
    if (error) throw new ToolError("Unable to load your badges right now.");

    return { content: [{ type: "text", text: JSON.stringify(data ?? []) }], structuredContent: { badges: data ?? [] } };
  },
});