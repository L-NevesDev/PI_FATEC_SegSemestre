import { z } from "zod";

const ItemPedidoSchema = z.object({
  id_produto_pronto: z.number().int().positive(),
  quantidade: z.number().int().positive(),
  valor_unitario: z.number().positive(),
});

const EntregaSchema = z.object({
  endereco_entrega: z.string().min(5),
  nome_recebedor: z.string().min(2),
  valor_entrega: z.number().min(0).default(0),
});

export const PedidoSchema = z.object({
  id_cliente: z.number().int().positive(),
  id_funcionario: z.number().int().positive(),
  data_entrega: z.string(),
  observacoes: z.string().optional(),
  itens: z.array(ItemPedidoSchema).min(1, "Pedido precisa de ao menos 1 item"),
  entrega: EntregaSchema.optional(), // entrega é opcional (pode retirar no balcão)
});

export type PedidoInput = z.infer<typeof PedidoSchema>;