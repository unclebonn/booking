import React, { useState, useEffect } from 'react';
import './stylesEmployee.scss';
import Add from './addNew';
import { UserListState } from '../../../app/type.d';
import { Button, Table, Space, Divider, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import Cookies from 'universal-cookie';

type DataType={
    "id": string,
    "normalizedName": string,
    "isManager": boolean,
    "roleClaims": 
      {
        "id": 1,
        "claimValue": string,
      }[]
}[]

export default function Role() {
    const [addForm, setAddForm] = useState(false);
    const [all_data, setAllData] = useState<DataType>();
    const [search, setSearch] = useState('');
    const [data, setData] = useState(all_data);

    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState(0);


    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {
        cookies = new Cookies()
        token = cookies.get("token")?.token;
        setLoading(true);
        const response = fetch(
            'http://bevm.e-biz.com.vn/api/Roles/All',
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
                setAllData(data);
                setData(data);
            })
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    }, []);

    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = all_data?.filter((item) =>
                String(item.id).toLowerCase().includes(search.toLowerCase()) ||
                item.normalizedName.toLowerCase().includes(search.toLowerCase())
                );
            setData(search_results);
        }
        else {
            setData(all_data);
        }
    };

    function sortList(tang_dan: boolean, sorttype: string) {
        if (tang_dan) {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.normalizedName > b.normalizedName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.normalizedName < b.normalizedName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
    }

    function filterList(filtype: number) {
        switch (filtype) {
            case 0:
                setData(all_data);
                sortList(ascending, sortType);
                break;
            case 1:
                setData(data?.filter((a) => (a.isManager == true)));
                break;
            case 2:
                setData(data?.filter((a) => (a.isManager == false)));
                break;
            default:
                break;
        }
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className='user-employlist'>

            {!addForm && <>
                <div className='dashboard-content-header1'>
                    <h2>Quyền hạn tài khoản</h2>

                    <hr
                        style={{
                            borderTop: '1px solid black',
                            width: '100%',
                            opacity: '.25',
                        }}
                    />
                </div>
                <div className='dashboard-content-header2'>
                    <div className='dashboard-content-header2-left'>
                        <button type="button" className="btn btn-primary" onClick={() => setAddForm(!addForm)}>
                            Thêm
                        </button></div>

                    <div className='dashboard-content-header2-right'>
                        <div className='dashboard-content-search'>
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Search..'
                                className='dashboard-content-input'
                            />
                        </div>
                    </div>
                </div>

                <div className='dashboard-content-header3'>
                    <span>Sắp xếp theo </span>
                    <button type="button" className="btn" onClick={() => {
                        sortList(!ascending, sortType);
                        setAscending(!ascending)
                    }}>
                        {ascending ? "Tăng dần" : "Giảm dần"}
                    </button>
                    <Select
                        defaultValue="name"
                        style={{ width: 120 }}
                        onChange={(e) => {
                            sortList(ascending, e);
                            setSortType(e)
                        }}
                        options={[
                            { value: 'name', label: 'Tên' },
                        ]}
                    />
                </div>

                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
            </>
            }

            {addForm && <><div className='dashboard-content-header2'>
                <h2>Thông tin nhân viên</h2>
                <button type="submit" className="btn btn-primary"
                    onClick={() => setAddForm(!addForm)}>Cancel</button></div>
                <Add />
            </>}
        </div>
    )
};
