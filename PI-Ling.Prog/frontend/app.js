const API = 'http://localhost:3000/api';

// ─── AUTENTICAÇÃO ─────────────────────────────────────────────────────────────
const token   = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

// Redireciona para login se não tiver token
if (!token) window.location.href = 'login.html';

// Wrapper de fetch que inclui token e redireciona no 401
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    }
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
    return null;
  }
  return res;
}

function sair() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('paginaAtual');
  window.location.href = 'login.html';
}

// ─── ESTADO GLOBAL ────────────────────────────────────────────────────────────
let paginaAtual       = localStorage.getItem('paginaAtual') || 'inicio';
let todosClientes     = [];
let todasCategorias   = [];
let todosProdutos     = [];
let todosEstoque      = [];
let todosPedidos      = [];
let todosFuncionarios = [];
let itensPedido       = [];
let itemIdx           = 0;

// ─── INICIALIZAR UI DE USUÁRIO ────────────────────────────────────────────────
function inicializarUI() {
  if (usuario) {
    document.getElementById('usuario-nome').textContent = usuario.nome;
    document.getElementById('usuario-perfil').textContent =
      usuario.perfil === 'admin' ? '👑 Admin' : '👤 Funcionário';
  }

  if (ehAdmin()) {
    // Admin vê tudo
    document.getElementById('nav-funcionarios').style.display = 'flex';
  } else {
    // Funcionário: esconde grupo de Produtos (parent + submenu) e Clientes
    const navGroup = document.querySelector('.nav-group');
    if (navGroup) navGroup.style.display = 'none';
    const navClientes = document.querySelector('.nav-item[data-page="clientes"]');
    if (navClientes) navClientes.style.display = 'none';

    // Se a página salva for restrita, redireciona para início
    const paginasPermitidas = ['inicio', 'estoque', 'pedidos', 'relatorios'];
    if (!paginasPermitidas.includes(paginaAtual)) {
      paginaAtual = 'inicio';
      localStorage.setItem('paginaAtual', 'inicio');
    }
  }
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(msg, tipo = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${tipo}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ─── NAVEGAÇÃO ────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    if (item.classList.contains('nav-parent')) {
      item.classList.toggle('open');
      document.getElementById('submenu-produtos').classList.toggle('open');
      return;
    }
    navegarPara(item.dataset.page);
  });
});

function navegarPara(page) {
  // Bloqueia acesso a páginas restritas para funcionários
  const paginasAdmin = ['clientes', 'produtos', 'categorias', 'funcionarios'];
  if (!ehAdmin() && paginasAdmin.includes(page)) {
    toast('Acesso restrito a administradores.', 'error');
    page = 'inicio';
  }

  paginaAtual = page;
  localStorage.setItem('paginaAtual', page);

  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  if (page === 'inicio')        carregarInicio();
  if (page === 'clientes')      carregarClientes();
  if (page === 'produtos')      carregarProdutos();
  if (page === 'categorias')    carregarCategorias();
  if (page === 'estoque')       carregarEstoque();
  if (page === 'pedidos')       carregarPedidos();
  if (page === 'relatorios')    carregarRelatorios();
  if (page === 'funcionarios')  carregarFuncionarios();
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatarMoeda(v) {
  if (v == null) return '—';
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',');
}

function formatarData(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('pt-BR');
}

function normalizarStatus(s) {
  return (s || '').toString().toLowerCase().replace(/_/g, ' ').trim();
}

function badgeStatus(status) {
  const s = normalizarStatus(status);
  const mapa = {
    'pendente':    'badge-pendente',
    'producao':    'badge-producao',
    'em producao': 'badge-producao',
    'em produção': 'badge-producao',
    'pronto':      'badge-pronto',
    'entregue':    'badge-entregue',
    'cancelado':   'badge-cancelado',
    'ativo':       'badge-ativo',
    'inativo':     'badge-inativo',
  };
  const cls = mapa[s] || 'badge-pendente';
  const labels = {
    'badge-pendente':  'Pendente',
    'badge-producao':  'Em Produção',
    'badge-pronto':    'Pronto',
    'badge-entregue':  'Entregue',
    'badge-cancelado': 'Cancelado',
    'badge-ativo':     'Ativo',
    'badge-inativo':   'Inativo',
  };
  return `<span class="badge ${cls}">${labels[cls] || s}</span>`;
}

function busca(inputId, tbodyId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', function () {
    const t = this.value.toLowerCase();
    document.querySelectorAll(`#${tbodyId} tr`).forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(t) ? '' : 'none';
    });
  });
}

function nomeDoCliente(id) {
  const c = todosClientes.find(x => x.id_cliente === id);
  return c ? c.nome : '—';
}

function ehAdmin() {
  return usuario?.perfil === 'admin';
}

