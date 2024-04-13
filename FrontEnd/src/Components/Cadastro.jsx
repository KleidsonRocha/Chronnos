import React, { useState } from 'react';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);

    fetch('http://localhost:3000/usuarios/cadastrarUsuario', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Usuário cadastrado:', data);
        // Faça algo após o sucesso, como redirecionar ou exibir uma mensagem
      })
      .catch((error) => {
        console.error('Erro:', error);
        // Faça algo para lidar com o erro, como exibir uma mensagem de erro
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome:</label>
      <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required /><br />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
      <label htmlFor="senha">Senha:</label>
      <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required /><br />
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroUsuario;
