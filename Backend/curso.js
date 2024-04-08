const express = require('express');
const router = express.Router();
const multer = require('multer'); // Importe o multer corretamente

// Configure o multer para definir a pasta de destino para o upload de arquivos
const upload = multer({ dest: './Images' });

const connection = require('./connection');


router.get('/listarCursoEspecifico', (req, res) => {
  const cursoId = req.query.cursoId;

  // Verifica se o parâmetro cursoId foi fornecido
  if (!cursoId) {
    res.status(400).send('ID do curso é obrigatório.');
    return;
  }

  // Chama a função do banco de dados para listar o curso específico
  const query = `SELECT listarCursoEspecifico(${cursoId}) AS curso`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao listar curso específico:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    // Retorna os dados do curso específico como resposta
    const curso = JSON.parse(results[0].curso); // Convertendo para objeto JavaScript
    res.json(curso);
  });
});


router.get('/editarCurso', upload.single('imagem'), (req, res) => {
  const { cursoId, nome, modalidade, anotacoes, valor, cursoIdArea, cursoIdMateria, cursoIdPagamento, dataIni, dataFini, duracao, media } = req.query;

  // Verificar se todos os parâmetros necessários foram fornecidos
  const parametrosFaltantes = [];
  if (!cursoId) parametrosFaltantes.push('cursoId');
  if (!nome) parametrosFaltantes.push('nome');
  if (!modalidade) parametrosFaltantes.push('modalidade');
  if (!anotacoes) parametrosFaltantes.push('anotacoes');
  if (!valor) parametrosFaltantes.push('valor');
  if (!cursoIdArea) parametrosFaltantes.push('cursoIdArea');
  if (!cursoIdMateria) parametrosFaltantes.push('cursoIdMateria');
  if (!cursoIdPagamento) parametrosFaltantes.push('cursoIdPagamento');
  if (!dataIni) parametrosFaltantes.push('dataIni');
  if (!dataFini) parametrosFaltantes.push('dataFini');
  if (!duracao) parametrosFaltantes.push('duracao');
  if (!media) parametrosFaltantes.push('media');

  // Se houver parâmetros faltando, retorna um erro
  if (parametrosFaltantes.length > 0) {
    res.status(400).json({ error: `Os seguintes parâmetros são obrigatórios: ${parametrosFaltantes.join(', ')}` });
    return;
  }

  let imagemNome = ''; 
  if (req.file) {
    imagemNome = req.file.filename; 
    // Faça o que for necessário com o nome da imagem, como salvá-lo no banco de dados
  }

 
  const query = `CALL editarCurso(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Executar a consulta SQL
  connection.query(query, [cursoId, nome, modalidade, anotacoes, valor, cursoIdArea, cursoIdMateria, cursoIdPagamento, dataIni, dataFini, duracao, media, NomeImg], (err, results) => {
    if (err) {
      console.error('Erro ao editar curso:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    // Verificar se o curso foi editado com sucesso
    if (results.affectedRows > 0) {
      // Retorna o ID do curso editado como resposta
      res.json({ cursoId: cursoId });
    } else {
      res.status(404).json({ error: 'Curso não encontrado ou não foi possível editar.' });
    }
  });
});






module.exports = router;