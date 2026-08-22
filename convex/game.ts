import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const drop = mutation({
  args: { kind: v.string(), x: v.number(), z: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("commands", args);
  },
});

export const commandsSince = query({
  args: { since: v.number() },
  handler: async (ctx, { since }) => {
    return await ctx.db
      .query("commands")
      .filter((q) => q.gt(q.field("_creationTime"), since))
      .collect();
  },
});

export const writePositions = mutation({
  args: { positions: v.array(v.object({
    userId: v.string(), x: v.number(), y: v.number(), z: v.number(),
  })) },
  handler: async (ctx, { positions }) => {
    for (const p of positions) {
      const rows = await ctx.db
        .query("players")
        .withIndex("by_user", (q) => q.eq("userId", p.userId))
        .collect();

      if (rows.length === 0) {
        await ctx.db.insert("players", { ...p, updatedAt: Date.now() });
      } else {
        await ctx.db.patch(rows[0]._id, { ...p, updatedAt: Date.now() });
        for (let i = 1; i < rows.length; i++) {
          await ctx.db.delete(rows[i]._id);
        }
      }
    }
  },
});
export const players = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("players").collect();
    const cutoff = Date.now() - 2000;
    return all.filter((p) => p.updatedAt && p.updatedAt > cutoff);
  },
});