
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'condominio',
    port:3306
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/inicio.html');
});

app.get('/cadastrar', (req, res) => {
    res.sendFile(__dirname + '/cadastrarb.html');
});

app.get('/cadastrarApartamento', (req, res) => {
    res.sendFile(__dirname + '/cadastrarap.html');
});

app.get('/cadastrarMorador', (req, res) => {
    res.sendFile(__dirname + '/cadastrarm.html');
});


app.get('/', (req, res) => {
    res.redirect('/tipoManutencao/cadastrar');
});

app.get('/registrarManutencao', (req, res) => {
    res.sendFile(__dirname + '/registrarManutencao.html');
});




        app.get('/blocos', (req, res) => {
        const blocos = 'SELECT * FROM blocos';
        connection.query(blocos, function(err, rows){
        if (!err) {
        res.send(`

        <html>
        <head>
        <title>Blocos Cadastrados</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
        <style>
        html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        }

        body {
        font-family: Arial;
        background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740')
        no-repeat center center fixed;
        background-size: cover;
        text-align: center;
        position: relative;
        }

        h1 {
        color: #fff;
        margin: 20px 0;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        table {
        width: 90%;
        margin: 20px auto;
        border-collapse: collapse;
        background: rgba(255,255,255,0.9);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        th, td {
        border: 1px solid #ddd;
        padding: 12px;
        }

        th {
        background-color: #191970;
        color: #fff;
        }

        td {
        background-color: #E6E6FA;
        }

        tr:nth-child(even) td {
        background-color: #f0eaff;
        }

        .action-buttons {
        display: flex;
        justify-content: center;
        gap: 8px;
        }

        .botao {
        background: #6A5ACD;
        color: #fff;
        padding: 6px 12px;
        border-radius: 5px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem;
        transition: background 0.3s, transform 0.2s;
        }

        .botao:hover {
        background: #6959CD;
        transform: scale(1.1);
        }

        .botao i.fa-trash { color: #f3f3f3; }
        .botao i.fa-edit  { color: #fafafa;}
        .botao i.fa-plus  { color: #f0ecf9; }
        .botao i.fas fa-arrow-left { color: #f0ecf9; 
        }


        .button-row {
        margin: 30px 0;
        }

         </style>
        </head>

        <body>
        <h1>Blocos Cadastrados</h1>
        <input type="text" id="searchBar" placeholder="Pesquisar descrição..." 
        style="padding:10px; 
        width:50%; 
        border-radius:5px; 
        border:1px solid #ddd; 
        margin-bottom:20px;">

        <table id="blocosTable">
        <tr>
        <th>ID</th>
        <th>Descrição</th>
        <th>Qtd. Aptos</th>
        <th>Ações</th>
        </tr>

        ${rows.map(row => `
        <tr>
        <td>${row.id}</td>
        <td>${row.descricao}</td>
        <td>${row.qtd_apartamentos}</td>
        <td>
        <div class="action-buttons">
        <a href="/bloco/excluir/${row.id}" class="botao" title="Excluir"
        onclick="return confirm('Tem certeza que deseja excluir este bloco?')">
        <i class="fas fa-trash"></i>
        </a>
        </a>
        <a href="/bloco/editar/${row.id}" class="botao" title="Editar">
        <i class="fas fa-edit"></i>
        </a>
        </div>
        </td>
        </tr>
        `).join('')}
         </table>
        <div class="button-row">
        <a href="/" class="botao">
        <i class="fas fa-arrow-left"></i> Voltar
        </a>

        <a href="/cadastrar" class="botao">
        <i class="fas fa-plus"></i> Cadastrar
        </a>

        </div>

        <script>
        document.getElementById('searchBar').addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#blocosTable tr:not(:first-child)');
        rows.forEach(row => {
        const descricao = row.cells[1].textContent.toLowerCase();
        row.style.display = descricao.includes(searchValue) ? '' : 'none';
        });
        });
        </script>

        </body>
        </html>
        `);
        } else {
        console.log('Erro ao buscar blocos:', err);
        res.send('Erro!');
        }
        });
        });

        app.post('/bloco/cadastrar', (req, res) => {
        const { descricao, qtd_apartamentos } = req.body;
        const insert = 'INSERT INTO blocos (descricao, qtd_apartamentos) VALUES (?, ?)';
        connection.query(insert, [descricao, qtd_apartamentos], (err, result) => {
        if (!err) {
        console.log('Bloco cadastrado com sucesso!');
        res.redirect('/blocos');
        } else {
        console.log('Erro ao cadastrar bloco:', err);
        res.send('Erro!');
        }
        });
        });

        app.get('/bloco/excluir/:id', (req, res) => {
        const id = req.params.id;
        const del = 'DELETE FROM blocos WHERE id = ?';
        connection.query(del, [id], (err, result) => {
        if (!err) {
        console.log('Bloco excluído com sucesso!');
        res.redirect('/blocos');
        } else {
        console.log('Erro ao excluir bloco:', err);
        res.send('Erro!');
        }
        });
        });

        app.get('/bloco/editar/:id', (req, res) => {
        const id = req.params.id;
        const query = 'SELECT * FROM blocos WHERE id = ?';
        connection.query(query, [id], (err, rows) => {
        if (!err && rows.length > 0) {
        const bloco = rows[0];
        res.send(`
        <html>
        <head>
        <title>Editar Bloco</title>
        <style>
        html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        }

        body {
        font-family: Arial, sans-serif;
        background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740') no-repeat center center fixed;
        background-size: cover;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        }

        form {
        background: #fff; 
        padding: 20px; 
        border-radius: 10px; 
        width: 300px;
        }

        input, button {
        width: 100%; 
        padding: 10px; 
        margin: 10px 0;
        }

        button { 
        background: #6A5ACD; 
        color: white; 
        border: none; 
        border-radius: 5px;
        }

        button:hover {
        background:rgb(82, 66, 185); 
        transform: scale(1.05); 
        }
        </style>
        </head>
        <body>
        <form action="/bloco/editar/${id}" method="POST">
        <input type="text" name="descricao" value="${bloco.descricao}" placeholder="Descrição" required>
        <input type="number" name="qtd_apartamentos" value="${bloco.qtd_apartamentos}" placeholder="Qtd. Apartamentos" required>
        <button type="submit">Salvar</button>
        </form>
        </body>
        </html>
        `);

        } else {
        console.log('Erro ao buscar bloco:', err);
        res.send('Erro!');
        }
        });
        });

        app.post('/bloco/editar/:id', (req, res) => {
        const id = req.params.id;
        const { descricao, qtd_apartamentos } = req.body;
        const update = 'UPDATE blocos SET descricao = ?, qtd_apartamentos = ? WHERE id = ?';
        connection.query(update, [descricao, qtd_apartamentos, id], (err, result) => {
        if (!err) {
        console.log('Bloco editado com sucesso!');
        res.redirect('/blocos');
        } else {
        console.log('Erro ao editar bloco:', err);
        res.send('Erro!');
        }
        });
        });

        app.get('/apartamentos', (req, res) => {
        const query = 'SELECT * FROM apartamentos';
        connection.query(query, (err, rows) => {
        if (!err) {
        res.send(`
        <html>
        <head>
        <title>Apartamentos Cadastrados</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
        <style>
        html, body { 
        height: 100%; 
        margin: 0; 
        padding: 0;
        }

        body {
        font-family: Arial;
        background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
        background-size: cover;
        text-align: center;
        }

        h1 { color: #fff; 
        margin: 20px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8); 
        }

        table {
        width: 90%; 
        margin: 20px auto; 
        border-collapse: collapse;
        background: rgba(255,255,255,0.9); 
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        th, td { 
        border: 1px 
        solid #ddd;
         padding: 12px; 
         }

        th { 
        background: #191970; 
        color: #fff; 
        }

        td { 
        background: #E6E6FA; 
        }

        tr:nth-child(even) 
        td { 
        background: #f0eaff; 
        }

        .action-buttons { 
        display: flex; 
        justify-content: center; 
        gap: 8px; 
        }

        .botao {
        background: #6A5ACD; 
        color: #fff;
        padding: 6px 12px; 
        border-radius: 5px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem; 
        transition: background 0.3s, transform 0.2s;
        }

        .botao:hover { 
        background: #6959CD; 
        transform: scale(1.1);
         }

        .button-row { 
        margin: 30px 0; 
        }

        </style>
        </head>
        <body>
        <h1>Apartamentos Cadastrados</h1>
        <input type="text" id="searchBar" placeholder="Pesquisar número.." 
        style="padding:10px; 
        width:50%; 
        border-radius:5px; 
        border:1px solid #ddd; 
        margin-bottom:20px;">

        <table id="blocosTable">
        <tr>
        <th>ID</th>
        <th>Número</th>
        <th>Bloco</th>
        <th>Ações</th>
        </tr>

        ${rows.map(row => `
        <tr>
        <td>${row.id}</td>
        <td>${row.numero}</td>
        <td>${row.bloco}</td>
        <td>
        <div class="action-buttons">
        <a href="/apartamento/excluir/${row.id}" class="botao" title="Excluir"
        onclick="return confirm('Tem certeza que deseja excluir este apartamento?')">
        <i class="fas fa-trash"></i>
        </a>
        
        <a href="/apartamento/editar/${row.id}" class="botao" title="Editar">
        <i class="fas fa-edit"></i>
        </a>
        </div>
        </td>
        </tr>
     `  ).join('')}
        </table>
        <div class="button-row">
        <a href="/" class="botao">
        <i class="fas fa-arrow-left"></i> Voltar</a>
        <a href="/cadastrarApartamento" class="botao">
        <i class="fas fa-plus"></i> Cadastrar</a>
        </div>
        <script>
        document.getElementById('searchBar').addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('#blocosTable tr:not(:first-child)');
        rows.forEach(row => {
        const numero = row.cells[1].textContent.toLowerCase();
        row.style.display = numero.includes(searchValue) ? '' : 'none';
        });
        });
        </script>
        </body>
        </html>
        `);

        } else {
        console.log('Erro ao buscar apartamentos:', err);
        res.send('Erro!');
        }
        });
        });

        app.post('/apartamento/cadastrar', (req, res) => {
        const { numero, bloco } = req.body;
        const insert = 'INSERT INTO apartamentos (numero, bloco) VALUES (?, ?)';
        connection.query(insert, [numero, bloco], (err) => {
        if (!err) {
        console.log('Apartamento cadastrado com sucesso!');
        res.redirect('/apartamentos');
        } else {
        console.log('Erro ao cadastrar apartamento:', err);
        res.send('Erro!');
        }
        });
        });

    app.post('/apartamento/editar/:id', (req, res) => {
    const { numero, bloco } = req.body;
    const update = 'UPDATE apartamentos SET numero = ?, bloco = ? WHERE id = ?';
    connection.query(update, [numero, bloco, req.params.id], (err) => {
    if (!err) {
    console.log('Apartamento atualizado!');
    res.redirect('/apartamentos');
    } else {
    console.log('Erro ao atualizar apartamento:', err);
    res.send('Erro!');
    }
    });
    });

    app.get('/apartamento/excluir/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM apartamentos WHERE id = ?', [id], (err) => {
    if (!err) {
     console.log('Apartamento excluído com sucesso!');
    res.redirect('/apartamentos');
    } else {
    console.log('Erro ao excluir apartamento:', err);
    res.send('Erro!');
    }
    });
    });

    app.get('/apartamento/editar/:id', (req, res) => {
    connection.query('SELECT * FROM apartamentos WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err && rows.length) {
    const ap = rows[0];
    res.send(`
    <html>
    <head>
    <title>Editar Apartamento</title>
    <style>

    html, body { height: 100%; 
    margin: 0; 
    padding: 0; 
    }

    body {
    font-family: Arial;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex; 
    justify-content: center; 
    align-items: center;
    }

    form { 
    background: #fff; 
    padding: 20px; 
    border-radius: 10px; 
    width: 300px; 
    }

    input, button { 
    width: 100%; 
    padding: 10px; 
    margin: 10px 0;
    }

    button { 
    background: #6A5ACD; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    }

    button:hover {
    background: #6959CD;
    transform: scale(1.05);
    }

    </style>
    </head>
    <body>
    <form action="/apartamento/editar/${ap.id}" method="POST">
    <input type="number" name="numero" value="${ap.numero}" placeholder="Número" required>
    <input type="text" name="bloco" value="${ap.bloco}" placeholder="Bloco " required>
    <button type="submit">Salvar</button>
    </form>
    </body>
    </html>
    `);

    } else {
    res.send('Erro ao carregar apartamento!');
    }
    });
    });

    app.post('/apartamento/editar/:id', (req, res) => {
    const { numero, bloco } = req.body;
    const update = 'UPDATE apartamentos SET numero = ?, bloco = ? WHERE id = ?';
    connection.query(update, [numero, bloco, req.params.id], (err) => {
    if (!err) {
    console.log('Apartamento atualizado!');
    res.redirect('/apartamentos');
    } else {
    console.log('Erro ao atualizar apartamento:', err);
    res.send('Erro!');
    }
    });
    });

    app.get('/moradores', (req, res) => {
    const query = 'SELECT * FROM moradores';
    connection.query(query, (err, rows) => {
    if (!err) {
    res.send(`

    <html>
    <head>
    <title>Moradores Cadastrados</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
    <style>

    html, body { 
    height: 100%; 
    margin: 0; 
    padding: 0; 
    }

    body {
    font-family: Arial;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;
    text-align: center;
    }

    h1 { 
    color: #fff; 
    margin: 20px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8); 
    }

    table {
    width: 95%; 
    margin: 20px auto; 
    border-collapse: collapse;
    background: rgba(255,255,255,0.9);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    th, td { 
    border: 1px solid #ddd;
    padding: 10px;
    }
        
    th { 
    background: #191970;
    color: #fff; 
    }

    td {
    background: #E6E6FA;
    font-size: 0.9rem;
    }

    tr:nth-child(even)
    td {
    background: #f0eaff; 
    }

    .action-buttons { 
    display: flex; 
    justify-content: center;
    gap: 6px; 
    }

    .botao {
    background: #6A5ACD;
    color: #fff; 
    padding: 5px 10px; 
    border-radius: 5px;
    text-decoration: none;
    display: inline-flex; 
    align-items: center; 
    gap: 5px;
    font-size: 0.8rem;
    transition: background 0.3s, transform 0.2s;
    }

    .botao:hover { 
    background: #6959CD; 
    transform: scale(1.1); }
    .button-row {
    margin: 20px;
    }

    </style>
    </head>
    <body>
    <h1>Moradores Cadastrados</h1>
    <input type="text" id="searchBar" placeholder="Pesquisar nome..." 
    style="padding:10px;
    width:50%; 
    border-radius:5px; 
    border:1px solid #ddd; 
    margin-bottom:20px;">

    <table id="blocosTable">
    <tr>
    <th>ID</th>
    <th>Nome</th>
    <th>CPF</th>
    <th>Apartamento</th>
    <th>Bloco</th>
    <th>Ações</th>
    </tr>

    ${rows.map(row => `
    <tr>
    <td>${row.id}</td>
    <td>${row.nome}</td>
    <td>${row.cpf}</td>
    <td>${row.apartamento}</td>
    <td>${row.bloco}</td>
    <td>
    <div class="action-buttons">
    <a href="/morador/excluir/${row.id}" class="botao" title="Excluir"
    onclick="return confirm('Tem certeza que deseja excluir este morador?')">
    <i class="fas fa-trash"></i>
    </a>
    <a href="/morador/editar/${row.id}" class="botao"><i class="fas fa-edit"></i></a>
    </div>
    </td>
    </tr>`).join('')}
    </table>
    <div class="button-row">
    <a href="/" class="botao"><i class="fas fa-arrow-left"></i> Voltar</a>
    <a href="/cadastrarMorador" class="botao">
    <i class="fas fa-plus"></i> Cadastrar</a>
    </div>


    <script>
    document.getElementById('searchBar').addEventListener('keyup', function() {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll('#blocosTable tr:not(:first-child)');
    rows.forEach(row => {
    const nome = row.cells[1].textContent.toLowerCase();
    row.style.display = nome.includes(searchValue) ? '' : 'none';
    });
    });
    </script>

    </body>
    </html>
    `);

    } else {
    console.log('Erro ao buscar moradores:', err);
    res.send('Erro!');
    }
    });
    });

    app.post('/morador/cadastrar', (req, res) => {
    const { cpf, nome, telefone, apartamento, bloco, responsavel, proprietario, veiculo, qtd_vagas, num_vaga } = req.body;
    const insert = `
    INSERT INTO moradores (cpf, nome, telefone, apartamento, bloco, responsavel, proprietario, veiculo, qtd_vagas, num_vaga)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(insert, [cpf, nome, telefone, apartamento, bloco, responsavel, proprietario, veiculo, qtd_vagas, num_vaga], (err) => {
    if (!err) {
    console.log('Morador cadastrado!');
    res.redirect('/moradores');
    } else {
    console.log('Erro ao cadastrar morador:', err);
    res.send('Erro ao cadastrar morador!');
    }
    });
    });

    app.get('/morador/editar/:id', (req, res) => {
    connection.query('SELECT * FROM moradores WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err && rows.length) {
    const m = rows[0];
    res.send(`

    <html>
    <head>
    <title>Editar Morador</title>
    <style>

    html, body { 
    height: 100%;
    margin: 0; 
    padding: 0; 
    }

    body {
    font-family: Arial;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    form {
    background: #fff; 
    padding: 20px; 
    border-radius: 10px; 
    width: 320px; 
    }

    input, button {
    width: 100%; 
    padding: 10px; 
    margin: 10px 0; 
    }

    button {
    background: #6A5ACD; 
    color: white; 
    border:none; 
    border-radius: 5px; 
    }

    button:hover {
    background: #6959CD; 
    transform: scale(1.05);
    }

    </style>
    </head>

    <body>
    <form action="/morador/editar/${m.id}" method="POST">
    <input type="text" name="cpf" value="${m.cpf}" placeholder="CPF" required>
    <input type="text" name="nome" value="${m.nome}" placeholder="Nome" required>
    <input type="text" name="apartamento" value="${m.apartamento}" placeholder="Apartamento" required>
    <input type="text" name="bloco" value="${m.bloco}" placeholder="Bloco" required>
    <button type="submit">Salvar</button>
    </form>
    </body>
    </html>
    `);
    } else {
    res.send('Erro ao carregar morador!');
    }
    });
    });

    app.post('/morador/editar/:id', (req, res) => {
    const { cpf, nome, apartamento, bloco } = req.body;
    const update = 'UPDATE moradores SET cpf = ?, nome = ?, apartamento = ?, bloco = ? WHERE id = ?';
    connection.query(update, [cpf, nome,apartamento, bloco, req.params.id], (err) => {
    if (!err) {
    console.log('Morador atualizado!');
    res.redirect('/moradores');
    } else {
    console.log('Erro ao atualizar morador:', err);
    res.send('Erro!');
    }
    });
    });

    app.get('/morador/excluir/:id', (req, res) => {
    connection.query('DELETE FROM moradores WHERE id = ?', [req.params.id], (err) => {
    if (!err) {
    console.log('Morador excluído!');
    res.redirect('/moradores');
    } else {
    console.log('Erro ao excluir morador:', err);
    res.send('Erro!');
    }
    });
    });



    app.get('/pagamentos/criar', function(req, res) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    const referenciaAtual = `${anoAtual}-${mesAtual.toString().padStart(2, '0')}-01`;
    const vencimento = new Date(anoAtual, mesAtual, 10).toISOString().split('T')[0];
    
    const queryApartamentos = `
    SELECT a.id, a.numero, b.descricao as bloco_descricao 
    FROM apartamentos a
    JOIN blocos b ON a.bloco_id = b.id
    ORDER BY b.descricao, a.numero
    `;
    
        
    connection.query(queryApartamentos, function(err, apartamentos) {
    if (err) return res.status(500).send("Erro ao carregar formulário");
    
    const renderBaseTemplate = (content) => `
    <!DOCTYPE html>


    <style>

    <style>
    <script>
    function buscarDados() {
    const apartamentoId = document.getElementById('apartamento_id').value;
    window.location.href = '/pagamentos/criar?apartamento_id=' + apartamentoId;
    }
                        
    function validarFormulario() {
    const apartamento = document.getElementById('apartamento_id').value;
    const dataPagamento = document.getElementById('data_pagamento').value;
    const valorPago = document.getElementById('valor_pago').value;
                            
    if (!apartamento) { alert('Selecione um apartamento válido'); return false; }
    if (!dataPagamento) { alert('Informe a data do pagamento'); return false; }
    if (!valorPago || isNaN(valorPago)) { alert('Informe um valor válido'); return false; }
                            
    return true;
    }
    </script>
    </head>
    <body>
    <div class="app-container">
    </div>
    </body>
    </html>
    `;
    
    if (req.query.apartamento_id) {
    const apartamentoId = req.query.apartamento_id;
                
    const queryMorador = `
    SELECT m.cpf, m.nome, m.telefone 
    FROM moradores m
    WHERE m.apartamento_id = ? AND m.responsavel = 1
    LIMIT 1
    `;
                
    connection.query(queryMorador, [apartamentoId], function(err, moradores) {
    if (err) return res.send(renderBaseTemplate(`
    <div class="error-message">Erro ao buscar dados do apartamento</div>
    <a href="/pagamentos/criar" class="btn-primary">Voltar</a>
    `));
                    
    if (moradores.length === 0) {
    return res.send(renderBaseTemplate(`
    <div class="error-message">Apartamento não possui morador responsável</div>
    <a href="/pagamentos/criar" class="btn-primary">Voltar</a>
    `));
    }
                    
    const morador = moradores[0];
                    
    const formContent = `
    <div class="page-header">
    <h2><i class="fas fa-money-bill-wave"></i> Registrar Pagamento</h2>
    <a href='/' class="btn-primary">
    <i class="fas fa-backward"></i> Voltar
    </a>
    </div>
    
    <div class="form-container">
    ${req.query.error ? `<div class="error-message">${req.query.error}</div>` : ''}
    ${req.query.success ? `<div class="success-message">${req.query.success}</div>` : ''}
                            
    <form method="POST" action="/pagamentos/criar/submit" onsubmit="return validarFormulario()">
    <div class="form-group apartamento-select-container">
    <label for="apartamento_id">Apartamento:</label>
    <select id="apartamento_id" name="apartamento_id" required onchange="buscarDados()">
    <option value="">Selecione um apartamento</option>
    ${apartamentos.map(apto => `
    <option value="${apto.id}" ${apartamentoId == apto.id ? 'selected' : ''}>
    ${apto.bloco_descricao} - Apt ${apto.numero}
    </option>
    `).join('')}
    </select>
    <div class="select-icon">
    <i class="fas fa-chevron-down"></i>
    </div>
    </div>
                                
    <div class="form-group">
    <label for="cpf">CPF do Morador:</label>
    <input type="text" id="cpf" name="cpf" readonly value="${morador.cpf || ''}">
    </div>
                                
    <div class="form-group">
    <label for="morador">Nome do Morador:</label>
    <input type="text" id="morador" name="morador" readonly value="${morador.nome || ''}">
    </div>
                                
    <div class="form-group">
    <label for="telefone">Telefone:</label>
    <input type="text" id="telefone" name="telefone" readonly value="${morador.telefone || ''}">
    </div>
                                
    <div class="form-group">
    <label for="referencia">Mês/Ano Referência:</label>
    <input type="text" id="referencia" name="referencia" readonly value="${referenciaAtual.split('-')[1]}/${referenciaAtual.split('-')[0]}">
    </div>
                                
    <div class="form-group">
    <label for="vencimento">Data de Vencimento:</label>
    <input type="text" id="vencimento" name="vencimento" readonly value="${vencimento}">
    </div>
                                    
    <div class="form-group">
    <label for="data_pagamento">Data do Pagamento:</label>
    <input type="date" id="data_pagamento" name="data_pagamento" required>
    </div>
                                
    <div class="form-group">
    <label for="valor_pago">Valor Pago (R$):</label>
    <input type="number" id="valor_pago" name="valor_pago" step="0.01" required>
    </div>
                                
    <div class="form-actions">
    <button type="submit" class="btn-primary">
    <i class="fas fa-check"></i> Registrar Pagamento
    </button>
    </div>
    </form>
    </div>
    `;
                    
    res.send(renderBaseTemplate(formContent));
    });
    } else {
    const initialContent = `
    <div class="page-header">
    <h2><i class="fas fa-money-bill-wave"></i> Registrar Pagamento</h2>
    </div>
    
    <div class="form-container">
    ${req.query.error ? `<div class="error-message">${req.query.error}</div>` : ''}
                            
    <form method="GET" action="/pagamentos/criar">
    <div class="form-group apartamento-select-container">
    <label for="apartamento_id">Apartamento:</label>
    <select id="apartamento_id" name="apartamento_id" required>
    <option value="">Selecione um apartamento</option>
    ${apartamentos.map(apto => `
    <option value="${apto.id}">
    Bloco ${apto.bloco_descricao} - Apt ${apto.numero}
    </option>
    `).join('')}
    </select>
    <div class="select-icon">
    <i class="fas fa-chevron-down"></i>
    </div>
    </div>
                            
    <div class="form-actions">
    <button type="submit" class="btn-primary">
    <i class="fas fa-arrow-right"></i> Continuar
    </button>
    </div>
    </form>
    </div>
    `;
                
    res.send(renderBaseTemplate(initialContent));
    }
    });
    });

    app.post('/pagamentos/criar/submit', function(req, res) {
        const { apartamento_id, data_pagamento, valor_pago } = req.body;
    if(!apartamento_id || !data_pagamento || !valor_pago){
    return res.redirect('/pagamentos/criar?error = Todos os campos são obrigatórios');
    }

    const obterConsultaResponsavel = 'SELECT id FROM moradores WHERE apartamento_id = ? AND responsavel = 1 LIMIT 1';
    connection.query(obterConsultaResponsavel, [apartamento_id], function(err, moradores){
        if (err) return res.redirect('/pagamentos/criar?error=Erro ao registrar pagamento');
    if (moradores.length === 0) return res.redirect('/pagamentos/criar?error=Apartamento sem morador responsável');

    const morador_id = moradores[0].id;
    const referenciaAtual = new Date().toISOString().slice(0, 7) + '-01';
    const vencimento = new Date();
    vencimento.setMonth(vencimento.getMonth() + 1);
    vencimento.setDate(10);
    const vencimentoFormatado = vencimento.toISOString().split('T')[0];
    const consultaInserirPagamento = `
    INSERT INTO pagamentos 
    (apartamento_id, morador_id, referencia, valor, vencimento, data_pagamento, valor_pago, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pago')
    `
    });
    connection.query(consultaInserirPagamento, [
    apartamento_id, morador_id, referenciaAtual,
    valor_pago,
    vencimentoFormatado, data_pagamento,
    valor_pago
    ], function(err, result) {
    });
    if (err) return res.redirect('/pagamentos/criar?error-Erro ao registrar pagamento');
    res.redirect('/pagamentos/criar?success-Pagamento registrado com sucesso');
    });




    app.get('/manutencoes', (req, res) => {
    connection.query('SELECT * FROM manutencoes', (err, rows) => {
    if (err) {
    console.error('Erro ao carregar manutenções:', err);
    return res.status(500).send('Erro ao carregar manutenções!');
    }

    let htmlContent = `
    <html>
    <head>
    <title>Lista de Manutenções</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
    <style>
    html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    }

    body {
    font-family: Arial;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740')
    no-repeat center center fixed;
    background-size: cover;
    text-align: center;
    position: relative;
    }

    h1 {
    color: #fff;
    margin: 20px 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    }

    table {
    width: 90%;
    margin: 20px auto;
    border-collapse: collapse;
    background: rgba(255,255,255,0.9);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    th, td {
    border: 1px solid #ddd;
    padding: 12px;
    }

    th {
    background-color: #191970;
    color: #fff;
    }

    td {
    background-color: #E6E6FA;
    }

    tr:nth-child(even) td {
    background-color: #f0eaff;
    }

    .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
    }

    .botao {
    background: #6A5ACD;
    color: #fff;
    padding: 6px 12px;
    border-radius: 5px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    transition: background 0.3s, transform 0.2s;
    }

    .botao:hover {
    background: #6959CD;
    transform: scale(1.1);
    }

    .botao i.fa-trash { color: #b493f5; }
    .botao i.fa-edit  { color: #b493f5;}
    .botao i.fa-plus  { color: #f0ecf9; }
    .botao i.fas fa-arrow-left { color: #f0ecf9; }

    .button-row {
    margin: 30px 0;
    }
    </style>
    </head>
    <body>
    <div class="container">
    <h2>Manutenções Registradas</h2>
    <ul>
    ${rows.map(row => 
    `<li>Tipo: ${row.tipo_id},
    Data: ${row.data}, 
    Local: ${row.local}</li>`)
    .join('')
    }
    </ul>
    <a href="/tipoManutencao/registrar" class="botao"><i class="fas fa-plus"></i>Registrar Nova Manutenção</a>
    <a href="/tiposManutencao" class="botao"><i class="fas fa-arrow-left"></i>Voltar para Tipos de Manutenção</a>
    </div>
    </body>
    </html>
    `;

    res.send(htmlContent);
    });
    });

    app.get('/tiposManutencao', (req, res) => {
    connection.query('SELECT * FROM tipos_manutencao', (err, rows) => {
    if (err) {
    console.error('Erro ao carregar tipos:', err);
    return res.send('Erro!');
    }
    res.send(`
    <html>
    <head>
    <title>Tipos de Manutenção</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
    <style>
    body {
    font-family: Arial, sans-serif;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740')
    no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    }
    
    .container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    text-align: center;
    }
    
    h2 {
    margin-top: 0;
    }
    
    ul {
    list-style-type: none;
    padding: 0;
    }
    
    li {
    padding: 5px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    }

    .button-link {
    background: #6A5ACD;
    color: #fff;
    padding: 6px 12px;
    border-radius: 5px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    transition: background 0.3s, transform 0.2s;
    }

    .button-link:hover {
    background: #6959CD;
    transform: scale(1.1);
    }
    </style>
    </head>
    <body>
    <div class="container">
    <h2>Tipos de Manutenção Cadastrados</h2>
    <ul>
    ${rows.map(t => `<li>${t.descricao}</li>`).join('')}
    </ul>
    <a href="/tipoManutencao/cadastrar" class="button-link">Cadastrar Novo</a>
    </div>
    </body>
    </html>
    `);
    });
    });
    
    app.get('/tipoManutencao/cadastrar', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>Cadastrar Tipo de Manutenção</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
    <style>
    body {
    font-family: Arial, sans-serif;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    }

    .container {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    width: 400px;
    text-align: center;
    }

    h1 {
    margin-top: 0;
    font-size: 24px;
    font-weight: bold;
    }

    h2 {
    font-size: 18px;
    margin-bottom: 20px;
    }

    label {
    display: block;
    margin: 15px 0 5px;
    font-weight: bold;
    text-align: left;
    }

    input[type="text"] {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    }

    #aviso {
    color: red;
    font-size: 14px;
    margin-top: 10px;
    }

    .buttons {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    }

    .botao {
    background: #6A5ACD;
    color: #fff;
    padding: 6px 12px;
    border-radius: 5px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    transition: background 0.3s, transform 0.2s;
    border: none;
    cursor: pointer;
    }

    .botao:hover {
    background: #6959CD;
    transform: scale(1.1);
    }

    </style>
    <script>
    async function verificarDuplicidade() {
    const descricao = document.getElementById('descricao').value;
    const response = await fetch('/tipoManutencao/existe?descricao=' + encodeURIComponent(descricao));
    const resultado = await response.text();

    const aviso = document.getElementById('aviso');
    const botao = document.getElementById('cadastrarBtn');

    if (resultado.trim() === 'existe') {
    aviso.textContent = 'Tipo de manutenção já cadastrada';
    botao.disabled = true;
    }else if (resultado.trim() === 'disponivel') {
    aviso.textContent = '';
    botao.disabled = false;
    } else {
    aviso.textContent = 'Erro na verificação';
    botao.disabled = true;
    }
    }
    </script>
    </head>
    <body>
    <div class="container">
    <h1>Condomínio</h1>
    <h2>Cadastrar Tipo de Manutenção</h2>
    <form action="/tipoManutencao/cadastrar" method="POST">
    <label for="descricao">Descrição da manutenção:</label>
    <input type="text" name="descricao" id="descricao" onblur="verificarDuplicidade()" required>
    <p id="aviso"></p>
    <div class="buttons">
    <button type="submit" id="cadastrarBtn" class="botao">Cadastrar</button>
    <a href="/tiposManutencao" class="botao">Voltar para Tipos de Manutenção</a>
    </div>
    </form>
    </div>
    </body>
    </html>

    `);
    });

    app.get('/tipoManutencao/existe', (req, res) => {
    const descricao = req.query.descricao?.trim();
    if (!descricao) {
    return res.send('descricao-nao-informada');
    }
    connection.query('SELECT * FROM tipos_manutencao WHERE descricao = ?', [descricao], (err, rows) => {
    if (err) return res.send('erro');
    if (rows.length > 0) {
    res.send('existe');
    } else {
    res.send('disponivel');
    }
    });
    });
    
    app.post('/tipoManutencao/cadastrar', (req, res) => {
    const { descricao } = req.body;
    if (!descricao) {
    return res.send(`
    <html>
    <head>
    <title>Erro</title>
    <style>
    body {
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740') no-repeat center center fixed;
     background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #f8d7da;
    }
    .mensagem {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border: 2px solid #f5c6cb;
    }
    .mensagem p {
    font-size: 18px;
    color: red;
    margin-bottom: 15px;
    }
    .mensagem a {
    color: white;
    background-color: #6A5ACD;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    }
    .mensagem a:hover {
    background-color: #6959CD;
    }
    </style>
    </head>
    
    <body>
    <div class="mensagem">
    <p>Descrição obrigatória.</p>
    <a href="/tipoManutencao/cadastrar">Voltar</a>
    </div>
    </body>
    </html>
    `);
    }
    
    connection.query('SELECT * FROM tipos_manutencao WHERE descricao = ?', [descricao], (err, rows) => {
    if (err) {
    return res.send('Erro ao consultar o banco de dados.');
    }
    
    if (rows.length > 0) {
    return res.send(`
    <html>
    <head>
    <title>Duplicado</title>
    <style>
    body {
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #fff3cd;
    }

    .mensagem {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border: 2px solid #ffeeba;
    }

    .mensagem p {
    font-size: 18px;
    color: #856404;
    margin-bottom: 15px;
    }

    .mensagem a {
    color: white;
    background-color: #6A5ACD;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    }
    
    mensagem a:hover {
    background-color: #6959CD;
    }

    </style>
    </head>
    
    <body>
    <div class="mensagem">
    <p>Tipo de manutenção já cadastrada.</p>
    <a href="/tipoManutencao/cadastrar">Voltar</a>
    </div>
    </body>
    </html>
    `);
    }
    
    connection.query('INSERT INTO tipos_manutencao (descricao) VALUES (?)', [descricao], (err) => {
    if (err) {
    return res.send(`
    <html>
    <head>
    <title>Erro</title>
    <style>
    body {
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #f8d7da;
    }

    .mensagem {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border: 2px solid #f5c6cb;
    }

    .mensagem p {
    font-size: 18px;
    color: red;
    margin-bottom: 15px;
    }

    .mensagem a {
    color: white;
    background-color: #6A5ACD;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    }

    .mensagem a:hover {
    background-color: #6959CD;
    }

    </style>
    </head>
    <body>
    <div class="mensagem">
    <p>Erro ao salvar!</p>
    <a href="/tipoManutencao/cadastrar">Voltar</a>
    </div>
    </body>
    </html>
    `);
    }
    
    res.send(`
    <html>
    <head>
    <title>Sucesso</title>
    <style>

    body {
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg?semt=ais_hybrid&w=740') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #d4edda;
    }

    .mensagem {
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border: 2px solid #c3e6cb;
    }

    .mensagem p {
    font-size: 18px;
    color:  #6A5ACD;
    margin-bottom: 15px;
    }

    .mensagem a {
    color: white;
    background-color: #6A5ACD;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    }

    .mensagem a:hover {
    background-color: #6959CD;
    }

    </style>
    </head>
    <body>
    <div class="mensagem">
    <p>Dados salvos com sucesso!</p>
    <a href="/tiposManutencao">Voltar</a>
    </div>
    </body>
    </html>
    `);
    });
    });
    });
    

    app.get('/tipoManutencao/registrar', (req, res) => {
    connection.query('SELECT * FROM tipos_manutencao', (err, tipos) => {
    if (err) return res.send('Erro ao carregar tipos.');
    const options = tipos.map(t => `<option value="${t.id}">${t.descricao}</option>`).join('');
        
    res.send(`
    <html>
    <head>
    <title>Registrar Manutenção</title>
    <style>

    html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: Arial;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    form {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    }

    input, select, button {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    }

    button {
    background-color: #6A5ACD;
    color: white;
    border: none;
    border-radius: 5px;
    }

    button:hover {
    background-color: #6959CD;
    transform: scale(1.05);
    }

    .botao-voltar {
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px;
    margin: 10px 0;
    background-color: #6A5ACD;
    color: white;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    font-size: 16px;
    box-sizing: border-box;
    transition: transform 0.2s;
    }

    .botao-voltar:hover {
    background-color: #6959CD;
    transform: scale(1.05);
    }

    </style>
    </head>
    <body>
    <form action="/tipoManutencao/registrar" method="POST" onsubmit="return validarCampos()">
    <label>Tipo:</label>
    <select name="tipo" id="tipo">
    <option value="">Selecione</option>
    ${options}
    </select><br/>
    <label>Data:</label>
    <input type="date" name="data" id="data"><br/>
    <label>Local:</label>
    <input type="text" name="local" id="local"><br/>
    <button type="submit">Cadastrar</button>
    <a href="/tiposManutencao" class="botao-voltar">Voltar</a>
    <p id="erro" style="color: red; text-align: center; margin: 5px 0 0 0;"></p>
    </form>
    <p id="erro" style="color: red;"></p>
                

    <script>
    function validarCampos() {
    const tipo = document.getElementById('tipo').value;
    const data = document.getElementById('data').value;
    const local = document.getElementById('local').value;
    if (!tipo || !data || !local) {
    document.getElementById('erro').textContent = 'Dados obrigatórios não informados';
    return false;
    }
    return true;
    }

    </script>
    </body>
    </html>
    `);
    });
    });



    app.post('/tipoManutencao/registrar', (req, res) => {
    const { tipo, data, local } = req.body;
    if (!tipo || !data || !local) {
    return res.send(`
    <html>
    <head>
    <title>Erro no Registro</title>
    <style>

    body {
    font-family: Arial, sans-serif;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    }

    .card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    border: 2px solid #f5c6cb;
    color: #721c24;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    a {
    text-decoration: none;
    color: #721c24;
    padding: 10px 20px;
    background-color: #f5c6cb; 
    border-radius: 5px;
    }

    a:hover {
    background-color: #f1b0b7; 
    }

    </style>
    </head>
    <body>
    <div class="card">
    <h3>Dados obrigatórios não informados.</h3>
    <a href="/tipoManutencao/registrar">Voltar</a>
    </div>
    </body>
    </html>
    `);
    }

    connection.query('INSERT INTO manutencoes (tipo_id, data, local) VALUES (?, ?, ?)', [tipo, data, local], (err) => {
    if (err) {
    console.error('Erro ao registrar:', err);
    return res.send(`
    <html>
    <head>
    <title>Erro no Registro</title>
    <style>

    body {
    font-family: Arial, sans-serif;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    }

    .card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    border: 2px solid #f5c6cb; 
    color: #721c24; 
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    a {
    text-decoration: none;
    color: #721c24; 
    padding: 10px 20px;
    background-color: #f5c6cb;
    border-radius: 5px;
    }

    a:hover {
    background-color: #f1b0b7; 
    }

    </style>
    </head>
    <body>
    <div class="card">
    <h3>Erro ao registrar manutenção!</h3>
    <a href="/tipoManutencao/registrar">Voltar</a>
    </div>
    </body>
    </html>
    `);
    }

    res.send(`
    <html>
    <head>
    <title>Registro Salvo</title>
    <style>

    body {
    font-family: Arial, sans-serif;
    background: url('https://img.freepik.com/fotos-gratis/conceito-de-plano-de-fundo-do-estudio-abstrato-vazio-luz-gradiente-roxo-estudio-quarto-fundo-para-o-produto_1258-56070.jpg') no-repeat center center fixed;
    background-size: cover;                        
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    }

    .card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    border: 2px solid #c3e6cb; 
    color: #155724; 
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    a {
    text-decoration: none;
    color: #155724;
    padding: 10px 20px;
    background-color: #c3e6cb;
    border-radius: 5px;         
    }

    a:hover {
    background-color: #a8d5b9; 
    }

    </style>
    </head>
    <body>
    <div class="card">
    <h3>Manutenção registrada com sucesso!</h3>
    <a href="/tiposManutencao">Voltar</a>
    </div>
    </body>
    </html>
    `);
    });
    });

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
