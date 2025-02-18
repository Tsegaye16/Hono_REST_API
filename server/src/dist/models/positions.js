"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.positions = (0, pg_core_1.pgTable)("positions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    parentid: (0, pg_core_1.integer)("parentid").references(() => exports.positions.id, {
        onDelete: "set null",
    }),
});
