import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import './login.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  login,
  selectSuccess,
  selectMessage,
  selectError,
  selectToken,
  selectRole,
  selectInformation,
  selectPermission,
  selectLogin,
  selectErrorServer
} from './loginSlice';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import api_links from '../../utils/api_links';
import handlePermission from '../../utils/permission_proccess'
import Cookies from 'universal-cookie';
import { log } from 'console';
import { unescapeLeadingUnderscores } from 'typescript';
//import PulseLoader from "react-spinners/PulseLoader";

export default function Login() {

  // Select data from store
  //not using const errorMessage = useAppSelector(selectErrorMessage);  const isSuccess = useAppSelector(selectSuccess);
  const isSuccess = useAppSelector(selectSuccess);
  const errorMessage1 = useAppSelector(selectMessage);
  const errorMessage2 = useAppSelector(selectError);
  const token = useAppSelector(selectToken);
  const information = useSelector(selectInformation);
  const role = useSelector(selectRole);
  const errorServer = useSelector(selectErrorServer);


  //const loginSelect = useSelector(selectLogin);
  //const permissionDone= handlePermission(permission?permission:[]);

  //variable
  const cookies = new Cookies();
  const dispatch = useAppDispatch();
  const storeCookieData = {
    token: token,
    information: information,
    role: role,
    // permissions: permission
  }
  const location = useLocation();
  const checked = location.pathname;
  const navigate = useNavigate()


  //api_link
  const userLoginAPI = api_links.user.superAdmin.login;
  const customerLoginAPI = api_links.user.customer.login;
  // const loginLink = checked === "/login/nhanvien" ? userLoginAPI : customerLoginAPI;
  const loginLink = userLoginAPI;

  useEffect(() => {
    document.title = "Quản lý nhân viên"
    if (cookies.get("token")?.token !== undefined) {
      navigate('/dashboard/khach-hang');
      //return 
    }
  }, [])

  const errorMessage = () => {
    if (errorMessage2) {
      if (typeof Object.values(errorMessage2)[0] == "string") {
        return Object.values(errorMessage2)[0];
      }
      return Object.values(errorMessage2)[0][0];
    }
    if (errorMessage1)
      return errorMessage1;
  };

  const onFinish = (values: any) => {
    dispatch(login({ "AccountInformation": values.username, "UserName": values.username, "Password": values.password, "link": loginLink }))
  };

  //check token existed 
  if (token != undefined) {
    cookies.set("token", storeCookieData, { path: '/', maxAge: 7200 })  // set cookies for 30 minutes
  }

  if (cookies.get("token")?.token !== undefined) {
    navigate('/dashboard/khach-hang');
    //return 
  }

  // Navigate to dashboard page if login successful


  return (
    <div className="login">
      <div className="box-form">
        <h2>Đăng nhập </h2>      <br />
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="password"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              {isSuccess ? <FontAwesomeIcon className='circle-loading' icon={faSpinner} /> : "Đăng nhập"}
            </Button>
            {(errorMessage()) &&
              <p style={{
                color: "red",
                textAlign: "left",
                fontSize: "13px"
              }}><br /> {errorMessage()}</p>
            }
            {
              errorServer?.includes("Failed to fetch") ? <p style={{
                color: "red",
                textAlign: "left",
                fontSize: "13px"
              }}><br />Lỗi máy chủ vui lòng thử lại sau</p> : ""
            }
          </Form.Item>

          <Form.Item>
            <a className="login-form-forgot" href="">
              Quên mật khẩu
            </a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

