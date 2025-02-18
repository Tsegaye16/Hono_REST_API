import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();
export default {
  schema: "./models/positions.ts",
  out: "../drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: parseInt(process.env.DB_PORT || "2123"),
    ssl: process.env.DB_SSL === "true",
  },
} satisfies Config;
