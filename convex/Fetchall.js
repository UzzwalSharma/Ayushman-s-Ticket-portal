import { query } from "./_generated/server";

export const all = query(async ({ db }) => {
  return await db.query("tickets").collect(); // fetch all tickets
});
