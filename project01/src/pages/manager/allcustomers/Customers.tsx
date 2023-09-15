import React, { useState, useEffect } from 'react';
import './stylesCustomers.scss';
import Add from './addNew';
import { CustomerListState } from '../../../app/type.d';
import { Button, Table, Space, Divider, Select, message, Modal, Input, List } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useParams, Link } from 'react-router-dom';

import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import { havePermission } from '../../../utils/permission_proccess';

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
    const [messageApi, contextHolder] = message.useMessage();
    const [all_data, setAllData] = useState<CustomerListState>();
    const [search, setSearch] = useState('');
    const [data, setData] = useState(all_data);

    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [record, setRecord] = useState<DataType>(undefined!)
    const [addFormRecover, setAddFormRecover] = useState(false);
    const [dataRecover, setDataRecover] = useState<DataType[]>([])
    const [deleteForm, setDeleteForm] = useState(false);

    const navigate = useNavigate();

    const addPermission = havePermission("Customer", "write");
    const deletePermission = havePermission("Customer", "delete");
    const restorePermission = havePermission("Customer", "restore");

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
    // const columnsRecover: ColumnsType<DataType> = [
    //     {
    //         title: 'Tên khách hàng',
    //         dataIndex: 'name',
    //     },
    //     {
    //         title: 'Thông tin',
    //         dataIndex: 'contact',
    //         render: (_, record) =>
    //             <div>
    //                 {record.citizenId && "CCCD/CMND: " + record.citizenId}<br />
    //                 {record.phoneNumber ? "ĐT: " + record.phoneNumber : record.email ? "Email: " + record.email : ""}
    //             </div>
    //     },
    //     {
    //         title: 'Thao tác',
    //         dataIndex: 'action',
    //         render: (text, record) =>
    //             <div className="item-content-recover">
    //                 <Button type='primary' onClick={() => handleRecover(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
    //             </div>
    //     },
    // ];

    useEffect(() => {

        document.title = "Khách hàng"
        fetch_Api({
            url: api_links.user.superAdmin.getAllCustomer,
            method: 'GET',
            data: undefined
        })
            .then(data => {
                setAllData(data.data);
                setData(data.data);
            })

        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Customers/all-deleted-customers",
            method: 'GET',
        })
            .then(data => {
                setDataRecover(data.data);
            })
    }, [addForm, addFormRecover, deleteForm]);

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
                //console.log(data.data);
                setDeleteForm(!deleteForm);
            })

        message.destroy('openloading');
        message.success({
            type: 'success',
            content: 'Xóa thành công khách hàng ' + itemName + '!'
        }, 1.5)
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
                    //console.log(data.data);
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
        <React.Fragment>
            {/* <Modal
                //width="80vw"
                style={{ top: "5vh" }}
                open={addFormRecover}
                title="Khôi phục"
                onCancel={() => {
                    setAddFormRecover(!addFormRecover)
                }}
                footer={[]}>
                <Table className='recover-table' columns={columnsRecover} dataSource={dataRecover} />
            </Modal> */}

            <div className='user-customerlist'>
                {!addForm && <>
                    <Space className='dashboard-content-header1'>
                        <Space className='dashboard-content-header2'>
                            <h2>Danh sách khách hàng</h2>
                            {/*<Button type="primary" className="btnAdd" onClick={() => navigate("/dashboard/khach-hang")}>
                                Trở về
                </Button>*/}
                        </Space>
                        <hr
                            style={{
                                borderTop: '1px solid black',
                                width: '100%',
                                opacity: '.25',
                            }}
                        />
                    </Space>
                    <Space className='dashboard-content-header2' wrap>
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
                                Xóa {`${selectedRowKeys.length ? selectedRowKeys.length : ""} khách hàng`}
                            </Button>}
                            {/* {restorePermission && <Button type='primary' onClick={() => setAddFormRecover(true)} style={{ background: "#465d65" }}>Khôi phục</Button>} */}
                        </div>

                        <div className='dashboard-content-header2-right'>
                            {/* <Space className='dashboard-content-search'> */}
                            <Input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Tên khách hàng..'
                                className='dashboard-content-input'
                            />
                            {/* </Space> */}
                        </div>
                    </Space>

                    <Space className='dashboard-content-header3'>


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
                    </Space>

                    <div className='displayDataTable'>
                        {deletePermission ? <Table rowSelection={rowSelection} columns={columns} dataSource={dataListShow} />
                            : <Table columns={columns} dataSource={dataListShow} />}
                    </div>

                </>
                }
                {!addForm &&
                    <List
                        bordered
                        className='displayDataTable--responsive'
                        itemLayout='vertical'
                        size='large'
                        pagination={{
                            align: "end",
                            position: "bottom"
                        }}
                        dataSource={dataListShow}
                        renderItem={(item) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <Space size="small">
                                        <Button size={"middle"} onClick={() => navigate("detail/" + item.id)}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                                        {deletePermission && <Button size={"middle"} onClick={() => handleDelete1(item.id, item.name)}><FontAwesomeIcon icon={faTrashCan} /></Button>}
                                    </Space>
                                }
                            >
                                <List.Item.Meta
                                    title={<a style={{ color: "#1677ff" }} onClick={() => navigate("detail/" + item.id)}>{item.name}</a>}
                                    description={`Thông tin liên hệ: ${item.contact}`}
                                />
                            </List.Item>
                        )}

                    />}

                {addForm && <><Space className='dashboard-content-header2'>
                    <h2>Thông tin khách hàng</h2>
                    <Button className="btn btn-primary"
                        onClick={() => setAddForm(!addForm)}>Cancel</Button></Space>
                    <Add />

                </>}
            </div>
        </React.Fragment>

    )
};