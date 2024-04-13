import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Cadastro from "./Components/Cadastro";
import Login from "./Components/Login";

const App = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/Cadastro' element={ <Cadastro /> }/>
        <Route path="/Login" element={ < Login /> }/>
    </Routes>
    </>
  );
};

export default App;
