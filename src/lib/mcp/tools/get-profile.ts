import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description: "Read the signed-in Shaenx builder's public profile details.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Sign in to read your profile.");
    const userId = ctx.getUserId();
    if (!userId) throw new ToolError("Your account identity could not be verified.");

    const { data, error } = await supabaseForUser(ctx)
      .from("profiles")
      .select("display_name, bio, avatar_url, twitter, github, linkedin, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new ToolError("Unable to load your profile right now.");

    return { content: [{ type: "text", text: JSON.stringify(data ?? {}) }], structuredContent: { profile: data } };
  },
});