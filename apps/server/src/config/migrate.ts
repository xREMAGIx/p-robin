import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./database";
import { sql } from "drizzle-orm";

await db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent`);

await migrate(db, { migrationsFolder: "./drizzle" });

console.log(`🦊 Migrate completed!`);

process.exit(0);
