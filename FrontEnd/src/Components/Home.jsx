import React, { useEffect, useState } from 'react';

// Definição do objeto Curso
const Curso = {
  ID_CURSO: 0,
  NOME: "",
  AREA: "",
  MATERIA: "",
  MEDIA: 0,
  VALOR: 0,
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
        
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchCursosDoUsuario();
  }, []);

  return (
    <div>
      <h1>Cursos do Usuário</h1>
      <a href="/Login"><button>Login</button></a>
      <a href="/Cadastro"><button>Cadastro</button></a>
      {cursos.map(curso => (
        <div key={curso.ID_CURSO}>
          <h2>{curso.NOME}</h2>
          <p><strong>ID do Curso:</strong> {curso.ID_CURSO}</p>
          <p><strong>Área:</strong> {curso.AREA}</p>
          <p><strong>Matéria:</strong> {curso.MATERIA}</p>
          <p><strong>Média:</strong> {curso.MEDIA}</p>
          <p><strong>Valor:</strong> {curso.VALOR}</p>
          <p><strong>Duração:</strong> {curso.DURACAO}</p>
          <p><strong>Data de Início:</strong> {curso.DATA_INI}</p>
          <p><strong>Data de Término:</strong> {curso.DATA_FINI}</p>
          <p><strong>Modalidade:</strong> {curso.MODALIDADE}</p>
          <p><strong>Anotações:</strong> {curso.ANOTACOES}</p>
          <embed src={`http://localhost:3000/Images/${curso.ARQUIVO}`} type="application/pdf" width="100%" height="500px" />
        </div>
      ))}
    </div>
  );
};

export default CursosUsuario;
