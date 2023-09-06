import React, { useState, useEffect } from 'react';
import './stylesService.css';

export default function MyService() {

    useEffect(() => {

    }, []);

    return (
        <div className='customer-service'>
            <div className='dashboard-content-header'>
                <h2>Dịch vụ của tôi</h2>
                <div className='dashboard-content-search'>
                    <input
                        type='text'
                        autoFocus
                        placeholder='Search..'
                        className='dashboard-content-input'
                    />
                </div>
            </div>
        </div>
    )
};