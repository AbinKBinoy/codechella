import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  commands: defineTable({
    kind: v.string(),        // "boulder" | "flame" | "gravity"
    x: v.number(),
    z: v.number(),
  }),
 players: defineTable({
  userId: v.string(),
  x: v.number(), y: v.number(), z: v.number(),
  updatedAt: v.optional(v.number()),
}).index("by_user", ["userId"]),
});