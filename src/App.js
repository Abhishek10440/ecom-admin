import './App.css';
import Header from "./Header"
import Login from './Login';
import Register from './Register';
import Update from './Update';
import Addproduct from './Addproduct';
import { Routes,Route } from 'react-router-dom';
import Home from './Home';



function App() {
  return (
    <div className="App">
      
      <h1> Wellcome to page</h1>
  <Header />
  <Routes>
    <Route path="/Addproduct" element={<Addproduct />}/>
    <Route path="/Login" element={<Login />}/>
    <Route path="/Register" element={<Register />}/>
    <Route path="/Update" element={<Update />}/>
    <Route path="/Home" element={<Home />}/>
  </Routes>
 
      
      
      
    </div>
  );
}

export default App;
