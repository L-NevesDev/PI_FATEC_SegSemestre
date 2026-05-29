/*Jefferson- routes padrão para item Pedido Adicional
*/
import { Router } from "express";
import { itemPedidoAdicionalService } from "../services/itemPedidoAdicional.service";
import { validar } from "../middlewares/validar";
import { ItemPedidoAdicionalSchema } from "../schemas/itemPedidoAdicional.schema";

const router = Router();


router.get("/item/:id_item", (req, res) => {
  res.json(itemPedidoAdicionalService.listarPorItem(Number(req.params.id_item)));
});


router.get("/:id", (req, res) => {
  try {
    res.json(itemPedidoAdicionalService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});


router.post("/", validar(ItemPedidoAdicionalSchema), (req, res) => {
  try {
    res.status(201).json(itemPedidoAdicionalService.criar(req.body));
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});


router.delete("/:id", (req, res) => {
  try {
    itemPedidoAdicionalService.deletar(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

export default router;