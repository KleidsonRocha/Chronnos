const express = require('express');
const router = express.Router();
const upload = require('./uploadConfig'); // Importa a configuração do multer
const connection = require('./connection');

router.get('/listarCursoEspecifico', (req, res) => {
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



module.exports = router;