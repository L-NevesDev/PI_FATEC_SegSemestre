import { Router } from "express";
import { usuarioService } from "../services/usuario.service";
import { validar } from "../middlewares/validar";
import { UsuarioSchema, LoginSchema } from "../schemas/usuario.schema";

const router = Router();

// Cadastrar novo usuário (só admin)
router.post("/", validar(UsuarioSchema), async (req, res) => {
  try {
    const novo = await usuarioService.criar(req.body);
    res.status(201).json(novo);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// Login
router.post("/login", validar(LoginSchema), async (req, res) => {
  try {
    const user = await usuarioService.login(req.body.usuario, req.body.senha);
    res.json(user);
  } catch (err: any) {
    res.status(401).json({ erro: err.message }); // 401 = não autorizado
  }
});

export default router;