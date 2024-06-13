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

const EditarCurso = () => {
  const { RotaBanco } = useGlobalContext();
  const [curso, setCurso] = useState(null);
  const [areasDoUsuario, setAreasDoUsuario] = useState([]);
  const [materiasDoUsuario, setMateriasDoUsuario] = useState([]);
  const [pagamento, setPagamento] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 
  const [showPopupEdicao, setShowPopupEdicao] = useState(false);
  const [nomeArq, setNomeArq] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('ID_CURSO');
    const url = RotaBanco + `/curso/listarCursoEspecifico?cursoId=${cursoId}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter os detalhes do curso');
        }
        return response.json();
      })
      .then(cursoData => {
        setCurso(cursoData);
        setPagamento(cursoData.PAGAMENTO)
      })
      .catch(error => {
        console.error('Erro:', error);
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
    const urlArea = RotaBanco + `/usuarios/listarAreasUsuario?usuario_id=${usuarioData.ID_USUARIO}`;
    const urlMateria = `${RotaBanco}/usuarios/listarMateriaUsuario?usuario_id=${usuarioData.ID_USUARIO}`;

    fetch(urlArea)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar áreas do usuário');
        }
        return response.json();
      })
      .then(data => {
        setAreasDoUsuario(data);
      });

    fetch(urlMateria)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar máteria do usuário');
        }
        return response.json();
      })
      .then(data => {
        setMateriasDoUsuario(data);
      });

  }, [RotaBanco]);

  function preencherFormulario(curso) {
    return (
      <form id="curso-formulario">
        <div className="layout-vertical">
          <div className="holder-dados">
            <p>Nome do curso</p>
            <ChronnosInput
              type="text"
              id="nome"
              value={curso.NOME}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'NOME')}
            />
          </div>
          <div className="holder-dados">
            <p>Area</p>
            <select id="area" value={curso.AREA} onChange={(e) => handleInputChange(e, 'AREA')}>
              <option value="">Selecione a nova área</option>
              {areasDoUsuario.map(area => (
                <option key={area.ID_AREA} value={area.ID_AREA}>
                  {area.NOME_AREA}
                </option>
              ))}
            </select>
          </div>
          <div className="holder-dados">
            <p>Materia</p>
            <select id="materia" value={curso.MATERIA} onChange={(e) => handleInputChange(e, 'MATERIA')}>
              <option value="">Selecione a nova área</option>
              {materiasDoUsuario.map(materia => (
                <option key={materia.ID_MATERIA} value={materia.ID_MATERIA}>
                  {materia.NOME_MATERIA}
                </option>
              ))}
            </select>
          </div>
          <div className="holder-dados">
            <p>Formato de pagamento</p>
            <select value={curso.PAGAMENTO} onChange={e => handleInputChange(e, 'PAGAMENTO')}>
              <option value="">Selecione a forma de pagamento</option>
              <option value="3">Pix</option>
              <option value="4">Cartão de Credito</option>
              <option value="6">Cartão de Débito</option>
              <option value="5">Boleto</option>
              <option value="7">Dinheiro</option>
            </select>
          </div>
          <div className="holder-dados">
            <p>Valor</p>
            <ChronnosInput
              type="number"
              id="valor"
              value={curso.VALOR}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'VALOR')}
            />
          </div>
          <div className="holder-dados">
            <p>Modalidade</p>
            <ChronnosInput
              type="text"
              id="modalidade"
              value={curso.MODALIDADE}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'MODALIDADE')}
            />
          </div>
          <div className="holder-dados">
            <p>Média</p>
            <ChronnosInput
              type="number"
              id="media"
              value={curso.MEDIA}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'MEDIA')}
            />
          </div>
          <div className="holder-dados">
            <p>Anotações</p>
            <textarea
              id="anotacoes"
              name="anotacoes"
              value={curso.ANOTACOES}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'ANOTACOES')}
            />
          </div>
          <div className="holder-pickers">
            <div className="holder-pickers">
              <p>Início do curso</p>
              <ChronnosInput
                type="date"
                id="data_ini"
                value={curso.DATA_INI}
                className="picker-data"
                onChange={(e) => handleInputChange(e, 'DATA_INI')}
              />
            </div>
            <div className="holder-pickers">
              <p>Fim do curso</p>
              <ChronnosInput
                type="date"
                id="data_fini"
                value={curso.DATA_FINI}
                className="picker-data"
                onChange={(e) => handleInputChange(e, 'DATA_FINI')}
              />
            </div>
          </div>
          <div className="holder-dados">
            <p>Duração</p>
            <ChronnosInput
              type="text"
              id="duracao"
              value={curso.DURACAO}
              className="input-default"
              onChange={(e) => handleInputChange(e, 'DURACAO')}
            />
          </div>
          <input type="file" id="imagem" name="imagem" onChange={handleImagemChange} />
          <label for="imagem" className="trocar-arquivo">
            <p>{nomeArq ? `${nomeArq}` : 'Substituir o certificado'}</p>
            <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.69004 24C2.03004 24 1.46504 23.765 0.995039 23.295C0.525039 22.825 0.290039 22.26 0.290039 21.6V2.4C0.290039 1.74 0.525039 1.175 0.995039 0.705C1.46504 0.235 2.03004 0 2.69004 0H11.3C11.62 0 11.925 0.06 12.215 0.18C12.505 0.3 12.76 0.47 12.98 0.69L18.8 6.51C19.02 6.73 19.19 6.985 19.31 7.275C19.43 7.565 19.49 7.87 19.49 8.19V13.2C19.49 13.54 19.375 13.825 19.145 14.055C18.915 14.285 18.63 14.4 18.29 14.4C17.95 14.4 17.665 14.285 17.435 14.055C17.205 13.825 17.09 13.54 17.09 13.2V8.4H12.29C11.95 8.4 11.665 8.285 11.435 8.055C11.205 7.825 11.09 7.54 11.09 7.2V2.4H2.69004V21.6H12.29C12.63 21.6 12.915 21.715 13.145 21.945C13.375 22.175 13.49 22.46 13.49 22.8C13.49 23.14 13.375 23.425 13.145 23.655C12.915 23.885 12.63 24 12.29 24H2.69004ZM18.29 20.91V22.38C18.29 22.72 18.175 23.005 17.945 23.235C17.715 23.465 17.43 23.58 17.09 23.58C16.75 23.58 16.465 23.465 16.235 23.235C16.005 23.005 15.89 22.72 15.89 22.38V18C15.89 17.66 16.005 17.375 16.235 17.145C16.465 16.915 16.75 16.8 17.09 16.8H21.47C21.81 16.8 22.095 16.915 22.325 17.145C22.555 17.375 22.67 17.66 22.67 18C22.67 18.34 22.555 18.625 22.325 18.855C22.095 19.085 21.81 19.2 21.47 19.2H19.97L22.67 21.9C22.89 22.12 23 22.395 23 22.725C23 23.055 22.89 23.34 22.67 23.58C22.43 23.82 22.145 23.94 21.815 23.94C21.485 23.94 21.2 23.82 20.96 23.58L18.29 20.91Z" fill="black" />
            </svg>
          </label>
          <div >
            {curso && curso.ARQUIVO && curso.ARQUIVO.endsWith('.pdf') ? (
              <embed id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} type="application/pdf" width="100%" height="500px" />
            ) : (
              <img id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} width="100%" height="auto" />
            )}
          </div>
        </div>
      </form>
    );
  }

  function handleInputChange(event, field) {
    const value = event.target.value;

    if(field === "PAGAMENTO") {
      setPagamento(value)
    }

    setCurso(prevState => ({
      ...prevState,
      [field]: value
    }));
  }

  function handleImagemChange(event) {
    const imagemInput = event.target;
    const imagemFile = imagemInput.files[0];
    const orgimg = document.getElementById('orgimg');

    if (imagemFile) {
      setNomeArq(imagemFile.name);
    } else {
      setNomeArq('');
    }

    if (imagemFile) {
      if (imagemFile.type === 'application/pdf') {
        // Se for um PDF, cria um elemento embed
        const embedElement = document.createElement('embed');
        embedElement.src = URL.createObjectURL(imagemFile);
        embedElement.type = 'application/pdf';
        embedElement.width = '100%';
        embedElement.height = '500px';
        orgimg.innerHTML = ''; // Limpa o conteúdo existente
        orgimg.appendChild(embedElement); // Adiciona o elemento embed à div orgimg
      } else {
        // Se for uma imagem, cria um elemento img
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(imagemFile);
        imgElement.width = '100%';
        imgElement.height = 'auto'; // Ajusta a altura automaticamente
        orgimg.innerHTML = ''; // Limpa o conteúdo existente
        orgimg.appendChild(imgElement); // Adiciona o elemento img à div orgimg
      }
    } else {
      // Se nenhum arquivo foi selecionado, restaura a imagem original
      orgimg.innerHTML = `<embed src="${RotaBanco}/Images/${curso.ARQUIVO}" type="application/pdf" width="100%" height="500px" />`;
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.href = '/Home';
  };

  function salvarAlteracoes() {
    const formData = new FormData();
    formData.append('cursoId', curso.ID_CURSO);
    formData.append('nome', document.getElementById('nome').value || "");
    formData.append('modalidade', document.getElementById('modalidade').value || "");
    formData.append('anotacoes', document.getElementById('anotacoes').value || "");
    formData.append('valor', document.getElementById('valor').value || "");
    formData.append('area', document.getElementById('area').value || "");
    formData.append('pagamento', pagamento || "");
    formData.append('materia', document.getElementById('materia').value || "");
    formData.append('dataIni', document.getElementById('data_ini').value || "");
    formData.append('dataFini', document.getElementById('data_fini').value || "");
    formData.append('duracao', document.getElementById('duracao').value || "");
    formData.append('media', document.getElementById('media').value || "");
  
    console.log([...formData.entries()]);

    const imagemInput = document.getElementById('imagem');
    const imagemFile = imagemInput.files[0];
    if (imagemFile) {
      formData.append('imagem', imagemFile);
    } else {
      formData.append('imagem', "NULL");
    }
  
    fetch(RotaBanco + '/curso/editarCurso', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setShowPopupEdicao(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function excluirCurso() {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('ID_CURSO');

    const url = RotaBanco + `/curso/excluirCurso?cursoId=${cursoId}`;
    console.log(url);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir curso');
        }
        setShowPopup(true);
      })
  }

  return (
    <>
      <MainMobile className="form-mob">
        <h1>Editar um curso</h1>
        <div>
          {curso && preencherFormulario(curso)}
        </div>
        <ChronnosButton id="editar-curso-btn" onClick={salvarAlteracoes} className="button-default">Salvar as edições</ChronnosButton>
        <ChronnosTitleInput title="Remover o curso" icon="rem-curso" format="delete" type="button" cmd={{ onClick: excluirCurso }} />
      </MainMobile>
      {showPopup && (
        <ChronnosPopUp title="Curso excluido com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
      )}
      {showPopupEdicao && (
        <ChronnosPopUp title="Curso editado com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
      )}
      <Dock />
    </>
  );
};

export default EditarCurso;
