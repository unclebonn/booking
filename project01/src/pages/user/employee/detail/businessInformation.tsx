import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { CustomerState } from '../../../../app/type.d';
import Cookies from 'universal-cookie';

type DataType = {
    id: string,
    salesEmployee: {
        id: string,
        name: string,
    },
    voucher: {
        "Id": 0,
        "VoucherType": {
            "Id": 0,
            "TypeName": "string",
            "PercentageDiscount": 0,
            "MaximumValueDiscount": 0,
            "ConditionsAndPolicies": "string"
        },
        "UsedValueDiscount": 0,
        "VoucherStatus": "string"
    }[],
    servicePackage: null,
    bookingTitle: string,
    bookingDate: string,
    bookingStatus: string,
    totalPrice: 0,
    priceDetails: string,
    note: string,
    descriptions: string,
    startDateTime: string,
    endDateTime: string,
}
export default function BusinessInformation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<DataType>();
    const [quantity, setQuantity] = useState(0);
    const aiStyle = { color: '#2F70AF', marginLeft: '5px' };

    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {
        cookies = new Cookies()
        token = cookies.get("token")?.token;
        const response = fetch(
            'http://bevm.e-biz.com.vn/api/Booking/Customer' + id,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }
        ).then(response => {
            return response.json()
        })
            .then(data => {
                setBook(data);
                //console.log(data);
                //console.log(id);

            })

    }, [id]);

    const handleDecrease = () => setQuantity(quantity > 0 ? quantity - 1 : 0);
    const handleIncrease = () => setQuantity(quantity + 1);
    const handleDirect = () => {
    };
    const handleAdd = () => {

    };

    return (
        <div className="personal-information">
            <Descriptions title={book?.salesEmployee.name}
                column={1}>
                <Descriptions.Item label="ID">{book?.id}</Descriptions.Item>
                <Descriptions.Item label="CitizenId">{book?.bookingDate}</Descriptions.Item>
                <Descriptions.Item label="Telephone">{book?.totalPrice}</Descriptions.Item>
                <Descriptions.Item label="Email">{book?.priceDetails}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

