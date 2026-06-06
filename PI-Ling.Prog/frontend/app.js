const API = 'http://localhost:3000/api';

// NAVEGAÇÃO
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    item.classList.add('active');
    document.getElementById('page-' + page).classList.add('active');
  });
});

function navegarPara(page) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('page-' + page).classList.add('active');
}

// CARREGAR CLIENTES
async function carregarClientes() {
  try {
    const res = await fetch(`${API}/clientes`);
    const clientes = await res.json();
    const tbody = document.getElementById('tbody-clientes');

    if (clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">Nenhum cliente cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = clientes.map(c => `
      <tr>
        <td>${c.nome}</td>
        <td>${c.telefone}</td>
        <td>${c.email || '—'}</td>
        <td class="acoes">
          <button class="btn-danger" onclick="deletarCliente(${c.id_cliente})">🗑</button>
        </td>
      </tr>
    `).join('');

  } catch (e) {
    document.getElementById('tbody-clientes').innerHTML =
      '<tr><td colspan="4" class="empty">Erro ao carregar clientes. Servidor ligado?</td></tr>';
  }
}

async function deletarCliente(id) {
  if (!confirm('Remover este cliente?')) return;
  await fetch(`${API}/clientes/${id}`, { method: 'DELETE' });
  carregarClientes();
}

// Busca
document.getElementById('busca-clientes').addEventListener('input', function() {
  const termo = this.value.toLowerCase();
  document.querySelectorAll('#tbody-clientes tr').forEach(linha => {
    linha.style.display = linha.textContent.toLowerCase().includes(termo) ? '' : 'none';
  });
});

// Carrega ao iniciar
carregarClientes();