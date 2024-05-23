import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import MainMobile from './layouts/MainMobile/MainMobile';
import Dock from './dock/Dock';
import { useGlobalContext } from '../App';
import ChronnosTitleInput from './inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';

const Ajustes = () => {
  const [cursos, setCursos] = useState([]);
  const { RotaBanco } = useGlobalContext();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
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
  
    const fetchCursosDoUsuario = async () => {
      try {
        const usuario = getUsuarioIdFromCookie();
        setUserData(usuario);
  
        if (!usuario) {
          window.location.href = '/Login';
          throw new Error('ID do usuário não encontrado no cookie');
        }
  
        const response = await fetch(RotaBanco + `/usuarios/listarCursosDoUsuario?usuario_id=${usuario.ID_USUARIO}`);
  
        if (!response.ok) {
          throw new Error('Erro ao obter os cursos do usuário');
        }
  
        const cursos = await response.json();
  
        // Promessas para obter detalhes da área de cada curso
        const areasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => ({ ...curso, AREA_NOME: 'Erro ao obter detalhes da área', AREA_COR: 'Erro' }))
        );
  
        // Promessas para obter detalhes da matéria de cada curso
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
  
        // Esperar todas as promessas de área, matéria e pagamento serem resolvidas ou rejeitadas
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
  
        setCursos(cursosCompleto);
      } catch (error) {
        console.error('Erro:', error);
        //pop-up de erro necessário
      }
    };
  
    fetchCursosDoUsuario();
  }, []);
  
  useEffect(() => {
    if (cursos.length > 0) {
      renderizarGrafico();
    }
  }, [cursos]);
  
  const renderizarGrafico = () => {
    const ctx = document.getElementById('graficoPizza');
    console.log(cursos);
    const valores = cursos.map(curso => curso.VALOR);
    const nomes = cursos.map(curso => curso.NOME);
  
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: nomes,
        datasets: [{
          label: 'Valor dos Cursos',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Valor dos Cursos'
          }
        }
      }
    });
  };


return (
  <>
    <MainMobile />
    <ChronnosTitleInput title="Ajustes" format="bold" icon="add" type="a" cmd={{ href: "/EditarUsuario" }}></ChronnosTitleInput>
    {userData && (
      <div>
        <p>Nome: {userData.NOME}</p>
        <p>Email: {userData.EMAIL}</p>
        <p>Senha: {userData.SENHA}</p>
        <p>ID: {userData.ID_USUARIO}</p>
      </div>
    )}
    <div>
      <canvas id="graficoPizza"></canvas>
    </div>
    <Dock />
  </>
);
};

export default Ajustes;
