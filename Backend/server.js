const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./usuarios');

const app = express();

// Habilitar CORS para todas as rotas
app.use(cors());

//Roteador para lidar com as rotas relacionadas aos usuários
app.use('/usuarios', usuariosRoutes);


// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
