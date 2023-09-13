import React, { useState, useEffect } from 'react';
import './stylesHistory.css';
import HistoryDisplay from './components/HistoryDisplay';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import { BookingListState } from '../../../app/type.d';

export default function History() {
    const [book, setBook] = useState<BookingListState>([]);

    useEffect(() => {
        document.title = "Lịch sử mua hàng"

        getBookingCustomer()
            .then((res) => {
                if (res.status === 200) {
                    setBook(res.data);
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }, []);

    ////////////////////////// GET API ////////////////////////
    const getBookingCustomer = () => {
        const api_link = {
            url: api_links.user.customer.getCustomerBooking,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    return (
        <div className='customer-history'>
            <div className='dashboard-content-header'>
                <div style={{ padding: "25px" }}>
                    <h1>Lịch sử giao dịch</h1>
                </div>
                <HistoryDisplay booking={book} />

            </div>
        </div>
    )
};