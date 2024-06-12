import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosTitleInput from '../inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import "../../Assets/utility.css";
import "../../Components/Cadastro/CadastroCurso/styles.css"
import Dock from '../dock/Dock';

const EditarMateria = () => {
  const { RotaBanco } = useGlobalContext();
  const [materia, setMateria] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupEdicao, setShowPopupEdicao] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const desejoid = urlParams.get('ID_MATERIA');

    const url = RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${desejoid}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter os detalhes da matéria');
        }
        return response.json();
      })
      .then(materiaData => {
        setMateria(materiaData);
        setSelectedArea(materiaData.MATERIA_AREA);
      });

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

    const usuarioData = getUsuarioIdFromCookie();
    setUserData(usuarioData);

    if (usuarioData) {
      const urlArea = RotaBanco + `/usuarios/listarAreasUsuario?usuario_id=${usuarioData.ID_USUARIO}`;
      fetch(urlArea)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar áreas do usuário');
          }
          return response.json();
        })
        .then(data => {
          if (!data || data.length === 0) {
            console.log(data);
            alert('Você não possui áreas cadastradas. Redirecionando para o cadastro de áreas.');
          } else {
            setAreasDoUsuario(data);
          }
        });
    }
  }, [RotaBanco]);

  function handleChange(event, field) {
    const value = event.target.value;
  
    if (field === 'MATERIA_AREA') {
      setSelectedArea(value);
    }
  
    setMateria(prevState => ({
      ...prevState,
      [field]: value
    }));
  }

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowPopupEdicao(false);
    window.location.href = '/Home';
  };

  function showDeleteConfirmation() {
    setShowConfirmation(true);
  }

  function confirmarDelete(confirmacao) {
    if (confirmacao) {
      const urlParams = new URLSearchParams(window.location.search);
      const materiaId = urlParams.get('ID_MATERIA');

      const url = RotaBanco + `/curso/excluirMateria?materiaId=${materiaId}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao excluir área');
          }
          setShowPopup(true);
        });
    }
    setShowConfirmation(false);
  }

  function preencherFormulario(materia) {
    return (
      <form id="curso-formulario">
        <div className="layout-vertical">
          <div className="holder-dados">
            <ChronnosInput
              type="text"
              id="nome"
              value={materia.NOME_MATERIA}
              className="input-default"
              onChange={(e) => handleChange(e, 'NOME_MATERIA')}
            />
          </div>
          <select id="area" value={selectedArea} onChange={(e) => handleChange(e, 'MATERIA_AREA')}>
            <option value="">Selecione a nova área</option>
            {areasDoUsuario.map(area => (
              <option key={area.ID_AREA} value={area.ID_AREA}>
                {area.NOME_AREA}
              </option>
            ))}
          </select>
        </div>
      </form>
    );
  }

  const salvarAlteracoes = async event => {
    const formData = new FormData();
    formData.append('materia_id', materia.ID_MATERIA);
    formData.append('area_id', selectedArea);
    formData.append('nome', materia.NOME_MATERIA);
    formData.append('usuario_id', userData.ID_USUARIO);

    console.log(materia);
    // fazer rota para o banco para editar materia
    const response = await fetch(RotaBanco + '/curso/editarMateria', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      setShowPopupEdicao(true);
    }
  };

  return (
    <>
      <MainMobile className="form-mob-cent">
        <h1>Editar um Matéria</h1>
        <div>
          {materia && preencherFormulario(materia)}
        </div>
        <ChronnosButton id="editar-curso-btn" onClick={salvarAlteracoes} className="button-default">Salvar as edições</ChronnosButton>
        <ChronnosTitleInput title="Remover a matéria" format="delete" type="button" icon="rem-curso" cmd={{ onClick: showDeleteConfirmation }} />
      </MainMobile>
      {showPopup && (
        <ChronnosPopUp title="Área excluida com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
      )}
      {showPopupEdicao && (
        <ChronnosPopUp title="Área editada com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
      )}
      {showConfirmation && (
        <>
          <ChronnosPopUp btntxt="teste" title="teste" double="true" btntype1="button" btntxt1="botao1" cmd1={{}} btntype2="button" btntxt2="botao2" cmd2={{}}></ChronnosPopUp>
          <div className="popup">
            <h2>Tem certeza que deseja excluir esta área?</h2>
            <div className="holder-double-button">
              <ChronnosButton id="editar-curso-btn" onClick={() => confirmarDelete(true)} className="button-perigo">Sim</ChronnosButton>
              <ChronnosButton id="editar-curso-btn" onClick={() => confirmarDelete(false)} className="button-default">Não</ChronnosButton>
            </div>
          </div>
        </>
      )}
      <Dock />
    </>
  );
};

export default EditarMateria;
