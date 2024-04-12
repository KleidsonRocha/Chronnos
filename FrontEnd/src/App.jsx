import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Teste from "./Components/Teste";

const App = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/teste' element={ <Teste /> }/>
    </Routes>
    </>
  );
};

export default App;
