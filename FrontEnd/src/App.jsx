import React, { createContext, useState, useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Cadastro from "./Components/Cadastro/Cadastro";
import Login from "./Components/Login";
import CadastroArea from "./Components/Cadastro/CadastroArea";
import CadastroMateria from "./Components/Cadastro/CadastroMateria";
import CadastroCurso from "./Components/Cadastro/CadastroCurso";
import CadastroDesejo from "./Components/Cadastro/CadastroDesejo";
import VisuaizarCursoEspecifico from "./Components/Visualizadores/VisualizarCursoEspecifico"
import EditarCurso from "./Components/Editores/EditarCurso"
import EditarAnotacoes from "./Components/Editores/EditarAnotacoes"
import EditarUsuario from "./Components/Editores/EditarUsuario"
import Anotacoes from "./Components/Anotacoes"
import Timeline from "./Components/Timeline"
import Ajustes from "./Components/Ajustes"
import Compartilhar from "./Components/Compartilhar";

// Criar um contexto
const GlobalContext = createContext();

const App = () => {
  // Definir o estado da variável global
  const [RotaBanco, setGlobalVariable] = useState("http://192.168.0.13:3000");
  const navigate = useNavigate();

  useEffect(() => {
    const getUsuarioIdFromCookie = () => {
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === 'usuario') {
          return; // Se o usuário estiver logado, não faz nada
        }
      }

      // Se o usuário não estiver logado e tentar acessar uma rota diferente de Cadastro e Login, redireciona para o Login
      const currentPath = window.location.pathname;
      if (currentPath !== '/Cadastro' && currentPath !== '/Login') {
        navigate('/Login');
      }
    };

    getUsuarioIdFromCookie();
  }, [navigate]);

  return (
    // Prover o contexto para os componentes
    <GlobalContext.Provider value={{ RotaBanco, setGlobalVariable }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Cadastro' element={<Cadastro />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/CadastroArea' element={<CadastroArea />} />
        <Route path='/CadastroMateria' element={<CadastroMateria />} />
        <Route path='/CadastroCurso' element={<CadastroCurso />} />
        <Route path='/CadastroDesejo' element={<CadastroDesejo />} />
        <Route path='/VisuaizarCursoEspecifico' element={<VisuaizarCursoEspecifico />} />
        <Route path='/EditarCurso' element={<EditarCurso />} />
        <Route path='/EditarAnotacoes' element={<EditarAnotacoes />} />       
        <Route path='/Anotacoes' element={<Anotacoes />} />
        <Route path='/Timeline' element={<Timeline />} />
        <Route path="/Ajustes" element={<Ajustes />} />
        <Route path="/EditarUsuario" element={<EditarUsuario />} />
        <Route path="/Compartilhar" element={<Compartilhar />} />
        <Route path='/*' element={<Home />} />
      </Routes>
    </GlobalContext.Provider>
  );
};

// Criar um hook personalizado para acessar o contexto
export const useGlobalContext = () => useContext(GlobalContext);

export default App;
