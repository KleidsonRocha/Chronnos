import React, { useEffect, useState } from 'react';
import "../Assets/utility.css";
import "../Components/tab-curso/styles.css";
import MainMobile from './layouts/MainMobile/MainMobile';
import Dock from './dock/Dock';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';

const CursosUsuario = () => {
  const { RotaBanco } = useGlobalContext();
  const [cursos, setCursos] = useState([]);
  const [desejos, setDesejos] = useState([]);
  const [areas, setAreasDoUsuario] = useState([]);
  const [materias, setMateriasDoUsuario] = useState([]);
  const [showMoreCursos, setShowMoreCursos] = useState(false);
  const [showMoreDesejos, setShowMoreDesejos] = useState(false);

  useEffect(() => {
    const getUsuarioIdFromCookie = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === 'usuario') {
          const userData = JSON.parse(decodeURIComponent(cookieValue));
          return userData.ID_USUARIO;
        }
      }
      return null;
    };

    const fetchCursosDoUsuario = async () => {
      try {
        const usuarioId = getUsuarioIdFromCookie();
        if (!usuarioId) {
          window.location.href = '/Login';
          throw new Error('ID do usuário não encontrado no cookie');
        }

        const response = await fetch(`${RotaBanco}/usuarios/listarCursosDoUsuario?usuario_id=${usuarioId}`);
        if (!response.ok) {
          throw new Error('Erro ao obter os cursos do usuário');
        }

        const cursos = await response.json();

        const areasPromises = cursos.map(curso =>
          fetch(`${RotaBanco}/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => ({ ...curso, AREA_NOME: 'Erro ao obter detalhes da área', AREA_COR: 'Erro' }))
        );

        const materiasPromises = cursos.map(curso =>
          fetch(`${RotaBanco}/curso/listarMateriaEspecifica?materiaId=${curso.MATERIA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da matéria'))
            .then(materiaData => ({ ...curso, MATERIA_NOME: materiaData.NOME_MATERIA }))
            .catch(error => ({ ...curso, MATERIA_NOME: 'Erro ao obter detalhes da matéria' }))
        );

        const pagamentoPromises = cursos.map(curso =>
          fetch(`${RotaBanco}/curso/listarPagamentoEspecifico?pagamentoId=${curso.PAGAMENTO}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes do pagamento'))
            .then(pagamentoData => {
              const pagamento = JSON.parse(pagamentoData[0].pagamento);
              return { ...curso, PAGAMENTO_NOME: pagamento.TIPO };
            })
            .catch(error => ({ ...curso, PAGAMENTO_NOME: 'Erro ao obter detalhes de pagamento' }))
        );

        const areasResultados = await Promise.allSettled(areasPromises);
        const materiasResultados = await Promise.allSettled(materiasPromises);
        const pagamentoResultados = await Promise.allSettled(pagamentoPromises);

        const cursosCompleto = cursos.map((curso, index) => ({
          ...curso,
          AREA_NOME: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_NOME : 'Erro',
          AREA_COR: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_COR : 'Erro',
          MATERIA_NOME: materiasResultados[index].status === 'fulfilled' ? materiasResultados[index].value.MATERIA_NOME : 'Erro',
          PAGAMENTO_NOME: pagamentoResultados[index].status === 'fulfilled' ? pagamentoResultados[index].value.PAGAMENTO_NOME : 'Erro',
        }));

        setCursos(cursosCompleto);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    const fetchDesejoDousuario = async () => {
      try {
        const usuarioId = getUsuarioIdFromCookie();
        if (!usuarioId) {
          window.location.href = '/Login';
          throw new Error('ID do usuário não encontrado no cookie');
        }

        const response = await fetch(`${RotaBanco}/usuarios/listarDesejoDoUsuario?usuario_id=${usuarioId}`);
        if (!response.ok) {
          throw new Error('Erro ao obter os desejos do usuário');
        }

        const desejos = await response.json();

        const desejosPromises = desejos.map(desejo =>
          Promise.all([
            fetch(`${RotaBanco}/curso/listarAreaEspecifica?areaId=${desejo.DESEJO_ID_AREA}`),
            fetch(`${RotaBanco}/curso/listarMateriaEspecifica?materiaId=${desejo.DESEJO_ID_MATERIA}`),
          ])
            .then(async ([areaResponse, materiaResponse]) => {
              if (!areaResponse.ok || !materiaResponse.ok) {
                throw new Error('Erro ao obter detalhes do desejo');
              }

              const [areaData, materiaData] = await Promise.all([
                areaResponse.json(),
                materiaResponse.json(),
              ]);

              return {
                ...desejo,
                AREA_NOME: areaData.NOME_AREA,
                AREA_COR: areaData.COR,
                MATERIA_NOME: materiaData.NOME_MATERIA,
              };
            })
            .catch(error => ({
              ...desejo,
              AREA_NOME: 'Erro ao obter detalhes da área',
              AREA_COR: 'Erro',
              MATERIA_NOME: 'Erro ao obter detalhes da matéria',
            }))
        );

        const desejosResultados = await Promise.allSettled(desejosPromises);
        const desejosCompletos = desejosResultados.map((resultado, index) => {
          if (resultado.status === 'fulfilled') {
            return resultado.value;
          } else {
            return {
              ...desejos[index],
              AREA_NOME: 'Erro ao obter detalhes da área',
              AREA_COR: 'Erro',
              MATERIA_NOME: 'Erro ao obter detalhes da matéria',
            };
          }
        });
        setDesejos(desejosCompletos);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    const fetchAreasMateriasUsuario = async () => {
      const usuarioId = getUsuarioIdFromCookie();
      if (!usuarioId) {
        window.location.href = '/Login';
        throw new Error('ID do usuário não encontrado no cookie');
      }
      const urlAreas = `${RotaBanco}/usuarios/listarAreasUsuario?usuario_id=${usuarioId}`;
      const urlMateria = `${RotaBanco}/usuarios/listarMateriaUsuario?usuario_id=${usuarioId}`;

      fetch(urlAreas)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar áreas do usuário');
          }
          return response.json();
        })
        .then(data => {
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
          setMateriasDoUsuario(data);
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    };

    fetchCursosDoUsuario();
    fetchDesejoDousuario();
    fetchAreasMateriasUsuario();
  }, []);

  const handleShowMoreCursos = () => {
    setShowMoreCursos(true);
  };

  const handleShowMoreDesejos = () => {
    setShowMoreDesejos(true);
  };

  return (
    <>
      <MainMobile className={"main-mob"}>
        <ChronnosTitleInput title="Cursos" format="bold" icon="add" type="a" cmd={{ href: "/CadastroCurso" }}></ChronnosTitleInput>
        <div className="layout-map">
          {cursos.slice(0, showMoreCursos ? cursos.length : 24).map(curso => (
            <a key={curso.ID_CURSO} href={`/VisuaizarCursoEspecifico?ID_CURSO=${curso.ID_CURSO}`}>
              <button className="tab-curso" style={{ backgroundColor: curso.AREA_COR }}>
                <h1>{curso.NOME}</h1>
                <p>{curso.AREA_NOME} • {curso.MATERIA_NOME}</p>
              </button>
            </a>
          ))}
        </div>
        {cursos.length > 6 && !showMoreCursos && <ChronnosButton className="button-tiny" onClick={handleShowMoreCursos}>Mostrar mais</ChronnosButton>}

        <ChronnosTitleInput title="Áreas" format="regular" icon="add" type="a" cmd={{ href: "/CadastroArea" }}></ChronnosTitleInput>
        <div className="layout-map">
          {areas && areas.length > 0 && areas.slice(0, showMoreCursos ? cursos.length : 24).map(area => (
            <a key={area.ID_AREA} href={`/EditarArea?ID_AREA=${area.ID_AREA}`}>
              <button className="tab-curso" style={{ backgroundColor: area.COR }}>
                <p>{area.NOME_AREA}</p>
              </button>
            </a>
          ))}
        </div>

        <ChronnosTitleInput title="Matérias" format="regular" icon="add" type="a" cmd={{ href: "/CadastroMateria" }}></ChronnosTitleInput>
        <div className="layout-map">
          {materias && materias.length > 0 && materias.slice(0, showMoreCursos ? cursos.length : 24).map(materia => (
            <a key={materia.ID_MATERIA} href={`/EditarMateria?ID_MATERIA=${materia.ID_MATERIA}`}>
              <button className="tab-curso" style={{ backgroundColor: materia.COR }}>
                <p>{materia.NOME_MATERIA}</p>
              </button>
            </a>
          ))}
        </div>

        <ChronnosTitleInput title="Desejos" format="regular" icon="add" type="a" cmd={{ href: "/CadastroDesejo" }}></ChronnosTitleInput>
        <div className="layout-map">
          {desejos.slice(0, showMoreDesejos ? desejos.length : 6).map(desejo => (
            <a key={desejo.ID_DESEJO} href={`/VisualizarDesejoEspecifico?ID_DESEJO=${desejo.ID_DESEJO}`}>
              <button className="tab-curso" style={{ backgroundColor: desejo.AREA_COR }}>
                <h1>{desejo.DESEJO_TITULO}</h1>
                <p>{desejo.AREA_NOME} • {desejo.MATERIA_NOME}</p>
              </button>
            </a>
          ))}
        </div>
        {!showMoreDesejos && desejos.length > 5 && (<ChronnosButton className="small" onClick={handleShowMoreDesejos}>Ver mais</ChronnosButton>)}

      </MainMobile>
      <Dock />
    </>
  );
}

export default CursosUsuario;
