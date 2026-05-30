import { Router, Request, Response } from "express"; // Murilo aqui! Aqui eu adicionei o Request e Response para fazer a tipagem das rotas e evitar erros na hora de rodar
import { funcionarioService } from "../services/funcionario.service";
import { validar } from "../middlewares/validar";
import { FuncionarioSchema } from "../schemas/funcionario.schema";

const router = Router();

// Adicionei async e await para que o código seja executado na ordem correta e com todos os dados
router.get("/", async (req: Request, res: Response) => {
  const funcionarios = await funcionarioService.listar();
  res.json(funcionarios);
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response, next) => {
  try {
    const funcionario = await funcionarioService.buscarPorId(Number(req.params.id));
    res.json(funcionario);
  } catch (err) {
    next(err); //também usei next para ficar mais fácil as trativas com erros nas rotas
    //agora um só lugar faz as trativas com erros
  }
});

router.post("/", validar(FuncionarioSchema), async (req: Request, res: Response) => {
  const novo = await funcionarioService.criar(req.body);
  res.status(201).json(novo);
});

router.put("/:id", validar(FuncionarioSchema.partial()), async (req: Request<{ id: string }>, res: Response, next) => {
  try {
    const atualizado = await funcionarioService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  } catch (err) {
    next(err);
  }
});

// Inativar em vez de deletar
router.delete("/:id", async (req: Request<{ id:string }>, res: Response, next) => {
  try {
    await funcionarioService.inativar(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;