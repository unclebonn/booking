import React, { useState } from 'react';
import './stypeHistoryDis.css';
import { Link, Route, Routes } from 'react-router-dom';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { BookingListState, BookingState } from '../../../../app/type.d'; 

interface HistoryProps {
    booking: BookingListState
}

const HistoryDisplay: React.FC<HistoryProps> = (props) => {
    const [totalMoneyUsed, setTotalMoneyUsed] = useState<number>()
    const dataListShow: BookingListState = [];
    const columns: ColumnsType<BookingState> = [
        {
            title: 'ID',
            dataIndex: 'key',
            render: (text, record) => <a>{text}</a>,
        },
        {
            title: 'Tên',
            dataIndex: 'bookingTitle',
            render: (text, record) => <a>{text}</a>,
        },
        {
            title: 'Ngày thực hiện',
            dataIndex: 'bookingDate',
            render: (_, record) => {
                return (
                    <span>{new Date(record.startDateTime).toLocaleString("vi-VN")}</span>
                )
            }
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDateTime',
            render: (_, record) => {
                return (
                    <span>{new Date(record.endDateTime).toLocaleString("vi-VN")}</span>
                )
            }
        },
        {
            title: 'Tình trạng',
            dataIndex: 'bookingStatus',
            width: '150px',
            filters: [
                {
                    text: 'Đã thanh toán',
                    value: "Đã thanh toán",
                },
                {
                    text: 'Chưa thanh toán',
                    value: "Chưa thanh toán",
                },
                {
                    text: 'Đã hủy',
                    value: "Đã huỷ",
                },
            ],
            onFilter: (value: any, record) => {
                return record.bookingStatus.includes(value)
            }

        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (_, record) => {
                return (
                    <span>{record.totalPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}</span>
                )
            }
        }
    ];

    const totalMoney = () => {
        var money = 0
        props.booking.map((data) => {
            if (data.bookingStatus === "Confirmed") {
                money += data.totalPrice
            }
        })
        return money
    }


    props.booking?.map((dataTemp, index) => {
        dataListShow.push({
            id: dataTemp.id,//index
            key: index,
            vouchers: [],
            servicePackage: null,
            bookingTitle: dataTemp.bookingTitle,
            bookingDate: String(new Date(dataTemp.bookingDate)),
            bookingStatus: dataTemp.bookingStatus === "Confirmed" ? "Đã thanh toán" : dataTemp.bookingStatus === "Cancelled" ? "Đã huỷ" : "Chưa thanh toán",
            totalPrice: dataTemp.totalPrice,
            priceDetails: dataTemp.priceDetails,
            note: dataTemp.note,
            descriptions: dataTemp.descriptions,
            startDateTime: new Date(dataTemp.startDateTime).toLocaleString("en-EN"),
            endDateTime: String(new Date(dataTemp.endDateTime).toLocaleString("en-EN")),
            customer: dataTemp.customer,
            salesEmployee: dataTemp.salesEmployee
        });
    });
    return (
        <div>
            <div style={{ padding: "0px 0px 10px 25px" }}>
                <h3>Tổng chi phí đã thanh toán: {totalMoney().toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</h3>
            </div>
            <Table columns={columns} dataSource={dataListShow} />
        </div>

    )
}

export default HistoryDisplay