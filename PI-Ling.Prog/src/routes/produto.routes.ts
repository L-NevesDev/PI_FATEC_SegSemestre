import { Router } from "express";
import { produtoService } from "../services/produto.service";
import { validar } from "../middlewares/validar";
import { ProdutoSchema } from "../schemas/produto.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(produtoService.listar());
});

router.get("/:id", (req, res) => {
  try {
    res.json(produtoService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(ProdutoSchema), (req, res) => {
  try {
    res.status(201).json(produtoService.criar(req.body));
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// PUT — atualiza um produto (parcial)
router.put("/:id", validar(ProdutoSchema.partial()), (req, res) => {
  try {
    res.json(produtoService.atualizar(Number(req.params.id), req.body));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.delete("/:id", (req, res) => {
  try {
    produtoService.inativar(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

export default router;
