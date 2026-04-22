import { authRouter } from "./auth-router";
import { familyRouter } from "./family-router";
import { relationshipsRouter } from "./relationships-router";
import { photosRouter } from "./photos-router";
import { contactRouter } from "./contact-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  family: familyRouter,
  relationships: relationshipsRouter,
  photos: photosRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
