import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const jobTable = pgTable("job", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	data: jsonb("data"),
	provider: text("provider"),
	description: text("description").notNull(),
	location: text("location").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: "string" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 3,
		mode: "string",
	}).notNull(),
});
