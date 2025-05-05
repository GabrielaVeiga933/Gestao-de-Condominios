const form = document.getElementById('form-bloco');
const tabela = document.getElementById('tabela-blocos');

function carregarBlocos() {
  fetch('/api/blocos')
    .then(res => res.json())
    .then(dados => {
      tabela.innerHTML = '';
      dados.forEach(bloco => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${bloco.id}</td>
          <td>${bloco.descricao}</td>
          <td>${bloco.quantidade_apartamentos}</td>
          <td>
            <button onclick="editar(${bloco.id}, '${bloco.descricao}', ${bloco.quantidade_apartamentos})">Editar</button>
            <button onclick="excluir(${bloco.id})">Excluir</button>
          </td>
        `;
        tabela.appendChild(linha);
      });
    });
}

function editar(id, descricao, quantidade) {
  document.getElementById('id').value = id;
  document.getElementById('descricao').value = descricao;
  document.getElementById('quantidade').value = quantidade;
}

function excluir(id) {
  if (confirm('Deseja realmente excluir?')) {
    fetch(`/api/blocos/${id}`, {
      method: 'DELETE'
    })
    .then(() => carregarBlocos());
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const descricao = document.getElementById('descricao').value;
  const quantidade = document.getElementById('quantidade').value;
  const dados = {
    descricao,
    quantidade_apartamentos: quantidade
  };

  if (id) {
    fetch(`/api/blocos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(() => {
      form.reset();
      carregarBlocos();
    });
  } else {
    fetch('/api/blocos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(() => {
      form.reset();
      carregarBlocos();
    });
  }
});

carregarBlocos();
