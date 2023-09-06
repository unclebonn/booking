import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase } from '@fortawesome/free-solid-svg-icons';

export default function PreLogin() {
  const navigate = useNavigate();
  if (window.location.pathname == "/")
    return <Navigate to='/login' />;

  return (
    <div className="prelogin">
      <h2>Đăng nhập dành cho</h2>
      <div className="prelogin-box">
        <button className="prelogin-button"
          onClick={() => navigate('khachhang')}>
          <FontAwesomeIcon icon={faUser}
            style={{
              color: "#ffffff",
              height: "50%",
            }} /> <br />
          Khách Hàng
        </button>
        <button className="prelogin-button"
          onClick={() => navigate('nhanvien')}>
          <FontAwesomeIcon icon={faBriefcase}
            style={{
              color: "#ffffff",
              height: "50%",
            }} /> <br />
          Nhân Viên
        </button>
      </div>
    </div>
  );
}

