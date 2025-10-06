import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTicket = mutation({
  args: {
    reporterName: v.string(),
    reporterEmail: v.string(),
    reporterContact: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tickets", {
      ...args,
      status: "open",
      createdAt: Date.now(),
    });
  },
});
