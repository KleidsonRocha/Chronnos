import React, { useEffect, useState } from 'react';
import "../Assets/utility.css";
import "../Components/tab-curso/styles.css"
import MainMobile from './layouts/MainMobile/MainMobile';
import Dock from './dock/Dock';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';
// Definição do objeto Curso
const Curso = {
  ID_CURSO: 0,
  NOME: "",
  AREA: "",
  AREA_NOME: "",
  AREA_COR: "",
  MATERIA: "",
  MATERIA_NOME: "",
  MEDIA: 0,
  VALOR: 0,
  PAGAMENTO: "",
  PAGAMENTO_NOME: "",
  DURACAO: "",
  DATA_INI: "",
  DATA_FINI: "",
  MODALIDADE: "",
  ANOTACOES: "",
  ARQUIVO: ""
};

const CursosUsuario = () => {
  const [cursos, setCursos] = useState([]);
  const [desejos, setDesejos] = useState([]);
  const [showMoreCursos, setShowMoreCursos] = useState(false);
  const [showMoreDesejos, setShowMoreDesejos] = useState(false);
  const [uniqueAreas, setUniqueAreas] = useState(new Set()); // Conjunto para armazenar áreas únicas
  const uniqueAreasObj = {};
  const [uniqueMaterias, setUniqueMaterias] = useState(new Set()); // Conjunto para armazenar áreas únicas
  const uniqueMateriasObj = {};
  const { RotaBanco } = useGlobalContext();

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
          //pop-up de erro necessário
        }

        const response = await fetch(RotaBanco + `/usuarios/listarCursosDoUsuario?usuario_id=${usuarioId}`);
        if (!response.ok) {
          throw new Error('Erro ao obter os cursos do usuário');
          //pop-up de erro necessário
        }

        const cursos = await response.json();

        // Promessas para obter detalhes da área de cada curso
        const areasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => ({ ...curso, AREA_NOME: 'Erro ao obter detalhes da área', AREA_COR: 'Erro' }))
          //pop-up de erro necessário
        );

        // Promessas para obter detalhes da matéria de cada curso
        const materiasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${curso.MATERIA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da matéria'))
            .then(materiaData => ({ ...curso, MATERIA_NOME: materiaData.NOME_MATERIA }))
            .catch(error => ({ ...curso, MATERIA_NOME: 'Erro ao obter detalhes da matéria' }))
          //pop-up de erro necessário
        );

        const pagamentoPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarPagamentoEspecifico?pagamentoId=${curso.PAGAMENTO}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes do pagamento'))//pop-up de erro necessário
            .then(pagamentoData => {
              const pagamento = JSON.parse(pagamentoData[0].pagamento);
              return { ...curso, PAGAMENTO_NOME: pagamento.TIPO };
            })
            .catch(error => ({ ...curso, PAGAMENTO_NOME: 'Erro ao obter detalhes de pagamento' }))
          //pop-up de erro necessário
        );


        // Esperar todas as promessas de área e matéria serem resolvidas ou rejeitadas
        const areasResultados = await Promise.allSettled(areasPromises);
        const materiasResultados = await Promise.allSettled(materiasPromises);
        const pagamentoResultados = await Promise.allSettled(pagamentoPromises);

        // Consolidar os resultados
        const cursosCompleto = cursos.map((curso, index) => ({
          ...curso,
          AREA_NOME: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_NOME : areasResultados[index].reason,
          AREA_COR: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_COR : 'Erro',
          MATERIA_NOME: materiasResultados[index].status === 'fulfilled' ? materiasResultados[index].value.MATERIA_NOME : materiasResultados[index].reason,
          PAGAMENTO_NOME: pagamentoResultados[index].status === 'fulfilled' ? pagamentoResultados[index].value.PAGAMENTO_NOME : pagamentoResultados[index].reason,
        }));


        // Iterar sobre os cursos completos para obter áreas únicas
        cursosCompleto.forEach(cursoCompleto => {
          // Verificar se a área já existe no objeto
          if (!uniqueAreasObj[cursoCompleto.AREA]) {
            // Se a área não existir, adicione-a ao objeto com o nome como chave e o ID como valor
            uniqueAreasObj[cursoCompleto.AREA] = cursoCompleto.AREA_NOME;
          }
        });
        // Converter o objeto em um array de objetos { id, nome } para renderização
        const uniqueAreasArray = Object.entries(uniqueAreasObj).map(([id, nome]) => ({ id, nome }));
        // Definir o estado de uniqueAreas com o array de áreas únicas
        setUniqueAreas(uniqueAreasArray);


        // Iterar sobre os desejos completos para obter matérias únicas
        cursosCompleto.forEach(cursoCompleto => {
          // Verificar se a matéria já existe no objeto
          if (!uniqueMateriasObj[cursoCompleto.MATERIA]) {
            // Se a matéria não existir, adicione-a ao objeto com o nome como chave e o ID como valor
            uniqueMateriasObj[cursoCompleto.MATERIA] = cursoCompleto.MATERIA_NOME;
          }
        });
        // Converter o objeto em um array de objetos { id, nome } para renderização
        const uniqueMateriasArray = Object.entries(uniqueMateriasObj).map(([id, nome]) => ({ id, nome }));
        // Definir o estado de uniqueMaterias com o array de matérias únicas
        setUniqueMaterias(uniqueMateriasArray);


        setCursos(cursosCompleto);
      } catch (error) {
        console.error('Erro:', error);
        //pop-up de erro necessário
      }
    };

    const fetchDesejoDousuario = async () => {
      try {
        const usuarioId = getUsuarioIdFromCookie();
        if (!usuarioId) {
          window.location.href = '/Login';
          throw new Error('ID do usuário não encontrado no cookie');
          // Pop-up de erro necessário
        }

        const response = await fetch(RotaBanco + `/usuarios/listarDesejoDoUsuario?usuario_id=${usuarioId}`);
        if (!response.ok) {
          throw new Error('Erro ao obter os desejos do usuário');
          // Pop-up de erro necessário
        }

        const desejos = await response.json();

        // Promessas para obter detalhes de cada desejo
        const desejosPromises = desejos.map(desejo =>
          Promise.all([
            fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${desejo.DESEJO_ID_AREA}`),
            fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${desejo.DESEJO_ID_MATERIA}`),
          ])
            .then(async ([areaResponse, materiaResponse]) => {
              if (!areaResponse.ok || !materiaResponse.ok) {
                throw new Error('Erro ao obter detalhes do desejo');
                // Pop-up de erro necessário
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

        // Esperar todas as promessas de detalhes de desejo serem resolvidas ou rejeitadas
        const desejosResultados = await Promise.allSettled(desejosPromises);
        const desejosCompletos = desejosResultados.map((resultado, index) => {
          if (resultado.status === 'fulfilled') {
            return resultado.value;
          } else {
            // Lida com o caso em que a promessa foi rejeitada
            return {
              ...desejos[index],
              AREA_NOME: resultado.reason.AREA_NOME,
              AREA_COR: resultado.reason.AREA_COR,
              MATERIA_NOME: resultado.reason.MATERIA_NOME,
              PAGAMENTO_NOME: resultado.reason.PAGAMENTO_NOME
            };
          }
        });
        setDesejos(desejosCompletos);



      } catch (error) {
        console.error('Erro:', error);
        //pop-up de erro necessário
      }
    };

    fetchCursosDoUsuario();
    fetchDesejoDousuario();
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
        {cursos.slice(0, showMoreCursos ? cursos.length : 5).map(curso => (
          <a key={curso.ID_CURSO} href={`/VisuaizarCursoEspecifico?ID_CURSO=${curso.ID_CURSO}`}>
            <button className="tab-curso" style={{ backgroundColor: curso.AREA_COR }}>
              <h1>{curso.NOME}</h1>
              <p>{curso.AREA_NOME} • {curso.MATERIA_NOME}</p>
            </button>
          </a>
        ))}
        {cursos.length > 5 && !showMoreCursos && <ChronnosButton className="button-tiny" onClick={handleShowMoreCursos}>Mostrar mais</ChronnosButton>}
        <ChronnosTitleInput title="Desejos" format="regular" icon="add" type="a" cmd={{ href: "/CadastroDesejo" }}></ChronnosTitleInput>
        {desejos.slice(0, showMoreDesejos ? desejos.length : 5).map(desejo => (
          <a key={desejo.ID_DESEJO} href={`/VisuaizarCursoEspecifico?ID_CURSO=${desejo.ID_DESEJO}`}>
            <button className="tab-curso" style={{ backgroundColor: desejo.AREA_COR }}>
              <h1>{desejo.NOME}</h1>
              <p>{desejo.AREA_NOME} • {desejo.MATERIA_NOME}</p>
            </button>
          </a>
        ))}
        {desejos.length > 5 && !showMoreDesejos && <ChronnosButton className="button-tiny" onClick={handleShowMoreDesejos}>Mostrar mais</ChronnosButton>}
        <ChronnosTitleInput title="Áreas" format="regular" icon="add" type="a" cmd={{ href: "/CadastroArea" }}></ChronnosTitleInput>
        {Array.from(uniqueAreas).map(area => (
          <button className="tab-curso" key={area.id}>
            <h1>{area.nome}</h1>
            <p>{area.id}</p>
          </button>
        ))}
        <ChronnosTitleInput title="Matérias" format="regular" icon="add" type="a" cmd={{ href: "/CadastroMateria" }}></ChronnosTitleInput>
        {Array.from(uniqueMaterias).map(materia => (
          <button className="tab-curso" key={materia.id}>
            <h1>{materia.nome}</h1>
            <p>{materia.id}</p>
          </button>
        ))}
      </MainMobile>
      <Dock></Dock>
    </>
  );
};

export default CursosUsuario;