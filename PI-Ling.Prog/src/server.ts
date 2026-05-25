import express from "express";
import { errorHandler } from "./middlewares/errorHandler";



// rotas 
import clienteRoutes from "./routes/cliente.routes";
import funcionarioRoutes from "./routes/funcionario.routes";
import produtoRoutes from "./routes/produto.routes";
import estoqueRoutes from "./routes/estoque.routes";
import pedidoRoutes from "./routes/pedido.routes";
import categoriaProdutoRoutes from "./routes/categoriaProduto.routes";
import usuarioRoutes          from "./routes/usuario.routes";
import produtoProntoRoutes    from "./routes/produtoPronto.routes";

const app = express();
app.use(express.json());

// Registro das rotas
app.use("/api/clientes",     clienteRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/produtos",     produtoRoutes);
app.use("/api/estoque",      estoqueRoutes);
app.use("/api/pedidos",      pedidoRoutes);
app.use("/api/categorias",       categoriaProdutoRoutes);
app.use("/api/usuarios",         usuarioRoutes);
app.use("/api/produtos-prontos", produtoProntoRoutes);

// Middleware de erros SEMPRE no final
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎂 Sabor e Magia — Servidor rodando na porta ${PORT}`);
  console.log(`   Clientes:     GET http://localhost:${PORT}/api/clientes`);
  console.log(`   Funcionários: GET http://localhost:${PORT}/api/funcionarios`);
  console.log(`   Produtos:     GET http://localhost:${PORT}/api/produtos`);
  console.log(`   Estoque:      GET http://localhost:${PORT}/api/estoque`);
  console.log(`   Pedidos:      GET http://localhost:${PORT}/api/pedidos`);
  console.log(`   Categorias:   GET http://localhost:${PORT}/api/categorias`);
  console.log(`   Usuarios:   GET http://localhost:${PORT}/api/usuarios`);
  console.log(`   Produtos Prontos:   GET http://localhost:${PORT}/api/produtos-prontos\n`);
});