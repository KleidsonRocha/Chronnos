import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import Dock from '../dock/Dock';

const CadastroMateria = () => {
  const { RotaBanco } = useGlobalContext();
  const [idUsuario, setIdUsuario] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [Nome, setNome] = useState('');
  const [showPopupSucesso, setShowPopupSucesso] = useState(false)

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    let idUsuarioFromCookie = null;

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === 'usuario') {
        const userData = JSON.parse(decodeURIComponent(cookieValue));
        idUsuarioFromCookie = userData.ID_USUARIO;
        break;
      }
    }

    if (idUsuarioFromCookie !== null) {
      const url = RotaBanco + `/usuarios/listarAreasUsuario?usuario_id=${idUsuarioFromCookie}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar áreas do usuário');
          }
          return response.json();
        })
        .then(data => {
          if (data === null) {
            alert('Você não possui áreas cadastradas. Redirecionando para o cadastro de áreas.');
            window.location.href = '/CadastroArea';
          } else {
            setIdUsuario(idUsuarioFromCookie);
            setAreasDoUsuario(data);
          }
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  }, []);

  const handleAreaChange = event => {
    setSelectedArea(event.target.value);
  };

  const handleSubmit = async (event) => {
    const formData = {
      IdArea: selectedArea,
      nomeMateria: Nome,
      materiausuario: idUsuario
    };

    try {
      const response = await fetch(RotaBanco + '/usuarios/adicionarMateria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.novoId) {
        setShowPopupSucesso(true);
      }

    } catch (error) {
      console.log('novoId não encontrado na resposta');
    }
  };

  function handleClosePopupSucesso() {
    setShowPopupSucesso(false);
    window.location.href = '/Home';
  }

  return (
    <>
      <MainMobile className="main-mob-cent">
        <h1>Cadastro de matéria</h1>
        <select id="area" value={selectedArea} onChange={handleAreaChange}>
          <option value="">Selecione a área</option>
          {areasDoUsuario.map(area => (
            <option key={area.ID_AREA} value={area.ID_AREA}>
              {area.NOME_AREA}
            </option>
          ))}
        </select>
        <ChronnosInput className="input-default" type="text" placeholder="Nome da matéria" value={Nome} onChange={(e) => setNome(e.target.value)}></ChronnosInput>
        <ChronnosButton className="button-default" onClick={handleSubmit} type="submit"> Adicionar matéria</ChronnosButton>
      </MainMobile>
      {showPopupSucesso && (
        <ChronnosPopUp title="Máteria criada com sucesso!" btntxt="Voltar a home" btntype="submit" cmd={{ onClick: handleClosePopupSucesso }}></ChronnosPopUp>
      )}
      <Dock></Dock>
    </>
  );
};

export default CadastroMateria;

