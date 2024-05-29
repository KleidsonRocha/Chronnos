const express = require('express');
const router = express.Router();
const upload = require('./uploadConfig');
const connection = require('./connection');

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

router.get('/listarDesejoDoUsuario', (req, res) => {
  const usuarioId = req.query.usuario_id;

  // Verifica se os parâmetros necessários foram fornecidos
  if (!usuarioId) {
    res.status(400).send('ID do usuário é obrigatório.');
    return;
  }

  // Chama a função do banco de dados para listar os cursos do usuário
  const query = `SELECT listarDesejoDoUsuario(${usuarioId}) AS desejo`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao listar desejo do usuário:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    // Retorna os cursos do usuário como resposta
    const desejo = JSON.parse(results[0].desejo); // Convertendo para objeto JavaScript
    res.json(desejo);
  });
});

router.get('/listarAreasUsuario', (req, res) => {
  const usuarioId = req.query.usuario_id;

  if(!usuarioId) {
    res.status(400).send('ID de usuário é obrigatorio.');
    return;
  }

  // Função do banco para listar as Areas do usuário
  const query = `SELECT listarAreasUsuario(${usuarioId}) AS cursos`;

  connection.query(query, (err, results) => {
    if(err) {
      console.error('Erro ao listar areas do usuário', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    //Retorna as áreas do usuário como resposta
    const areas = JSON.parse(results[0].cursos);
    res.json(areas)
  });
})

router.get('/listarMateriaUsuario', (req, res) => {
  const usuarioId = req.query.usuario_id;

  if(!usuarioId) {
    res.status(400).send('ID de usuário é obrigatorio.');
    return;
  }

  // Função do banco para listar as materia do usuário
  const query = `SELECT listarMateriasUsuario(${usuarioId}) AS cursos`;

  connection.query(query, (err, results) => {
    if(err) {
      console.error('Erro ao listar materias do usuário', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    const areas = JSON.parse(results[0].cursos);
    res.json(areas)
  });
})

router.post('/adicionarUsuario', (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha) {
    res.status(400).send('Todos os campos são obrigatórios.');
    return;
  }

  const query = `SELECT adicionarUsuario('${nome}', '${email}', '${senha}') AS novo_id`;

  console.log(query);

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao adicionar usuário:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    // Retorna o ID do usuário recém-cadastrado como resposta
    const novoId = results[0].novo_id;
    res.json({ novoId });
  });
});

router.post('/adicionarArea', (req, res) => {
  const {idUsuario, nomeArea, Cor} = req.body;

  if (!idUsuario || !nomeArea || !Cor) {
    res.status(400).send('Todos os campos são obrigatórios.');
    return;
  }

  const query = `SELECT adicionarArea(${idUsuario}, '${nomeArea}', '${Cor}') AS novo_id`

  console.log(query);

  connection.query(query, (err, result) => {
    if(err) {
      console.log('Erro ao adicioar Area:', err);
      res.status(500).send('Erro interno de servidor');
      return
    }

    const novoId = result[0].novo_id
    res.json({ novoId });
  })
})

router.post('/adicionarMateria', (req, res) => {
  const {IdArea, nomeMateria, materiausuario} = req.body;

  if(!IdArea || !nomeMateria || !materiausuario) {
    res.status(400).send('Todos os campos são obrigatórios.');
    return;
  }

  const query = `SELECT adicionarMateria(${IdArea}, '${nomeMateria}', ${materiausuario}) AS novo_id`

  connection.query(query, (err, result) => {
    if(err) {
      console.log('Erro ao adicioar Materia:', err);
      res.status(500).send('Erro interno de servidor');
      return
    }

    const novoId = result[0].novo_id
    res.json({ novoId });
  })
})

router.get('/verificaUsuario', (req, res) => {
  const { usuario_email, usuario_senha } = req.query;

  // Verifica se os parâmetros necessários foram fornecidos
  if (!usuario_email || !usuario_senha) {
    res.status(400).json({ error: 'O email e a senha são obrigatórios.' });
    return;
  }

  // Chama a função do banco de dados para obter o ID do usuário
  const query = `SELECT obterIdUsuario('${usuario_email}', '${usuario_senha}')`;

  console.log(query);

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao obter ID do usuário:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }

    const usuarioJSON = JSON.parse(Object.values(results[0])[0]);

    console.log(usuarioJSON);
    if (usuarioJSON.error) {
      res.status(404).json({ error: usuarioJSON.error });
      return;
    }
    res.json(usuarioJSON);
  });
});

router.post('/editarUsuario', upload.none(), (req, res) => {
  const { id_aluno, nome, email, senha} = req.body;


  // Cria a query para adicionar o desejo
  const query = `SELECT editarUsuario(${id_aluno}, "${nome}", "${email}", "${senha}") AS novo_id`;

  console.log(query); // Log da query para debug

  // Executa a query no banco de dados
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao editar usuario:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    res.status(200).send('')
  });
});


// Exporte o roteador
module.exports = router;
