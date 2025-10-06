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

  admins: defineTable({
    email: v.string(),
    password: v.string(), // Hashing of password will be done later on
 
  }).index("by_email", ["email"]),

  //sessions management for admin authentication
   sessions: defineTable({
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});



