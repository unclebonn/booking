import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Tabs,Row, Col, Button, Rate, Carousel, Descriptions } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import Cookies from 'universal-cookie';
import api_links from '../../../utils/api_links';
import PersonalInformation from '../../../component/detail/personalInformation';

import BookingInformation from '../../../component/detail/bookingInformation';
import VoucherInformation from '../../../component/detail/voucherInformation';

const tab_item=[
      {
        label: `Giao dịch`,
        key: '1',
        children: <BookingInformation
        api_link={api_links.user.customer.getCustomerBooking}
        isCustomer={true}/>,
      },
      {
        label: `Voucher`,
        key: '2',
        children: <VoucherInformation
        api_link={api_links.user.customer.getCustomerVoucher}
        isCustomer={true}/>,
      }
    ]
    
export default function CustomerDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {

    }, []);

    

    return (
        <div className='user-detail'>
       <PersonalInformation
       api_link={api_links.user.superAdmin.blockCustomer}/>
       
       <Tabs
        defaultActiveKey="1"
        type="card"
        size={"middle"}
        items={tab_item}
        style={{
          width: '100%',
        }}
      />
       
        </div>
    );
};