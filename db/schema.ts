import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Family Members Table - stores each person in the family tree
export const familyMembers = mysqlTable("family_members", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  maidenName: varchar("maiden_name", { length: 255 }),
  birthDate: varchar("birth_date", { length: 50 }),
  bio: text("bio"),
  avatar: text("avatar"),
  generation: int("generation").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = typeof familyMembers.$inferInsert;

// Relationships Table - defines connections between family members
export const relationships = mysqlTable("relationships", {
  id: serial("id").primaryKey(),
  memberId: bigint("member_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => familyMembers.id),
  relatedMemberId: bigint("related_member_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => familyMembers.id),
  relationType: mysqlEnum("relation_type", [
    "parent",
    "child",
    "spouse",
    "sibling",
  ]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Relationship = typeof relationships.$inferSelect;
export type InsertRelationship = typeof relationships.$inferInsert;

// Photos Table - stores uploaded family photos
export const photos = mysqlTable("photos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  uploadedBy: bigint("uploaded_by", { mode: "number", unsigned: true }).references(
    () => familyMembers.id,
  ),
  memberIds: json("member_ids").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

// Contact Info Table - stores contact details for family members
export const contactInfo = mysqlTable("contact_info", {
  id: serial("id").primaryKey(),
  memberId: bigint("member_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => familyMembers.id),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 255 }),
  socialLinks: json("social_links").$type<Record<string, string>>(),
  isPublic: int("is_public").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = typeof contactInfo.$inferInsert;
