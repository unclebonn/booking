import React, { useEffect } from 'react';
import './dashboard.css'
import { Navigate, Link, Router, Route, Routes, useNavigate } from 'react-router-dom';
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
          : <Routes>
            <Route path="*" element={<div></div>} />
            <Route path="khach-hang" element={<AllCustomers />} />
            <Route path="khach-hang/detail/:id" element={<CustomerDetail />} />
            {/*<Route path="goi-dich-vu" element={<AllServicePackages />} />
          <Route path="goi-dich-vu/tao-moi" element={<NewServicePackage />} />
          <Route path="goi-dich-vu/cap-nhat" element={<UpdateServicePackage />} />
          <Route path="loai-dich-vu" element={<AllServices />} />
          <Route path="loai-dich-vu/tao-moi" element={<NewService />} />
          <Route path="vouchers" element={<AllVouchers />} />
          <Route path="vouchers/tao-moi" element={<Newvoucher />} />
          <Route path="vouchers/cap-nhat" element={<UpdateVoucher />} />*/}
            <Route path="nhan-vien" element={<AllEmployees />} />
            <Route path="nhan-vien/detail/:id" element={<EmployeeDetail />} />
            {/*<Route path="nhan-vien/role" element={<Role />} />
          <Route path="giao-dich" element={<AllBooking />} />*/}
            {/*<Route path="giao-dich/updatebooking" element={<UpdateBooking />} />
            <Route path="giao-dich/createbooking" element={<NewBooking />} />
            <Route path="vouchers-customer/createvoucherextension" element={<VoucherExtension />} />
          <Route path="vouchers-customer/createvouchercustomer" element={<NewVoucherCustomer />} />*/}
          </Routes>}
      </div>
    </div>
  );

}
