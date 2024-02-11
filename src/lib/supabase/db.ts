import { drizzle } from "drizzle-orm/postgres-js";
import postres from "postgres";

import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 DATABASE_URL not found");
}

const client = postres(process.env.DATABASE_URL as string, { max: 1 });

const db = drizzle(client, { schema });
// const migrateDb = async () => {
//   try {
//     console.log("🟠 Migrating client");
//     await migrate(db, { migrationsFolder: "migrations" });
//     console.log("🟢 Successfully Migrated");
//   } catch (error) {
//     console.log("🔴Error Migrating client");
//   }
// };
// migrateDb();
export default db;
