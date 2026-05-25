import { Router } from "express";
import { categoriaProdutoService } from "../services/categoriaProduto.service";
import { validar } from "../middlewares/validar";
import { CategoriaProdutoSchema } from "../schemas/categoriaProduto.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(categoriaProdutoService.listar());
});

router.get("/:id", (req, res) => {
  try {
    res.json(categoriaProdutoService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(CategoriaProdutoSchema), (req, res) => {
  res.status(201).json(categoriaProdutoService.criar(req.body));
});

router.put("/:id", validar(CategoriaProdutoSchema.partial()), (req, res) => {
  try {
    res.json(categoriaProdutoService.atualizar(Number(req.params.id), req.body));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.delete("/:id", (req, res) => {
  try {
    categoriaProdutoService.deletar(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;