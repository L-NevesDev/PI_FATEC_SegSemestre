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

// Lucas: adicionado try/catch no POST — sem ele, erros do banco (ex: id_produto inexistente, FK constraint)
// chegavam como 500 sem mensagem útil; agora retornam 400 com a mensagem de erro correta
router.post("/", validar(EstoqueSchema), (req, res) => {
  try {
    res.status(201).json(estoqueService.adicionar(req.body));
  } catch (err: unknown) {
    res.status(400).json({ erro: (err as Error).message });
  }
});

export default router;