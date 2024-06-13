import React, { useEffect, useState } from 'react';
import "../Assets/utility.css";
import "../Components/timeline/styles.css";
import MainMobile from './layouts/MainMobile/MainMobile';
import Dock from './dock/Dock';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import Chart from 'chart.js/auto';
import ChronnosButton from './inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosPopUp from '../Components/ChronnosPopUp/ChronnosPopUp';

const Timeline = () => {
  const { RotaBanco } = useGlobalContext();
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [chartType, setChartType] = useState("Total de cursos por áreas");

  useEffect(() => {
    const getUsuarioIdFromCookie = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');

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

    setUsuario(getUsuarioIdFromCookie());

    const fetchCursosDoUsuario = async () => {
      try {
        const usuarioId = getUsuarioIdFromCookie();
        if (!usuarioId) {
          throw new Error('ID do usuário não encontrado no cookie');
        }

        const response = await fetch(RotaBanco + `/usuarios/listarCursosDoUsuario?usuario_id=${usuarioId.ID_USUARIO}`);
        if (!response.ok) {
          throw new Error('Erro ao obter os cursos do usuário');
        }

        const cursos = await response.json();

        const areasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => ({ ...curso, AREA_NOME: 'Erro ao obter detalhes da área', AREA_COR: 'Erro' }))
        );

        const materiasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${curso.MATERIA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da matéria'))
            .then(materiaData => ({ ...curso, MATERIA_NOME: materiaData.NOME_MATERIA }))
            .catch(error => ({ ...curso, MATERIA_NOME: 'Erro ao obter detalhes da matéria' }))
        );

        const pagamentoPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarPagamentoEspecifico?pagamentoId=${curso.PAGAMENTO}`)
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
          AREA_NOME: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_NOME : areasResultados[index].reason,
          AREA_COR: areasResultados[index].status === 'fulfilled' ? areasResultados[index].value.AREA_COR : 'Erro',
          MATERIA_NOME: materiasResultados[index].status === 'fulfilled' ? materiasResultados[index].value.MATERIA_NOME : materiasResultados[index].reason,
          PAGAMENTO_NOME: pagamentoResultados[index].status === 'fulfilled' ? pagamentoResultados[index].value.PAGAMENTO_NOME : pagamentoResultados[index].reason,
        }));

        setCursos(cursosCompleto);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchCursosDoUsuario();
  }, []);

  useEffect(() => {
    if (cursos.length > 0) {
      renderizarGrafico();
    }
  }, [cursos, chartType]);

  const handleSelectChange = (event) => {
    setChartType(event.target.value);
  };

  const cursosOrdenados = cursos.sort((cursoA, cursoB) => {
    const dataA = new Date(cursoA.DATA_FINI);
    const dataB = new Date(cursoB.DATA_FINI);
    return dataA - dataB;
  });

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const nomeMes = meses[data.getMonth()];
    const ano = data.getFullYear();
    return `${nomeMes} de ${ano}`;
  };

  const renderizarGrafico = () => {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    if (window.myChart) {
      window.myChart.destroy();
    }
    let chartData = {};
    let chartOptions = {};
    switch (chartType) {
      case "Total de cursos por áreas":
        const areaCount = cursos.reduce((acc, curso) => {
          acc[curso.AREA_NOME] = (acc[curso.AREA_NOME] || 0) + 1;
          return acc;
        }, {});
        chartData = {
          labels: Object.keys(areaCount),
          datasets: [{
            label: 'Cursos pertencentes à área',
            data: Object.values(areaCount),
            backgroundColor: cursos.map(curso => curso.AREA_COR),
          }]
        };
        chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 16,
                  family: 'Inter',
                  style: 'normal',
                  weight: 'normal',
                },
                color: '#000000',
              }
            },
            title: {
              display: true,
              text: 'Total de cursos por áreas',
              font: {
                size: 20,
                family: 'Inter',
                style: 'normal',
                weight: 'bold'
              },
              color: '#000000',
              align: 'left',
            }
          }
        };
        break;
      case "Valor individual por curso":
        chartData = {
          labels: cursos.map(curso => curso.NOME),
          datasets: [{
            label: 'Valor deste curso',
            data: cursos.map(curso => curso.VALOR),
            backgroundColor: cursos.map(curso => curso.AREA_COR),
          }]
        };
        chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 16,
                  family: 'Inter',
                  style: 'normal',
                  weight: 'normal'
                },
                color: '#000000',
              }
            },
            title: {
              display: true,
              text: 'Valor individual por curso',
              font: {
                size: 20,
                family: 'Inter',
                style: 'normal',
                weight: 'bold'
              },
              color: '#000000',
              align: 'left',
            }
          }
        };
        break;
      default:
        break;
    }
    window.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions,
    });
  };


  function CompartilharPefil() {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/Compartilhar?USUARIO_ID=${usuario.ID_USUARIO}&EMAIL=${usuario.EMAIL}&NOME=${usuario.NOME}`;

    const textArea = document.createElement('textarea');
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setShowPopup(true)
    } catch (err) {
      console.error('Erro ao copiar o link: ', err);
    }
    document.body.removeChild(textArea);
  }

  function handleClosePopup() {
    setShowPopup(false);
  }

  return (
    <>
      <MainMobile className={"main-mob"}>
        <ChronnosTitleInput title="Timeline" format="bold" type="button" icon="comp" cmd={{ onClick: CompartilharPefil }} />
        <p className='txt-instrucao' style={{ textAlign: 'start' }}>Linha do tempo e histórico de cursos</p>
        <div className="holder-timeline-graf">
          <div className="frame-timeline">
            {cursosOrdenados.map(curso => (
              <a href={`/VisuaizarCursoEspecifico?ID_CURSO=${curso.ID_CURSO}`} key={curso.ID_CURSO}>
                <button className="tab-timline" style={{ borderLeft: `2px solid ${curso.AREA_COR}` }}>
                  <h1>{curso.NOME}</h1>
                  <p>{formatarData(curso.DATA_FINI)}</p>
                </button>
              </a>
            ))}
          </div>
          <div className="frame-grafico">
            <select name="Total de cursos por áreas" onChange={handleSelectChange}>
              <option>Total de cursos por áreas</option>
              <option>Valor individual por curso</option>
            </select>
            <div className="canvas-graf">
              <canvas id="graficoPizza"></canvas>
            </div>
          </div>
        </div>
      </MainMobile>
      {showPopup && (
        <ChronnosPopUp title="Link da Timeline copiado para a área de transferência" btntxt="OK" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
      )}
      <Dock></Dock>
    </>
  );
};

export default Timeline;
