import { Router } from "express";
import { empresaService } from "../services/empresa.service";
import { validar } from "../middlewares/validar";
import { EmpresaSchema } from "../schemas/empresa.schema";

const router = Router();

router.get("/", (req, res) => {
  res.json(empresaService.listar());
});

router.get("/:id", (req, res) => {
  const empresa = empresaService.buscarPorId(req.params.id);
  if (!empresa) return res.status(404).json({ erro: "Empresa não encontrada" });
  res.json(empresa);
});

router.post("/", validar(EmpresaSchema), (req, res) => {
  const novaEmpresa = empresaService.criar(req.body);
  res.status(201).json(novaEmpresa);
});

router.put("/:id", validar(EmpresaSchema.partial()), (req, res) => {
  const atualizada = empresaService.atualizar(req.params.id, req.body);
  if (!atualizada) return res.status(404).json({ erro: "Empresa não encontrada" });
  res.json(atualizada);
});

router.delete("/:id", (req, res) => {
  const sucesso = empresaService.deletar(req.params.id);
  if (!sucesso) return res.status(404).json({ erro: "Empresa não encontrada" });
  res.status(204).send();
});

export default router;