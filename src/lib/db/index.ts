import postgres from "postgres";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export const sql = postgres(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
