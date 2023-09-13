import React, { useEffect } from 'react';
import './dashboard.css'
import { Navigate, Link, Router, Route, Routes, useNavigate, BrowserRouter, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOpenMenu, setMenuRole } from '../component/header/headerSlice';
import { selectRole, selectToken } from './login/loginSlice';
import Header from '../component/header/Header';
import Cookies from 'universal-cookie';
import CMenuNew from '../component/newsider/indexCMenu';

export default function Dashboard() {
  useEffect(() => {
  }, []);
  //useSelector, useNavigate
  const isMenu = useSelector(selectOpenMenu);
  const nagivate = useNavigate();
  const token = useSelector(selectToken)
  const r = useSelector(selectRole);
  const cookies = new Cookies();
  //const sidebar_menu = (cookies.get("token")?.role.id == "0") ? sidebar_menu_customer : sidebar_menu_user;
  if (cookies.get("token")?.token === undefined) {
    return (<Navigate replace to="/" />)
  }

  return (
    <div className='dashboard-container'>
      <Header />
      <div className='dashboard-body'>
        {isMenu && <CMenuNew />
          // ((
          //   cookies.get("token")?.role.id === "0") ? <CMenuNew />
          //   : <UMenuNew />
          // )
        }
        <Outlet />
      </div>
    </div>
  );

}
