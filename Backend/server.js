const express = require('express');
const usuariosRoutes = require('./usuarios');

const app = express();

//Roteador para lidar com as rotas relacionadas aos usuários
app.use('/usuarios', usuariosRoutes);

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
