import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Cadastro from "./Components/Cadastro";

const App = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/Cadastro' element={ <Cadastro /> }/>
    </Routes>
    </>
  );
};

export default App;
