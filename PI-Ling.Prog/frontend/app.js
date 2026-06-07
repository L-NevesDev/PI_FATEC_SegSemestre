const API = 'http://localhost:3000/api';

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
    navegarPara(item.dataset.page);
  });
});

function navegarPara(page) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('page-' + page).classList.add('active');

  if (page === 'clientes') carregarClientes();
  if (page === 'produtos')  carregarProdutos();
  if (page === 'estoque')   carregarEstoque();
  if (page === 'pedidos')   carregarPedidos();
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

function badgeStatus(status) {
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
  const cls = mapa[(status || '').toLowerCase()] || 'badge-pendente';
  const labels = {
    'badge-pendente':  'Pendente',
    'badge-producao':  'Em Produção',
    'badge-pronto':    'Pronto',
    'badge-entregue':  'Entregue',
    'badge-cancelado': 'Cancelado',
    'badge-ativo':     'Ativo',
    'badge-inativo':   'Inativo',
  };
  return `<span class="badge ${cls}">${labels[cls] || status}</span>`;
}

function busca(inputId, tbodyId) {
  document.getElementById(inputId).addEventListener('input', function () {
    const t = this.value.toLowerCase();
    document.querySelectorAll(`#${tbodyId} tr`).forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(t) ? '' : 'none';
    });
  });
}

// ─── CLIENTES ─────────────────────────────────────────────────────────────────
let todosClientes = [];

async function carregarClientes() {
  const tbody = document.getElementById('tbody-clientes');
  try {
    const res = await fetch(`${API}/clientes`);
    todosClientes = await res.json();
    renderClientes(todosClientes);
  } catch {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">Erro ao carregar clientes. Servidor ligado?</td></tr>';
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
        <button type="button" class="btn-danger" onclick="deletarCliente(${c.id_cliente})">🗑</button>
      </td>
    </tr>
  `).join('');
}

async function deletarCliente(id) {
  if (!confirm('Remover este cliente?')) return;
  try {
    await fetch(`${API}/clientes/${id}`, { method: 'DELETE' });
    toast('Cliente removido!');
    carregarClientes();
  } catch { toast('Erro ao remover cliente.', 'error'); }
}

function abrirModalCliente() {
  document.getElementById('modal-cliente-titulo').textContent = 'Novo Cliente';
  document.getElementById('cliente-id').value       = '';
  document.getElementById('cliente-nome').value     = '';
  document.getElementById('cliente-cpf').value      = '';
  document.getElementById('cliente-telefone').value = '';
  document.getElementById('cliente-email').value    = '';
  document.getElementById('cliente-endereco').value = '';
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

  if (!nome || !cpf || !tel || !email || !end) {
    toast('Todos os campos são obrigatórios.', 'error'); return;
  }
  if (cpf.length !== 11)                        { toast('CPF deve ter 11 dígitos.', 'error'); return; }
  if (tel.length < 10 || tel.length > 12)       { toast('Telefone inválido (10 a 12 dígitos).', 'error'); return; }

  const body = { nome, cpf, telefone: tel, email, endereco: end };

  try {
    if (id) {
      await fetch(`${API}/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      toast('Cliente atualizado!');
    } else {
      await fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      toast('Cliente cadastrado!');
    }
    fecharModalCliente();
    carregarClientes();
  } catch { toast('Erro ao salvar cliente.', 'error'); }
}

busca('busca-clientes', 'tbody-clientes');

// ─── PRODUTOS ─────────────────────────────────────────────────────────────────
let todosProdutos  = [];
let todasCategorias = [];

async function carregarCategorias() {
  if (todasCategorias.length) return; // já carregou
  try {
    const res = await fetch(`${API}/categorias`);
    todasCategorias = await res.json();
  } catch { todasCategorias = []; }
}

async function carregarProdutos() {
  const tbody = document.getElementById('tbody-produtos');
  try {
    await carregarCategorias();
    const res = await fetch(`${API}/produtos`);
    todosProdutos = await res.json();
    renderProdutos(todosProdutos);
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Erro ao carregar produtos. Servidor ligado?</td></tr>';
  }
}

function nomeDaCategoria(id) {
  const cat = todasCategorias.find(c => c.id_categoria === id);
  return cat ? (cat.nome_categoria || cat.nome || '—') : '—';
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
        <button type="button" class="btn-edit"   onclick="editarProduto(${p.id_produto})">✏️</button>
        <button type="button" class="btn-danger" onclick="inativarProduto(${p.id_produto}, ${p.ativo})">🗑</button>
      </td>
    </tr>
  `).join('');
}

async function inativarProduto(id, ativoAtual) {
  const novoAtivo = ativoAtual === 0 ? 1 : 0;
  const acao = novoAtivo === 0 ? 'Inativar' : 'Reativar';
  if (!confirm(`${acao} este produto?`)) return;
  try {
    await fetch(`${API}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: novoAtivo })
    });
    toast(`Produto ${novoAtivo === 0 ? 'inativado' : 'reativado'}!`);
    carregarProdutos();
  } catch { toast('Erro ao atualizar produto.', 'error'); }
}

