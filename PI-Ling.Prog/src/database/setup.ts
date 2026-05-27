import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "../../data/pi_saborEmagia.db");
const db: DatabaseType = new Database(DB_PATH);

// Murilo aqui! Exclui a tabela de usuários porque ela já não faz mais parte do nosso banco conceitual
// Alterei os campos "ativo" e "telefone" do Funcionário como NOT NULL para deixá-los como uma entrada obrigatória


/*Jefferson - Tabela Pedido alterado para se adequar ao novo modelo do Banco Fisico
Tabela ProdutoPronto apagada, é o que fazia ligação entre estoque e item_pedido
funcionamento atual dessas duas tabelas acaba sendo outro
Tabela Entrega alterada para se adequar ao novo modelo do Banco Fisico
Tabela Item_Pedido alterada para se adequar ao novo modelo do Banco fisico
Tabela Item_Pedido_Adicional adicionada, tabela referente ao atributo multivalador adicional
e valor adicional
*/
db.pragma("foreign_keys = ON");

db.exec(`-- Ativar suporte a Chaves Estrangeiras no SQLite
PRAGMA foreign_keys = ON;

-- 1. CategoriaProduto
CREATE TABLE IF NOT EXISTS CategoriaProduto (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT
);

-- Lucas irá mexer aqui,
-- O produto não tem data de criação
-- Retirei o campo "quantidade_fatias" já que isso se encaixa como regra de negocio
-- ou até mesmo cadastro de um produto especifico

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
    cargo TEXT NOT NULL,
    data_admissao TEXT NOT NULL
);


-- Pedido
CREATE TABLE Pedido (
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
CREATE TABLE Entrega (
    id_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_recebedor TEXT,
    endereco_entrega TEXT NOT NULL,
    valor_entrega NUMERIC DEFAULT 0.00,
    status_entrega TEXT NOT NULL,
    id_pedido INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (id_pedido) REFERENCES Pedido (id_pedido) ON DELETE CASCADE
);


-- Item_Pedido 
CREATE TABLE Item_Pedido (
    id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    valor_unitario NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL, -- (quantidade * valor_unitario)
    id_pedido INTEGER NOT NULL,
    id_estoque INTEGER NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedido (id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_estoque) REFERENCES Estoque (id_estoque) ON DELETE RESTRICT
);

-- Item_Pedido_Adicional (atributo multivalorado)
CREATE TABLE Item_Pedido_Adicional (
    id_item_adicional INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_adicional TEXT NOT NULL,      
    preco_adicional NUMERIC DEFAULT 0.00, -- Preço cobrado por adicional específico
    id_item_pedido INTEGER NOT NULL,    
    FOREIGN KEY (id_item_pedido) REFERENCES Item_Pedido (id_item_pedido) ON DELETE CASCADE
);



`);

console.log("Banco de dados criado em:", DB_PATH);
db.close();