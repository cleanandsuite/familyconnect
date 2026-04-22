import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { familyMembers, relationships } from "@db/schema";
import { eq } from "drizzle-orm";

export const familyRouter = createRouter({
  // List all family members
  list: publicQuery.query(async () => {
    const db = getDb();
    const members = await db.select().from(familyMembers).orderBy(familyMembers.generation);
    return members;
  }),

  // Get a single family member with their relationships
  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const member = await db
        .select()
        .from(familyMembers)
        .where(eq(familyMembers.id, input.id))
        .then((rows) => rows[0]);

      if (!member) return null;

      const memberRelationships = await db
        .select()
        .from(relationships)
        .where(eq(relationships.memberId, input.id));

      const relatedRelationships = await db
        .select()
        .from(relationships)
        .where(eq(relationships.relatedMemberId, input.id));

      return {
        ...member,
        relationships: [...memberRelationships, ...relatedRelationships],
      };
    }),

  // Create a family member
  create: publicQuery
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        maidenName: z.string().optional(),
        birthDate: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        generation: z.number().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(familyMembers).values({
        firstName: input.firstName,
        lastName: input.lastName,
        maidenName: input.maidenName,
        birthDate: input.birthDate,
        bio: input.bio,
        avatar: input.avatar,
        generation: input.generation,
      });
      return { id: Number(result[0].insertId) };
    }),

  // Update a family member
  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        maidenName: z.string().optional(),
        birthDate: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        generation: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(familyMembers).set(data).where(eq(familyMembers.id, id));
      return { success: true };
    }),

  // Delete a family member
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(familyMembers).where(eq(familyMembers.id, input.id));
      return { success: true };
    }),
});