// ─── TELA INICIAL ─────────────────────────────────────────────────────────────
async function carregarInicio() {
  try {
    const [resP, resC, resE] = await Promise.all([
      apiFetch(`${API}/pedidos`), apiFetch(`${API}/clientes`), apiFetch(`${API}/estoque`),
    ]);
    const pedidos = await resP.json();
    todosClientes = await resC.json();
    todosEstoque  = await resE.json();

    const pendentes = pedidos.filter(p => normalizarStatus(p.status_pedido) === 'pendente').length;
    const producao  = pedidos.filter(p => normalizarStatus(p.status_pedido) === 'em producao').length;

    document.getElementById('inicio-pedidos-pendentes').textContent = pendentes;
    document.getElementById('inicio-pedidos-producao').textContent  = producao;
    document.getElementById('inicio-total-clientes').textContent    = todosClientes.length;
    document.getElementById('inicio-total-estoque').textContent     = todosEstoque.length;

    const tbody = document.getElementById('tbody-inicio-pedidos');
    const recentes = [...pedidos].sort((a,b) => (b.id_pedido||b.id||0) - (a.id_pedido||a.id||0)).slice(0,5);
    if (!recentes.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum pedido ainda</td></tr>';
      return;
    }
    tbody.innerHTML = recentes.map(p => `
      <tr>
        <td>#${p.id_pedido || p.id}</td>
        <td>${p.cliente_nome || p.nome_cliente || nomeDoCliente(p.id_cliente)}</td>
        <td>${formatarData(p.data_entrega)}</td>
        <td>${badgeStatus(p.status_pedido)}</td>
        <td class="valor-positivo">${formatarMoeda(p.valor_total)}</td>
      </tr>
    `).join('');
  } catch {
    document.getElementById('tbody-inicio-pedidos').innerHTML =
      '<tr><td colspan="5" class="empty">Erro ao carregar dados.</td></tr>';
  }
}

// ─── CLIENTES ─────────────────────────────────────────────────────────────────
async function carregarClientes() {
  const tbody = document.getElementById('tbody-clientes');
  try {
    const res = await apiFetch(`${API}/clientes`);
    todosClientes = await res.json();
    if (tbody) renderClientes(todosClientes);
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="empty">Erro ao carregar clientes.</td></tr>';
  }
}

