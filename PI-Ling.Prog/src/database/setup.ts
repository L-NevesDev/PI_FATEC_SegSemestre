import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "../../data/pi_saborEmagia.db");
const db: DatabaseType = new Database(DB_PATH);

db.pragma("foreign_keys = ON");

db.exec(`
PRAGMA foreign_keys = ON;

-- CategoriaProduto
CREATE TABLE IF NOT EXISTS CategoriaProduto (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT
);

-- Produto
CREATE TABLE IF NOT EXISTS Produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_produto TEXT NOT NULL,
    descricao TEXT,
    preco_base NUMERIC NOT NULL,
    preco_kg NUMERIC,
    ativo INTEGER DEFAULT 1,
    id_categoria INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES CategoriaProduto (id_categoria) ON DELETE RESTRICT
);

-- Estoque
CREATE TABLE IF NOT EXISTS Estoque (
    id_estoque INTEGER PRIMARY KEY AUTOINCREMENT,
    lote TEXT NOT NULL,
    data_producao TEXT NOT NULL,
    data_validade TEXT NOT NULL,
    quantidade_disponivel NUMERIC NOT NULL,
    id_produto INTEGER NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES Produto (id_produto) ON DELETE CASCADE
);

-- Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    endereco TEXT NOT NULL,
    data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Funcionario
CREATE TABLE IF NOT EXISTS Funcionario (
    id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    data_admissao TEXT NOT NULL,
    cargo TEXT NOT NULL,
    telefone TEXT,
    ativo INTEGER DEFAULT 1
);

-- Pedido
CREATE TABLE IF NOT EXISTS Pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    data_pedido TEXT DEFAULT CURRENT_TIMESTAMP,
    data_entrega TEXT,
    status_pedido TEXT NOT NULL,
    valor_total NUMERIC DEFAULT 0.00,
    observacoes TEXT,
    id_cliente INTEGER NOT NULL,
    id_funcionario INTEGER NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente (id_cliente) ON DELETE RESTRICT,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario (id_funcionario) ON DELETE RESTRICT
);

-- Entrega
CREATE TABLE IF NOT EXISTS Entrega (
    id_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_recebedor TEXT,
    endereco_entrega TEXT NOT NULL,
    valor_entrega NUMERIC DEFAULT 0.00,
    status_entrega TEXT NOT NULL,
    id_pedido INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (id_pedido) REFERENCES Pedido (id_pedido) ON DELETE CASCADE
);

-- Item_Pedido
CREATE TABLE IF NOT EXISTS Item_Pedido (
    id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    valor_unitario NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    id_pedido INTEGER NOT NULL,
    id_estoque INTEGER NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedido (id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_estoque) REFERENCES Estoque (id_estoque) ON DELETE RESTRICT
);

-- Item_Pedido_Adicional (atributo multivalorado)
CREATE TABLE IF NOT EXISTS Item_Pedido_Adicional (
    id_item_adicional INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_adicional TEXT NOT NULL,
    preco_adicional NUMERIC DEFAULT 0.00,
    id_item_pedido INTEGER NOT NULL,
    FOREIGN KEY (id_item_pedido) REFERENCES Item_Pedido (id_item_pedido) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS IDX_Pedido_Cliente ON Pedido(id_cliente);
CREATE INDEX IF NOT EXISTS IDX_Item_Pedido_Pedido ON Item_Pedido(id_pedido);
CREATE INDEX IF NOT EXISTS IDX_Estoque_Produto ON Estoque(id_produto);
CREATE INDEX IF NOT EXISTS IDX_Funcionario_Email ON Funcionario(email);
CREATE INDEX IF NOT EXISTS IDX_Adicional_Item_Pedido ON Item_Pedido_Adicional(id_item_pedido);




`);

console.log("Banco de dados criado em:", DB_PATH);
db.close();