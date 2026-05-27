/*Jefferson - Criação  do Schema para o item Pedido Adicional
Tabela referente aos  atributos multivalorados  adicional e preco adicional
*/
import { z } from "zod";

export const ItemPedidoAdicionalSchema = z.object({
  id_item_pedido: z.number().int().positive("ID do item de pedido obrigatório"),
  nome_adicional: z.string().min(1, "Nome do adicional obrigatório"),
  preco_adicional: z.number().min(0).default(0),
});

export type ItemPedidoAdicional = z.infer<typeof ItemPedidoAdicionalSchema> & {
  id_item_adicional: number;
};