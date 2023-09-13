import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesEmployee.scss';
import Add from './addNew';
import { LoginPermissionState, UserListState } from '../../../app/type.d';
import { Button, Table, Space, Divider, Select, message, Modal, Input, List } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import { havePermission } from '../../../utils/permission_proccess';

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

    const [record, setRecord] = useState<DataType>(undefined!)
    const [addFormRecover, setAddFormRecover] = useState(false);
    const [dataRecover, setDataRecover] = useState<DataType[]>([])

    const dataListShow: DataType[] = [];
    const navigate = useNavigate();

    const addPermission = havePermission("Customer", "write");
    const deletePermission = havePermission("Customer", "delete");
    const restorePermission = havePermission("Customer", "restore");


    useEffect(() => {
        document.title = "Nhân viên"
        fetch_Api({
            url: api_links.user.superAdmin.getAllUser,
            method: 'GET',
            data: undefined
        })
            .then(data => {
                setAllData(data.data);
                setData(data.data);
            })

        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Users/all-deleted-users",
            method: 'GET',
        })
            .then(data => {
                setDataRecover(data.data);
            })
    }, [addForm, addFormRecover, deleteForm]);
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
    const columnsRecover: ColumnsType<DataType> = [
        {
            title: 'Tên nhân viên',
            dataIndex: 'name',
        },
        {
            title: 'Thông tin',
            dataIndex: 'contact',
            render: (_, record) =>
                <div>
                    {record.citizenId && "CCCD/CMND: " + record.citizenId}<br />
                    {record.phoneNumber ? "ĐT: " + record.phoneNumber : record.email ? "Email: " + record.email : ""}
                </div>
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: (text, record) =>
                <div className="item-content-recover">
                    <Button type='primary' onClick={() => handleRecover(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                </div>
        },
    ];



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
                    setDeleteForm(!deleteForm);
                })
        })
        message.destroy('openloading');
        message.success({
            type: 'success',
            content: 'Đã xóa ' + String(selectedRowKeys.length) + ' nhân viên!'
        }, 1.5)
    }

    const handleRecover = (recordId: string) => {
        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Users/restore-user/" + recordId,
            method: "PATCH",
        })
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    return (
        <React.Fragment>
            <Modal
                //width="40vw"
                style={{ top: "5vh" }}
                open={addFormRecover}
                title="Khôi phục"
                onCancel={() => {
                    setAddFormRecover(!addFormRecover)
                }}
                footer={[]}>
                <Table className='recover-table' columns={columnsRecover} dataSource={dataRecover} />
            </Modal>

            
        </React.Fragment>
    )
};
