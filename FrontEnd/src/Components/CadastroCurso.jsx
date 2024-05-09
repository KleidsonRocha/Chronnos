import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../App';

const CadastroMateria = () => {
  const { RotaBanco } = useGlobalContext();
  const [idUsuario, setIdUsuario] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [materiasDoUsuario, setMateriasDoUsuario] = useState([]);
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
      const urlAreas = RotaBanco + `/usuarios/listarAreasUsuario?usuario_id=${idUsuarioFromCookie}`;
      const urlMateria = RotaBanco + `/usuarios/listarMateriaUsuario?usuario_id=${idUsuarioFromCookie}`;

      fetch(urlAreas)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar áreas do usuário');
          }
          return response.json();
        })
        .then(data => {
          setIdUsuario(idUsuarioFromCookie);
          setAreasDoUsuario(data);
          console.log(data);
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
      fetch(urlMateria)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar matérias do usuário');
          }
          return response.json();
        })
        .then(data => {
          setIdUsuario(idUsuarioFromCookie);
          setMateriasDoUsuario(data);
          console.log(data);
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  }, []);

  const handleAreaChange = event => {
    setSelectedArea(event.target.value);
  };

  const handleMateriaChange = event => {
    setSelectedMateria(event.target.value); // Alteração aqui
  };


  const handleSubmit = async (event) => {
    event.preventDefault();


    const formData = {
      materiausuario: idUsuario,
      IdArea: selectedArea,
      IdMateria: selectedMateria
    };

    try {
     console.log("area:" + selectedArea);
     console.log("materia:" + selectedMateria);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div>
      <h1>Adicionar novo Curso:</h1>
      <select id="area" value={selectedArea} onChange={handleAreaChange}>
        <option value="">Selecione a área</option>
        {areasDoUsuario.map(area => (
          <option key={area.ID_AREA} value={area.ID_AREA}>
            {area.NOME_AREA}
          </option>
        ))}
      </select>
      <select id="materia" value={selectedMateria} onChange={handleMateriaChange}>
        <option value="">Selecione a matéria</option>
        {materiasDoUsuario.map(materia => (
          <option key={materia.ID_MATERIA} value={materia.ID_MATERIA}>
            {materia.NOME_MATERIA}
          </option>
        ))}
      </select>
      { /*
      -- VALUES (nome_curso, modalidade, anotacoes, valor, curso_id_area(selectedArea), curso_id_materia(selectedMateria), curso_id_pagamento, data_ini, data_fini, duracao, media,usuario_id(idUsuario), foto);
      */ }
      <button onClick={handleSubmit}>Adicionar Matéria</button>
    </div>
  );
};

export default CadastroMateria;
