import { Router } from "express";
import db from "../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" });
  }

  const funcionario = db.prepare(
    "SELECT * FROM Funcionario WHERE email = ? AND ativo = 1"
  ).get(email) as any;

  if (!funcionario) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const senhaCorreta = bcrypt.compareSync(senha, funcionario.senha_hash);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    {
      id_funcionario: funcionario.id_funcionario,
      nome: funcionario.nome,
      perfil: funcionario.perfil || "funcionario",
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    funcionario: {
      id_funcionario: funcionario.id_funcionario,
      nome: funcionario.nome,
      email: funcionario.email,
      cargo: funcionario.cargo,
      perfil: funcionario.perfil || "funcionario",
    },
  });
});

export default router;