async function abrirModalProduto() {
  await carregarCategorias();

  // Popula select de categorias
  const sel = document.getElementById('produto-id-categoria');
  sel.innerHTML = '<option value="">Selecione...</option>';
  todasCategorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id_categoria;
    opt.textContent = cat.nome_categoria || cat.nome;
    sel.appendChild(opt);
  });

  document.getElementById('modal-produto-titulo').textContent = 'Novo Produto';
  document.getElementById('produto-id').value           = '';
  document.getElementById('produto-nome').value         = '';
  document.getElementById('produto-preco').value        = '';
  document.getElementById('produto-preco-kg').value     = '';
  document.getElementById('produto-descricao').value    = '';
  document.getElementById('modal-produto').classList.add('open');
}

function fecharModalProduto() {
  document.getElementById('modal-produto').classList.remove('open');
}

async function editarProduto(id) {
  const p = todosProdutos.find(x => x.id_produto === id);
  if (!p) return;
  await abrirModalProduto(); // popula categorias primeiro

  document.getElementById('modal-produto-titulo').textContent = 'Editar Produto';
  document.getElementById('produto-id').value           = p.id_produto;
  document.getElementById('produto-nome').value         = p.nome_produto  || p.nome || '';
  document.getElementById('produto-id-categoria').value = p.id_categoria  || '';
  document.getElementById('produto-preco').value        = p.preco_base    || '';
  document.getElementById('produto-preco-kg').value     = p.preco_kg      || '';
  document.getElementById('produto-descricao').value    = p.descricao     || '';
}

async function salvarProduto() {
  const id       = document.getElementById('produto-id').value;
  const nome     = document.getElementById('produto-nome').value.trim();
  const idCat    = document.getElementById('produto-id-categoria').value;
  const preco    = document.getElementById('produto-preco').value;
  const precoKg  = document.getElementById('produto-preco-kg').value;
  const desc     = document.getElementById('produto-descricao').value.trim();

  if (!nome || !idCat || !preco) {
    toast('Nome, categoria e preço são obrigatórios.', 'error'); return;
  }

  const body = {
    nome_produto:  nome,
    id_categoria:  Number(idCat),
    preco_base:    Number(preco),
    descricao:     desc || undefined,
    preco_kg:      precoKg ? Number(precoKg) : undefined,
  };

  try {
    if (id) {
      await fetch(`${API}/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      toast('Produto atualizado!');
    } else {
      await fetch(`${API}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      toast('Produto cadastrado!');
    }
    fecharModalProduto();
    carregarProdutos();
  } catch { toast('Erro ao salvar produto.', 'error'); }
}

busca('busca-produtos', 'tbody-produtos');

// ─── ESTOQUE ──────────────────────────────────────────────────────────────────
async function carregarEstoque() {
  const tbody = document.getElementById('tbody-estoque');
  try {
    const res = await fetch(`${API}/estoque`);
    const lotes = await res.json();
    if (!lotes.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">Nenhum lote cadastrado</td></tr>';
      return;
    }
    tbody.innerHTML = lotes.map(l => `
      <tr>
        <td>${l.nome_produto || l.produto || '—'}</td>
        <td>${l.num_lote || l.lote || '—'}</td>
        <td>${l.quantidade ?? '—'}</td>
        <td>${formatarData(l.data_validade || l.validade)}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">Erro ao carregar estoque. Servidor ligado?</td></tr>';
  }
}

async function abrirModalLote() {
  const sel = document.getElementById('lote-produto');
  sel.innerHTML = '<option value="">Selecione...</option>';
  try {
    if (!todosProdutos.length) await carregarProdutos();
    todosProdutos.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id_produto;
      opt.textContent = p.nome_produto || p.nome;
      sel.appendChild(opt);
    });
  } catch {}
  document.getElementById('lote-numero').value     = '';
  document.getElementById('lote-quantidade').value = '';
  document.getElementById('lote-validade').value   = '';
  document.getElementById('modal-lote').classList.add('open');
}

function fecharModalLote() {
  document.getElementById('modal-lote').classList.remove('open');
}

async function salvarLote() {
  const idProduto = document.getElementById('lote-produto').value;
  const numero    = document.getElementById('lote-numero').value.trim();
  const qtd       = document.getElementById('lote-quantidade').value;
  const validade  = document.getElementById('lote-validade').value;

  if (!idProduto || !qtd) { toast('Produto e quantidade são obrigatórios.', 'error'); return; }

  const body = {
    id_produto:    Number(idProduto),
    num_lote:      numero || null,
    quantidade:    Number(qtd),
    data_validade: validade || null
  };

  try {
    await fetch(`${API}/estoque`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    toast('Lote adicionado!');
    fecharModalLote();
    carregarEstoque();
  } catch { toast('Erro ao salvar lote.', 'error'); }
}

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────
async function carregarPedidos() {
  const tbody = document.getElementById('tbody-pedidos');
  try {
    const res = await fetch(`${API}/pedidos`);
    const pedidos = await res.json();
    if (!pedidos.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum pedido encontrado</td></tr>';
      return;
    }
    tbody.innerHTML = pedidos.map(p => `
      <tr>
        <td>#${p.id_pedido || p.id}</td>
        <td>${p.nome_cliente || p.cliente || '—'}</td>
        <td>${formatarData(p.data_entrega)}</td>
        <td>${badgeStatus(p.status || 'pendente')}</td>
        <td class="valor-positivo">${formatarMoeda(p.valor_total || p.total)}</td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Erro ao carregar pedidos. Servidor ligado?</td></tr>';
  }
}

busca('busca-pedidos', 'tbody-pedidos');

// ─── FECHAR MODAL CLICANDO FORA ───────────────────────────────────────────────
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────
carregarClientes();
