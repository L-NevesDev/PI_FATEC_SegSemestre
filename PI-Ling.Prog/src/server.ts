import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { errorHandler } from "./middlewares/errorHandler";


// rotas
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

// Documentação Swagger
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registro das rotas
app.use("/api/clientes",     clienteRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/produtos",     produtoRoutes);
app.use("/api/estoque",      estoqueRoutes);
app.use("/api/pedidos",      pedidoRoutes);
app.use("/api/categorias",   categoriaProdutoRoutes);
app.use("/api/adicionais",   itemPedidoAdicionalRoutes);

// Middleware de erros SEMPRE no final
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎂 Sabor e Magia — Servidor rodando na porta ${PORT}`);
  console.log(`   Documentação:  http://localhost:${PORT}/api-docs`);
  console.log(`   Clientes:     GET http://localhost:${PORT}/api/clientes`);
  console.log(`   Funcionários: GET http://localhost:${PORT}/api/funcionarios`);
  console.log(`   Produtos:     GET http://localhost:${PORT}/api/produtos`);
  console.log(`   Estoque:      GET http://localhost:${PORT}/api/estoque`);
  console.log(`   Pedidos:      GET http://localhost:${PORT}/api/pedidos`);
  console.log(`   Categorias:   GET http://localhost:${PORT}/api/categorias`);
  console.log(`   Adicionais:   GET http://localhost:${PORT}/api/adicionais\n`);
});
