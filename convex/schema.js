import { defineSchema , defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tickets: defineTable({
    reporterName: v.string(),
    reporterEmail: v.string(),
    reporterContact: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    images: v.array(v.string()), // Cloudinary URLs
    status: v.string(),          // open, in-progress, closed
    createdAt: v.number(),
  }),
});
