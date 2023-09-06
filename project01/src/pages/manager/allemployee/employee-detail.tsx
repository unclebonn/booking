import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Tabs,Row, Col, Button, Rate, Carousel, Descriptions } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import api_links from '../../../utils/api_links';
import PersonalInformation from '../../../component/detail/personalInformation';

import BookingInformation from '../../../component/detail/bookingInformation';
import VoucherInformation from '../../../component/detail/voucherInformation';
import {SupportedCustomerInformation} from '../../../component/detail/supportedCustomerInformation';

const tab_item=[
      {
        label: `Giao dịch`,
        key: '1',
        children: <BookingInformation         
        api_link={api_links.user.saleAdmin.getUserBooking}
        isCustomer = {false}/>,
      },
      {
        label: `Voucher`,
        key: '2',
        children: <VoucherInformation
        api_link={api_links.user.saleAdmin.getUserVoucher}
        isCustomer={false}/>,
      },
      /*{
        label: `Khách hàng`,
        key: '3',
        children: <SupportedCustomerInformation/>,
      }*/
    ]
    
export default function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {

    }, []);

    

    return (
        <div className='user-detail'>
       <PersonalInformation
       api_link={api_links.user.superAdmin.blockUser}/>
       <Tabs
        defaultActiveKey="1"
        type="card"
        size={"middle"}
        items={tab_item}
      />
       
        </div>
    );
};