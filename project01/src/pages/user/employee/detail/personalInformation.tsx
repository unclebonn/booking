import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { CustomerState } from '../../../../app/type.d';
import Cookies from 'universal-cookie';

export default function PersonalInformation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<CustomerState>();
    const [quantity, setQuantity] = useState(0);
    const aiStyle = { color: '#2F70AF', marginLeft: '5px' };

    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {
        cookies = new Cookies()
        token = cookies.get("token")?.token;
        const response = fetch(
            'http://bevm.e-biz.com.vn/api/Users/' + id,
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
            <Descriptions title={book?.name}
            column={1}>
                <Descriptions.Item label="ID">{book?.id}</Descriptions.Item>
                <Descriptions.Item label="CitizenId">{book?.citizenId}</Descriptions.Item>
                <Descriptions.Item label="Telephone">{book?.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Email">{book?.email}</Descriptions.Item>
            </Descriptions>
            </div>
    );
};

