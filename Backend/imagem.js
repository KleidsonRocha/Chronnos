const express = require('express');
const router = express.Router();
const upload = require('./multer');
const connection = require('./connection');

// Rota para lidar com solicitações de imagens
router.get('/:imagemID', (req, res) => {
    const imagemID = req.params.imagemID;
    // Lógica para buscar e enviar a imagem com o ID fornecido
    res.sendFile(`C:/Users/Profissional/Documents/Chronnos/Backend/Images${imagemID}`);
});

module.exports = router;
