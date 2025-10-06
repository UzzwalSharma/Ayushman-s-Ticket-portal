import { query } from "./_generated/server";
import { v } from "convex/values";

export const validateSession = query({
  args: { token: v.string() },
  handler: async ({ db }, { token }) => {
    const session = await db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", token))
      .unique();

    if (!session) return { valid: false };
    if (Date.now() > session.expiresAt) return { valid: false };

    return { valid: true, adminId: session.adminId };
  },
});
