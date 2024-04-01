const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const connection = require('./connection')


router.get('/adicionarUsuario', (req, res) => {
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

router.get('/listarCursosDoUsuario', (req, res) => {
  const usuarioId = req.query.usuario_id;

  // Verifica se os parâmetros necessários foram fornecidos
  if (!usuarioId) {
    res.status(400).send('ID do usuário é obrigatório.');
    return;
  }

  // Chama a função do banco de dados para listar os cursos do usuário
  const query = `SELECT listarCursosDoUsuario(${usuarioId}) AS cursos`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao listar cursos do usuário:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    // Retorna os cursos do usuário como resposta
    const cursos = JSON.parse(results[0].cursos); // Convertendo para objeto JavaScript
    res.json(cursos);
  });
});



// Exporte o roteador
module.exports = router;
