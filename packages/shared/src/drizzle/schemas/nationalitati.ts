import { pgTable, text } from "drizzle-orm/pg-core";

export const nationalitati = pgTable("nationalitati", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
