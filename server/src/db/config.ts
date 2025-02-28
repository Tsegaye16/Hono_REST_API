import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { positions } from "../models/positions";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.LOCAL_DATABASE_URL,
});

const db = drizzle(pool, { schema: { positions } });

// Function to create the 'positions' table if it doesn't exist
async function createTableIfNotExists() {
  const query = `
    CREATE TABLE IF NOT EXISTS positions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      parentid INTEGER REFERENCES positions(id) ON DELETE SET NULL
    );
  `;

  try {
    await pool.query(query);
    console.log("Table 'positions' is ensured to exist.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// Run the function to ensure the table is created on startup
createTableIfNotExists();

export { db };
