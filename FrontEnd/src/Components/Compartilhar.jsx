import React, { useEffect, useState } from 'react';
import "../Assets/utility.css";
import "../Components/timeline/styles.css";
import MainMobile from './layouts/MainMobile/MainMobile';
import Dock from './dock/Dock';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import Chart from 'chart.js/auto';

const Compartilhar = () => {
  const [cursos, setCursos] = useState([]);
  const [nome, setNome] = useState(null);
  const [email, setEmail] = useState(null);

  const { RotaBanco } = useGlobalContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('USUARIO_ID');
    setNome("Timeline de " + urlParams.get('NOME'));
    setEmail("Email para contato: " + urlParams.get('EMAIL'));

    const fetchCursosDoUsuario = async () => {
      try {
        if (!usuarioId) {
          console.log(usuarioId);
          window.location.href = '/Login';
          throw new Error('ID do usuário não encontrado no cookie');
        }

        const response = await fetch(RotaBanco + `/usuarios/listarCursosDoUsuario?usuario_id=${usuarioId}`);
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
  }, [cursos]);

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

    const areaCount = cursos.reduce((acc, curso) => {
      acc[curso.AREA_NOME] = (acc[curso.AREA_NOME] || 0) + 1;
      return acc;
    }, {});

    const chartData = {
      labels: Object.keys(areaCount),
      datasets: [{
        label: 'Cursos pertencentes à área',
        data: Object.values(areaCount),
        backgroundColor: cursos.map(curso => curso.AREA_COR),
      }]
    };

    const chartOptions = {
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

    window.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions,
    });
  };

  return (
    <>
      <MainMobile className={"main-mob"}>
        <ChronnosTitleInput title={nome} format="bold"></ChronnosTitleInput>
        <div className="holder-timeline-graf">
          <div className="frame-timeline">
            {cursosOrdenados.map(curso => (
              <a href={`/VisualizarCursoCompartilhado?ID_CURSO=${curso.ID_CURSO}`} key={curso.ID_CURSO}>
                <button className="tab-timline" style={{ borderLeft: `2px solid ${curso.AREA_COR}` }}>
                  <h1>{curso.NOME}</h1>
                  <p>{formatarData(curso.DATA_FINI)}</p>
                </button>
              </a>
            ))}
          </div>
          <div className="frame-grafico">
            <div className="canvas-graf">
              <canvas id="graficoPizza"></canvas>
            </div>
          </div>
        </div>
      </MainMobile>
      <Dock/>
    </>
  );
};

export default Compartilhar;