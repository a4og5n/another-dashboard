import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

/**
 * Neon Postgres connection with Drizzle ORM
 * Uses Neon's serverless driver optimized for edge/serverless environments
 * Works over HTTP with automatic connection pooling
 */

// Get connection string from environment
// Neon provides DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct)
// Drizzle works with both, prefer unpooled for migrations
const connectionString =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "Database connection string not found. Expected one of: POSTGRES_PRISMA_URL, DATABASE_URL_UNPOOLED, DATABASE_URL, POSTGRES_URL",
  );
}

// Create Neon client
const sql = neon(connectionString);

// Create Drizzle instance
export const db = drizzle(sql, { schema });

// Export schema for queries
export { schema };
