import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions, Radio, Tabs, Table, Space } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { CustomerListState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from '../../utils/api_function';
import api_links from '../../utils/api_links';

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    contact: string;
    status: string;
}

export function SupportedCustomerInformation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CustomerListState>();
    const dataListShow: DataType[] = [];
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            render: (text, record) =>
                <Space size="small">
                    <Button size={"small"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                    <a onClick={() => navigate("detail/" + record.id)}>{text}</a>
                </Space>
        },            
        {
                title: 'Thông tin liên hệ',
                dataIndex: 'contact',
            },
           /* {
                title: 'Tình trạng',
                dataIndex: 'status',
                width: '150px',
                filters: [
                    {
                        text: 'Đang hoạt động',
                        value: 'Đang hoạt động',
                    },
                    {
                        text: 'Đã khóa',
                        value: 'Đã khóa',
                    },
                ],
                onFilter: (value: any, record) => record.status.indexOf(value) === 0,
    
            },*/
        ];
        data?.map((dataTemp, index) => dataListShow.push({
            key: dataTemp.id,//index
            id: String(dataTemp.id),
            name: dataTemp.name,
            contact: dataTemp.phoneNumber ? dataTemp.phoneNumber : (dataTemp.email ? dataTemp.email : ""),
            status: dataTemp.isBlocked ? "Đã khóa" : "Đang hoạt động",
        }));
        /*
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
    });*/

    useEffect(() => {
        fetch_Api({
            url: "Không có link" + '/' + id,
            method: 'GET',
        }).then(data => {
            setData(data.data);
        })
    }, [id]);

    return (
        <div className="booking-information">
            <Table columns={columns} dataSource={dataListShow} />
        </div>
    );
};

export default function SupportedCustomerInformationDf(){} ;