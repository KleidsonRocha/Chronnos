import React, { useState, useEffect } from 'react';
import ChronnosInput from './inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';
import MainMobile from './layouts/MainMobile/MainMobile';
import '../pages/LoginCadastro/styles.css'
import '../Assets/utility.css';
import './Login/styles.css';
import backgroundLogin from '../Assets/background-login.mp4';
import { useGlobalContext } from '../App';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [btnLoginClass, setBtnLoginClass] = useState('');
  const { RotaBanco } = useGlobalContext();

  useEffect(() => {
    if (email === '' || senha === '') {
      setBtnLoginClass('button-insatisfaz');
    } else {
      setBtnLoginClass('button-default');
    }
  }, [email, senha]);

  const handleLogin = async () => {
    try {
      const response = await fetch(RotaBanco + `/usuarios/verificaUsuario?usuario_email=${encodeURIComponent(email)}&usuario_senha=${encodeURIComponent(senha)}`);
      if (!response.ok) {
        throw new Error('Erro ao fazer login');
        //pop-up de erro necessário
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
      //pop-up de erro necessário
    }
  };

  return (
    <>
      <MainMobile className="login">
        <div className="anim-troca-cor">
          <h1 className="txt-titulo">Chronnos</h1>
        </div>
        <div className="anim-troca-cor">
          <p className='txt-instrucao'>Sua carteira digital de cursos e certificados.</p>

        </div>
        {error && <p className="txt-error">{error}</p>}
        <ChronnosInput type="email" id="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="input-default"></ChronnosInput>
        <ChronnosInput type="password" id="senha" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="input-default"></ChronnosInput>
        <ChronnosButton onClick={handleLogin} className={btnLoginClass}>Efetuar o login</ChronnosButton>
        <div className="anim-troca-cor">
          <p className="txt-footer">Ainda não possui uma conta?<a href="/Cadastro">Crie aqui</a>.</p>
          <p className='txt-footer'>Quer conhecer mais?<a href="/Sobre">Clique aqui</a>.</p>
        </div>
      </MainMobile>
      <div className="background-animation">
        <video autoPlay muted src={backgroundLogin} type="video/mp4" />
      </div>
    </>
  );
}

export default Login;
