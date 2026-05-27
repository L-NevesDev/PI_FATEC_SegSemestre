import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "../../data/pi_saborEmagia.db");
const db: DatabaseType = new Database(DB_PATH);

// Murilo aqui! Exclui a tabela de usuários porque ela já não faz mais parte do nosso banco conceitual
// Alterei os campos "ativo" e "telefone" do Funcionário como NOT NULL para deixá-los como uma entrada obrigatória
db.pragma("foreign_keys = ON");

db.exec(`-- Ativar suporte a Chaves Estrangeiras no SQLite
PRAGMA foreign_keys = ON;

-- 1. CategoriaProduto
CREATE TABLE IF NOT EXISTS CategoriaProduto (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT
);

-- 2. Produto
CREATE TABLE IF NOT EXISTS Produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria INTEGER NOT NULL,
    nome_produto TEXT NOT NULL,
    descricao TEXT,
    preco_base REAL NOT NULL,
    preco_kg REAL,
    quantidade_fatias INTEGER,
    ativo INTEGER DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES CategoriaProduto(id_categoria) ON DELETE RESTRICT
);

-- 3. Recheio
CREATE TABLE IF NOT EXISTS Recheio (
    id_recheio INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_recheio TEXT NOT NULL,
    valor_adicional REAL DEFAULT 0.0
);

-- 4. Cobertura
CREATE TABLE IF NOT EXISTS Cobertura (
    id_cobertura INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_cobertura TEXT NOT NULL,
    valor_adicional REAL DEFAULT 0.0
);

-- 5. Aux_Prod_Recheio
CREATE TABLE IF NOT EXISTS Aux_Prod_Recheio (
    id_produto INTEGER,
    id_recheio INTEGER,
    PRIMARY KEY (id_produto, id_recheio),
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_recheio) REFERENCES Recheio(id_recheio) ON DELETE CASCADE
);

-- 6. Aux_Prod_Cobertura
CREATE TABLE IF NOT EXISTS Aux_Prod_Cobertura (
    id_cobertura INTEGER,
    id_produto INTEGER,
    PRIMARY KEY (id_cobertura, id_produto),
    FOREIGN KEY (id_cobertura) REFERENCES Cobertura(id_cobertura) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE CASCADE
);

-- 7. Estoque
CREATE TABLE IF NOT EXISTS Estoque (
    id_estoque INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INTEGER NOT NULL,
    quantidade_disponivel INTEGER NOT NULL,
    data_producao TEXT NOT NULL,
    data_validade TEXT NOT NULL,
    lote TEXT NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto) ON DELETE RESTRICT
);

-- 8. Produto_Pronto
CREATE TABLE IF NOT EXISTS Produto_Pronto (
    id_produto_pronto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_estoque INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    disponivel_venda INTEGER DEFAULT 1,
    FOREIGN KEY (id_estoque) REFERENCES Estoque(id_estoque) ON DELETE RESTRICT
);

-- 9. Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    endereco TEXT,
    data_cadastro TEXT
);

-- 10. Funcionario
CREATE TABLE IF NOT EXISTS Funcionario (
    id_funcionario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cargo TEXT NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1,
    data_admissao TEXT NOT NULL
);

-- 12. Pedido
CREATE TABLE IF NOT EXISTS Pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_funcionario INTEGER NOT NULL,
    data_pedido TEXT,
    data_entrega TEXT NOT NULL,
    status_pedido TEXT NOT NULL,
    valor_total REAL NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE RESTRICT,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario) ON DELETE RESTRICT
);

-- 13. Entrega
CREATE TABLE IF NOT EXISTS Entrega (
    id_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER UNIQUE NOT NULL,
    endereco_entrega TEXT NOT NULL,
    nome_recebedor TEXT NOT NULL,
    valor_entrega REAL DEFAULT 0.0,
    status_entrega TEXT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido) ON DELETE CASCADE
);

-- 14. Item_Pedido
CREATE TABLE IF NOT EXISTS Item_Pedido (
    id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_produto_pronto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_produto_pronto) REFERENCES Produto_Pronto(id_produto_pronto) ON DELETE RESTRICT
);
`);

console.log("✅ Banco de dados criado com sucesso em:", DB_PATH);
db.close();