import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, redirect, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/login/Login";
import Profile from './pages/customer/profile/Profile';
import MyService from './pages/customer/myservice/MyService';
import MyVoucher from './pages/customer/myvoucher/MyVoucher';
import History from './pages/customer/history/History';

import Cookies from 'universal-cookie';

function App() {
  const cookies = new Cookies();
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="dashboard/" element={<Dashboard />} >
          <Route path="*" element={<Navigate replace to="/dashboard/myvoucher" />} />
          <Route path="profile" element={<Profile />} />
          <Route path="myservice" element={<MyService />} />
          <Route path="myvoucher" element={<MyVoucher />} />
          <Route path="history" element={< History />} />
        </Route>
        <Route path="/" element={<Login />} />
          {
            cookies.get("token")?.token !== undefined ?
              <Route path="/*" element={<Navigate replace to="dashboard/myvoucher" />} />
              : <Route path="/*" element={<Navigate replace to="/" />} />
          }
        </Routes>
      </div >
    </BrowserRouter >
  );
}

export default App;
