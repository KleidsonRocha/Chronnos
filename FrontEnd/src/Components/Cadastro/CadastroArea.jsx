import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';

const CadastroArea = () => {
  const { RotaBanco } = useGlobalContext();
  const [nomeArea, setNomeArea] = useState('');
  const [cor, setCor] = useState('');
  const [idUsuario, setIdUsuario] = useState(null);
  const [showPopupSucesso, setShowPopupSucesso] = useState(false)

  // Efeito para obter o ID do usuário do cookie quando o componente é montado
  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === 'usuario') {
        const userData = JSON.parse(decodeURIComponent(cookieValue));
        setIdUsuario(userData.ID_USUARIO);
        break;
      }
    }
  }, []);

  const handleSubmit = async (event) => {
    const formData = {
      idUsuario: idUsuario,
      nomeArea: nomeArea,
      Cor: cor
    };

    try {
      const response = await fetch(RotaBanco + '/usuarios/adicionarArea', {
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

  const cores = [
    { nome: 'Azul Neptuno', hex: '#0B2943' },
    { nome: 'Céu Mercúrio', hex: '#0091C4' },
    { nome: 'Ciano Júpiter', hex: '#67B2B5' },
    { nome: 'Vinho Baco', hex: '#7A3889' },
    { nome: 'Pêssego Juno', hex: '#F5ADC3' },
    { nome: 'Laranja Vulcano', hex: '#FB5E06' },
    { nome: 'Girassol Diana', hex: '#EA963C' },
    { nome: 'Amarelo Minerva', hex: '#F0C300' },
    { nome: 'Magenta Vénus', hex: '#F11867' },
    { nome: 'Musgo Marte', hex: '#6F8E82' },
    { nome: 'Limão Febo', hex: '#8CA252' },
    { nome: 'Erva Ceres', hex: '#57522D' },
  ];

  const corFeedback = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([30, 50, 15]);
    }
  };

  return (
    <>
      <MainMobile className="form-mob-cent">
        <h1>Cadastro de área</h1>
        <ChronnosInput className="input-default" type="text" placeholder="Nome da Área" value={nomeArea} onChange={(e) => setNomeArea(e.target.value)}></ChronnosInput>
        <div>
          <p style={{ marginBottom: '0.25rem' }}>Selecione uma cor</p>
          <div className="no-scrollbar" style={{ display: 'flex', direction: 'row', width: '100%', overflowY: 'scroll', gap: '0.5rem', borderRadius: '1rem' }}>
            {cores.map((cor, index) => (<button style={{ backgroundColor: cor.hex }} className="button-color-picker" key={index} onClick={() => { setCor(cor.hex); corFeedback(); }}>{cor.nome}</button>))}
          </div>
        </div>
        <ChronnosButton className="button-default" onClick={handleSubmit}>Adicionar Área</ChronnosButton>
      </MainMobile>
      {showPopupSucesso && (
        <ChronnosPopUp title="Área criada com sucesso!" btntxt="Voltar a home" btntype="submit" cmd={{ onClick: handleClosePopupSucesso }}></ChronnosPopUp>
      )}
    </>
  );
};

export default CadastroArea;