function renderClientes(lista) {
  const tbody = document.getElementById('tbody-clientes');
  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">Nenhum cliente cadastrado</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(c => `
    <tr>
      <td>${c.nome}</td>
      <td>${c.telefone || '—'}</td>
      <td>${c.email || '—'}</td>
      <td class="acoes">
        <button type="button" class="btn-edit"   onclick="editarCliente(${c.id_cliente})">✏️</button>
        ${ehAdmin() ? `<button type="button" class="btn-danger" onclick="deletarCliente(${c.id_cliente})">🗑</button>` : ''}
      </td>
    </tr>
  `).join('');
}

async function deletarCliente(id) {
  if (!confirm('Remover este cliente?')) return;
  try {
    await apiFetch(`${API}/clientes/${id}`, { method: 'DELETE' });
    toast('Cliente removido!');
    navegarPara(paginaAtual);
  } catch { toast('Erro ao remover cliente.', 'error'); }
}

function abrirModalCliente() {
  document.getElementById('modal-cliente-titulo').textContent = 'Novo Cliente';
  ['cliente-id','cliente-nome','cliente-cpf','cliente-telefone','cliente-email','cliente-endereco']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('modal-cliente').classList.add('open');
}

function fecharModalCliente() {
  document.getElementById('modal-cliente').classList.remove('open');
}

function editarCliente(id) {
  const c = todosClientes.find(x => x.id_cliente === id);
  if (!c) return;
  document.getElementById('modal-cliente-titulo').textContent = 'Editar Cliente';
  document.getElementById('cliente-id').value       = c.id_cliente;
  document.getElementById('cliente-nome').value     = c.nome     || '';
  document.getElementById('cliente-cpf').value      = c.cpf      || '';
  document.getElementById('cliente-telefone').value = c.telefone || '';
  document.getElementById('cliente-email').value    = c.email    || '';
  document.getElementById('cliente-endereco').value = c.endereco || '';
  document.getElementById('modal-cliente').classList.add('open');
}

async function salvarCliente() {
  const id    = document.getElementById('cliente-id').value;
  const nome  = document.getElementById('cliente-nome').value.trim();
  const cpf   = document.getElementById('cliente-cpf').value.replace(/\D/g, '');
  const tel   = document.getElementById('cliente-telefone').value.replace(/\D/g, '');
  const email = document.getElementById('cliente-email').value.trim();
  const end   = document.getElementById('cliente-endereco').value.trim();

  if (!nome || !cpf || !tel || !email || !end) { toast('Todos os campos são obrigatórios.', 'error'); return; }
  if (cpf.length !== 11)                        { toast('CPF deve ter 11 dígitos.', 'error'); return; }
  if (tel.length < 10 || tel.length > 12)       { toast('Telefone inválido.', 'error'); return; }

  const body = { nome, cpf, telefone: tel, email, endereco: end };
  try {
    const url = id ? `${API}/clientes/${id}` : `${API}/clientes`;
    await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    toast(id ? 'Cliente atualizado!' : 'Cliente cadastrado!');
    fecharModalCliente();
    navegarPara(paginaAtual);
  } catch { toast('Erro ao salvar cliente.', 'error'); }
}

busca('busca-clientes', 'tbody-clientes');

// ─── CATEGORIAS ───────────────────────────────────────────────────────────────
async function carregarCategorias() {
  const tbody = document.getElementById('tbody-categorias');
  try {
    const res = await apiFetch(`${API}/categorias`);
    todasCategorias = await res.json();
    if (tbody) renderCategorias(todasCategorias);
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="3" class="empty">Erro ao carregar categorias.</td></tr>';
  }
}

function renderCategorias(lista) {
  const tbody = document.getElementById('tbody-categorias');
  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty">Nenhuma categoria cadastrada</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(c => `
    <tr>
      <td>${c.nome || '—'}</td>
      <td>${c.descricao || '—'}</td>
      <td class="acoes">
        <button type="button" class="btn-edit"   onclick="editarCategoria(${c.id_categoria})">✏️</button>
        ${ehAdmin() ? `<button type="button" class="btn-danger" onclick="deletarCategoria(${c.id_categoria})">🗑</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function abrirModalCategoria() {
  document.getElementById('modal-categoria-titulo').textContent = 'Nova Categoria';
  document.getElementById('categoria-id').value        = '';
  document.getElementById('categoria-nome').value      = '';
  document.getElementById('categoria-descricao').value = '';
  document.getElementById('modal-categoria').classList.add('open');
}

function fecharModalCategoria() {
  document.getElementById('modal-categoria').classList.remove('open');
}

function editarCategoria(id) {
  const c = todasCategorias.find(x => x.id_categoria === id);
  if (!c) return;
  document.getElementById('modal-categoria-titulo').textContent = 'Editar Categoria';
  document.getElementById('categoria-id').value        = c.id_categoria;
  document.getElementById('categoria-nome').value      = c.nome || '';
  document.getElementById('categoria-descricao').value = c.descricao || '';
  document.getElementById('modal-categoria').classList.add('open');
}

async function deletarCategoria(id) {
  if (!confirm('Remover esta categoria?')) return;
  try {
    await apiFetch(`${API}/categorias/${id}`, { method: 'DELETE' });
    toast('Categoria removida!');
    todasCategorias = [];
    navegarPara(paginaAtual);
  } catch { toast('Erro ao remover categoria.', 'error'); }
}

async function salvarCategoria() {
  const id   = document.getElementById('categoria-id').value;
  const nome = document.getElementById('categoria-nome').value.trim();
  const desc = document.getElementById('categoria-descricao').value.trim();
  if (!nome) { toast('Nome é obrigatório.', 'error'); return; }
  const body = { nome, descricao: desc || undefined };
  try {
    const url = id ? `${API}/categorias/${id}` : `${API}/categorias`;
    await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    toast(id ? 'Categoria atualizada!' : 'Categoria cadastrada!');
    fecharModalCategoria();
    todasCategorias = [];
    navegarPara(paginaAtual);
  } catch { toast('Erro ao salvar categoria.', 'error'); }
}

// ─── PRODUTOS ─────────────────────────────────────────────────────────────────
async function carregarProdutos() {
  const tbody = document.getElementById('tbody-produtos');
  try {
    if (!todasCategorias.length) await carregarCategorias();
    const res = await apiFetch(`${API}/produtos`);
    todosProdutos = await res.json();
    if (tbody) renderProdutos(todosProdutos);
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="empty">Erro ao carregar produtos.</td></tr>';
  }
}

function nomeDaCategoria(id) {
  const cat = todasCategorias.find(c => c.id_categoria === id);
  return cat ? (cat.nome || '—') : '—';
}

function renderProdutos(lista) {
  const tbody = document.getElementById('tbody-produtos');
  if (!lista.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum produto cadastrado</td></tr>';
    return;
  }
  tbody.innerHTML = lista.map(p => `
    <tr>
      <td>${p.nome_produto || p.nome || '—'}</td>
      <td>${nomeDaCategoria(p.id_categoria)}</td>
      <td class="valor-positivo">${formatarMoeda(p.preco_base)}</td>
      <td>${badgeStatus(p.ativo === 0 ? 'inativo' : 'ativo')}</td>
      <td class="acoes">
        <button type="button" class="btn-edit" onclick="editarProduto(${p.id_produto})">✏️</button>
        ${ehAdmin() ? `<button type="button" class="btn-danger" onclick="inativarProduto(${p.id_produto}, ${p.ativo})">🗑</button>` : ''}
      </td>
    </tr>
  `).join('');
}

async function inativarProduto(id, ativoAtual) {
  const novoAtivo = ativoAtual === 0 ? 1 : 0;
  if (!confirm(`${novoAtivo === 0 ? 'Inativar' : 'Reativar'} este produto?`)) return;
  try {
    await apiFetch(`${API}/produtos/${id}`, { method: 'PUT', body: JSON.stringify({ ativo: novoAtivo }) });
    toast(`Produto ${novoAtivo === 0 ? 'inativado' : 'reativado'}!`);
    navegarPara(paginaAtual);
  } catch { toast('Erro ao atualizar produto.', 'error'); }
}

async function popularSelectCategorias() {
  if (!todasCategorias.length) await carregarCategorias();
  const sel = document.getElementById('produto-id-categoria');
  const v = sel.value;
  sel.innerHTML = '<option value="">Selecione...</option>';
  todasCategorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id_categoria;
    opt.textContent = cat.nome;
    sel.appendChild(opt);
  });
  if (v) sel.value = v;
}

async function abrirModalProduto() {
  await popularSelectCategorias();
  document.getElementById('modal-produto-titulo').textContent = 'Novo Produto';
  ['produto-id','produto-nome','produto-preco','produto-preco-kg','produto-descricao']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('produto-id-categoria').value = '';
  document.getElementById('modal-produto').classList.add('open');
}

function fecharModalProduto() {
  document.getElementById('modal-produto').classList.remove('open');
}

async function editarProduto(id) {
  const p = todosProdutos.find(x => x.id_produto === id);
  if (!p) return;
  await popularSelectCategorias();
  document.getElementById('modal-produto-titulo').textContent = 'Editar Produto';
  document.getElementById('produto-id').value           = p.id_produto;
  document.getElementById('produto-nome').value         = p.nome_produto || p.nome || '';
  document.getElementById('produto-id-categoria').value = p.id_categoria || '';
  document.getElementById('produto-preco').value        = p.preco_base   || '';
  document.getElementById('produto-preco-kg').value     = p.preco_kg     || '';
  document.getElementById('produto-descricao').value    = p.descricao    || '';
  document.getElementById('modal-produto').classList.add('open');
}

async function salvarProduto() {
  const id      = document.getElementById('produto-id').value;
  const nome    = document.getElementById('produto-nome').value.trim();
  const idCat   = document.getElementById('produto-id-categoria').value;
  const preco   = document.getElementById('produto-preco').value;
  const precoKg = document.getElementById('produto-preco-kg').value;
  const desc    = document.getElementById('produto-descricao').value.trim();

  if (!nome || !idCat || !preco) { toast('Nome, categoria e preço são obrigatórios.', 'error'); return; }

  const body = { nome_produto: nome, id_categoria: Number(idCat), preco_base: Number(preco), descricao: desc || undefined, preco_kg: precoKg ? Number(precoKg) : undefined };
  try {
    const url = id ? `${API}/produtos/${id}` : `${API}/produtos`;
    await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    toast(id ? 'Produto atualizado!' : 'Produto cadastrado!');
    fecharModalProduto();
    navegarPara(paginaAtual);
  } catch { toast('Erro ao salvar produto.', 'error'); }
}

busca('busca-produtos', 'tbody-produtos');

// ─── ESTOQUE ──────────────────────────────────────────────────────────────────
async function carregarEstoque() {
  const tbody = document.getElementById('tbody-estoque');
  try {
    const res = await apiFetch(`${API}/estoque`);
    todosEstoque = await res.json();
    if (!tbody) return;
    if (!todosEstoque.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">Nenhum lote cadastrado</td></tr>';
      return;
    }
    tbody.innerHTML = todosEstoque.map(l => `
      <tr>
        <td>${l.nome_produto || '—'}</td>
        <td>${l.lote || '—'}</td>
        <td>${l.quantidade_disponivel ?? '—'}</td>
        <td>${formatarData(l.data_producao)}</td>
        <td>${formatarData(l.data_validade)}</td>
        <td class="acoes">
          <button type="button" class="btn-edit"   onclick="editarLote(${l.id_estoque})">✏️</button>
          ${ehAdmin() ? `<button type="button" class="btn-danger" onclick="deletarLote(${l.id_estoque})">🗑</button>` : ''}
        </td>
      </tr>
    `).join('');
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="empty">Erro ao carregar estoque.</td></tr>';
  }
}

async function popularSelectProdutos() {
  if (!todosProdutos.length) await carregarProdutos();
  const sel = document.getElementById('lote-produto');
  sel.innerHTML = '<option value="">Selecione...</option>';
  todosProdutos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id_produto;
    opt.textContent = p.nome_produto || p.nome;
    sel.appendChild(opt);
  });
}

async function abrirModalLote() {
  await popularSelectProdutos();
  document.getElementById('modal-lote-titulo').textContent = 'Adicionar Lote';
  ['lote-id','lote-numero','lote-quantidade','lote-producao','lote-validade']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('lote-produto').value = '';
  document.getElementById('modal-lote').classList.add('open');
}

function fecharModalLote() {
  document.getElementById('modal-lote').classList.remove('open');
}

async function editarLote(id) {
  const l = todosEstoque.find(x => x.id_estoque === id);
  if (!l) return;
  await popularSelectProdutos();
  document.getElementById('modal-lote-titulo').textContent = 'Editar Lote';
  document.getElementById('lote-id').value         = l.id_estoque;
  document.getElementById('lote-produto').value    = l.id_produto || '';
  document.getElementById('lote-numero').value     = l.lote || '';
  document.getElementById('lote-quantidade').value = l.quantidade_disponivel ?? '';
  document.getElementById('lote-producao').value   = (l.data_producao || '').split('T')[0];
  document.getElementById('lote-validade').value   = (l.data_validade || '').split('T')[0];
  document.getElementById('modal-lote').classList.add('open');
}

async function deletarLote(id) {
  if (!confirm('Remover este lote?')) return;
  try {
    await apiFetch(`${API}/estoque/${id}`, { method: 'DELETE' });
    toast('Lote removido!');
    navegarPara(paginaAtual);
  } catch { toast('Erro ao remover lote.', 'error'); }
}

async function salvarLote() {
  const id        = document.getElementById('lote-id').value;
  const idProduto = document.getElementById('lote-produto').value;
  const lote      = document.getElementById('lote-numero').value.trim();
  const qtd       = document.getElementById('lote-quantidade').value;
  const producao  = document.getElementById('lote-producao').value;
  const validade  = document.getElementById('lote-validade').value;

  if (!idProduto || !lote || !qtd || !producao || !validade) {
    toast('Todos os campos são obrigatórios.', 'error'); return;
  }

  const body = { id_produto: Number(idProduto), lote, quantidade_disponivel: Number(qtd), data_producao: producao, data_validade: validade };
  try {
    const url = id ? `${API}/estoque/${id}` : `${API}/estoque`;
    await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    toast(id ? 'Lote atualizado!' : 'Lote adicionado!');
    fecharModalLote();
    navegarPara(paginaAtual);
  } catch { toast('Erro ao salvar lote.', 'error'); }
}

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────
async function carregarPedidos() {
  const tbody = document.getElementById('tbody-pedidos');
  try {
    if (!todosClientes.length) await carregarClientes();
    const res = await apiFetch(`${API}/pedidos`);
    todosPedidos = await res.json();
    if (!tbody) return;
    if (!todosPedidos.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">Nenhum pedido encontrado</td></tr>';
      return;
    }
    tbody.innerHTML = todosPedidos.map(p => `
      <tr>
        <td>#${p.id_pedido || p.id}</td>
        <td>${p.cliente_nome || p.nome_cliente || nomeDoCliente(p.id_cliente)}</td>
        <td>${formatarData(p.data_entrega)}</td>
        <td>${badgeStatus(p.status_pedido)}</td>
        <td class="valor-positivo">${formatarMoeda(p.valor_total)}</td>
        <td class="acoes">
          <button type="button" class="btn-edit" onclick="abrirEditarPedido(${p.id_pedido || p.id})">✏️</button>
        </td>
      </tr>
    `).join('');
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="empty">Erro ao carregar pedidos.</td></tr>';
  }
}

busca('busca-pedidos', 'tbody-pedidos');

async function abrirModalPedido() {
  if (!todosClientes.length) await carregarClientes();
  const selCliente = document.getElementById('pedido-cliente');
  selCliente.innerHTML = '<option value="">Selecione...</option>';
  todosClientes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id_cliente;
    opt.textContent = c.nome;
    selCliente.appendChild(opt);
  });

  try {
    const res = await apiFetch(`${API}/funcionarios`);
    todosFuncionarios = await res.json();
  } catch { todosFuncionarios = []; }
  const selFunc = document.getElementById('pedido-funcionario');
  selFunc.innerHTML = '<option value="">Selecione...</option>';
  todosFuncionarios.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id_funcionario;
    opt.textContent = `${f.nome} (${f.cargo || 'Funcionário'})`;
    selFunc.appendChild(opt);
  });

  if (!todosEstoque.length) await carregarEstoque();

  itensPedido = [];
  itemIdx = 0;
  document.getElementById('pedido-data-entrega').value = '';
  document.getElementById('pedido-observacoes').value  = '';
  document.getElementById('pedido-tem-entrega').checked = false;
  document.getElementById('pedido-entrega-fields').style.display = 'none';
  renderItensPedido();
  document.getElementById('modal-pedido').classList.add('open');
}

function fecharModalPedido() {
  document.getElementById('modal-pedido').classList.remove('open');
}

function toggleEntrega() {
  document.getElementById('pedido-entrega-fields').style.display =
    document.getElementById('pedido-tem-entrega').checked ? 'block' : 'none';
}

function adicionarItemPedido() {
  itensPedido.push({ idx: itemIdx++ });
  renderItensPedido();
}

function removerItemPedido(idx) {
  itensPedido = itensPedido.filter(i => i.idx !== idx);
  renderItensPedido();
}

function renderItensPedido() {
  const container = document.getElementById('pedido-itens-lista');
  if (!itensPedido.length) {
    container.innerHTML = '<p class="empty-inline">Clique em "+ Item" para adicionar</p>';
    return;
  }
  container.innerHTML = itensPedido.map(item => `
    <div class="item-pedido">
      <div class="form-row" style="align-items:flex-end">
        <div class="form-group" style="flex:2">
          <label>Item do estoque *</label>
          <select id="item-estoque-${item.idx}">
            <option value="">Selecione...</option>
            ${todosEstoque.map(e => `<option value="${e.id_estoque}">${e.nome_produto || '—'} — Lote: ${e.lote || '—'} (${e.quantidade_disponivel ?? 0} disp.)</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Qtd *</label><input type="number" id="item-qtd-${item.idx}" min="1" placeholder="1"></div>
        <div class="form-group"><label>Valor unit. *</label><input type="number" id="item-valor-${item.idx}" step="0.01" min="0" placeholder="0.00"></div>
        <div style="padding-bottom:0.75rem">
          <button type="button" class="btn-danger" onclick="removerItemPedido(${item.idx})">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function salvarPedido() {
  const idCliente   = document.getElementById('pedido-cliente').value;
  const idFunc      = document.getElementById('pedido-funcionario').value;
  const dataEntrega = document.getElementById('pedido-data-entrega').value;
  const obs         = document.getElementById('pedido-observacoes').value.trim();

  if (!idCliente || !idFunc || !dataEntrega) { toast('Cliente, funcionário e data são obrigatórios.', 'error'); return; }
  if (!itensPedido.length) { toast('Adicione pelo menos um item ao pedido.', 'error'); return; }

  const itens = [];
  for (const item of itensPedido) {
    const idEstoque = document.getElementById(`item-estoque-${item.idx}`).value;
    const qtd       = document.getElementById(`item-qtd-${item.idx}`).value;
    const valor     = document.getElementById(`item-valor-${item.idx}`).value;
    if (!idEstoque || !qtd || !valor) { toast('Preencha todos os campos dos itens.', 'error'); return; }
    itens.push({ id_estoque: Number(idEstoque), quantidade: Number(qtd), valor_unitario: Number(valor) });
  }

  const body = { id_cliente: Number(idCliente), id_funcionario: Number(idFunc), data_entrega: dataEntrega, observacoes: obs || undefined, itens };

  if (document.getElementById('pedido-tem-entrega').checked) {
    const recebedor  = document.getElementById('pedido-recebedor').value.trim();
    const endEntrega = document.getElementById('pedido-endereco-entrega').value.trim();
    const valEnt     = document.getElementById('pedido-valor-entrega').value;
    if (recebedor.length < 10 || endEntrega.length < 10) { toast('Nome do recebedor e endereço precisam ter ao menos 10 caracteres.', 'error'); return; }
    body.entrega = { nome_recebedor: recebedor, endereco_entrega: endEntrega, valor_entrega: Number(valEnt) || 0 };
  }

  try {
    await apiFetch(`${API}/pedidos`, { method: 'POST', body: JSON.stringify(body) });
    toast('Pedido cadastrado!');
    fecharModalPedido();
    navegarPara(paginaAtual);
  } catch { toast('Erro ao salvar pedido.', 'error'); }
}

function abrirEditarPedido(id) {
  const p = todosPedidos.find(x => (x.id_pedido || x.id) === id);
  if (!p) return;
  const statusUpper = (p.status_pedido || 'PENDENTE').toUpperCase().replace(/\s+/g, '_');
  document.getElementById('pedido-edit-id').value     = id;
  document.getElementById('pedido-edit-status').value = statusUpper;
  document.getElementById('modal-pedido-editar').classList.add('open');
}

function fecharModalPedidoEditar() {
  document.getElementById('modal-pedido-editar').classList.remove('open');
}

async function salvarPedidoEditado() {
  const id     = document.getElementById('pedido-edit-id').value;
  const status = document.getElementById('pedido-edit-status').value;
  try {
    const res = await apiFetch(`${API}/pedidos/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    if (!res || !res.ok) { toast('Erro ao atualizar status.', 'error'); return; }
    toast('Status atualizado!');
    fecharModalPedidoEditar();
    navegarPara(paginaAtual);
  } catch { toast('Erro ao atualizar pedido.', 'error'); }
}

// ─── FUNCIONÁRIOS (só admin) ──────────────────────────────────────────────────
async function carregarFuncionarios() {
  if (!ehAdmin()) { navegarPara('inicio'); return; }
  const tbody = document.getElementById('tbody-funcionarios');
  try {
    const res = await apiFetch(`${API}/funcionarios`);
    todosFuncionarios = await res.json();
    if (!tbody) return;
    if (!todosFuncionarios.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum funcionário cadastrado</td></tr>';
      return;
    }
    tbody.innerHTML = todosFuncionarios.map(f => `
      <tr>
        <td>${f.nome}</td>
        <td>${f.email}</td>
        <td>${f.cargo || '—'}</td>
        <td><span class="badge ${f.perfil === 'admin' ? 'badge-producao' : 'badge-entregue'}">${f.perfil === 'admin' ? '👑 Admin' : '👤 Funcionário'}</span></td>
        <td class="acoes">
          <button type="button" class="btn-edit"   onclick="editarFuncionario(${f.id_funcionario})">✏️</button>
          <button type="button" class="btn-danger" onclick="inativarFuncionario(${f.id_funcionario})">🗑</button>
        </td>
      </tr>
    `).join('');
  } catch {
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="empty">Erro ao carregar funcionários.</td></tr>';
  }
}

function abrirModalFuncionario() {
  document.getElementById('modal-funcionario-titulo').textContent = 'Novo Funcionário';
  ['func-id','func-nome','func-email','func-senha','func-telefone','func-cargo','func-admissao']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('func-perfil').value = 'funcionario';
  document.getElementById('modal-funcionario').classList.add('open');
}

function fecharModalFuncionario() {
  document.getElementById('modal-funcionario').classList.remove('open');
}

function editarFuncionario(id) {
  const f = todosFuncionarios.find(x => x.id_funcionario === id);
  if (!f) return;
  document.getElementById('modal-funcionario-titulo').textContent = 'Editar Funcionário';
  document.getElementById('func-id').value        = f.id_funcionario;
  document.getElementById('func-nome').value      = f.nome || '';
  document.getElementById('func-email').value     = f.email || '';
  document.getElementById('func-senha').value     = '';
  document.getElementById('func-telefone').value  = f.telefone || '';
  document.getElementById('func-cargo').value     = f.cargo || '';
  document.getElementById('func-perfil').value    = f.perfil || 'funcionario';
  document.getElementById('func-admissao').value  = (f.data_admissao || '').split('T')[0];
  document.getElementById('modal-funcionario').classList.add('open');
}

async function inativarFuncionario(id) {
  if (!confirm('Inativar este funcionário?')) return;
  try {
    await apiFetch(`${API}/funcionarios/${id}`, { method: 'DELETE' });
    toast('Funcionário inativado!');
    navegarPara(paginaAtual);
  } catch { toast('Erro ao inativar funcionário.', 'error'); }
}

async function salvarFuncionario() {
  const id       = document.getElementById('func-id').value;
  const nome     = document.getElementById('func-nome').value.trim();
  const email    = document.getElementById('func-email').value.trim();
  const senha    = document.getElementById('func-senha').value;
  const telefone = document.getElementById('func-telefone').value.trim();
  const cargo    = document.getElementById('func-cargo').value.trim();
  const perfil   = document.getElementById('func-perfil').value;
  const admissao = document.getElementById('func-admissao').value;

  if (!nome || !email || !telefone || !cargo || !admissao) { toast('Preencha todos os campos obrigatórios.', 'error'); return; }
  if (!id && !senha) { toast('Senha é obrigatória para novos funcionários.', 'error'); return; }

  const body = { nome, email, telefone, cargo, perfil, data_admissao: admissao, ativo: 1 };
  if (senha) body.senha = senha;

  try {
    const url = id ? `${API}/funcionarios/${id}` : `${API}/funcionarios`;
    await apiFetch(url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    toast(id ? 'Funcionário atualizado!' : 'Funcionário cadastrado!');
    fecharModalFuncionario();
    navegarPara(paginaAtual);
  } catch { toast('Erro ao salvar funcionário.', 'error'); }
}

// ─── RELATÓRIOS ───────────────────────────────────────────────────────────────
async function carregarRelatorios() {
  try {
    const [resP, resC, resPr, resE] = await Promise.all([
      apiFetch(`${API}/pedidos`), apiFetch(`${API}/clientes`), apiFetch(`${API}/produtos`), apiFetch(`${API}/estoque`),
    ]);
    const pedidos  = await resP.json();
    const clientes = await resC.json();
    const produtos = await resPr.json();
    const estoque  = await resE.json();
    todosClientes  = clientes;

    const fat = pedidos.reduce((acc, p) => acc + Number(p.valor_total || 0), 0);
    const ticketMedio = pedidos.length ? fat / pedidos.length : 0;
    const hoje = new Date();
    const fatMes = pedidos
      .filter(p => { if (!p.data_entrega) return false; const d = new Date(p.data_entrega); return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear(); })
      .reduce((acc, p) => acc + Number(p.valor_total || 0), 0);
    const pendentes  = pedidos.filter(p => normalizarStatus(p.status_pedido) === 'pendente').length;
    const cancelados = pedidos.filter(p => normalizarStatus(p.status_pedido) === 'cancelado').length;
    const taxaCancel = pedidos.length ? (cancelados / pedidos.length) * 100 : 0;

    document.getElementById('rel-total-pedidos').textContent  = pedidos.length;
    document.getElementById('rel-faturamento').textContent    = formatarMoeda(fat);
    document.getElementById('rel-ticket-medio').textContent   = formatarMoeda(ticketMedio);
    document.getElementById('rel-fat-mes').textContent        = formatarMoeda(fatMes);
    document.getElementById('rel-total-clientes').textContent = clientes.length;
    document.getElementById('rel-total-produtos').textContent = produtos.filter(p => p.ativo !== 0).length;
    document.getElementById('rel-pendentes').textContent      = pendentes;
    document.getElementById('rel-taxa-cancel').textContent    = taxaCancel.toFixed(1) + '%';

    // Alerta validade
    const seteDiasMs = 7 * 24 * 60 * 60 * 1000;
    const vencendo = estoque.filter(l => { if (!l.data_validade) return false; const dv = new Date(l.data_validade).getTime(); return dv >= hoje.getTime() && dv <= hoje.getTime() + seteDiasMs; });
    const alertaBox = document.getElementById('alerta-validade');
    if (vencendo.length) {
      alertaBox.style.display = 'block';
      document.getElementById('alerta-validade-lista').innerHTML = vencendo.map(l => `
        <div class="alerta-item"><strong>${l.nome_produto || 'Produto'}</strong> — Lote ${l.lote || '—'}<span class="alerta-data">vence em ${formatarData(l.data_validade)}</span></div>
      `).join('');
    } else { alertaBox.style.display = 'none'; }

    // Gráfico
    const dias = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0); dias.push({ data: d, total: 0, label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '') }); }
    pedidos.forEach(p => { if (!p.data_entrega) return; const dp = new Date(p.data_entrega); dp.setHours(0,0,0,0); const dia = dias.find(d => d.data.getTime() === dp.getTime()); if (dia) dia.total += Number(p.valor_total || 0); });
    const maxVal = Math.max(...dias.map(d => d.total), 1);
    document.getElementById('bar-chart-7dias').innerHTML = dias.map(d => `
      <div class="bar-column"><div class="bar-wrap"><div class="bar-value">${d.total > 0 ? formatarMoeda(d.total) : ''}</div><div class="bar-fill" style="height:${Math.max((d.total/maxVal)*100, 2)}%"></div></div><div class="bar-label">${d.label}</div></div>
    `).join('');

    // Top clientes
    const porCliente = {};
    pedidos.forEach(p => { const id = p.id_cliente; if (!id) return; if (!porCliente[id]) porCliente[id] = { count: 0, total: 0 }; porCliente[id].count++; porCliente[id].total += Number(p.valor_total || 0); });
    const top5 = Object.entries(porCliente).sort((a,b) => b[1].count - a[1].count).slice(0,5);
    document.getElementById('tbody-top-clientes').innerHTML = top5.length
      ? top5.map(([id, d]) => `<tr><td>${nomeDoCliente(Number(id))}</td><td>${d.count}</td><td class="valor-positivo">${formatarMoeda(d.total)}</td></tr>`).join('')
      : '<tr><td colspan="3" class="empty">Sem dados ainda</td></tr>';

    // Status
    const contagem = {};
    pedidos.forEach(p => { const s = normalizarStatus(p.status_pedido) || 'pendente'; contagem[s] = (contagem[s] || 0) + 1; });
    document.getElementById('tbody-relatorio-status').innerHTML = pedidos.length
      ? Object.entries(contagem).sort((a,b) => b[1]-a[1]).map(([s,q]) => `<tr><td>${badgeStatus(s)}</td><td>${q}</td><td>${Math.round((q/pedidos.length)*100)}%</td></tr>`).join('')
      : '<tr><td colspan="3" class="empty">Nenhum pedido</td></tr>';

  } catch {
    const el = document.getElementById('tbody-relatorio-status');
    if (el) el.innerHTML = '<tr><td colspan="3" class="empty">Erro ao carregar dados.</td></tr>';
  }
}

// ─── FECHAR MODAL CLICANDO FORA ───────────────────────────────────────────────
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────
inicializarUI();
navegarPara(paginaAtual);