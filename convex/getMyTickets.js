import { v } from "convex/values";
import { query } from "./_generated/server";
// Simple query filtering tickets by email
export const getMyTickets = query({
  args: { reporterEmail: v.string() },
  handler: async (ctx, args) => {
    const allTickets = await ctx.db.query("tickets").collect();

  
    return allTickets.filter(
      (ticket) => ticket.reporterEmail === args.reporterEmail
    ).sort((a, b) => b.createdAt - a.createdAt);
  },
});
