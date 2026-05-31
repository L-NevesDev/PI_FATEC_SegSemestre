import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { errorHandler } from "./middlewares/errorHandler";
<<<<<<< HEAD
 
// rotas
=======


/*Jefferson- Apagado as rotas e correspondentes não mais utilizado (usuarios e produtoPronto)
Adicionado routes e correspondentes de item pedido adicional
*/
// rotas 
>>>>>>> 2216c6be4c97af8081f0f9e016a9c5bff55f0a92
import clienteRoutes from "./routes/cliente.routes";
import funcionarioRoutes from "./routes/funcionario.routes";
import produtoRoutes from "./routes/produto.routes";
import estoqueRoutes from "./routes/estoque.routes";
import pedidoRoutes from "./routes/pedido.routes";
import categoriaProdutoRoutes from "./routes/categoriaProduto.routes";
<<<<<<< HEAD
import usuarioRoutes          from "./routes/usuario.routes";
import produtoProntoRoutes    from "./routes/produtoPronto.routes";
 
=======
import itemPedidoAdicionalRoutes from "./routes/itemPedidoAdicional.routes";


>>>>>>> 2216c6be4c97af8081f0f9e016a9c5bff55f0a92
const app = express();
app.use(express.json());
 
// Documentação Swagger
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
// Registro das rotas
<<<<<<< HEAD
app.use("/api/clientes",          clienteRoutes);
app.use("/api/funcionarios",      funcionarioRoutes);
app.use("/api/produtos",          produtoRoutes);
app.use("/api/estoque",           estoqueRoutes);
app.use("/api/pedidos",           pedidoRoutes);
app.use("/api/categorias",        categoriaProdutoRoutes);
app.use("/api/usuarios",          usuarioRoutes);
app.use("/api/produtos-prontos",  produtoProntoRoutes);
 
=======
app.use("/api/clientes",     clienteRoutes);
app.use("/api/funcionarios", funcionarioRoutes);
app.use("/api/produtos",     produtoRoutes);
app.use("/api/estoque",      estoqueRoutes);
app.use("/api/pedidos",      pedidoRoutes);
app.use("/api/categorias",       categoriaProdutoRoutes);
app.use("/api/adicionais",   itemPedidoAdicionalRoutes);


>>>>>>> 2216c6be4c97af8081f0f9e016a9c5bff55f0a92
// Middleware de erros SEMPRE no final
app.use(errorHandler);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎂 Sabor e Magia — Servidor rodando na porta ${PORT}`);
<<<<<<< HEAD
  console.log(`   Documentação:  http://localhost:${PORT}/api-docs`);
  console.log(`   Clientes:      GET http://localhost:${PORT}/api/clientes`);
  console.log(`   Funcionários:  GET http://localhost:${PORT}/api/funcionarios`);
  console.log(`   Produtos:      GET http://localhost:${PORT}/api/produtos`);
  console.log(`   Estoque:       GET http://localhost:${PORT}/api/estoque`);
  console.log(`   Pedidos:       GET http://localhost:${PORT}/api/pedidos`);
  console.log(`   Categorias:    GET http://localhost:${PORT}/api/categorias`);
  console.log(`   Usuários:      GET http://localhost:${PORT}/api/usuarios`);
  console.log(`   Produtos Prontos: GET http://localhost:${PORT}/api/produtos-prontos\n`);
=======
  console.log(`   Clientes:     GET http://localhost:${PORT}/api/clientes`);
  console.log(`   Funcionários: GET http://localhost:${PORT}/api/funcionarios`);
  console.log(`   Produtos:     GET http://localhost:${PORT}/api/produtos`);
  console.log(`   Estoque:      GET http://localhost:${PORT}/api/estoque`);
  console.log(`   Pedidos:      GET http://localhost:${PORT}/api/pedidos`);
  console.log(`   Categorias:   GET http://localhost:${PORT}/api/categorias`);
  console.log(`   Adicionais:   GET http://localhost:${PORT}/api/adicionais\n`);

>>>>>>> 2216c6be4c97af8081f0f9e016a9c5bff55f0a92
});