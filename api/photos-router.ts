import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { photos } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const photosRouter = createRouter({
  // List all photos
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(photos).orderBy(desc(photos.createdAt));
  }),

  // Get photos by member
  getByMemberId: publicQuery
    .input(z.object({ memberId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const allPhotos = await db.select().from(photos).orderBy(desc(photos.createdAt));
      return allPhotos.filter(
        (p) =>
          p.uploadedBy === input.memberId ||
          (p.memberIds && p.memberIds.includes(input.memberId)),
      );
    }),

  // Create a photo record
  create: publicQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        url: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
        uploadedBy: z.number().optional(),
        memberIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(photos).values({
        title: input.title,
        description: input.description,
        url: input.url,
        thumbnailUrl: input.thumbnailUrl,
        uploadedBy: input.uploadedBy,
        memberIds: input.memberIds,
      });
      return { id: Number(result[0].insertId) };
    }),

  // Delete a photo
  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(photos).where(eq(photos.id, input.id));
      return { success: true };
    }),
});
