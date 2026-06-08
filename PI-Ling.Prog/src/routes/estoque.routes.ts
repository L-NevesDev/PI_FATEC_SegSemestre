import { Router } from "express";
import { estoqueService } from "../services/estoque.service";
import { validar } from "../middlewares/validar";
import { EstoqueSchema } from "../schemas/estoque.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(estoqueService.listar());
});

// GET /api/estoque/vencimento?dias=5
router.get("/vencimento", (req, res) => {
  const dias = Number(req.query.dias) || 3;
  res.json(estoqueService.alertarVencimento(dias));
});

router.get("/:id", (req, res) => {
  try {
    res.json(estoqueService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(EstoqueSchema), (req, res) => {
  try {
    res.status(201).json(estoqueService.adicionar(req.body));
  } catch (err: unknown) {
    res.status(400).json({ erro: (err as Error).message });
  }
});

// PUT — atualiza um lote (parcial)
router.put("/:id", validar(EstoqueSchema.partial()), (req, res) => {
  try {
    res.json(estoqueService.atualizar(Number(req.params.id), req.body));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

// DELETE — remove um lote
router.delete("/:id", (req, res) => {
  try {
    estoqueService.deletar(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

export default router;
