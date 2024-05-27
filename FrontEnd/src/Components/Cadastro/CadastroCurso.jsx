import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';

const CadastroCurso = () => {
  const { RotaBanco } = useGlobalContext();
  const [idUsuario, setIdUsuario] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [materiasDoUsuario, setMateriasDoUsuario] = useState([]);
  const [nomeCurso, setNomeCurso] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [anotacoes, setAnotacoes] = useState('');
  const [valor, setValor] = useState('');
  const [cursoIdPagamento, setCursoIdPagamento] = useState('');
  const [dataIni, setDataIni] = useState('');
  const [dataFini, setDataFini] = useState('');
  const [duracao, setDuracao] = useState('');
  const [media, setMedia] = useState('');
  const [foto, setFoto] = useState(null);

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
      const urlAreas = `${RotaBanco}/usuarios/listarAreasUsuario?usuario_id=${idUsuarioFromCookie}`;
      const urlMateria = `${RotaBanco}/usuarios/listarMateriaUsuario?usuario_id=${idUsuarioFromCookie}`;

      fetch(urlAreas)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar áreas do usuário');
          }
          return response.json();
        })
        .then(data => {
          setIdUsuario(idUsuarioFromCookie);
          if (!data || data.length === 0) {
            alert('Você não possui áreas cadastradas. Redirecionando para o cadastro de áreas.');
            window.location.href = '/CadastroArea';
          } else {
            setAreasDoUsuario(data);
          }
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });

      fetch(urlMateria)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar matérias do usuário');

          }
          window
          return response.json();
        })
        .then(data => {
          setIdUsuario(idUsuarioFromCookie);
          setMateriasDoUsuario(data);
          if (!data || data.length === 0) {
            alert('Você não possui matérias cadastradas. Redirecionando para o cadastro de matérias.');
            window.location.href = '/CadastroMateria';
          } else {
            setMateriasDoUsuario(data);
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

  const handleMateriaChange = event => {
    setSelectedMateria(event.target.value);
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      setFoto(file);
    }
  };

  const handleSubmit = async event => {

    const formData = new FormData();
    formData.append('id_aluno', idUsuario);
    formData.append('curso_id_area', selectedArea);
    formData.append('curso_id_materia', selectedMateria);
    formData.append('nome_curso', nomeCurso);
    formData.append('modalidade', modalidade);
    formData.append('anotacoes', anotacoes);
    formData.append('valor', valor);
    formData.append('curso_id_pagamento', cursoIdPagamento);
    formData.append('data_ini', dataIni);
    formData.append('data_fini', dataFini);
    formData.append('duracao', duracao);
    formData.append('media', media);
    if (foto) {
      formData.append('certificado', foto);
    }

    try {
      const response = await fetch(`${RotaBanco}/curso/adicionarCurso`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar curso');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <MainMobile className="main-mob">
      <h1>Registrar um curso</h1>
      <form onSubmit={handleSubmit} className="layout-vertical">
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
        <select value={cursoIdPagamento} onChange={e => setCursoIdPagamento(e.target.value)}>
          <option value="">Selecione o ID de pagamento</option>
          <option value="3">Pix</option>
        </select>
        <ChronnosInput className="input-default" type="text" placeholder="Nome do curso" value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} ></ChronnosInput>
        <ChronnosInput className="input-default" type="text" placeholder="Modalidade" value={modalidade} onChange={e => setModalidade(e.target.value)} ></ChronnosInput>
        <ChronnosInput className="input-default" type="text" placeholder="Anotações" value={anotacoes} onChange={e => setAnotacoes(e.target.value)} ></ChronnosInput>
        <ChronnosInput className="input-default" type="text" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} ></ChronnosInput>
        <input type="date" placeholder="Data de início" value={dataIni} onChange={e => setDataIni(e.target.value)} />
        <input type="date" placeholder="Data de término" value={dataFini} onChange={e => setDataFini(e.target.value)} />
        <ChronnosInput className="input-default" type="text" placeholder="Duração" value={duracao} onChange={e => setDuracao(e.target.value)} ></ChronnosInput>
        <input type="text" placeholder="Média" value={media} onChange={e => setMedia(e.target.value)} />
        <input id="imagem" name="imagem" type="file" onChange={handleFileChange} />
        <ChronnosButton className="button-default" onClick={handleSubmit}>Registrar curso</ChronnosButton>
      </form>
    </MainMobile>
  );
};

export default CadastroCurso;
