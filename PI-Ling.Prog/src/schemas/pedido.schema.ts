import { z } from "zod";

/*Jefferson - Alterações feitas para se adequar ao novo modelo Fisico do banco de dados.
Não utiliza mais id_produto_pronto(não existe)
Agora possuem adicionais (que antes possuia funcionamento em produto)

nome_recebedor agora tem o minimo de 10 letras
endereco_entrega tambem
 */
const ItemPedidoSchema = z.object({
  id_estoque: z.number().int().positive("ID do estoque deve ser positivo"),
  quantidade: z.number().int().positive("Quantidade deve ser positiva"),
  valor_unitario: z.number().positive("Valor unitário deve ser positivo"),
  /*Adicionais são opcionais (Eles vêm como array de strings já
  que fazem parte de uma outra tabela, são atributos multivalorado)
  */
  adicionais: z.array(z.object({
    nome_adicional: z.string().min(1),
    preco_adicional: z.number().min(0).default(0),
  })).optional(),
});


const EntregaSchema = z.object({
  nome_recebedor: z.string().min(10, "Nome do recebedor obrigatório"),
  endereco_entrega: z.string().min(10, "Endereço de entrega obrigatório"),
  valor_entrega: z.number().min(0).default(0),
});


export const PedidoSchema = z.object({
  id_cliente: z.number().int().positive(),
  id_funcionario: z.number().int().positive(),
  data_entrega: z.string().min(1, "Data de entrega obrigatória"),
  observacoes: z.string().optional(),
  itens: z.array(ItemPedidoSchema).min(1, "Pedido precisa de pelo menos 1 item"),
  entrega: EntregaSchema.optional(), // entrega é opcional (pode retirar no balcão)
});

export type PedidoInput = z.infer<typeof PedidoSchema>;