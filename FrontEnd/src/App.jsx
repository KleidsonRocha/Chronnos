import React, { createContext, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Cadastro from "./Components/Cadastro";
import Login from "./Components/Login";
import CadastroArea from "./Components/CadastroArea";

// Criar um contexto
const GlobalContext = createContext();

const App = () => {
  // Definir o estado da variável global
  const [RotaBanco, setGlobalVariable] = useState("http://192.168.10.35:3000");

  return (
    // Prover o contexto para os componentes
    <GlobalContext.Provider value={{ RotaBanco, setGlobalVariable }}>
      <Routes>
        <Route path='/' element={ <Home/> }/>
        <Route path='/Cadastro' element={ <Cadastro /> }/>
        <Route path="/Login" element={ <Login /> }/>
        <Route path='/CadastroArea' element={ <CadastroArea /> }/>
      </Routes>
    </GlobalContext.Provider>
  );
};

// Criar um hook personalizado para acessar o contexto
export const useGlobalContext = () => useContext(GlobalContext);

export default App;
