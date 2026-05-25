import db from "../database/connection";
import type { Produto, Recheio, Cobertura } from "../schemas/produto.schema";

export const produtoRepository = {

  listarTodos: (): Produto[] => {
    return db.prepare(`
      SELECT p.*, c.nome as categoria_nome
      FROM Produto p
      JOIN CategoriaProduto c ON c.id_categoria = p.id_categoria
      WHERE p.ativo = 1
    `).all() as Produto[];
  },

  buscarPorId: (id: number): Produto | undefined => {
    return db.prepare(
      "SELECT * FROM Produto WHERE id_produto = ? AND ativo = 1"
    ).get(id) as Produto | undefined;
  },

  buscarRecheiosDoProduto: (id_produto: number): Recheio[] => {
    return db.prepare(`
      SELECT r.* FROM Recheio r
      JOIN Aux_Prod_Recheio apr ON apr.id_recheio = r.id_recheio
      WHERE apr.id_produto = ?
    `).all(id_produto) as Recheio[];
  },

  buscarCoberturasDoProduto: (id_produto: number): Cobertura[] => {
    return db.prepare(`
      SELECT c.* FROM Cobertura c
      JOIN Aux_Prod_Cobertura apc ON apc.id_cobertura = c.id_cobertura
      WHERE apc.id_produto = ?
    `).all(id_produto) as Cobertura[];
  },

  criar: (dados: Omit<Produto, "id_produto" | "ativo">, recheios: number[], coberturas: number[]): Produto => {
    // db.transaction() garante que tudo isso acontece junto ou nada acontece
    const transacao = db.transaction(() => {
      const resultado = db.prepare(`
        INSERT INTO Produto (id_categoria, nome_produto, descricao, preco_base, preco_kg, quantidade_fatias, ativo)
        VALUES (@id_categoria, @nome_produto, @descricao, @preco_base, @preco_kg, @quantidade_fatias, 1)
      `).run(dados);

      const id_produto = Number(resultado.lastInsertRowid);

      // Vincula cada recheio ao produto na tabela auxiliar
      const insRecheio = db.prepare(
        "INSERT INTO Aux_Prod_Recheio (id_produto, id_recheio) VALUES (?, ?)"
      );
      recheios.forEach(id_recheio => insRecheio.run(id_produto, id_recheio));

      // Vincula cada cobertura ao produto na tabela auxiliar
      const insCobertura = db.prepare(
        "INSERT INTO Aux_Prod_Cobertura (id_produto, id_cobertura) VALUES (?, ?)"
      );
      coberturas.forEach(id_cobertura => insCobertura.run(id_produto, id_cobertura));

      return { id_produto, ativo: 1, ...dados };
    });

    return transacao(); // executa a transação
  },

  inativar: (id: number): void => {
    db.prepare("UPDATE Produto SET ativo = 0 WHERE id_produto = ?").run(id);
  },
};