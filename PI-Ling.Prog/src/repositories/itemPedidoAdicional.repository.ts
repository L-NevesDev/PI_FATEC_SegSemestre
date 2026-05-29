/*Jefferson - Repository padrão para item Pedido Adicional
*/

import db from "../database/connection";
import type { ItemPedidoAdicional } from "../schemas/itemPedidoAdicional.schema";

export const itemPedidoAdicionalRepository = {

  listarPorItem: (id_item_pedido: number): ItemPedidoAdicional[] => {
    return db.prepare(`
      SELECT * FROM Item_Pedido_Adicional
      WHERE id_item_pedido = ?
      ORDER BY id_item_adicional
    `).all(id_item_pedido) as ItemPedidoAdicional[];
  },

  buscarPorId: (id: number): ItemPedidoAdicional | undefined => {
    return db.prepare(
      "SELECT * FROM Item_Pedido_Adicional WHERE id_item_adicional = ?"
    ).get(id) as ItemPedidoAdicional | undefined;
  },

  criar: (dados: Omit<ItemPedidoAdicional, "id_item_adicional">): ItemPedidoAdicional => {
    const resultado = db.prepare(`
      INSERT INTO Item_Pedido_Adicional (id_item_pedido, nome_adicional, preco_adicional)
      VALUES (@id_item_pedido, @nome_adicional, @preco_adicional)
    `).run(dados);

    return { id_item_adicional: Number(resultado.lastInsertRowid), ...dados };
  },

  deletar: (id: number): boolean => {
    const resultado = db.prepare(
      "DELETE FROM Item_Pedido_Adicional WHERE id_item_adicional = ?"
    ).run(id);
    return resultado.changes > 0;
  },
};