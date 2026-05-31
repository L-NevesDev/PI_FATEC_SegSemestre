import swaggerUi from "swagger-ui-express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Sabor & Magia",
    version: "1.0.0",
    description: "Documentação da API da Confeitaria Sabor & Magia — FATEC Indaiatuba · ADS 2º Período",
  },
  servers: [
    { url: "http://localhost:3000", description: "Servidor local" },
  ],
  components: {
    schemas: {
      Cliente: {
        type: "object",
        required: ["nome", "telefone"],
        properties: {
          nome:     { type: "string", example: "Maria Silva" },
          telefone: { type: "string", example: "11999999999" },
          email:    { type: "string", example: "maria@email.com" },
          endereco: { type: "string", example: "Rua das Flores, 123" },
        },
      },
      Funcionario: {
        type: "object",
        required: ["nome", "telefone", "cargo", "data_admissao"],
        properties: {
          nome:          { type: "string",  example: "João Souza" },
          telefone:      { type: "string",  example: "11988888888" },
          cargo:         { type: "string",  example: "Confeiteiro" },
          ativo:         { type: "integer", example: 1 },
          data_admissao: { type: "string",  example: "2024-01-15" },
        },
      },
      Produto: {
        type: "object",
        required: ["id_categoria", "nome_produto", "preco_base"],
        properties: {
          id_categoria:      { type: "integer", example: 1 },
          nome_produto:      { type: "string",  example: "Bolo de Chocolate" },
          descricao:         { type: "string",  example: "Bolo fofinho com ganache" },
          preco_base:        { type: "number",  example: 89.90 },
          preco_kg:          { type: "number",  example: 45.00 },
          quantidade_fatias: { type: "integer", example: 12 },
          recheios:          { type: "array", items: { type: "integer" }, example: [1, 2] },
          coberturas:        { type: "array", items: { type: "integer" }, example: [1] },
        },
      },
      CategoriaProduto: {
        type: "object",
        required: ["nome"],
        properties: {
          nome:      { type: "string", example: "Bolos" },
          descricao: { type: "string", example: "Bolos de festa e comemorações" },
        },
      },
      Estoque: {
        type: "object",
        required: ["id_produto", "quantidade_disponivel", "data_producao", "data_validade", "lote"],
        properties: {
          id_produto:            { type: "integer", example: 1 },
          quantidade_disponivel: { type: "integer", example: 10 },
          data_producao:         { type: "string",  example: "2025-06-01" },
          data_validade:         { type: "string",  example: "2025-06-05" },
          lote:                  { type: "string",  example: "LOTE-001" },
        },
      },
      ProdutoPronto: {
        type: "object",
        required: ["id_estoque", "quantidade"],
        properties: {
          id_estoque:       { type: "integer", example: 1 },
          quantidade:       { type: "integer", example: 5 },
          disponivel_venda: { type: "integer", example: 1 },
        },
      },
      Pedido: {
        type: "object",
        required: ["id_cliente", "id_funcionario", "data_entrega", "itens"],
        properties: {
          id_cliente:     { type: "integer", example: 1 },
          id_funcionario: { type: "integer", example: 1 },
          data_entrega:   { type: "string",  example: "2025-06-08" },
          observacoes:    { type: "string",  example: "Sem açúcar na cobertura" },
          itens: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id_produto_pronto: { type: "integer", example: 1 },
                quantidade:        { type: "integer", example: 2 },
                valor_unitario:    { type: "number",  example: 89.90 },
              },
            },
          },
          entrega: {
            type: "object",
            properties: {
              endereco_entrega: { type: "string", example: "Rua das Flores, 123" },
              nome_recebedor:   { type: "string", example: "Maria Silva" },
              valor_entrega:    { type: "number", example: 10.00 },
            },
          },
        },
      },
      Usuario: {
        type: "object",
        required: ["id_funcionario", "usuario", "senha", "nivel_acesso"],
        properties: {
          id_funcionario: { type: "integer", example: 1 },
          usuario:        { type: "string",  example: "joao.souza" },
          senha:          { type: "string",  example: "senha123" },
          nivel_acesso:   { type: "string",  enum: ["admin", "funcionario"], example: "funcionario" },
        },
      },
      Login: {
        type: "object",
        required: ["usuario", "senha"],
        properties: {
          usuario: { type: "string", example: "joao.souza" },
          senha:   { type: "string", example: "senha123" },
        },
      },
      Erro: {
        type: "object",
        properties: {
          erro: { type: "string", example: "Registro não encontrado" },
        },
      },
    },
  },
  paths: {
    "/api/clientes": {
      get: {
        tags: ["Clientes"],
        summary: "Lista todos os clientes",
        responses: { "200": { description: "Lista de clientes" } },
      },
      post: {
        tags: ["Clientes"],
        summary: "Cria um novo cliente",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Cliente" } } } },
        responses: { "201": { description: "Cliente criado" }, "400": { description: "Dados inválidos" } },
      },
    },
    "/api/clientes/{id}": {
      get: {
        tags: ["Clientes"],
        summary: "Busca cliente por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Cliente encontrado" }, "404": { description: "Não encontrado" } },
      },
      put: {
        tags: ["Clientes"],
        summary: "Atualiza cliente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Cliente" } } } },
        responses: { "200": { description: "Cliente atualizado" }, "404": { description: "Não encontrado" } },
      },
      delete: {
        tags: ["Clientes"],
        summary: "Remove cliente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "Removido" }, "404": { description: "Não encontrado" } },
      },
    },
    "/api/funcionarios": {
      get: { tags: ["Funcionários"], summary: "Lista todos os funcionários", responses: { "200": { description: "Lista" } } },
      post: {
        tags: ["Funcionários"], summary: "Cria funcionário",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Funcionario" } } } },
        responses: { "201": { description: "Criado" }, "400": { description: "Dados inválidos" } },
      },
    },
    "/api/funcionarios/{id}": {
      get: { tags: ["Funcionários"], summary: "Busca por ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Encontrado" }, "404": { description: "Não encontrado" } } },
      put: {
        tags: ["Funcionários"], summary: "Atualiza funcionário",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Funcionario" } } } },
        responses: { "200": { description: "Atualizado" } },
      },
      delete: { tags: ["Funcionários"], summary: "Inativa funcionário", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "204": { description: "Inativado" } } },
    },
    "/api/produtos": {
      get: { tags: ["Produtos"], summary: "Lista todos os produtos", responses: { "200": { description: "Lista" } } },
      post: {
        tags: ["Produtos"], summary: "Cria produto",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Produto" } } } },
        responses: { "201": { description: "Criado" }, "400": { description: "Dados inválidos" } },
      },
    },
    "/api/produtos/{id}": {
      get: { tags: ["Produtos"], summary: "Busca por ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Encontrado" }, "404": { description: "Não encontrado" } } },
      delete: { tags: ["Produtos"], summary: "Inativa produto", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "204": { description: "Inativado" } } },
    },
    "/api/categorias": {
      get: { tags: ["Categorias"], summary: "Lista categorias", responses: { "200": { description: "Lista" } } },
      post: {
        tags: ["Categorias"], summary: "Cria categoria",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CategoriaProduto" } } } },
        responses: { "201": { description: "Criada" } },
      },
    },
    "/api/categorias/{id}": {
      get: { tags: ["Categorias"], summary: "Busca por ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Encontrada" } } },
      put: {
        tags: ["Categorias"], summary: "Atualiza categoria",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CategoriaProduto" } } } },
        responses: { "200": { description: "Atualizada" } },
      },
      delete: { tags: ["Categorias"], summary: "Remove categoria", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "204": { description: "Removida" } } },
    },
    "/api/estoque": {
      get: { tags: ["Estoque"], summary: "Lista estoque", responses: { "200": { description: "Lista" } } },
      post: {
        tags: ["Estoque"], summary: "Adiciona lote",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Estoque" } } } },
        responses: { "201": { description: "Lote adicionado" } },
      },
    },
    "/api/estoque/vencimento": {
      get: {
        tags: ["Estoque"], summary: "Alerta de vencimento",
        parameters: [{ name: "dias", in: "query", schema: { type: "integer", example: 3 }, description: "Dias até vencer (padrão: 3)" }],
        responses: { "200": { description: "Lista de produtos próximos ao vencimento" } },
      },
    },
    "/api/estoque/{id}": {
      get: { tags: ["Estoque"], summary: "Busca lote por ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Encontrado" } } },
    },
    "/api/produtos-prontos": {
      get: { tags: ["Produtos Prontos"], summary: "Lista disponíveis para venda", responses: { "200": { description: "Lista" } } },
      post: {
        tags: ["Produtos Prontos"], summary: "Registra produto pronto",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProdutoPronto" } } } },
        responses: { "201": { description: "Registrado" } },
      },
    },
    "/api/produtos-prontos/{id}": {
      get: { tags: ["Produtos Prontos"], summary: "Busca por ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Encontrado" } } },
    },
    "/api/produtos-prontos/{id}/retirar": {
      patch: { tags: ["Produtos Prontos"], summary: "Retira de venda", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "204": { description: "Retirado" } } },
    },
    "/api/pedidos": {
      get: { tags: ["Pedidos"], summary: "Lista pedidos", responses: { "200": { description: "Lista" } } },
      post: {
        tags: ["Pedidos"], summary: "Cria pedido",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Pedido" } } } },
        responses: { "201": { description: "Criado" }, "400": { description: "Dados inválidos" } },
      },
    },
    "/api/pedidos/{id}": {
      get: { tags: ["Pedidos"], summary: "Busca por ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Encontrado" } } },
    },
    "/api/pedidos/{id}/status": {
      patch: {
        tags: ["Pedidos"], summary: "Atualiza status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "em_preparo" } } } } } },
        responses: { "200": { description: "Status atualizado" } },
      },
    },
    "/api/usuarios": {
      post: {
        tags: ["Usuários"], summary: "Cadastra usuário",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Usuario" } } } },
        responses: { "201": { description: "Criado" }, "400": { description: "Dados inválidos" } },
      },
    },
    "/api/usuarios/login": {
      post: {
        tags: ["Usuários"], summary: "Login no sistema",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } } },
        responses: { "200": { description: "Login realizado" }, "401": { description: "Credenciais inválidas" } },
      },
    },
  },
};