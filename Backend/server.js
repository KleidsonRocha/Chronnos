const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Soccol_barbieiri_2023',
  database: 'pi_3'
});

app.get('/adicionarUsuario', (req, res) => {
  const { nome, email, senha } = req.query;
  const parametrosFaltando = [];

  // Verifica se os parâmetros necessários foram fornecidos
  if (!nome) {
    parametrosFaltando.push('nome');
  }
  if (!email) {
    parametrosFaltando.push('email');
  }
  if (!senha) {
    parametrosFaltando.push('senha');
  }

  // Se houver parâmetros faltando, envie uma mensagem de erro com a lista de parâmetros
  if (parametrosFaltando.length > 0) {
    const mensagemErro = `Parâmetros faltando: ${parametrosFaltando.join(', ')} são obrigatórios.`;
    res.status(400).send(mensagemErro);
    return;
  }

  // Se todos os parâmetros estiverem presentes, prossiga com a criação do usuário
  const query = `SELECT adicionarUsuario("${nome}", "${email}", "${senha}") AS novo_id`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao chamar a função adicionarUsuario:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    const novoId = results[0].novo_id;
    res.send(`ID do novo usuário: ${novoId}`);
  });
});



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
