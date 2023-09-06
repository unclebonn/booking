import React, { useState, useEffect } from 'react';
import './stylesCustomers.scss';
import Add from '../addNew/newCustomer';
import { CustomerListState } from '../../../app/type.d';
import { Button, Table, Space, Divider, Select, message, Modal, Popconfirm, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useParams, Link } from 'react-router-dom';

import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import { havePermission } from '../../../utils/permission_proccess';
import { NotificationPlacement } from 'antd/es/notification/interface';

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    contact: string;
    status: string;
    phoneNumber?: string;
    email?: string;
    citizenId?: string;
}


export default function Customers() {
    const [addForm, setAddForm] = useState(false);
    // const [messageApi, contextHolder] = message.useMessage();
    const [deleteForm, setDeleteForm] = useState(false);
    // const [messageApi, contextHolder] = message.useMessage();
    const [all_data, setAllData] = useState<CustomerListState>();
    const [search, setSearch] = useState('');
    const [data, setData] = useState(all_data);

    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const navigate = useNavigate();

    const addPermission = havePermission("Customer", "write");
    const deletePermission = havePermission("Customer", "delete");
    const allPermission = havePermission("Customer", "all");
    const [api, contextHolder] = notification.useNotification()
    const key = `open${Date.now()}`;
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            render: (text, record) => <a onClick={() => navigate("detail/" + record.id)}>{text}</a>,
        },
        {
            title: 'Thông tin liên hệ',
            dataIndex: 'contact',
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
            url: api_links.user.saleAdmin.getUserCustomer,
            method: 'GET',
            data: undefined
        })
            .then(data => {
                setAllData(data.data);
                setData(data.data);
            })

    }, [addForm, deleteForm]);

    const dataListShow: DataType[] = [];
    data?.map((dataTemp, index) => dataListShow.push({
        key: dataTemp.id,//index
        id: String(dataTemp.id),
        name: dataTemp.name,
        contact: dataTemp.phoneNumber ? dataTemp.phoneNumber : (dataTemp.email ? dataTemp.email : ""),
        status: dataTemp.isBlocked ? "Đã khóa" : "Đang hoạt động",
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


    const openNotification = (placement: NotificationPlacement, selectedRowKeys: number) => {
        api.warning({
            message: `Lưu ý`,
            description: `Bạn có chắc chắn xoá ${selectedRowKeys} khách hàng không`,
            placement: `${placement}`,
            btn,
            key
        })
    }

    const btn = (
        <Space>
            <Button type="default" size="middle" onClick={() => api.destroy()}>
                Huỷ bỏ
            </Button>
            <Button type="primary" size="middle" onClick={() => { handleDeleteMulti(); api.destroy(); setSelectedRowKeys([]) }}>
                Xoá
            </Button>
        </Space>
    );

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
            url: api_links.user.superAdmin.blockCustomer + '/' + itemId,
            method: 'delete',
        })
            .then(data => {
                if (data.status === 200) {
                    message.destroy('openloading');
                    message.success({
                        type: 'success',
                        content: 'Xóa thành công khách hàng ' + itemName + '!'
                    }, 1.5)
                }
            })
        setDeleteForm(!deleteForm);


    }

    function handleDeleteMulti() {
        message.loading({
            key: 'openloading',
            type: 'loading',
            content: 'Đang xóa ' + String(selectedRowKeys.length) + ' khách hàng...',
        }, 0);
        selectedRowKeys.map((key) => {
            fetch_Api({
                url: api_links.user.superAdmin.blockCustomer + '/' + key,
                method: 'delete',
            })
                .then(data => {
                    ////console.log(data.data);
                    setDeleteForm(!deleteForm);
                })
        })
        message.destroy('openloading');
        message.success({
            type: 'success',
            content: 'Đã xóa ' + String(selectedRowKeys.length) + ' khách hàng!'
        }, 1.5)
    }

    return (
        <div className='user-customerlist'>
            {!addForm &&
                <>
                    <div className='dashboard-content-header1'>
                        <div className='dashboard-content-header2'>
                            <h2>Danh sách khách hàng</h2>
                            {allPermission && <Button type="primary" className="btnAdd" onClick={() => navigate("/managerdashboard/khach-hang")}>
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
                            {contextHolder}

                            {addPermission &&
                                <Button type="primary" className="btnAdd" onClick={() => setAddForm(!addForm)}>
                                    Thêm
                                </Button>}
                            {deletePermission &&

                                <Button
                                    onClick={() => openNotification("top", selectedRowKeys.length)}
                                    disabled={!hasSelected}
                                    type="primary"
                                    style={!hasSelected ?
                                        { backgroundColor: "rgba(0,0,0,0.45)" }
                                        : { backgroundColor: "red" }}
                                >
                                    Xóa   {hasSelected ? `${selectedRowKeys.length}` : ''} khách hàng
                                </Button>

                            }
                        </div>

                        <div className='dashboard-content-header2-right'>
                            <div className='dashboard-content-search'>
                                <input
                                    type='text'
                                    onChange={e => __handleSearch(e)}
                                    placeholder='Tên khách hàng...'
                                    className='dashboard-content-input'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='dashboard-content-header3'>
                        {/* <span style={{ textAlign: 'left', fontSize: 'initial', alignSelf: 'center', width: '100%' }}>
                      
                    </span> */}
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
                <h2>Thông tin khách hàng</h2>
                <Button className="btn btn-primary"
                    onClick={() => setAddForm(!addForm)}>Cancel</Button></div>
                <Add />

            </>}
        </div>

    )
};