const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Importe o body-parser

const usuariosRoutes = require('./usuarios');
const cursoRoutes = require('./curso');

const app = express();

// Habilitar CORS para todas as rotas
app.use(cors());

// Middleware para fazer o parsing do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Roteador para lidar com as rotas relacionadas aos usuários
app.use('/usuarios', usuariosRoutes);
app.use('/curso', cursoRoutes);

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
