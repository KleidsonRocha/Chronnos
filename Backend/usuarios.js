const express = require('express');
const router = express.Router();
const upload = require('./uploadConfig');
const connection = require('./connection');

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

router.post('/excluirUsuario', upload.none(), (req, res) => {
  const { id_aluno } = req.body;

  // Chama a procedure com os parâmetros de entrada e saída
  const query = `
    CALL excluirUsuario(
      ?, 
      @rows_deleted_curso_has_usuario, 
      @rows_deleted_usuario, 
      @rows_deleted_usuario_has_desejo, 
      @rows_deleted_desejo, 
      @rows_deleted_curso, 
      @rows_deleted_area, 
      @rows_deleted_materia
    );
  `;

  // Executa a query no banco de dados
  connection.query(query, [id_aluno], (err) => {
    if (err) {
      console.error('Erro ao excluir usuario:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    // Após a execução da procedure, recupera os resultados dos parâmetros de saída
    const resultQuery = `
      SELECT 
        @rows_deleted_curso_has_usuario AS rows_deleted_curso_has_usuario,
        @rows_deleted_usuario AS rows_deleted_usuario,
        @rows_deleted_usuario_has_desejo AS rows_deleted_usuario_has_desejo,
        @rows_deleted_desejo AS rows_deleted_desejo,
        @rows_deleted_curso AS rows_deleted_curso,
        @rows_deleted_area AS rows_deleted_area,
        @rows_deleted_materia AS rows_deleted_materia;
    `;

    connection.query(resultQuery, (err, results) => {
      if (err) {
        console.error('Erro ao recuperar resultados da exclusão:', err);
        res.status(500).send('Erro ao obter resultados');
        return;
      }

      // Retorna os resultados da exclusão para o frontend
      res.status(200).json(results[0]);
    });
  });
});

router.get('/verificaUsuario', (req, res) => {
  const { usuario_email, usuario_senha } = req.query;

  // Verifica se os parâmetros necessários foram fornecidos
  if (!usuario_email || !usuario_senha) {
    res.status(400).json({ error: 'O email e a senha são obrigatórios.' });
    return;
  }

  // Chama a função do banco de dados para obter o ID do usuário
  const query = `SELECT verificarLogin('${usuario_email}', '${usuario_senha}')`;

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

router.get('/exportarUsuario', (req, res) => {
  const { idUsuario } = req.query;

  // Verifica se os parâmetros necessários foram fornecidos
  if (!idUsuario) {
    res.status(400).json({ error: 'O Id de usuario é obrigatorio' });
    return;
  }

  const query = `SELECT * FROM cursos_completos WHERE CURSO_ID_CURSO IN ( SELECT CURSO_ID_CURSO FROM curso_has_usuario WHERE USUARIO_ID_USUARIO = ${idUsuario});`;


  connection.query(query, (err, results) => {
    if (err) {
      console.error(err); // Log do erro para depuração
      return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
    }
    res.json(results); // Envia os resultados como resposta
  });
});



// Exporte o roteador
module.exports = router;
