import { pgTable, serial, varchar, text, integer } from "drizzle-orm/pg-core";

export const positions: any = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  parentid: integer("parentid").references(() => positions.id, {
    onDelete: "set null",
  }),
});
