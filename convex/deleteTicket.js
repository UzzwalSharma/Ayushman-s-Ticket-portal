import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Deletes a ticket by its ID
export const deleteTicket = mutation({
   args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    await ctx.db.delete(ticketId);
    return { success: true };
  },
});
