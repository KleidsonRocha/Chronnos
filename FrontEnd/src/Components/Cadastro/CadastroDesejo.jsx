import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';

const CadastroDesejo = () => {
  const { RotaBanco } = useGlobalContext();
  const [idUsuario, setIdUsuario] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [materiasDoUsuario, setMateriasDoUsuario] = useState([]);
  const [nomeCurso, setNomeCurso] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [linkCurso, setLinkCurso] = useState('');

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
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    }
  }, [RotaBanco]);

  const handleAreaChange = event => {
    setSelectedArea(event.target.value);
  };

  const handleMateriaChange = event => {
    setSelectedMateria(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const formData = {
      id_aluno: idUsuario,
      curso_id_area: selectedArea,
      curso_id_materia: selectedMateria,
      nome_curso: nomeCurso,
      modalidade: modalidade,
      linkCurso: linkCurso
    };

    try {
      const response = await fetch(RotaBanco + '/curso/adicionarDesejo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar curso');
      }

      const data = await response.json();
      console.log('Desejo adicionado com sucesso:', data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div>
      <h1>Adicionar novo Curso Desejado:</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome do curso" value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} />
        <input type="text" placeholder="Modalidade" value={modalidade} onChange={e => setModalidade(e.target.value)} />
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
        <input type="text" placeholder="Link do Curso" value={linkCurso} onChange={e => setLinkCurso(e.target.value)} />
        <button type="submit">Adicionar à lista de desejos</button>
      </form>
    </div>
  );
};

export default CadastroDesejo;
