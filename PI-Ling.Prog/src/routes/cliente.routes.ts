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

// Lucas: adicionado try/catch no POST — sem ele, erros do banco (ex: CPF duplicado, UNIQUE constraint)
// chegavam como 500 sem mensagem útil; agora retornam 400 com a mensagem de erro correta
router.post("/", validar(ClienteSchema), (req, res) => {
  try {
    const novo = clienteService.criar(req.body);
    res.status(201).json(novo);
  } catch (err: unknown) {
    res.status(400).json({ erro: (err as Error).message });
  }
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