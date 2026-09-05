import { readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = path.join(process.cwd(), "prisma", "dev.db");
const schemaSqlPath = path.join(process.cwd(), "prisma", "init.sql");

const sql = readFileSync(schemaSqlPath, "utf8");
const database = new DatabaseSync(databasePath);

try {
  database.exec("PRAGMA foreign_keys=ON");
  database.exec(sql);
  console.log(`SQLite database initialized: ${databasePath}`);
} finally {
  database.close();
}
