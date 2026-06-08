import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { autenticar, apenasAdmin } from "./middlewares/auth.middleware";

// Rotas
import authRoutes from "./routes/auth.routes";
import clienteRoutes from "./routes/cliente.routes";
import funcionarioRoutes from "./routes/funcionario.routes";
import produtoRoutes from "./routes/produto.routes";
import estoqueRoutes from "./routes/estoque.routes";
import pedidoRoutes from "./routes/pedido.routes";
import categoriaProdutoRoutes from "./routes/categoriaProduto.routes";
import itemPedidoAdicionalRoutes from "./routes/itemPedidoAdicional.routes";

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger
app.get("/api-docs.json", (req, res) => { res.json(swaggerSpec); });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota pública — login
app.use("/api/auth", authRoutes);

// Rotas protegidas — exigem token JWT
app.use("/api/clientes",     autenticar, clienteRoutes);
app.use("/api/produtos",     autenticar, produtoRoutes);
app.use("/api/estoque",      autenticar, estoqueRoutes);
app.use("/api/pedidos",      autenticar, pedidoRoutes);
app.use("/api/categorias",   autenticar, categoriaProdutoRoutes);
app.use("/api/adicionais",   autenticar, itemPedidoAdicionalRoutes);

// Funcionários — somente admin pode ver/gerenciar
app.use("/api/funcionarios", autenticar, apenasAdmin, funcionarioRoutes);

// Middleware de erros SEMPRE no final
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎂 Sabor e Magia — Servidor rodando na porta ${PORT}`);
  console.log(`   Documentação:  http://localhost:${PORT}/api-docs`);
  console.log(`   Login:        POST http://localhost:${PORT}/api/auth/login\n`);
});
