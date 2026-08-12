import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | undefined;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required before database-backed Odhvica features can run.");
  }

  pool ??= new Pool({ connectionString });
  return drizzle({ client: pool, schema });
}
