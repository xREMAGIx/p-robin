import { drizzle } from "drizzle-orm/postgres-js/driver";
import postgres from "postgres";
import * as schema from "../db-schema";

export const sql = postgres({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

export const db = drizzle(sql, { schema: { ...schema } });

const extractDB = () => {
  return db;
};

export type DBType = ReturnType<typeof extractDB>;
