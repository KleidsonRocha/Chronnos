import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import "./CadastroCurso/styles.css";
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import Dock from '../dock/Dock';
import InputMask from 'react-input-mask'; // Importação da biblioteca

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
  const [showPopupSucesso, setShowPopupSucesso] = useState(false)
  const [showPopupArea, setshowPopupArea] = useState(false)
  const [showPopupMateria, setshowPopupMateria] = useState(false)
  const [nomeArq, setNomeArq] = useState('');

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
            setshowPopupArea(true);
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
          return response.json();
        })
        .then(data => {
          if (!showPopupArea) {
            setMateriasDoUsuario(data);
            if (!data || data.length === 0) {
              setshowPopupMateria(true);
            }
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
      setNomeArq(file.name);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault()
    let partes = duracao.split(':');
    let resultado = partes.join('');

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
    formData.append('duracao', resultado);
    formData.append('media', media);
    if (foto) {
      formData.append('certificado', foto);
    }

    try {
      const response = await fetch(`${RotaBanco}/curso/adicionarCurso`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowPopupSucesso(true);
      }
    } catch (error) {
      console.log('Erro ao adicionar curso');
    }
  };

  function handleClosePopupSucesso() {
    setShowPopupSucesso(false);
    window.location.href = '/Home';
  }

  function handleClosePopupArea() {
    window.location.href = "/CadastroArea";
    setshowPopupArea(false);
  }

  function handleClosePopupMateria() {
    window.location.href = "/CadastroMateria";
    setshowPopupArea(false);
  }

  function handleClosePopupSucessoClose() {
    setShowPopupSucesso(false);
  }

  function handleClosePopupAreaClose() {
    window.location.href = "/CadastroArea";
  }

  function handleClosePopupMateriaClose() {
    window.location.href = "/CadastroMateria";
  }

  return (
    <>
      <MainMobile className="form-mob">
        <h1>Registrar um curso</h1>
        <form onSubmit={handleSubmit} className="layout-vertical">
          <ChronnosInput className="input-default" type="text" placeholder="Nome do curso" value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} ></ChronnosInput>
          <select id="area" value={selectedArea} onChange={handleAreaChange}>
            <option value="">Selecione a área</option>
            {areasDoUsuario && areasDoUsuario.map(area => (
              <option key={area.ID_AREA} value={area.ID_AREA}>
                {area.NOME_AREA}
              </option>
            ))}
          </select>
          <select id="materia" value={selectedMateria} onChange={handleMateriaChange}>
            <option value="">Selecione a matéria</option>
            {materiasDoUsuario && materiasDoUsuario.map(materia => (
              <option key={materia.ID_MATERIA} value={materia.ID_MATERIA}>
                {materia.NOME_MATERIA}
              </option>
            ))}
          </select>
          <select value={cursoIdPagamento} onChange={e => setCursoIdPagamento(e.target.value)}>
            <option value="">Selecione a forma de pagamento</option>
            <option value="3">Pix</option>
            <option value="4">Cartão de Credito</option>
            <option value="6">Cartão de Débito</option>
            <option value="5">Boleto</option>
            <option value="7">Dinheiro</option>
            <option value="8">Grátis</option>
          </select>
          <ChronnosInput className="input-default" type="number" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} ></ChronnosInput>
          <ChronnosInput className="input-default" type="text" placeholder="Modalidade" value={modalidade} onChange={e => setModalidade(e.target.value)} ></ChronnosInput>
          <ChronnosInput className="input-default" type="number" placeholder="Média" value={media} onChange={e => setMedia(e.target.value)} ></ChronnosInput>
          <ChronnosInput className="input-default" type="text" placeholder="Anotações" value={anotacoes} onChange={e => setAnotacoes(e.target.value)} ></ChronnosInput>
          <div className="holder-pickers">
            <div>
              <p>Início do curso</p>
              <input type="date" placeholder="Data de início" value={dataIni} onChange={e => setDataIni(e.target.value)} className="picker-data" />
            </div>
            <div>
              <p>Fim do curso</p>
              <input type="date" placeholder="Data de término" value={dataFini} onChange={e => setDataFini(e.target.value)} className="picker-data" />
            </div>
          </div>
          <InputMask type="text" placeholder="Duração" mask="99:99:99" value={duracao} onChange={e => setDuracao(e.target.value)} className="input-default" />
          <input id="imagem" name="imagem" type="file" onChange={handleFileChange} />
          <label for="imagem" className="upload-arquivo-button">
            <div className="icones-upload">
              {nomeArq && (
                <svg id="icone-1" width="111" height="96" viewBox="0 0 111 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.4082 27.5917L47.4 56.5835L55.0585 48.925C56.7568 47.2267 58.9221 46.4332 61.2667 46.4332C63.6112 46.4332 65.7766 47.2267 67.4749 48.925C69.1732 50.6233 69.9667 52.7887 69.9667 55.1332C69.9667 57.4778 69.1732 59.6432 67.4749 61.3415L53.6082 75.2081C51.9294 76.887 49.8112 77.8332 47.4 77.8332C44.9889 77.8332 42.8707 76.887 41.1918 75.2081L5.9918 40.0081C4.29351 38.3098 3.5 36.1445 3.5 33.7999C3.5 31.4554 4.29351 29.29 5.9918 27.5917C7.69009 25.8934 9.85545 25.0999 12.2 25.0999C14.5446 25.0999 16.7099 25.8934 18.4082 27.5917Z" stroke="#F5F5F5" stroke-width="7" />
                  <path d="M24.2 96C22.28 96 20.6 95.28 19.16 93.84C17.72 92.4 17 90.72 17 88.8L17 7.2C17 5.28 17.72 3.6 19.16 2.16C20.6 0.72 22.28 0 24.2 0L64.52 0C65.5155 0 66.4644 0.2 67.3666 0.6C68.2689 1 69.04 1.52 69.68 2.16L91.64 24.12C92.28 24.76 92.8 25.5311 93.2 26.4334C93.6 27.3356 93.8 28.2845 93.8 29.28V88.8C93.8 90.72 93.08 92.4 91.64 93.84C90.2 95.28 88.52 96 86.6 96H24.2ZM63.92 25.92V7.2L24.2 7.2L24.2 88.8H86.6V29.52L67.52 29.52C66.5 29.52 65.645 29.175 64.955 28.485C64.265 27.795 63.92 26.94 63.92 25.92Z" fill="black" />
                  <path d="M24.2 96C22.28 96 20.6 95.28 19.16 93.84C17.72 92.4 17 90.72 17 88.8L17 7.2C17 5.28 17.72 3.6 19.16 2.16C20.6 0.72 22.28 0 24.2 0L64.52 0C65.5155 0 66.4644 0.2 67.3666 0.6C68.2689 1 69.04 1.52 69.68 2.16L91.64 24.12C92.28 24.76 92.8 25.5311 93.2 26.4334C93.6 27.3356 93.8 28.2845 93.8 29.28V88.8C93.8 90.72 93.08 92.4 91.64 93.84C90.2 95.28 88.52 96 86.6 96H24.2ZM63.92 25.92V7.2L24.2 7.2L24.2 88.8H86.6V29.52L67.52 29.52C66.5 29.52 65.645 29.175 64.955 28.485C64.265 27.795 63.92 26.94 63.92 25.92Z" fill="black" />
                  <path d="M63.92 25.92V7.2L24.2 7.2V29.52L24.2 88.8H86.6V29.52L67.52 29.52C66.5 29.52 65.645 29.175 64.955 28.485C64.265 27.795 63.92 26.94 63.92 25.92Z" fill="black" />
                  <path d="M63.92 25.92V7.2L24.2 7.2V29.52L24.2 88.8H86.6V29.52L67.52 29.52C66.5 29.52 65.645 29.175 64.955 28.485C64.265 27.795 63.92 26.94 63.92 25.92Z" fill="white" />
                  <path d="M92.3251 27.5917L63.3333 56.5835L55.6748 48.925C53.9765 47.2267 51.8112 46.4332 49.4666 46.4332C47.1221 46.4332 44.9567 47.2267 43.2584 48.925C41.5601 50.6233 40.7666 52.7887 40.7666 55.1332C40.7666 57.4778 41.5601 59.6432 43.2584 61.3415L57.1251 75.2081C58.8039 76.887 60.9221 77.8332 63.3333 77.8332C65.7444 77.8332 67.8626 76.887 69.5415 75.2081L104.741 40.0081C106.44 38.3098 107.233 36.1445 107.233 33.7999C107.233 31.4554 106.44 29.29 104.741 27.5917C103.043 25.8934 100.878 25.0999 98.5333 25.0999C96.1887 25.0999 94.0234 25.8934 92.3251 27.5917Z" fill="black" stroke="white" stroke-width="7" />
                </svg>
              )}
              {!nomeArq && (
                <>
                  <svg id="icone-1" width="77" height="96" viewBox="0 0 77 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34.8 62.04V73.92C34.8 74.94 35.147 75.795 35.841 76.485C36.5351 77.175 37.3951 77.52 38.421 77.52C39.447 77.52 40.3 77.175 40.98 76.485C41.66 75.795 42 74.94 42 73.92V62.04H54C55.02 62.04 55.875 61.693 56.565 60.999C57.255 60.3049 57.6 59.4449 57.6 58.419C57.6 57.393 57.255 56.54 56.565 55.86C55.875 55.18 55.02 54.84 54 54.84H42V42.84C42 41.82 41.653 40.965 40.959 40.275C40.2649 39.585 39.4049 39.24 38.379 39.24C37.353 39.24 36.5 39.585 35.82 40.275C35.14 40.965 34.8 41.82 34.8 42.84V54.84H22.8C21.78 54.84 20.925 55.187 20.235 55.881C19.545 56.5751 19.2 57.4351 19.2 58.461C19.2 59.487 19.545 60.34 20.235 61.02C20.925 61.7 21.78 62.04 22.8 62.04H34.8ZM7.2 96C5.28 96 3.6 95.28 2.16 93.84C0.72 92.4 0 90.72 0 88.8V7.2C0 5.28 0.72 3.6 2.16 2.16C3.6 0.72 5.28 0 7.2 0H47.52C48.5155 0 49.4644 0.2 50.3666 0.6C51.2689 1 52.04 1.52 52.68 2.16L74.64 24.12C75.28 24.76 75.8 25.5311 76.2 26.4334C76.6 27.3356 76.8 28.2845 76.8 29.28V88.8C76.8 90.72 76.08 92.4 74.64 93.84C73.2 95.28 71.52 96 69.6 96H7.2ZM46.92 25.92V7.2H7.2V88.8H69.6V29.52H50.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" />
                    <path d="M34.8 62.04V73.92C34.8 74.94 35.147 75.795 35.841 76.485C36.5351 77.175 37.3951 77.52 38.421 77.52C39.447 77.52 40.3 77.175 40.98 76.485C41.66 75.795 42 74.94 42 73.92V62.04H54C55.02 62.04 55.875 61.693 56.565 60.999C57.255 60.3049 57.6 59.4449 57.6 58.419C57.6 57.393 57.255 56.54 56.565 55.86C55.875 55.18 55.02 54.84 54 54.84H42V42.84C42 41.82 41.653 40.965 40.959 40.275C40.2649 39.585 39.4049 39.24 38.379 39.24C37.353 39.24 36.5 39.585 35.82 40.275C35.14 40.965 34.8 41.82 34.8 42.84V54.84H22.8C21.78 54.84 20.925 55.187 20.235 55.881C19.545 56.5751 19.2 57.4351 19.2 58.461C19.2 59.487 19.545 60.34 20.235 61.02C20.925 61.7 21.78 62.04 22.8 62.04H34.8ZM7.2 96C5.28 96 3.6 95.28 2.16 93.84C0.72 92.4 0 90.72 0 88.8V7.2C0 5.28 0.72 3.6 2.16 2.16C3.6 0.72 5.28 0 7.2 0H47.52C48.5155 0 49.4644 0.2 50.3666 0.6C51.2689 1 52.04 1.52 52.68 2.16L74.64 24.12C75.28 24.76 75.8 25.5311 76.2 26.4334C76.6 27.3356 76.8 28.2845 76.8 29.28V88.8C76.8 90.72 76.08 92.4 74.64 93.84C73.2 95.28 71.52 96 69.6 96H7.2ZM46.92 25.92V7.2H7.2V88.8H69.6V29.52H50.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M46.92 25.92V7.2H7.2V29.52V88.8H69.6V29.52H50.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92ZM34.8 73.92V62.04H22.8C21.78 62.04 20.925 61.7 20.235 61.02C19.545 60.34 19.2 59.487 19.2 58.461C19.2 57.4351 19.545 56.5751 20.235 55.881C20.925 55.187 21.78 54.84 22.8 54.84H34.8V42.84C34.8 41.82 35.14 40.965 35.82 40.275C36.5 39.585 37.353 39.24 38.379 39.24C39.4049 39.24 40.2649 39.585 40.959 40.275C41.653 40.965 42 41.82 42 42.84V54.84H54C55.02 54.84 55.875 55.18 56.565 55.86C57.255 56.54 57.6 57.393 57.6 58.419C57.6 59.4449 57.255 60.3049 56.565 60.999C55.875 61.693 55.02 62.04 54 62.04H42V73.92C42 74.94 41.66 75.795 40.98 76.485C40.3 77.175 39.447 77.52 38.421 77.52C37.3951 77.52 36.5351 77.175 35.841 76.485C35.147 75.795 34.8 74.94 34.8 73.92Z" fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M46.92 25.92V7.2H7.2V29.52V88.8H69.6V29.52H50.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92ZM34.8 73.92V62.04H22.8C21.78 62.04 20.925 61.7 20.235 61.02C19.545 60.34 19.2 59.487 19.2 58.461C19.2 57.4351 19.545 56.5751 20.235 55.881C20.925 55.187 21.78 54.84 22.8 54.84H34.8V42.84C34.8 41.82 35.14 40.965 35.82 40.275C36.5 39.585 37.353 39.24 38.379 39.24C39.4049 39.24 40.2649 39.585 40.959 40.275C41.653 40.965 42 41.82 42 42.84V54.84H54C55.02 54.84 55.875 55.18 56.565 55.86C57.255 56.54 57.6 57.393 57.6 58.419C57.6 59.4449 57.255 60.3049 56.565 60.999C55.875 61.693 55.02 62.04 54 62.04H42V73.92C42 74.94 41.66 75.795 40.98 76.485C40.3 77.175 39.447 77.52 38.421 77.52C37.3951 77.52 36.5351 77.175 35.841 76.485C35.147 75.795 34.8 74.94 34.8 73.92Z" fill="white" />
                  </svg>
                  <svg id="icone-2" width="77" height="96" viewBox="0 0 77 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.68 75.6H54.12C55.14 75.6 55.995 75.253 56.685 74.559C57.375 73.8649 57.72 73.0049 57.72 71.979C57.72 70.953 57.375 70.1 56.685 69.42C55.995 68.74 55.14 68.4 54.12 68.4H22.68C21.66 68.4 20.805 68.747 20.115 69.441C19.425 70.1351 19.08 70.9951 19.08 72.021C19.08 73.047 19.425 73.9 20.115 74.58C20.805 75.26 21.66 75.6 22.68 75.6ZM22.68 55.2H54.12C55.14 55.2 55.995 54.853 56.685 54.159C57.375 53.4649 57.72 52.6049 57.72 51.579C57.72 50.553 57.375 49.7 56.685 49.02C55.995 48.34 55.14 48 54.12 48H22.68C21.66 48 20.805 48.347 20.115 49.041C19.425 49.7351 19.08 50.5951 19.08 51.621C19.08 52.647 19.425 53.5 20.115 54.18C20.805 54.86 21.66 55.2 22.68 55.2ZM7.2 96C5.28 96 3.6 95.28 2.16 93.84C0.72 92.4 0 90.72 0 88.8L0 7.2C0 5.28 0.72 3.6 2.16 2.16C3.6 0.72 5.28 0 7.2 0L47.52 0C48.5155 0 49.4644 0.2 50.3666 0.6C51.2689 1 52.04 1.52 52.68 2.16L74.64 24.12C75.28 24.76 75.8 25.5311 76.2 26.4334C76.6 27.3356 76.8 28.2845 76.8 29.28V88.8C76.8 90.72 76.08 92.4 74.64 93.84C73.2 95.28 71.52 96 69.6 96H7.2ZM46.92 25.92V7.2L7.2 7.2L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" />
                    <path d="M22.68 75.6H54.12C55.14 75.6 55.995 75.253 56.685 74.559C57.375 73.8649 57.72 73.0049 57.72 71.979C57.72 70.953 57.375 70.1 56.685 69.42C55.995 68.74 55.14 68.4 54.12 68.4H22.68C21.66 68.4 20.805 68.747 20.115 69.441C19.425 70.1351 19.08 70.9951 19.08 72.021C19.08 73.047 19.425 73.9 20.115 74.58C20.805 75.26 21.66 75.6 22.68 75.6ZM22.68 55.2H54.12C55.14 55.2 55.995 54.853 56.685 54.159C57.375 53.4649 57.72 52.6049 57.72 51.579C57.72 50.553 57.375 49.7 56.685 49.02C55.995 48.34 55.14 48 54.12 48H22.68C21.66 48 20.805 48.347 20.115 49.041C19.425 49.7351 19.08 50.5951 19.08 51.621C19.08 52.647 19.425 53.5 20.115 54.18C20.805 54.86 21.66 55.2 22.68 55.2ZM7.2 96C5.28 96 3.6 95.28 2.16 93.84C0.72 92.4 0 90.72 0 88.8L0 7.2C0 5.28 0.72 3.6 2.16 2.16C3.6 0.72 5.28 0 7.2 0L47.52 0C48.5155 0 49.4644 0.2 50.3666 0.6C51.2689 1 52.04 1.52 52.68 2.16L74.64 24.12C75.28 24.76 75.8 25.5311 76.2 26.4334C76.6 27.3356 76.8 28.2845 76.8 29.28V88.8C76.8 90.72 76.08 92.4 74.64 93.84C73.2 95.28 71.52 96 69.6 96H7.2ZM46.92 25.92V7.2L7.2 7.2L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" fill-opacity="0.2" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M46.92 25.92V7.2L7.2 7.2L7.2 29.52L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92ZM54.12 75.6H22.68C21.66 75.6 20.805 75.26 20.115 74.58C19.425 73.9 19.08 73.047 19.08 72.021C19.08 70.9951 19.425 70.1351 20.115 69.441C20.805 68.747 21.66 68.4 22.68 68.4H54.12C55.14 68.4 55.995 68.74 56.685 69.42C57.375 70.1 57.72 70.953 57.72 71.979C57.72 73.0049 57.375 73.8649 56.685 74.559C55.995 75.253 55.14 75.6 54.12 75.6ZM54.12 55.2H22.68C21.66 55.2 20.805 54.86 20.115 54.18C19.425 53.5 19.08 52.647 19.08 51.621C19.08 50.5951 19.425 49.7351 20.115 49.041C20.805 48.347 21.66 48 22.68 48H54.12C55.14 48 55.995 48.34 56.685 49.02C57.375 49.7 57.72 50.553 57.72 51.579C57.72 52.6049 57.375 53.4649 56.685 54.159C55.995 54.853 55.14 55.2 54.12 55.2Z" fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M46.92 25.92V7.2L7.2 7.2L7.2 29.52L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92ZM54.12 75.6H22.68C21.66 75.6 20.805 75.26 20.115 74.58C19.425 73.9 19.08 73.047 19.08 72.021C19.08 70.9951 19.425 70.1351 20.115 69.441C20.805 68.747 21.66 68.4 22.68 68.4H54.12C55.14 68.4 55.995 68.74 56.685 69.42C57.375 70.1 57.72 70.953 57.72 71.979C57.72 73.0049 57.375 73.8649 56.685 74.559C55.995 75.253 55.14 75.6 54.12 75.6ZM54.12 55.2H22.68C21.66 55.2 20.805 54.86 20.115 54.18C19.425 53.5 19.08 52.647 19.08 51.621C19.08 50.5951 19.425 49.7351 20.115 49.041C20.805 48.347 21.66 48 22.68 48H54.12C55.14 48 55.995 48.34 56.685 49.02C57.375 49.7 57.72 50.553 57.72 51.579C57.72 52.6049 57.375 53.4649 56.685 54.159C55.995 54.853 55.14 55.2 54.12 55.2Z" fill="white" />
                  </svg>
                  <svg id="icone-3" width="77" height="96" viewBox="0 0 77 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.2 96C5.28 96 3.6 95.28 2.16 93.84C0.72 92.4 0 90.72 0 88.8L0 7.2C0 5.28 0.72 3.6 2.16 2.16C3.6 0.72 5.28 0 7.2 0L47.52 0C48.5155 0 49.4644 0.2 50.3666 0.6C51.2689 1 52.04 1.52 52.68 2.16L74.64 24.12C75.28 24.76 75.8 25.5311 76.2 26.4334C76.6 27.3356 76.8 28.2845 76.8 29.28V88.8C76.8 90.72 76.08 92.4 74.64 93.84C73.2 95.28 71.52 96 69.6 96H7.2ZM46.92 25.92V7.2L7.2 7.2L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" />
                    <path d="M7.2 96C5.28 96 3.6 95.28 2.16 93.84C0.72 92.4 0 90.72 0 88.8L0 7.2C0 5.28 0.72 3.6 2.16 2.16C3.6 0.72 5.28 0 7.2 0L47.52 0C48.5155 0 49.4644 0.2 50.3666 0.6C51.2689 1 52.04 1.52 52.68 2.16L74.64 24.12C75.28 24.76 75.8 25.5311 76.2 26.4334C76.6 27.3356 76.8 28.2845 76.8 29.28V88.8C76.8 90.72 76.08 92.4 74.64 93.84C73.2 95.28 71.52 96 69.6 96H7.2ZM46.92 25.92V7.2L7.2 7.2L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" />
                    <path d="M46.92 25.92V7.2L7.2 7.2L7.2 29.52L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="black" />
                    <path d="M46.92 25.92V7.2L7.2 7.2L7.2 29.52L7.2 88.8H69.6V29.52L50.52 29.52C49.5 29.52 48.645 29.175 47.955 28.485C47.265 27.795 46.92 26.94 46.92 25.92Z" fill="white" />
                  </svg>
                </>
              )}
            </div>
            <h2>{nomeArq ? nomeArq : "Clique aqui para adicionar o seu certificado"}</h2>
          </label>
          <ChronnosButton className="button-default" onSubmit={handleSubmit}>Registrar curso</ChronnosButton>
        </form>
      </MainMobile>
      {showPopupSucesso && (
        <ChronnosPopUp title="Curso criado com sucesso" btntxt="Voltar a home" btntype="submit" cmd={{ onClick: handleClosePopupSucesso }} close={handleClosePopupSucessoClose} conft="true"></ChronnosPopUp>
      )}
      {showPopupMateria && (
        <ChronnosPopUp title="Você não possui Matérias cadastradas" btntxt="Cadastrar matéria" btntype="submit" cmd={{ onClick: handleClosePopupMateria }} close={handleClosePopupMateriaClose}></ChronnosPopUp>
      )}
      {showPopupArea && (
        <ChronnosPopUp title="Você não possui áreas cadastradas" btntxt="Cadastrar área" btntype="submit" cmd={{ onClick: handleClosePopupArea }} close={handleClosePopupAreaClose}></ChronnosPopUp>
      )}
      <Dock />
    </>
  );
};

export default CadastroCurso;
