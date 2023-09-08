import React, { useState, useEffect } from 'react';
import { VoucherListState, VoucherState, VoucherTypeListState, VoucherTypeState } from '../../../app/type.d';
import { ColumnsType } from 'antd/es/table';
import Cookies from 'universal-cookie';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import { Button, Col, Modal, Row, Space, Tag, message, Table, Popconfirm, Divider, Select, Form, Input, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import Notification from '../../../component/notification/Notification';
import './vouchercustomer.scss'
import { havePermission } from '../../../utils/permission_proccess';



export default function VoucherCustomer() {

    //useState
    const [all_data, setAllData] = useState<VoucherListState>([]);
    const [data, setData] = useState<VoucherListState>(all_data);
    const [sortType, setSortType] = useState('cost');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [addForm, setAddForm] = useState(false);
    const [addFormRecover, setAddFormRecover] = useState(false);
    const [dataRecover, setDataRecover] = useState<VoucherListState>([])
    const [addFormInformationService, setAddFormInformationService] = useState(false)
    const [record, setRecord] = useState<VoucherState>(undefined!)
    const [voucherStatus, setVoucherStatus] = useState<string>("")

    const addPermission = havePermission("Voucher", "write");
    const deletePermission = havePermission("Voucher", "delete");
    const restorePermission = havePermission("Voucher", "restore");
    const editPermission = havePermission("Voucher", "update");

    useEffect(() => {
        getAllVoucher()
            .then((res) => {
                if (res.status === 200) {
                    setAllData(res.data);
                    setData(res.data);

                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
        getAllDeleteVoucher()
            .then((res) => {
                if (res.status === 200) {
                    setDataRecover(res.data)
                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
    }, [])


    // call api to get data
    const dataListShow: VoucherListState = [];
    data?.map((dataTemp) => dataListShow.push({
        key: dataTemp.id,//index
        id: dataTemp.id,
        href: 'https://ant.design',
        image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        customer: dataTemp.customer,
        salesEmployee: dataTemp.salesEmployee,
        voucherType: dataTemp.voucherType,
        issuedDate: dataTemp.issuedDate,
        expiredDate: dataTemp.expiredDate,
        actualPrice: dataTemp.actualPrice,
        usedValueDiscount: dataTemp.usedValueDiscount,
        voucherStatus: dataTemp.voucherStatus,
        bookings: dataTemp.bookings,
        voucherExtensions: dataTemp.voucherExtensions
    }));

    const handleDelete = (e: number) => {
        deleteVoucher(e)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                    getAllVoucher()
                        .then((res) => {
                            setAllData(res.data);
                            setData(res.data);
                        })
                        .catch((reason) => {
                            //console.log(reason);
                        })
                    getAllDeleteVoucher()
                        .then((res) => {
                            if (res.status === 200) {
                                setDataRecover(res.data)
                            }
                        })
                        .catch((reason) => {
                            //console.log(reason);
                        })
                }
            })
            .catch((reason) => {
                message.error(reason.message)
            })
    }


    const handleRecover = (recordId: number) => {
        const recoverData = dataRecover.filter((data) => data.id !== recordId)
        recoverVoucher(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    setDataRecover(recoverData)
                    message.success(res_re.data.message)
                    getAllVoucher()
                        .then((res) => {
                            if (res.status === 200) {
                                setAllData(res.data)
                            }
                        })
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }


    const columns: ColumnsType<VoucherState> = [
        {
            title: 'Lựa chọn',
            dataIndex: 'image',
            width: '300px',
            render: (img) =>
                <a>
                    <img
                        width={300}
                        alt="logo"
                        src={img}
                    />
                </a>,
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'service',
            render: (text, record, index) => <>
                <div className="item-content">
                    <span><b style={{ color: "#4096ff" }}>Thời gian bắt đầu:</b> {new Date(record?.issuedDate).toLocaleString("vi-VN")}</span>
                    <span><b style={{ color: "#4096ff" }}>Hết hạn:</b> {new Date(record?.expiredDate).toLocaleString("vi-VN")}</span>
                </div>
                <div className="bonus-content">
                    <div>Giá bán: {record?.actualPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</div>
                </div></>,
        },
        {
            title: 'Thao tác',
            key: 'id',
            width: '112px',
            render: (text, record, index) => (
                <Space size="small">
                    {editPermission && <Link to={"createvoucherextension"} state={record}>
                        <Button type='default' size='large'>
                            <FontAwesomeIcon title='Sửa đổi' icon={faPenToSquare} />
                        </Button>
                    </Link>}
                </Space>

            )
        },
    ];

    const columnsRecover: ColumnsType<VoucherState> = [
        {
            title: 'Khách hàng',
            dataIndex: 'typeName',
            render: (text, record, index) =>
                <div className="item-content-recover">
                    <a style={{ fontWeight: "bold" }}>{record?.customer?.name}</a>
                </div>

        },
        {
            title: 'Nhân viên',
            dataIndex: 'conditionsAndPolicies',
            render: (text, record, index) =>
                <div className="item-content-recover">

                    <p>{record?.salesEmployee?.name}</p>
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
    ]




    // // search data
    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            let search_results = all_data.filter((item) => {
                if (item.customer.name.toLowerCase().includes(event.target.value.toLowerCase())) return item.customer.name.toLowerCase()
            });

            setData(search_results);
        }
        else {
            setData(all_data);
        }
    };

    // sort data by descending or increment
    function sortList(tang_dan: boolean, sorttype: string) {
        if (tang_dan) {
            switch (sorttype) {
                case "date":
                    data?.sort((a, b) => (a.issuedDate > b.issuedDate) ? 1 : -1);
                    break;
                case "cost":
                    data?.sort((a, b) => (a.actualPrice > b.actualPrice) ? 1 : -1);
                    break;

                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "date":
                    data?.sort((a, b) => (a.issuedDate < b.issuedDate) ? 1 : -1);
                    break;
                case "cost":
                    data?.sort((a, b) => (a.actualPrice < b.actualPrice) ? 1 : -1);
                    break;

                default:
                    break;
            }
        }
    }

    //=========================== GET API ====================================
    const getVoucher = (voucherId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.getVoucher.url}${voucherId}`,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    const getAllVoucher = () => {
        const api_link = {
            url: api_links.user.superAdmin.getAllVoucher,
            method: "GET",
        }
        return fetch_Api(api_link)
    }
    const deleteVoucher = (e: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.deleteVoucher.url}${e}`,
            method: "DELETE",
        }
        return fetch_Api(api_link)
    }

    const getAllDeleteVoucher = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteVoucher
        return fetch_Api(api_link)
    }

    const recoverVoucher = (recordId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverVoucher.url}${recordId}`,
            method: "PATCH",
        }
        return fetch_Api(api_link)
    }



    // ====================================================================

    const handleTableRowClick = (record: VoucherState) => {
        setAddFormInformationService(!addFormInformationService)
        // setRecord(record)
        getVoucher(record.id)
            .then((res) => {
                if (res.status === 200) {
                    setRecord(res.data)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })

    }


    // voucher status 
    const getVoucherStatus = () => {
        switch (record?.voucherStatus) {
            case "Expired":
                return "Hết hạn"


            case "Usable":
                return "Sử dụng"

            case "OutOfValue":
                return "Không có giá trị"

            case "Blocked":
                return "Khoá"
        }
    }

    return (
        <React.Fragment>
            <Modal
                open={addForm}
                footer={[]}
                onCancel={() => setAddForm(false)}
                style={{ top: "25vh" }}
            >
                <Space direction='horizontal' style={{ justifyContent: "space-between" }}>
                    <Row gutter={[10, 10]}>
                        <Col>
                            <Link to={"createvouchercustomer"}>
                                <Button type='default' size='large'>
                                    Tạo voucher cho khách hàng
                                </Button>
                            </Link>
                        </Col>
                        <Col>

                        </Col>
                    </Row>
                </Space>
            </Modal>

            <Modal
                width="40vw"
                style={{ top: "5vh" }}
                open={addFormRecover}
                title="Khôi phục"
                onCancel={() => {
                    setAddFormRecover(!addFormRecover)
                    getAllVoucher()
                        .then((res) => {
                            if (res.status === 200) {
                                setAllData(res.data);
                                setData(res.data);
                            }
                        })
                        .catch((reason) => {
                            //console.log(reason);
                        })

                }}
                footer={[]}



            >
                <Table className='recover-table' columns={columnsRecover} dataSource={dataRecover} />

            </Modal>


            <Modal
                open={addFormInformationService}
                onCancel={() => setAddFormInformationService(!addFormInformationService)}
                footer={[]}
                width="65vw"
            >
                <Space size={[25, 0]} direction='horizontal' className='uservoucher-record' align='center'>
                    <Space.Compact className='coupon-left' direction='vertical'>
                        <div>
                            <img src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" alt="image" width="250px" />
                        </div>
                        {deletePermission && <Popconfirm
                            className="ant-popconfirm"
                            title="Xoá dịch vụ"
                            description="Bạn có chắc chắn xoá không ?"
                            onConfirm={() => {
                                handleDelete(record.id)
                                setAddFormInformationService(!addFormInformationService)
                            }}
                            okText="Xoá"
                            cancelText="Huỷ"
                            placement='bottomLeft'
                        >
                            <Button size={"large"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                        </Popconfirm>}
                    </Space.Compact>
                    <Space.Compact className='coupon-con' direction='vertical'>
                        <Divider orientation='left'>Thông tin</Divider>
                        <Space direction='vertical' className='uservoucher-record--information'>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Tên khách hàng: </span>
                                        <span>{record?.customer?.name}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Tên nhân viên: </span>
                                        <span>{record?.salesEmployee?.name}</span>

                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Loại voucher: </span>
                                        <span>{record?.voucherType?.typeName}</span> <span style={{ color: "red" }}>( Mã voucher: {record?.voucherType?.id} )</span>

                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Giá bán: </span>
                                        <span>{record?.actualPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>

                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Ngày bắt đầu: </span>
                                        <span>{new Date(record?.issuedDate).toLocaleString("vi-VN")}</span>
                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Ngày hết hạn: </span>
                                        <span>{new Date(record?.expiredDate).toLocaleString("vi-VN")}</span>
                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Trạng thái: </span>
                                        <span>{getVoucherStatus()}</span>
                                    </Col>
                                </Row>

                            </Space>
                        </Space>
                    </Space.Compact>
                </Space>
            </Modal>

            <div className="user-voucherextension">
                <div className="dashboard-content-header1">
                    <h2>Danh sách voucher</h2>

                    <hr
                        style={{
                            borderTop: '1px solid black',
                            width: '100%',
                            opacity: '.25',
                        }}
                    />
                </div>
                <div className="dashboard-content-header2">
                    <div className="dashboard-content-header2-left">
                        {addPermission && <Button type="primary" onClick={() => setAddForm(true)}>
                            Tạo
                        </Button>}
                        {restorePermission && <Button type='primary' onClick={() => setAddFormRecover(true)} style={{ background: "#465d65" }}>Khôi phục</Button>}
                    </div>

                    <div className="dashboard-content-header2-right">
                        <div className="dashboard-content-search">
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Tên khách hàng...'
                                className="dashboard-content-input"
                            />
                        </div>

                    </div>

                </div>
                <div className="dashboard-content-header3">
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
                        defaultValue="cost"
                        style={{ width: 120 }}
                        onChange={(e) => {
                            sortList(ascending, e);
                            setSortType(e)
                        }}
                        options={[
                            { value: 'date', label: 'Ngày' },
                            { value: 'cost', label: 'Giá bán' },
                        ]}
                    />
                </div>

                <Table columns={columns} dataSource={dataListShow}
                    onRow={(record) => ({
                        onClick: () => handleTableRowClick(record),
                    })}
                />

            </div>
        </React.Fragment>

    )

};

