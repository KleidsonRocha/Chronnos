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
import VisualizarDesejoEspecifico from "./Components/Visualizadores/VisualizarDesejoEspecifico"
import VisualizarCursoCompartilhado from "./Components/Visualizadores/VisualizarCursoCompartilhado";
import EditarCurso from "./Components/Editores/EditarCurso"
import EditarDesejo from "./Components/Editores/EditarDesejo"
import EditarAnotacoes from "./Components/Editores/EditarAnotacoes"
import EditarArea from "./Components/Editores/EditarArea"
import EditarMateria from "./Components/Editores/EditarMateria"
import Anotacoes from "./Components/Anotacoes"
import Timeline from "./Components/Timeline"
import Ajustes from "./Components/Ajustes"
import Compartilhar from "./Components/Compartilhar";
import Sobre from "./Sobre";

const GlobalContext = createContext(); 

const App = () => {
  const [RotaBanco, setGlobalVariable] = useState("http://192.168.193.143:3000");
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
      if (currentPath !== '/Cadastro' && currentPath !== '/Login' && currentPath !== '/Sobre') {
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
        <Route path='/Login' element={<Login />} />
        <Route path='/Cadastro' element={<Cadastro />} />
        <Route path='/Anotacoes' element={<Anotacoes />} />
        <Route path='/Timeline' element={<Timeline />} />
        <Route path="/Ajustes" element={<Ajustes />} />
        <Route path="/Compartilhar" element={<Compartilhar />} />
        <Route path='/CadastroArea' element={<CadastroArea />} />
        <Route path='/CadastroMateria' element={<CadastroMateria />} />
        <Route path='/CadastroCurso' element={<CadastroCurso />} />
        <Route path='/CadastroDesejo' element={<CadastroDesejo />} />
        <Route path='/EditarCurso' element={<EditarCurso />} />
        <Route path='/EditarDesejo' element={<EditarDesejo />} />
        <Route path='/EditarArea' element={<EditarArea />} />
        <Route path='/EditarMateria' element={<EditarMateria />} />
        <Route path='/EditarAnotacoes' element={<EditarAnotacoes />} />       
        <Route path='/VisualizarDesejoEspecifico' element={<VisualizarDesejoEspecifico />} />
        <Route path='/VisuaizarCursoEspecifico' element={<VisuaizarCursoEspecifico />} />
        <Route path='/VisualizarCursoCompartilhado' element={<VisualizarCursoCompartilhado />} />
        <Route path='/Sobre' element={<Sobre />} />
        <Route path='/*' element={<Home />} />
      </Routes>
    </GlobalContext.Provider>
  );
};

// Criar um hook personalizado para acessar o contexto
export const useGlobalContext = () => useContext(GlobalContext);

export default App;
