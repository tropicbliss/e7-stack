import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
	id: serial("id").primaryKey(),
	googleId: text("google_id").notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	picture: text("picture").notNull(),
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
});

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;
