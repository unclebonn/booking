import React, { useState, useEffect } from 'react';
import './stylesVoucher.css';
import DisplayVoucher from './components/DisplayVoucher';
import Cookies from 'universal-cookie';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function'; 
import { message } from 'antd';





export default function MyVoucher() {
    const [voucher, setVoucher] = useState<[]>([]);
    var cookies = new Cookies();
    useEffect(() => {
        document.title='Voucher của tôi'
        getVoucherCustomer()
            .then((res) => {
                if (res.status === 200) {
                    setVoucher(res.data)
                }
            })
            .catch((error) => {
                message.error("Vui lòng đăng nhập lại")
            })
    }, []);
    //////////////////////// GET API /////////////////////////////
    const getVoucherCustomer = () => {
        const api_link = {
            url: api_links.user.customer.getCustomerVoucher,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    return (
        <div className='customer-voucher'>
            <div className='dashboard-content-header'>
                <div style={{ padding: "25px" }}>
                    <h1>Voucher của tôi</h1>
                </div>
                <DisplayVoucher voucher={voucher} />
            </div>
        </div>
    )
};