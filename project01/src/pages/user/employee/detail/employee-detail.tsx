import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import Cookies from 'universal-cookie';

import PersonalInformation from './personalInformation';
import './styles.css';

export default function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {

    }, []);

    return (
        <div className='user-customerdetail'>
       <PersonalInformation/>
        </div>
    );
};