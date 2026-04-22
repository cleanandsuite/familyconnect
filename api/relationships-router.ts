import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { relationships } from "@db/schema";
import { eq } from "drizzle-orm";

export const relationshipsRouter = createRouter({
  // List all relationships
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(relationships);
  }),

  // Get relationships for a specific member
  getByMemberId: publicQuery
    .input(z.object({ memberId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const asMember = await db
        .select()
        .from(relationships)
        .where(eq(relationships.memberId, input.memberId));
      const asRelated = await db
        .select()
        .from(relationships)
        .where(eq(relationships.relatedMemberId, input.memberId));
      return [...asMember, ...asRelated];
    }),

  // Create a relationship
  create: publicQuery
    .input(
      z.object({
        memberId: z.number(),
        relatedMemberId: z.number(),
        relationType: z.enum(["parent", "child", "spouse", "sibling"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(relationships).values({
        memberId: input.memberId,
        relatedMemberId: input.relatedMemberId,
        relationType: input.relationType,
      });
      return { id: Number(result[0].insertId) };
    }),

  // Delete a relationship
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(relationships).where(eq(relationships.id, input.id));
      return { success: true };
    }),

  // Get full tree data (all members + relationships)
  getTreeData: publicQuery.query(async () => {
    const db = getDb();
    const { familyMembers: members } = await import("@db/schema");
    const allMembers = await db.select().from(members).orderBy(members.generation);
    const allRelationships = await db.select().from(relationships);
    return {
      members: allMembers,
      relationships: allRelationships,
    };
  }),
});
