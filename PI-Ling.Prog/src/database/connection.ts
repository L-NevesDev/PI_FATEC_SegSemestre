import Database from "better-sqlite3";
import path from "path";

// Caminho para o arquivo .db na pasta data/
const DB_PATH = path.join(__dirname, "../../data/pi_saborEmagia.db");

// Abre (ou cria) o arquivo do banco
const db = new Database(DB_PATH);

// Ativa as chaves estrangeiras — OBRIGATÓRIO para seu banco funcionar corretamente
db.pragma("foreign_keys = ON");

export default db;