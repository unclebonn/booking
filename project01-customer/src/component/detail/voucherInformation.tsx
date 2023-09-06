import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Tag, Descriptions, Radio, Tabs, Table, Space } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { VoucherListState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from '../../utils/api_function';

interface DataType {
    key: React.Key;
    "id": any,
    "salesEmployee": {
        "id": string,
        "name": string,
        "phoneNumber": string
    } | string | undefined,
    "voucherType": {
        "id": string,
        "typeName": string,
        "isAvailable": boolean,
        "commonPrice": any,
        "percentageDiscount": any,
        "valueDiscount": any,
        "maximumValueDiscount": any,
        "conditionsAndPolicies": string,
    } | string | undefined,
    "issuedDate": string,
    "expiredDate": {
        "expiredDate": string,
        "voucherStatus": boolean,
    }
    "actualPrice": any,
    "usedValueDiscount": any,
    "voucherStatus": string,
    //"bookings": [],
    //"voucherExtensions": []
}

export default function VoucherInformation({ api_link,isCustomer }: { api_link: string,isCustomer:boolean }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<VoucherListState>();
    const dataListShow: DataType[] = [];
    const aiStyle = { color: '#2F70AF', marginLeft: '5px' };

    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

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
            title: 'Loại',
            dataIndex: 'voucherType',
            render: (text, record) => <a onClick={() => navigate("detail/" + record.id)}>{text}</a>,
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiredDate',
            render: (item) =>
                <div>{item.expiredDate} {!item.voucherStatus && <Tag color="volcano" style={{ width: "fit-content" }}>Đã hết hạn</Tag>}
                </div>,
            filters: [
                {
                    text: 'Còn hiệu lực',
                    value: true,
                },
                {
                    text: 'Đã hết hạn',
                    value: false,
                },
            ],
            onFilter: (value: any, record) => record.expiredDate.voucherStatus===value,
        },
        {
            title: 'Thành tiền',
            dataIndex: 'actualPrice',
            align: 'right',
        },];

        const userColumn = {
            title: 'Giao dịch viên',
                dataIndex: 'salesEmployee',
          };
          const cusColumn = {
            title: 'Khách hàng',
            dataIndex: 'customer',
          };

    data?.map((dataTemp, index) => {
        const date = new Date(dataTemp.expiredDate);
        let status;
        switch (dataTemp.voucherStatus) {
            case "Usable": {
                status = true;
                break;
            }
            default: {
                status = false;
                break;
            }
        };
        dataListShow.push({
            key: dataTemp.id,
            id: String(dataTemp.id),
            actualPrice: dataTemp.actualPrice.toLocaleString('en-US', {
                currency: 'USD',
            }),
            expiredDate: {
                expiredDate: date.toLocaleString(),
                voucherStatus: status,
            },
            usedValueDiscount: dataTemp.usedValueDiscount,
            voucherStatus: dataTemp.voucherStatus,
            voucherType: dataTemp.voucherType?.typeName,
            salesEmployee: dataTemp.salesEmployee?.name,
            issuedDate: dataTemp.issuedDate,
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
        <div className="voucher-information">
            <Table columns={isCustomer?[...columns,userColumn]:[...columns,cusColumn]} dataSource={dataListShow} />
        </div>
    );
};

