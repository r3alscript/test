import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Input1 from "./components/Input1";
import Input2 from "./components/Input2";
import Element from "./components/Element";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="frame">
      <div className="header"></div>
      <div className="container">
        <h1>
          Вітаємо на платформі для розв'язування двоїстого симплекс-методу
        </h1>
        <div className="btn-container">
          <button className="btn">Інструкція</button>
          <button className="btn primary" onClick={() => navigate("/input1")}>
            Почати роботу
          </button>
        </div>
      </div>
      <div className="background-image top-right"></div>
      <div className="background-image bottom-left"></div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input1" element={<Input1 />} />
        <Route path="/input2" element={<Input2 />} />
        <Route path="/element" element={<Element />} />
      </Routes>
    </Router>
  );
}
