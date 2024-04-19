const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usuariosRoutes = require('./usuarios');
const cursoRoutes = require('./curso');
const imagemRoutes = require('./imagem');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/Foto', imagemRoutes)
app.use('/usuarios', usuariosRoutes);
app.use('/curso', cursoRoutes);

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
