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
  const [cursos, setCursos] = useState([]);
  const { RotaBanco } = useGlobalContext();
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupSenha, setShowPopupSenha] = useState(false);
  const [showPopupSucesso, setShowPopupSucesso] = useState(false)
  const [showPopupExcluir, setshowPopupExcluir] = useState(false);

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

    const fetchCursosDoUsuario = async () => {
      try {
        const usuario = getUsuarioIdFromCookie();
        setUserData(usuario);

        if (!usuario) {
          window.location.href = '/Login';
          throw new Error('ID do usuário não encontrado no cookie');
        }

        const response = await fetch(RotaBanco + `/usuarios/listarCursosDoUsuario?usuario_id=${usuario.ID_USUARIO}`);

        if (!response.ok) {
          throw new Error('Erro ao obter os cursos do usuário');
        }

        const cursos = await response.json();

        // Promessas para obter detalhes da área de cada curso
        const areasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => ({ ...curso, AREA_NOME: 'Erro ao obter detalhes da área', AREA_COR: 'Erro' }))
        );

        // Promessas para obter detalhes da matéria de cada curso
        const materiasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${curso.MATERIA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da matéria'))
            .then(materiaData => ({ ...curso, MATERIA_NOME: materiaData.NOME_MATERIA }))
            .catch(error => ({ ...curso, MATERIA_NOME: 'Erro ao obter detalhes da matéria' }))
        );

        const pagamentoPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarPagamentoEspecifico?pagamentoId=${curso.PAGAMENTO}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes do pagamento'))
            .then(pagamentoData => {
              const pagamento = JSON.parse(pagamentoData[0].pagamento);
              return { ...curso, PAGAMENTO_NOME: pagamento.TIPO };
            })
            .catch(error => ({ ...curso, PAGAMENTO_NOME: 'Erro ao obter detalhes de pagamento' }))
        );

        // Esperar todas as promessas de área, matéria e pagamento serem resolvidas ou rejeitadas
        const areasResultados = await Promise.allSettled(areasPromises);
        const materiasResultados = await Promise.allSettled(materiasPromises);
        const pagamentoResultados = await Promise.allSettled(pagamentoPromises);

        // Consolidar os resultados
        const cursosCompleto = cursos.map((curso, index) => ({
          ...curso,
          AREA_NOME: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_NOME : areasResultados[index].reason,
          AREA_COR: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_COR : 'Erro',
          MATERIA_NOME: materiasResultados[index].status === 'fulfilled' ? materiasResultados[index].value.MATERIA_NOME : materiasResultados[index].reason,
          PAGAMENTO_NOME: pagamentoResultados[index].status === 'fulfilled' ? pagamentoResultados[index].value.PAGAMENTO_NOME : pagamentoResultados[index].reason,
        }));

        setCursos(cursosCompleto);
      } catch (error) {
        console.error('Erro:', error);
        //pop-up de erro necessário
      }
    };

    fetchCursosDoUsuario();
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

  const handleCock = () => {
    alert('Button clicked!');
  };
  

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
        <ChronnosTitleInput title="Apagar a conta" icon="arrow-red" format="delete" type="button" cmd={{ onClick: ExcluirConta }}
      />
      </MainMobile>
      {showPopup && (
        <ChronnosPopUp title="Senha digitada difere da atual" btntxt="Retornar" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
      )}
      {showPopupSenha && (
        <ChronnosPopUp title="Senhas novas não conferem" btntxt="Retornar" btntype="submit" cmd={{ onClick: handleClosePopupSenha }}></ChronnosPopUp>
      )}
      {showPopupSucesso && (
        <ChronnosPopUp title="Ajustes realizados com sucesso!" btntxt="OK" btntype="submit" cmd={{ onClick: handleClosePopupSucesso }}></ChronnosPopUp>
      )}
      {showPopupExcluir && (
        <ChronnosPopUp title="Tem certeza que deseja excluir a conta" btntxt="Sim" btntype="submit" cmd={{ onClick: handleClosePopupExcluir }}></ChronnosPopUp>
      )}
      <Dock />
    </>
  );
};

export default Ajustes;
