import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3"; // ← importa o tipo
import path from "path";

const DB_PATH = path.join(__dirname, "../../data/pi_saborEmagia.db");

const db: DatabaseType = new Database(DB_PATH); // ← tipo explícito aqui

db.pragma("foreign_keys = ON");

export default db;