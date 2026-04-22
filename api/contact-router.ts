import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactInfo, type InsertContactInfo } from "@db/schema";
import { eq } from "drizzle-orm";

export const contactRouter = createRouter({
  // List all contact info
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(contactInfo);
  }),

  // Get contact info by member
  getByMemberId: publicQuery
    .input(z.object({ memberId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(contactInfo)
        .where(eq(contactInfo.memberId, input.memberId));
      return result[0] || null;
    }),

  // Create contact info
  create: publicQuery
    .input(
      z.object({
        memberId: z.number(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        socialLinks: z.record(z.string(), z.string()).optional(),
        isPublic: z.number().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const values = {
        memberId: input.memberId,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
        city: input.city || null,
        state: input.state || null,
        zipCode: input.zipCode || null,
        country: input.country || null,
        isPublic: input.isPublic,
        socialLinks: input.socialLinks ? (input.socialLinks as Record<string, string>) : null,
      };
      const result = await db.insert(contactInfo).values(values as InsertContactInfo);
      return { id: Number(result[0].insertId) };
    }),

  // Update contact info
  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        memberId: z.number().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        socialLinks: z.record(z.string(), z.string()).optional(),
        isPublic: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const values: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) {
          values[key] = val;
        }
      }
      await db.update(contactInfo).set(values as Partial<InsertContactInfo>).where(eq(contactInfo.id, id));
      return { success: true };
    }),

  // Delete contact info
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contactInfo).where(eq(contactInfo.id, input.id));
      return { success: true };
    }),
});
