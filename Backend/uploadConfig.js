// uploadConfig.js
const multer = require('multer');
const path = require('path');

// Configuração do destino de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images/');
  },
  filename: function (req, file, cb) {
    // Adicionar .pdf ao final do nome original do arquivo
    const originalName = file.originalname // Remove a extensão original
    cb(null, `${originalName}`);
  }
});

// Configuração do multer
const upload = multer({ storage: storage });

module.exports = upload;
