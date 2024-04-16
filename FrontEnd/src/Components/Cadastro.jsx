import React, { useState } from 'react';
import ChronnosInput from './inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';
import MainMobile from './layouts/MainMobile/MainMobile';
import '../pages/LoginCadastro/styles.css'
import '../Assets/utility.css';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      nome: nome,
      email: email,
      senha: senha
    };

    fetch('http://localhost:3000/usuarios/adicionarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Usuário cadastrado:', data);
        // Faça algo após o sucesso, como redirecionar ou exibir uma mensagem
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
  };

  return (
    <MainMobile className="main-mob-cent">
      <p className="txt-instrucao">CRIAÇÃO DA CONTA</p>
      <h1 className="txt-titulo">Insira seus dados</h1>
      <form onSubmit={handleSubmit}>
        <ChronnosInput type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required className="input-default" /><br />
        <ChronnosInput type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-default" /><br />
        <ChronnosInput type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required className="input-default" /><br />
        <ChronnosButton type="submit" className={"button-default"}>Criar conta</ChronnosButton>
      </form>
    </MainMobile>
  );
}

export default CadastroUsuario;
