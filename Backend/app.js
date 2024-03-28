// Importe o módulo 'mysql'
const mysql = require('mysql');

// Crie uma conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Soccol_barbieiri_2023',
  database: 'pi_3'
});

// Conecte-se ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados');
});

// Exemplo de consulta
connection.query('SELECT * FROM usuario', (err, rows) => {
  if (err) {
    console.error('Erro ao executar consulta:', err);
    return;
  }
  console.log('Dados da consulta:', rows);
});

// Encerre a conexão após executar as consultas necessárias
connection.end();
