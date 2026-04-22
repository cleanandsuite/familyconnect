import { relations } from "drizzle-orm";
import { familyMembers, relationships, photos, contactInfo } from "./schema";

export const familyMembersRelations = relations(familyMembers, ({ many }) => ({
  relationshipsAsMember: many(relationships),
  contactInfo: many(contactInfo),
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  member: one(familyMembers, {
    fields: [relationships.memberId],
    references: [familyMembers.id],
  }),
  relatedMember: one(familyMembers, {
    fields: [relationships.relatedMemberId],
    references: [familyMembers.id],
  }),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  uploader: one(familyMembers, {
    fields: [photos.uploadedBy],
    references: [familyMembers.id],
  }),
}));

export const contactInfoRelations = relations(contactInfo, ({ one }) => ({
  member: one(familyMembers, {
    fields: [contactInfo.memberId],
    references: [familyMembers.id],
  }),
}));
