import { Router } from "express";
import { produtoProntoService } from "../services/produtoPronto.service";
import { validar } from "../middlewares/validar";
import { ProdutoProntoSchema } from "../schemas/produtoPronto.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(produtoProntoService.listarDisponiveis());
});

router.get("/:id", (req, res) => {
  try {
    res.json(produtoProntoService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(ProdutoProntoSchema), (req, res) => {
  res.status(201).json(produtoProntoService.registrar(req.body));
});

// Retirar de venda
router.patch("/:id/retirar", (req, res) => {
  try {
    produtoProntoService.retirarDeVenda(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

export default router;