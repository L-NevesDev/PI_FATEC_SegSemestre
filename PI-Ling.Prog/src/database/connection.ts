import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3"; // ← importa o tipo
import path from "path";

const DB_PATH = path.join(__dirname, "../../data/pi_saborEmagia.db");

const db: DatabaseType = new Database(DB_PATH); // ← tipo explícito aqui

db.pragma("foreign_keys = ON");
db.pragma("foreign_keys = ON");

// Migration: adiciona coluna perfil se não existir
try {
  db.exec("ALTER TABLE Funcionario ADD COLUMN perfil TEXT DEFAULT 'funcionario'");
} catch {} // coluna já existe, ignora

export default db;