import { mutation } from "./_generated/server";
import { v4 as uuid } from "uuid";

export const login = mutation(async ({ db }, { email, password }) => {
  // Find admin
  const admin = await db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();

  if (!admin) return { success: false, error: "Admin not found" };
  if (admin.password !== password) return { success: false, error: "Invalid password" };

  //  Generate a session token
  const token = uuid();

  // Set expiry for 6 hours
  const now = Date.now();
  const expiresAt = now + 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  //  Save token in sessions table
  await db.insert("sessions", {
  
    token,
    createdAt: now,
    expiresAt,
  });

  //  Return token to client
  return { success: true, token };
});
