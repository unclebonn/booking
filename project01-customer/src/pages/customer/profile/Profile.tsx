import React, { useState, useEffect } from 'react';
import './stylesProfile.css';
import Cookies from 'universal-cookie';
import ProfileDisplay from './ProfileDisplay';


export default function Profile() {

    const [user, setUser] = useState();
    var cookies = new Cookies();
    var token = cookies.get("token")?.token;

    return (
        <div className='customer-profile'>
            <div className='dashboard-content-header'>
                <div style={{ padding: "25px" }}>
                    <h1>Thông tin cá nhân</h1>
                </div>
                <ProfileDisplay />

            </div>
        </div>
    )
};