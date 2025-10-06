// mutations/tickets.js
import { mutation } from "./_generated/server";

export const updateStatus = mutation(async ({ db }, { id, status }) => {
  if (!id) throw new Error("Missing ticket id for update");
  await db.patch(id, { status }); 
});
