import { Router } from "express";
import { funcionarioService } from "../services/funcionario.service";
import { validar } from "../middlewares/validar";
import { FuncionarioSchema } from "../schemas/funcionario.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(funcionarioService.listar());
});

router.get("/:id", (req, res) => {
  try {
    res.json(funcionarioService.buscarPorId(Number(req.params.id)));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(FuncionarioSchema), (req, res) => {
  res.status(201).json(funcionarioService.criar(req.body));
});

router.put("/:id", validar(FuncionarioSchema.partial()), (req, res) => {
  try {
    res.json(funcionarioService.atualizar(Number(req.params.id), req.body));
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

// Inativar em vez de deletar
router.delete("/:id", (req, res) => {
  try {
    funcionarioService.inativar(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

export default router;