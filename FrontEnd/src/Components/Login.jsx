import React, { useState, useEffect } from 'react';
import ChronnosInput from './inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';
import MainMobile from './layouts/MainMobile/MainMobile';
import '../pages/LoginCadastro/styles.css'
import '../Assets/utility.css';
import { useGlobalContext } from '../App';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [btnLoginClass, setBtnLoginClass] = useState('');
  const { RotaBanco } = useGlobalContext();

  useEffect(() => {
    if(email === '' || senha === '') {
      setBtnLoginClass('button-insatisfaz');
    } else {
      setBtnLoginClass('button-default');
    }    
  }, [email, senha]);

  const handleLogin = async () => {
    try {
      const response = await fetch(RotaBanco + `/usuarios/obterUsuario?usuario_email=${encodeURIComponent(email)}&usuario_senha=${encodeURIComponent(senha)}`);
      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }
      const userData = await response.json();
      if (userData.error) {
        setError(userData.error);
      } else {
        // Armazena os dados do usuário em um cookie de sessão
        document.cookie = `usuario=${JSON.stringify(userData)}`;
        // Redireciona para a página inicial
        window.location.href = '/';
      }
    } catch (error) {
      setError('Usuário ou Senha inválidos! Por Favor tente novamente.');
    }
  };

  return (
    <MainMobile className={"main-mob-cent"}>
      <h1 className="txt-titulo">Seja bem vindo ao Chronnos!</h1>
      {error && <p className="txt-error">{error}</p>}
      <ChronnosInput type="email" id="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="input-default"></ChronnosInput>
      <ChronnosInput type="password" id="senha" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="input-default"></ChronnosInput>
      <ChronnosButton onClick={handleLogin} className={btnLoginClass}>Efetuar o Login</ChronnosButton>
      <p className="txt-footer">Ainda não possui uma conta? Crie <a href="/Cadastro">aqui</a>.</p>
    </MainMobile>
  );
}

export default Login;
