const express = require('express');
const router = express.Router();
const upload = require('./uploadConfig'); // Importa a configuração do multer
const connection = require('./connection');

router.get('/listarDesejoEspecifico', (req, res) => {
  const desejoId = req.query.desejoId;

  if (!desejoId) {
    res.status(400).send('ID do curso é obrigatório.');
    return;
  }

  const query = `SELECT listarDesejoEspecifico(${desejoId}) AS desejo`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao listar desejo específico:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    const desejo = JSON.parse(results[0].desejo);
    res.json(desejo);
  });
});

router.post('/editarDesejo', upload.none(), (req, res) => {
  const { id_desejo, id_usuario, nome, modalidade, id_area, id_materia, link} = req.body;


  const query = `SELECT editarDesejo(${id_desejo}, ${id_usuario}, "${nome}", "${modalidade}", ${id_area}, ${id_materia}, "${link}") AS novo_id`;

  console.log(query);

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao editar desejo:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    res.status(200).send('')
  });
});

router.get('/excluirDesejo', (req, res) => {
  const desejoId = req.query.desejoId;

  if (!desejoId) {
    res.status(400).send('ID do curso é obrigatório.');
    return;
  }
  
  const query = `SELECT excluirDesejo(${desejoId}) AS desejo`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao excluir desejo específico:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    const desejo = JSON.parse(results[0].desejo);
    res.json(desejo);
  });
});

module.exports = router;