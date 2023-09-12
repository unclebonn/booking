import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions, Radio, Tabs, Table, Space } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { BookingListState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from '../../utils/api_function';

interface DataType {
    key: React.Key;
    id: string;
    vouchers: [],
    servicePackage: null,
    bookingTitle: string,
    bookingDate: string,
    bookingStatus: string,
    totalPrice: any,
    priceDetails: string,
    note: string,
    descriptions: string,
    startDateTime: string,
    endDateTime: string,
    salesEmployee: string | undefined,
    customer:string | undefined,
}

export default function BookingInformation({ api_link,isCustomer }: { api_link: string,isCustomer:boolean }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<BookingListState>();
    const dataListShow: DataType[] = [];
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {
        document.title="Lịch sử mua hàng"
    },[])

    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text, record) =>
                <Space size="small">
                    <Button size={"small"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                    <a onClick={() => navigate("detail/" + record.id)}>{text}</a>
                </Space>
        },
        {
            title: 'Tên',
            dataIndex: 'bookingTitle',
            render: (text, record) => <a onClick={() => navigate("detail/" + record.id)}>{text}</a>,
        },
        {
            title: 'Ngày thực hiện',
            dataIndex: 'bookingDate',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'bookingStatus',
            width: '150px',
            filters: [
                {
                    text: 'Đã thanh toán',
                    value: 'Đã thanh toán',
                },
                {
                    text: 'Đang xử lí',
                    value: 'Đang xử lí',
                },
                {
                    text: 'Đã hủy',
                    value: 'Đã hủy',
                },
            ],
            onFilter: (value: any, record) => record.bookingStatus.indexOf(value) === 0,

        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            align: 'right',
        },
    ];
    const userColumn = {
        title: 'Giao dịch viên',
            dataIndex: 'salesEmployee',
      };
      const cusColumn = {
        title: 'Khách hàng',
        dataIndex: 'customer',
      };

    data?.map((dataTemp, index) => {
        const date = new Date(dataTemp.bookingDate);
        let status="";
        switch(dataTemp.bookingStatus){
            case "Confirmed": {
                status = "Đã hoàn thành";
                break;
              }
              case "Pending": {
                status = "Đang xử lý";
                break;
              }
              case "Cancelled": {
                status = "Đã hủy";
                break;
              }
            };
        dataListShow.push({
            key: dataTemp.id,//index
            id: String(dataTemp.id),
            vouchers: [],
            servicePackage: null,
            bookingTitle: dataTemp.bookingTitle,
            bookingDate: date.toLocaleString(),
            bookingStatus:status,
            totalPrice: dataTemp.totalPrice.toLocaleString('en-US', {
                currency: 'USD',
            }),
            priceDetails: dataTemp.priceDetails,
            note: dataTemp.note,
            descriptions: dataTemp.descriptions,
            startDateTime: dataTemp.startDateTime,
            endDateTime: dataTemp.endDateTime,
            salesEmployee: dataTemp.salesEmployee?.name,
            customer: dataTemp.customer?.name,
        });
    });

    useEffect(() => {
        fetch_Api({
            url: api_link + '/' + id,
            method: 'GET',
        }).then(data => {
            setData(data.data);
        })
    }, [id]);

    return (
        <div className="booking-information">
            <Table columns={isCustomer?[...columns,userColumn]:[...columns,cusColumn]} dataSource={dataListShow} />
        </div>
    );
};

