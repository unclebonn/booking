import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, redirect, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/login/Login";

import Cookies from 'universal-cookie';

function App() {
  const cookies = new Cookies();
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          {
            cookies.get("token")?.token !== undefined ?
              <Route path="/*" element={<Navigate replace to="dashboard/" />} />
              : <Route path="/*" element={<Navigate replace to="/" />} />
          }
          <Route path="dashboard/*" element={<Dashboard />} />
        </Routes>
      </div >
    </BrowserRouter >
  );
}

export default App;
