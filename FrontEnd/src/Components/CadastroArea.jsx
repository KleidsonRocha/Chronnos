import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../App';

const CadastroArea = () => {
  const { RotaBanco } = useGlobalContext();
  const [nomeArea, setNomeArea] = useState('');
  const [cor, setCor] = useState('');
  const [idUsuario, setIdUsuario] = useState(null); 

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
    event.preventDefault();


    const formData = {
      idUsuario: idUsuario,
      nomeArea: nomeArea,
      Cor: cor
    };

    try {
      const response = await fetch( RotaBanco +'/usuarios/adicionarArea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar área');
      }

      const data = await response.json();
      console.log('Área cadastrada:', data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div>
      <h1>Adicionar Nova Área</h1>
      <input
        type="text"
        placeholder="Nome da Área"
        value={nomeArea}
        onChange={(e) => setNomeArea(e.target.value)}
      />
      <input
        type="text"
        placeholder="Cor"
        value={cor}
        onChange={(e) => setCor(e.target.value)}
      />
      <button onClick={handleSubmit}>Adicionar Área</button>
    </div>
  );
};

export default CadastroArea;
