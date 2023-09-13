import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, redirect, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import Login from "./pages/login/Login";
import AllEmployees from './pages/manager/allemployee/Employee';
import AllCustomers from './pages/manager/allcustomers/Customers';
import Customers from './pages/user/customers/Customers';
import Vouchers from './pages/user/vouchers/Vouchers';
import Employees from './pages/user/employee/Employee';
import NewService from './pages/user/services/NewService';
import Newvoucher from './pages/user/vouchers/NewVoucher';
import UpdateVoucher from './pages/user/vouchers/UpdateVoucher';
import Service from './pages/user/services/Service';
import NewServicePackage from './pages/user/servicepackages/NewServicePackage';
import UpdateServicePackage from './pages/user/servicepackages/UpdateServicePackage';
import ServicePackage from './pages/user/servicepackages/ServicePackage';
import NewBooking from './pages/user/bookings/NewBooking';
import NewVoucherCustomer from './pages/user/vouchers/NewVoucherCustomer';
import UpdateBooking from './pages/user/bookings/UpdateBooking';
import VoucherExtension from './pages/user/vouchers/VoucherExtension';
import CustomerDetail from './pages/manager/allcustomers/customer-detail';
import EmployeeDetail from './pages/manager/allemployee/employee-detail';
import { RecoveryPage } from './pages/user/recovery/Recovery';

import Cookies from 'universal-cookie';

function App() {
  const cookies = new Cookies();
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="dashboard/*" element={<Dashboard />} >
            <Route path="khach-hang" element={<Customers />} />
            <Route path="khach-hang/detail/:id" element={<CustomerDetail />} />
            <Route path="nhan-vien" element={<Employees />} />
            <Route path="nhan-vien/detail/:id" element={<EmployeeDetail />} /><Route path="goi-dich-vu" element={<ServicePackage />} />
            <Route path="goi-dich-vu/createservicepackage" element={<NewServicePackage />} />
            <Route path="goi-dich-vu/updateservicepackage" element={<UpdateServicePackage />} />
            <Route path="loai-dich-vu" element={<Service />} />
            <Route path="loai-dich-vu/createservice" element={<NewService />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="vouchers/createvoucher" element={<Newvoucher />} />
            <Route path="vouchers/updatevoucher" element={<UpdateVoucher />} />
            <Route path="vouchers-customer/createvoucherextension" element={<VoucherExtension />} />
            <Route path="vouchers-customer/createvouchercustomer" element={<NewVoucherCustomer />} />
            <Route path="giao-dich/updatebooking" element={<UpdateBooking />} />
            <Route path="giao-dich/createbooking" element={<NewBooking />} />
            <Route path="khoi-phuc" element={<RecoveryPage />} />
            <Route path="*" element={<Navigate replace to="/dashboard/khach-hang" />} />
          </Route>
          <Route path="managerdashboard/*" element={<ManagerDashboard />} >
            <Route path="khach-hang" element={<AllCustomers />} />
            <Route path="khach-hang/detail/:id" element={<CustomerDetail />} />
            <Route path="nhan-vien" element={<AllEmployees />} />
            <Route path="nhan-vien/detail/:id" element={<EmployeeDetail />} />
            <Route path="*" element={<Navigate replace to="/dashboard/khach-hang" />} />
          </Route>
          <Route path="/*" element={<Login />} />
          {
            cookies.get("token")?.token !== undefined ?
              <Route path="/*" element={<Navigate replace to="dashboard/" />} />
              : <Route path="/*" element={<Navigate replace to="/" />} />
          }
          {/*<Route path="login/*" element={<Login />} />*/}

        </Routes>
      </div >
    </BrowserRouter >
  );
}

export default App;
