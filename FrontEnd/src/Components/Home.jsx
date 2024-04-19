import React, { useEffect, useState } from 'react';
import "../Assets/utility.css";

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

        const response = await fetch(`http://localhost:3000/usuarios/listarCursosDoUsuario?usuario_id=${usuarioId}`);
        if (!response.ok) {
          throw new Error('Erro ao obter os cursos do usuário');
        }

        const cursos = await response.json();

        // Promessas para obter detalhes da área de cada curso
        const areasPromises = cursos.map(curso =>
          fetch(`http://localhost:3000/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => ({ ...curso, AREA_NOME: 'Erro ao obter detalhes da área', AREA_COR: 'Erro' }))
        );

        // Promessas para obter detalhes da matéria de cada curso
        const materiasPromises = cursos.map(curso =>
          fetch(`http://localhost:3000/curso/listarMateriaEspecifica?materiaId=${curso.MATERIA}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes da matéria'))
            .then(materiaData => ({ ...curso, MATERIA_NOME: materiaData.NOME_MATERIA }))
            .catch(error => ({ ...curso, MATERIA_NOME: 'Erro ao obter detalhes da matéria' }))
        );

        const pagamentoPromises = cursos.map(curso =>
          fetch(`http://localhost:3000/curso/listarPagamentoEspecifico?pagamentoId=${curso.PAGAMENTO}`)
            .then(response => response.ok ? response.json() : Promise.reject('Erro ao obter os detalhes do pagamento'))
            .then(pagamentoData => {
              const pagamento = JSON.parse(pagamentoData[0].pagamento);
              return { ...curso, PAGAMENTO_NOME: pagamento.TIPO };
            })
            .catch(error => ({ ...curso, PAGAMENTO_NOME: 'Erro ao obter detalhes de pagamento' }))
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

        setCursos(cursosCompleto);
      } catch (error) {
        console.error('Erro:', error);
      }
    };


    fetchCursosDoUsuario();
  }, []);

  return (
<<<<<<< HEAD
    <div>
      <h1>Cursos do Usuário</h1>
      <a href="/Login"><button>Login</button></a>
      <a href="/Cadastro"><button>Cadastro</button></a>
      {cursos.map(curso => (
        <div key={curso.ID_CURSO}>
          <h2>{curso.NOME}</h2>
          <p><strong>ID do Curso:</strong> {curso.ID_CURSO}</p>
          <p><strong>Área:</strong> {curso.AREA_NOME}</p>
          <p><strong>Cor Atrelada a Área:</strong> {curso.AREA_COR}</p>
          <p><strong>Matéria:</strong> {curso.MATERIA_NOME}</p>
          <p><strong>Média:</strong> {curso.MEDIA}</p>
          <p><strong>Valor:</strong> {curso.VALOR}</p>
          <p><strong>Pagamento usado:</strong> {curso.PAGAMENTO}</p>
          <p><strong>Pagamento usado:</strong> {curso.PAGAMENTO_NOME}</p>
          <p><strong>Duração:</strong> {curso.DURACAO}</p>
          <p><strong>Data de Início:</strong> {curso.DATA_INI}</p>
          <p><strong>Data de Término:</strong> {curso.DATA_FINI}</p>
          <p><strong>Modalidade:</strong> {curso.MODALIDADE}</p>
          <p><strong>Anotações:</strong> {curso.ANOTACOES}</p>
          <p>{curso.ARQUIVO}</p>
          <embed src={`Backend/Images/${curso.ARQUIVO}`}/>
=======
    <>
      <MainMobile className={"main-mob"}>
        <div>
          <h1 className="txt-titulo">Cursos</h1>
          <a href="/Login"><button>Login</button></a>
          <a href="/Cadastro"><button>Cadastro</button></a>
          {cursos.map(curso => (
            <div key={curso.ID_CURSO}>
              <h2>{curso.NOME}</h2>
              <p><strong>ID do Curso:</strong> {curso.ID_CURSO}</p>
              <p><strong>Área:</strong> {curso.AREA_NOME}</p>
              <p><strong>Cor Atrelada a Área:</strong> {curso.AREA_COR}</p>
              <p><strong>Matéria:</strong> {curso.MATERIA_NOME}</p>
              <p><strong>Média:</strong> {curso.MEDIA}</p>
              <p><strong>Valor:</strong> {curso.VALOR}</p>
              <p><strong>Pagamento usado:</strong> {curso.PAGAMENTO}</p>
              <p><strong>Pagamento usado:</strong> {curso.PAGAMENTO_NOME}</p>
              <p><strong>Duração:</strong> {curso.DURACAO}</p>
              <p><strong>Data de Início:</strong> {curso.DATA_INI}</p>
              <p><strong>Data de Término:</strong> {curso.DATA_FINI}</p>
              <p><strong>Modalidade:</strong> {curso.MODALIDADE}</p>
              <p><strong>Anotações:</strong> {curso.ANOTACOES}</p>
              <embed src={`http://localhost:3000/Images/${curso.ARQUIVO}`} type="application/pdf" width="100%" height="500px" />
            </div>
          ))}
>>>>>>> 649de0a77b1e9f8bfcea25cabd69afcad414281a
        </div>
      </MainMobile>
      <Dock></Dock>
    </>
  );
};

export default CursosUsuario;
