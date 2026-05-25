import { Router } from "express";
import { pedidoService } from "../services/pedido.service";
import { validar } from "../middlewares/validar";
import { PedidoSchema } from "../schemas/pedido.schema";
import { z } from "zod";

const router = Router();

const StatusSchema = z.object({
  status: z.string(),
});

router.get("/", (req, res) => {
  res.json(pedidoService.listar());
});

router.get("/:id", (req, res) => {
  try {
    res.json(pedidoService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(PedidoSchema), (req, res) => {
  try {
    res.status(201).json(pedidoService.criar(req.body));
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// PATCH para atualizar só o status
router.patch("/:id/status", validar(StatusSchema), (req, res) => {
  try {
    res.json(pedidoService.atualizarStatus(Number(req.params.id), req.body.status));
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;