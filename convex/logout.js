import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Logout mutation
export const logout = mutation({
  args: { token: v.string() },
  handler: async ({ db }, { token }) => {
    // Delete the session token from the sessions table
    const session = await db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", token))
      .unique();

    if (session) {
      await db.delete("sessions", session._id);
    }

    return { success: true };
  },
});
