import express from "express";
import empresaRoutes from "./routes/empresa.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

// Registro das Rotas
app.use("/api/empresas", empresaRoutes);

// Middleware de tratamento de erros SEMPRE no final
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Testes: GET http://localhost:${PORT}/api/empresas`);
});