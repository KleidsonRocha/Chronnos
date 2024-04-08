const multer = require('multer');
const path = require('path');

// Configuração do destino de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Backend/Images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Configuração do multer
const upload = multer({ storage: storage });

module.exports = upload;
