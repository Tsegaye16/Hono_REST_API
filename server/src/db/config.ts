import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { positions } from "../models/positions";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema: { positions } });

export { db };
