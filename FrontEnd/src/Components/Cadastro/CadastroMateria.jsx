import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';

const CadastroMateria = () => {
  const { RotaBanco } = useGlobalContext();
  const [idUsuario, setIdUsuario] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [Nome, setNome] = useState('');

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
          if(data === null) {
            //COLOCAR POP UP PARA AVISAR QUE NAO POSSUI AREA CADASTRADA

            window.location.href = '/CadastroArea';
          } else {
            setIdUsuario(idUsuarioFromCookie);
            setAreasDoUsuario(data);
            console.log(data);
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
    event.preventDefault();


    const formData = {
      IdArea: selectedArea,
      nomeMateria: Nome,
      materiausuario: idUsuario
    };

    try {
      const response = await fetch( RotaBanco +'/usuarios/adicionarMateria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      //necessário pop-up de cadastro
      
    } catch (error) {
      console.error('Erro:', error);
      //necessário pop-up de erro
    }
  };

  return (
    <div>
      <h1>Adicionar nova Materia:</h1>
      <select id="area" value={selectedArea} onChange={handleAreaChange}>
        <option value="">Selecione a área</option>
        {areasDoUsuario.map(area => (
          <option key={area.ID_AREA} value={area.ID_AREA}>
            {area.NOME_AREA}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Nome"
        value={Nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={handleSubmit}>Adicionar Materia</button>
    </div>
    /*
    USAR O MESMO POP UP JA EXISTENTE
          {showPopup && (
            <div className="popup">
              <p className="txt-titulo">Usuário cadastrado com sucesso!</p>
              <ChronnosButton type="submit" className={"button-default"} onClick={handleClosePopup}>Retornar ao Login</ChronnosButton>
            </div>
          )}
    */
  );
};

export default CadastroMateria;

