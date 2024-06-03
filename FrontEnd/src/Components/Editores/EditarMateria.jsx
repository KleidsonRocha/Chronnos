import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import "../../Assets/utility.css";
import "../../Components/Cadastro/CadastroCurso/styles.css"

const EditarMateria = () => {
  const { RotaBanco } = useGlobalContext();
  const [materia, setMateria] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupEdicao, setShowPopupEdicao] = useState(false);
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
        setMateria(materiaData)
        setSelectedArea(materiaData.MATERIA_AREA)
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

  function preencherFormulario(materia) {
    return (
      <form id="curso-formulario">
        <div className="layout-vertical">
          <div className="holder-dados">
            <p>NOME</p>
            <ChronnosInput
              type="text"
              id="nome"
              value={materia.NOME_MATERIA}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'NOME_MATERIA')}
            />
          </div>

        </div>
      </form>
    );
  }

  function handleInputChange(event, field) {
    const value = event.target.value;
    setMateria(prevState => ({
      ...prevState,
      [field]: value
    }));
  }

  const handleAreaChange = event => {
    setSelectedArea(event.target.value);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowPopupEdicao(false)
    window.location.href = '/Home';
  };

  const salvarAlteracoes = async event => {
    // Criação do formulário para passar como body da requisição do fetch 
    const formData = new FormData();
    formData.append('id_materia', materia.ID_MATERIA);
    formData.append('area', selectedArea);
    formData.append('nome', materia.NOME_MATERIA);

    //fazer rota para o banco para editar materia
    const response = await fetch(RotaBanco + '', {
      method: 'POST',
      body: formData,
    })
    if (response.status == 200) {
      setShowPopupEdicao(true);
    }

  }

  function excluirMateria() {

    //fazer logica de confirmação
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('ID_AREA');

    const url = RotaBanco + `/curso/excluirArea?areaId=${cursoId}`;


    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir area');
        }
        setShowPopup(true);
      })
  }



  return (
    <>
      <MainMobile className="main-mob">
        <h1>Editar um Matéria</h1>
        <div>
          {materia && preencherFormulario(materia)}
        </div>
        <select id="area" value={selectedArea} onChange={handleAreaChange}>
          <option value="">Selecione a nova área</option>
          {areasDoUsuario.map(area => (
            <option key={area.ID_AREA} value={area.ID_AREA}>
              {area.NOME_AREA}
            </option>
          ))}
        </select>
        <ChronnosButton id="editar-curso-btn" onClick={salvarAlteracoes} className="button-default">Salvar as edições</ChronnosButton>
        <ChronnosButton id="editar-curso-btn" onClick={excluirMateria} className="button">Excluir</ChronnosButton>
      </MainMobile>
      {showPopup && (
        <ChronnosPopUp title="Área excluido com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
      )}
      {showPopupEdicao && (
        <ChronnosPopUp title="Área editado com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
      )}
    </>
  );
};

export default EditarMateria;
