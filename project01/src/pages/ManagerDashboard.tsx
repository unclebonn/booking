import React, { useEffect } from 'react';
import './dashboard.css'
import { Navigate, Link, Router, Route, Routes, useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOpenMenu, setMenuRole } from '../component/header/headerSlice';
import { selectRole, selectToken } from './login/loginSlice';

import Header from '../component/header/Header';
import Cookies from 'universal-cookie';
import AllCustomers from './manager/allcustomers/Customers';
import AllServices from './manager/allservices/services/Service';
import AllServicePackages from './manager/allservices/servicepackages/ServicePackage';
import AllVouchers from './manager/allvouchers/Vouchers';
import AllEmployees from './manager/allemployee/Employee';
import AllBooking from './manager/allbookings/Booking';
import CustomerDetail from './manager/allcustomers/customer-detail';
import EmployeeDetail from './manager/allemployee/employee-detail';
import UMenuNew from '../component/newsider/indexUMenu';
import Role from './manager/allemployee/Role';
import NewServicePackage from './manager/allservices/servicepackages/NewServicePackage';
import UpdateServicePackage from './manager/allservices/servicepackages/UpdateServicePackage';
import NewService from './manager/allservices/services/NewService';
import Newvoucher from './manager/allvouchers/NewVoucher';
import UpdateVoucher from './manager/allvouchers/UpdateVoucher';
import handlePermission from '../utils/permission_proccess';
import Unauthorized from './Unauthorized';
import UpdateBooking from './manager/allbookings/UpdateBooking';
import NewBooking from './manager/allbookings/NewBooking';
import VoucherExtension from './manager/allvouchers/VoucherExtension';
import NewVoucherCustomer from './manager/allvouchers/NewVoucherCustomer';

export default function ManagerDashboard() {

  //useSelector, useNavigate
  const isMenu = useSelector(selectOpenMenu);
  const nagivate = useNavigate();
  const token = useSelector(selectToken)
  const r = useSelector(selectRole);
  const cookies = new Cookies();
  //const sidebar_menu = (cookies.get("token")?.role.id == "0") ? sidebar_menu_customer : sidebar_menu_user;

  const permission = handlePermission(cookies.get("token")?.information.permission);
  const path = window.location.pathname;

  if (cookies.get("token")?.token == undefined) {
    return (<Navigate replace to="/login" />)
  }

  const unauthorized: boolean =
    ((path.includes("/managerdashboard/khach-hang") && !permission.Customer.all)
      || (path.includes("/managerdashboard/nhan-vien") && !permission.User.all)
      || (path.includes("/managerdashboard/giao-dich") && !permission.Booking.all)
      || (path.includes("/managerdashboard/vouchers") && !permission.Voucher.all)
      || (path.includes("/dashboard/khach-hang") && !permission.Customer.read)
      || (path.includes("/dashboard/nhan-vien") && !permission.User.read)
      || (path.includes("/dashboard/giao-dich") && !permission.Booking.read)
    ) ? true : false;

  return (
    <div className='dashboard-container'>
      <Header />
      <div className='dashboard-body'>
        {isMenu && <UMenuNew />}
        {unauthorized ?
          <Unauthorized />
          : <Outlet/>
          }
      </div>
    </div>
  );

}
