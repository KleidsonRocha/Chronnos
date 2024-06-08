import React, { useEffect, useState } from 'react';
import MainMobile from './layouts/MainMobile/MainMobile';
import Dock from './dock/Dock';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from './inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosPopUp from '../Components/ChronnosPopUp/ChronnosPopUp';
import "../Assets/utility.css";

const Ajustes = () => {
  const { RotaBanco } = useGlobalContext();
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupSenha, setShowPopupSenha] = useState(false);
  const [showPopupSucesso, setShowPopupSucesso] = useState(false)
  const [showPopupExcluir, setshowPopupExcluir] = useState(false);
  const [showPopupSair, setshowPopupSair] = useState(false);


  useEffect(() => {
    const getUsuarioIdFromCookie = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split(';');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        const trimmedName = cookieName.trim();
        if (trimmedName === 'usuario') {
          const usuarioString = cookieValue.replace(/[()]/g, '');
          const usuarioObjeto = JSON.parse(usuarioString);
          return usuarioObjeto;

        }
      }
      return null;
    };
    setUserData(getUsuarioIdFromCookie());

  }, []);


  function handleClosePopup() {
    setShowPopup(false);
  }

  function handleClosePopupSenha() {
    setShowPopupSenha(false);
  }

  function handleClosePopupSucesso() {
    setShowPopupSenha(false);
    window.location.href = '/Ajustes';
  }

  function handleClosePopupSair() {
    setshowPopupSair(false);
    window.location.href = '/Login';
  }

  const handleClosePopupExcluir = async event => {
    const formData = new FormData();
    formData.append('id_aluno', userData.ID_USUARIO);
    setshowPopupExcluir(false);

    const response = await fetch(RotaBanco + '/usuarios/excluirUsuario', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      // Excluir todos os cookies de sessão
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // Redirecionar para a página de login
      window.location.href = "/Login";
    }
  };

  function ExcluirConta() {
    setshowPopupExcluir(true);
  }

  const EditarConta = async event => {
    let nome = document.getElementById('Nome').value;
    let email = document.getElementById('Email').value;
    let SenhaAtual = document.getElementById('SenhaAtual').value;
    let SenhaNova = document.getElementById('SenhaNova').value;
    let SenhaNova2 = document.getElementById('SenhaNovaIgual').value;

    if (userData.SENHA !== SenhaAtual) {
      setShowPopup(true);
    } else if (SenhaNova !== SenhaNova2) {
      setShowPopupSenha(true);
    } else {
      if (nome === "") {
        nome = userData.NOME;
      }
      if (email === "") {
        email = userData.EMAIL;
      }

      const formData = new FormData();
      formData.append('id_aluno', userData.ID_USUARIO);
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('senha', SenhaNova);


      const response = await fetch(RotaBanco + '/usuarios/editarUsuario', {
        method: 'POST',
        body: formData,
      })
      if (response.status == 200) {
        document.cookie = `usuario=${JSON.stringify({ NOME: nome, EMAIL: email, SENHA: SenhaNova, ID_USUARIO: userData.ID_USUARIO })}; path=/;`;
        setShowPopupSucesso(true);
      }

    }
  }
  
  function DeslogarConta() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var nomeCookie = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = nomeCookie + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"; 
    }
    setshowPopupSair(true)
  }


  return (
    <>
      <MainMobile className="form-mob">
        <ChronnosTitleInput title="Ajustes" format="bold" />
        {userData && (
          <div className="layout-vertical">
            <div className="holder-dados">
              <p>Nome</p>
              <ChronnosInput id="Nome" className="input-default" placeholder={`${userData.NOME}`} />
            </div>
            <div className="holder-dados">
              <p>E-mail</p>
              <ChronnosInput id="Email" className="input-default" placeholder={`${userData.EMAIL}`} />
            </div>
          </div>
        )}
        <div className="holder-dados">
          <p>Alterar a senha</p>
          <ChronnosInput id="SenhaAtual" className="input-default" placeholder="Digite aqui a sua senha atual" />
        </div>
        <ChronnosInput id="SenhaNova" className="input-default" placeholder="Digite aqui a sua senha nova" />
        <ChronnosInput id="SenhaNovaIgual" className="input-default" placeholder="Confirme aqui a sua senha nova" />
        <ChronnosButton className="button-default" onClick={EditarConta}>Confirmar as mudanças</ChronnosButton>
        <ChronnosTitleInput title="Sair da sessão atual" icon="logout" format="delete" type="button" cmd={{ onClick:  DeslogarConta}} />
        <ChronnosTitleInput title="Apagar a conta" icon="rem-conta" format="delete" type="button" cmd={{ onClick: ExcluirConta }} />
      </MainMobile>
      {showPopup && (
        <ChronnosPopUp title="Senha digitada difere da atual" btntxt="Retornar" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
      )}
      {showPopupSenha && (
        <ChronnosPopUp title="Senhas novas não conferem" btntxt="Retornar" btntype="submit" cmd={{ onClick: handleClosePopupSenha }} close={handleClosePopupSenha}></ChronnosPopUp>
      )}
      {showPopupSucesso && (
        <ChronnosPopUp title="Ajustes realizados com sucesso!" btntxt="OK" btntype="submit" cmd={{ onClick: handleClosePopupSucesso }} close={handleClosePopupSucesso}></ChronnosPopUp>
      )}
      {showPopupExcluir && (
        <ChronnosPopUp title="Tem certeza que deseja excluir a conta" btntxt="Sim" btntype="submit" cmd={{ onClick: handleClosePopupExcluir }} close={handleClosePopupExcluir}></ChronnosPopUp>
      )}
      {showPopupSair && (
        <ChronnosPopUp title="Tem certeza que deseja sair da conta?" btntxt="Sim" btntype="submit" cmd={{ onClick: handleClosePopupSair}} close={handleClosePopupSair}></ChronnosPopUp>
      )}
      <Dock />
    </>
  );
};

export default Ajustes;
