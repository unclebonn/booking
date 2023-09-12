import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './stylesEmployee.css';
import Add from '../addNew/newEmployee';
import { LoginPermissionState, UserListState } from '../../../app/type.d';
import { Button, Table, Space, Divider, Select, message, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import { havePermission } from '../../../utils/permission_proccess';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    contact: string;
    status: string;
    level: string;
    phoneNumber?: string;
    email?: string;
    citizenId?: string;
}

export default function Employees() {
    const [addForm, setAddForm] = useState(false);
    const [deleteForm, setDeleteForm] = useState(false);
    const [all_data, setAllData] = useState<UserListState>();
    const [search, setSearch] = useState('');
    const [data, setData] = useState(all_data);

    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const dataListShow: DataType[] = [];
    const navigate = useNavigate();

    const addPermission = havePermission("User", "write");
    const deletePermission = havePermission("User", "delete");
    const allPermission = havePermission("User", "all");

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên Nhân Viên',
            dataIndex: 'name',
            render: (text, record) => <a onClick={() => navigate("detail/" + record.id)}>{text}</a>,
        },
        {
            title: 'Thông tin liên hệ',
            dataIndex: 'contact',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'level',
            filters: [
                {
                    text: 'Super Admin',
                    value: 'SUPER ADMIN',
                },
                {
                    text: 'Sales Admin',
                    value: 'SALES ADMIN',
                },
                {
                    text: 'Sales',
                    value: 'SALES',
                },
            ],
            onFilter: (value: any, record) => record.level.indexOf(value) === 0,
        },
        {
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

        },
        {
            title: '',
            key: 'action',
            width: '112px',
            render: (_, record) => (
                <Space size="small">
                    <Button size={"middle"} onClick={() => navigate("detail/" + record.id)}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                    {deletePermission && <Button size={"middle"} onClick={() => handleDelete1(record.id, record.name)}><FontAwesomeIcon icon={faTrashCan} /></Button>}
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetch_Api({
            url: api_links.user.saleAdmin.getUserUser,
            method: 'GET',
            data: undefined
        })
            .then(data => {
                setAllData(data.data);
                setData(data.data);
            })

        }, [addForm, deleteForm]);

    data?.map((dataTemp, index) => dataListShow.push({
        key: dataTemp.id,//index
        id: dataTemp.id,
        name: dataTemp.name,
        contact: dataTemp.phoneNumber ? dataTemp.phoneNumber : (dataTemp.email ? dataTemp.email : ""),
        status: dataTemp.isBlocked ? "Đã khóa" : "Đang hoạt động",
        level: dataTemp.roles.map((d) => d.normalizedName).join(" / "),
    }));

    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = all_data?.filter((item) =>
                String(item.id).toLowerCase().includes(search.toLowerCase()) ||
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.email?.toLowerCase().includes(search.toLowerCase()) ||
                item.phoneNumber?.toLowerCase().includes(search.toLowerCase()) ||
                item.citizenId?.toLowerCase().includes(search.toLowerCase())
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
                    data?.sort((a, b) => (a.name > b.name) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.name < b.name) ? 1 : -1);
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
                setData(data?.filter((a) => (a.lockoutEnabled == true)));
                break;
            case 2:
                setData(data?.filter((a) => (a.lockoutEnabled == false)));
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

    function handleDelete1(itemId: string, itemName: string) {
        message.loading({
            key: 'openloading',
            type: 'loading',
            content: 'Đang xóa... ',
        }, 0);
        fetch_Api({
            url: api_links.user.superAdmin.blockUser + '/' + itemId,
            method: 'delete',
        })
            .then(data => {
                //console.log(data.data);
                setDeleteForm(!deleteForm);
             })
        message.destroy('openloading');
        message.success({
            type: 'success',
            content: 'Xóa thành công nhân viên ' + itemName + '!'
        }, 1.5)
    }

    function handleDeleteMulti() {
        message.loading({
            key: 'openloading',
            type: 'loading',
            content: 'Đang xóa ' + String(selectedRowKeys.length) + ' nhân viên...',
        }, 0);
        selectedRowKeys.map((key) => {
            fetch_Api({
                url: api_links.user.superAdmin.blockUser + '/' + key,
                method: 'delete',
            })
                .then(data => {
                //console.log(data.data);
                setDeleteForm(!deleteForm);                })
        })
        message.destroy('openloading');
        message.success({
            type: 'success',
            content: 'Đã xóa ' + String(selectedRowKeys.length) + ' nhân viên!'
        }, 1.5)
    }

    return (
        <div className='user-employlist'>

            {!addForm && <>
                <div className='dashboard-content-header1'>
                    <div className='dashboard-content-header2'>
                        <h2>Danh sách nhân viên</h2>
                        {allPermission && <Button type="primary" className="btnAdd" onClick={() => navigate("/managerdashboard/nhan-vien")}>
                            Xem tất cả
                        </Button>}
                    </div>
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
                        {addPermission && <Button type="primary" className="btnAdd" onClick={() => setAddForm(!addForm)}>
                            Thêm
                        </Button>}
                        {deletePermission && <Button
                            disabled={!hasSelected}
                            type="primary"
                            style={!hasSelected ?
                                { backgroundColor: "rgba(0,0,0,0.45)" }
                                : { backgroundColor: "red" }}
                            onClick={() => //openNotification(placement)
                            { handleDeleteMulti(); setSelectedRowKeys([]) }}
                        >
                            Xóa {hasSelected ? `${selectedRowKeys.length} nhân viên` : ''}
                        </Button>}
                    </div>

                    <div className='dashboard-content-header2-right'>
                        <div className='dashboard-content-search'>
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Tên nhân viên...'
                                className='dashboard-content-input'
                            />
                        </div>
                    </div>
                </div>

                <div className='dashboard-content-header3'>
                    <Button
                        size='large'
                        type="default"
                        onClick={() => {
                            sortList(!ascending, sortType);
                            setAscending(!ascending)
                        }}
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                        {ascending ? "Tăng dần" : "Giảm dần"}
                    </Button>
                    <Select
                        className="text-bold"
                        size='large'
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

                {deletePermission ? <Table rowSelection={rowSelection} columns={columns} dataSource={dataListShow} />
                    : <Table columns={columns} dataSource={dataListShow} />}
            </>}
            {addForm && <><div className='dashboard-content-header2'>
                <h2>Thông tin nhân viên</h2>
                <Button className="btn btn-primary"
                        onClick={() => setAddForm(!addForm)}>Cancel</Button></div>
                    <Add />
            </>}
        </div>
    )
};
