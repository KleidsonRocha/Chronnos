const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usuariosRoutes = require('./usuarios');
const cursoRoutes = require('./curso');
const app = express();
const desejoRoutes = require('./desejo')


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/Images', (req, res, next) => {
  res.setHeader('Content-Disposition', 'inline');
  next();
}, express.static('C:/Users/Profissional/Documents/Chronnos/Backend/Images'));

app.use('/usuarios', usuariosRoutes);
app.use('/curso', cursoRoutes);
app.use('/desejo', desejoRoutes)

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
