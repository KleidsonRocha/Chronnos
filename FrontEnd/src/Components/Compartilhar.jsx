import React, { useEffect, useState } from 'react';
import "../Assets/utility.css";
import "../Components/timeline/styles.css";
import MainMobile from './layouts/MainMobile/MainMobile';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import Chart from 'chart.js/auto';
import Dock from './dock/Dock';
import ChronnosPopUp from './ChronnosPopUp/ChronnosPopUp';

const Compartilhar = () => {
  const [cursos, setCursos] = useState([]);
  const [nome, setNome] = useState(null);
  const [nomeExib, setNomeExib] = useState(null);
  const [email, setEmail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const { RotaBanco } = useGlobalContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('USUARIO_ID');
    setNome("Timeline de " + urlParams.get('NOME'));
    setNomeExib(urlParams.get('NOME'));
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

  function CompartilharPerfil() {
    const link = window.location.href;
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
          <div className="only-mob">
            <ChronnosTitleInput title="Abrir o Chronnos" format="regular" icon="arrow" type="a" cmd={{ href: "/Home" }}></ChronnosTitleInput>
          </div>
        </div>
        {showPopup && (
          <ChronnosPopUp title={`Link da ${nome} copiado para a área de transferência`} btntxt="OK" btntype="submit" cmd={{ onClick: handleClosePopup }} close={handleClosePopup}></ChronnosPopUp>
        )}
      </MainMobile>

      <div className="only-desk">
        <Dock />
      </div>
      <div className="dock-comp">
        <div className="nome-info-holder">
          <h2>Visualização de timeline compartilhada</h2>
          <h1>{nomeExib}</h1>
        </div>
        <button onClick={CompartilharPerfil}>
          <svg width="1.5rem" height="1.68rem" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 26.8334C18.8889 26.8334 17.9444 26.4445 17.1667 25.6667C16.3889 24.889 16 23.9445 16 22.8334C16 22.6779 16.0111 22.5167 16.0333 22.3501C16.0556 22.1834 16.0889 22.0334 16.1333 21.9001L6.73333 16.4334C6.35556 16.7667 5.93333 17.0279 5.46667 17.2167C5 17.4056 4.51111 17.5001 4 17.5001C2.88889 17.5001 1.94444 17.1112 1.16667 16.3334C0.388889 15.5556 0 14.6112 0 13.5001C0 12.389 0.388889 11.4445 1.16667 10.6667C1.94444 9.88897 2.88889 9.50008 4 9.50008C4.51111 9.50008 5 9.59453 5.46667 9.78341C5.93333 9.9723 6.35556 10.2334 6.73333 10.5667L16.1333 5.10008C16.0889 4.96675 16.0556 4.81675 16.0333 4.65008C16.0111 4.48341 16 4.3223 16 4.16675C16 3.05564 16.3889 2.11119 17.1667 1.33341C17.9444 0.555637 18.8889 0.166748 20 0.166748C21.1111 0.166748 22.0556 0.555637 22.8333 1.33341C23.6111 2.11119 24 3.05564 24 4.16675C24 5.27786 23.6111 6.2223 22.8333 7.00008C22.0556 7.77786 21.1111 8.16675 20 8.16675C19.4889 8.16675 19 8.0723 18.5333 7.88341C18.0667 7.69453 17.6444 7.43341 17.2667 7.10008L7.86667 12.5667C7.91111 12.7001 7.94444 12.8501 7.96667 13.0167C7.98889 13.1834 8 13.3445 8 13.5001C8 13.6556 7.98889 13.8167 7.96667 13.9834C7.94444 14.1501 7.91111 14.3001 7.86667 14.4334L17.2667 19.9001C17.6444 19.5667 18.0667 19.3056 18.5333 19.1167C19 18.9279 19.4889 18.8334 20 18.8334C21.1111 18.8334 22.0556 19.2223 22.8333 20.0001C23.6111 20.7779 24 21.7223 24 22.8334C24 23.9445 23.6111 24.889 22.8333 25.6667C22.0556 26.4445 21.1111 26.8334 20 26.8334ZM20 5.50008C20.3778 5.50008 20.6944 5.3723 20.95 5.11675C21.2056 4.86119 21.3333 4.54453 21.3333 4.16675C21.3333 3.78897 21.2056 3.4723 20.95 3.21675C20.6944 2.96119 20.3778 2.83341 20 2.83341C19.6222 2.83341 19.3056 2.96119 19.05 3.21675C18.7944 3.4723 18.6667 3.78897 18.6667 4.16675C18.6667 4.54453 18.7944 4.86119 19.05 5.11675C19.3056 5.3723 19.6222 5.50008 20 5.50008ZM4 14.8334C4.37778 14.8334 4.69444 14.7056 4.95 14.4501C5.20556 14.1945 5.33333 13.8779 5.33333 13.5001C5.33333 13.1223 5.20556 12.8056 4.95 12.5501C4.69444 12.2945 4.37778 12.1667 4 12.1667C3.62222 12.1667 3.30556 12.2945 3.05 12.5501C2.79444 12.8056 2.66667 13.1223 2.66667 13.5001C2.66667 13.8779 2.79444 14.1945 3.05 14.4501C3.30556 14.7056 3.62222 14.8334 4 14.8334ZM20 24.1667C20.3778 24.1667 20.6944 24.039 20.95 23.7834C21.2056 23.5279 21.3333 23.2112 21.3333 22.8334C21.3333 22.4556 21.2056 22.139 20.95 21.8834C20.6944 21.6279 20.3778 21.5001 20 21.5001C19.6222 21.5001 19.3056 21.6279 19.05 21.8834C18.7944 22.139 18.6667 22.4556 18.6667 22.8334C18.6667 23.2112 18.7944 23.5279 19.05 23.7834C19.3056 24.039 19.6222 24.1667 20 24.1667Z" fill="black" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Compartilhar;