import { Router } from "express";
import { clienteService } from "../services/cliente.service";
import { validar } from "../middlewares/validar";
import { ClienteSchema } from "../schemas/cliente.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(clienteService.listar());
});

router.get("/:id", (req, res) => {
  try {
    const cliente = clienteService.buscarPorId(Number(req.params.id));
    res.json(cliente);
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.post("/", validar(ClienteSchema), (req, res) => {
  const novo = clienteService.criar(req.body);
  res.status(201).json(novo);
});

router.put("/:id", validar(ClienteSchema.partial()), (req, res) => {
  try {
    const atualizado = clienteService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

router.delete("/:id", (req, res) => {
  try {
    clienteService.deletar(Number(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ erro: err.message });
  }
});

export default router;