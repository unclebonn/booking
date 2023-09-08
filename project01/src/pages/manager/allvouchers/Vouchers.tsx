import React, { useState, useEffect } from 'react';
import { VoucherTypeListState, VoucherTypeState } from '../../../app/type.d';
import { ColumnsType } from 'antd/es/table';
import Cookies from 'universal-cookie';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import { Button, Col, Modal, Row, Space, Tag, message, Table, Popconfirm, Divider, Select } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import Notification from '../../../component/notification/Notification';
import './stylesVouchers.scss'


interface DataType {
    "key": React.Key;
    "href"?: string | undefined;
    "image"?: string;
    "id": number,
    "typeName": string,
    "isAvailable": boolean,
    "commonPrice": number,
    "valueDiscount": number,
    "availableNumberOfVouchers": number,
    "percentageDiscount": number,
    "maximumValueDiscount": number,
    "conditionsAndPolicies": string,
    "vouchers": [],
    "usableServicePackages": []

}


export default function Services() {

    //useState
    const [all_data, setAllData] = useState<VoucherTypeListState>([]);
    const [data, setData] = useState<VoucherTypeListState>(all_data);
    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [addForm, setAddForm] = useState(false);
    const [addFormRecover, setAddFormRecover] = useState(false);
    const [dataRecover, setDataRecover] = useState<DataType[]>([])
    const [addFormInformationService, setAddFormInformationService] = useState(false)
    const [record, setRecord] = useState<DataType>(undefined!)

    //get data from cookie
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;

    useEffect(() => {
        getAllVoucherTypes()
            .then((res) => {
                if (res.status === 200) {
                    setAllData(res.data);
                    setData(res.data);

                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
        getAllDeleteVoucherType()
            .then((res) => {
                if (res.status === 200) {
                    //console.log(res);
                    setDataRecover(res.data)
                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
    }, [])


    // call api to get data
    const dataListShow: DataType[] = [];
    data?.map((dataTemp) => dataListShow.push({
        key: dataTemp.id,//index
        id: dataTemp.id,
        href: 'https://ant.design',
        image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        typeName: dataTemp.typeName,
        isAvailable: dataTemp.isAvailable,
        commonPrice: dataTemp.commonPrice,
        availableNumberOfVouchers: dataTemp.availableNumberOfVouchers,
        percentageDiscount: dataTemp.percentageDiscount,
        maximumValueDiscount: dataTemp.maximumValueDiscount,
        conditionsAndPolicies: dataTemp.conditionsAndPolicies,
        valueDiscount: dataTemp.valueDiscount,
        vouchers: dataTemp.vouchers,
        usableServicePackages: dataTemp.usableServicePackages
    }));


    // ======================================= use to render the format of the table ===============================================
    // quantity of column, title of column...

    const handleDelete = (e: number) => {
        deleteVoucherType(e)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                    getAllVoucherTypes()
                        .then((res) => {
                            setAllData(res.data);
                            setData(res.data);
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


    // not yet
    const handleRecover = (recordId: number) => {
        const recoverData = dataRecover.filter((data) => data.id !== recordId)
        recoverVoucherType(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    setDataRecover(recoverData)
                    message.success(res_re.data.message)
                    getAllVoucherTypes()
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


    const columns: ColumnsType<DataType> = [
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
                    <a style={{ fontWeight: "bold" }}>{record?.typeName}</a>
                    <span>
                        Giá trị: {record?.percentageDiscount ? `${record?.percentageDiscount}%` : `${record?.valueDiscount}đ`}
                        {record?.maximumValueDiscount ? (` ( Tối đa: ${record.maximumValueDiscount?.toLocaleString('en-US')}đ )`) : ""}

                    </span>
                </div>
                <div className="bonus-content">
                    <div>Số lượng còn lại: {record?.availableNumberOfVouchers}</div>
                </div></>,
        },
        {
            title: 'Thao tác',
            key: 'id',
            width: '112px',
            render: (text, record, index) => (
                <Space size="small">
                    <Link to={"updatevoucher"} state={record}>
                        <Button
                            title='Sửa đổi'
                            size={"large"} >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                    </Link>
                </Space>

            )
        },
    ];

    const columnsRecover: ColumnsType<DataType> = [
        {
            title: 'Gói khuyến mãi',
            dataIndex: 'typeName',
            render: (text, record, index) =>
                <div className="item-content-recover">
                    <a style={{ fontWeight: "bold" }}>{record.typeName}</a>
                </div>

        },
        {
            title: 'Điều kiện',
            dataIndex: 'conditionsAndPolicies',
            render: (text, record, index) =>
                <div className="item-content-recover">

                    <p>Nội dung: {record.conditionsAndPolicies}</p>
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


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };


    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;
    //===================================================================================================================================


    const selectedRowData = all_data.filter((row, index) => selectedRowKeys.includes(index))




    // search data
    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            let search_results = all_data?.filter((item) => {
                return String(item.id).toLowerCase().includes(event.target.value.toLowerCase()) ||
                    item.typeName.toLowerCase().includes(event.target.value.toLowerCase())
            }
            );
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
                case "name":
                    data?.sort((a, b) => (a.typeName > b.typeName) ? 1 : -1);
                    break;
                case "cost":
                    data?.sort((a, b) => (a.commonPrice > b.commonPrice) ? 1 : -1);
                    break;
                case "maxvalue":
                    data?.sort((a, b) => (a.maximumValueDiscount > b.maximumValueDiscount) ? 1 : -1);
                    break;
                case "remain":
                    data?.sort((a, b) => (a.availableNumberOfVouchers > b.availableNumberOfVouchers) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.typeName < b.typeName) ? 1 : -1);
                    break;
                case "cost":
                    data?.sort((a, b) => (a.commonPrice < b.commonPrice) ? 1 : -1);
                    break;
                case "maxvalue":
                    data?.sort((a, b) => (a.maximumValueDiscount < b.maximumValueDiscount) ? 1 : -1);
                    break;
                case "remain":
                    data?.sort((a, b) => (a.availableNumberOfVouchers < b.availableNumberOfVouchers) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
    }

    //=========================== GET API ====================================
    const getAllVoucherTypes = () => {
        const api_link = {
            url: api_links.user.superAdmin.getAllVoucherType,
            method:"GET",
            token:token
        }
        return fetch_Api(api_link)
    }
    const deleteVoucherType = (e: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.deleteVoucherType.url}${e}`,
            method: "DELETE",
            token: token
        }
        return fetch_Api(api_link)
    }

    const getAllDeleteVoucherType = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteVoucherType
        api_link.token = token
        return fetch_Api(api_link)
    }

    const recoverVoucherType = (recordId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverVoucherType.url}${recordId}`,
            method: "PATCH",
            token: token
        }
        return fetch_Api(api_link)
    }



    // ====================================================================

    // not yet
    const handleTableRowClick = (record: DataType) => {
        setAddFormInformationService(!addFormInformationService)
        setRecord(record)
    }



    return (
        <React.Fragment>
            <Modal
                open={addForm}
                footer={[]}
                onCancel={() => setAddForm(false)}
                style={{ top: "25vh", width: " 500px" }}
            >
                <Row>
                    <Col span={24}>
                        <Link to={"createvoucher"}>
                            <Button style={{ width: "100%" }} type='default' size='large'>
                                Thêm mã khuyến mãi
                            </Button>
                        </Link>
                    </Col>
                    {/* <Col span={12}>
                        <Link to={"createvoucerservice"}>
                            <Button type='default' size='large'>
                                Thêm voucher cho dịch vụ
                            </Button>
                        </Link>
                    </Col> */}
                </Row>
            </Modal>

            <Modal
                width="40vw"
                style={{ top: "5vh" }}
                open={addFormRecover}
                title="Khôi phục"
                onCancel={() => {
                    setAddFormRecover(!addFormRecover)
                    getAllVoucherTypes()
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
                            <img src={record?.image} alt="image" width="250px" />
                        </div>
                        <Popconfirm
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
                        </Popconfirm>
                    </Space.Compact>
                    <Space.Compact className='coupon-con' direction='vertical'>
                        <Divider orientation='left'>Thông tin</Divider>
                        <Space direction='vertical' className='uservoucher-record--information'>
                            <Space>
                                <span style={{ color: "#0958d9" }}>Tên gói khuyến mãi: </span>
                                <span>{record?.typeName}</span>
                            </Space>
                            <Space>
                                <span style={{ color: "#0958d9", display: "inline-block", width: "4vw" }}>Điều kiện: </span>
                                <span>{record?.conditionsAndPolicies}</span>
                            </Space>
                            <Space>
                                <span style={{ color: "#0958d9" }}>Giá trị: </span>
                                <span>{record?.commonPrice.toLocaleString("en")}đ</span>
                            </Space>
                            <Space>
                                <span style={{ color: "#0958d9" }}>Số lượng khuyến mãi còn lại: </span>
                                <span>{record?.availableNumberOfVouchers}</span>
                            </Space>
                            <Space>
                                {record?.percentageDiscount ?
                                    <>
                                        <span style={{ color: "#0958d9" }}>Giảm giá: </span>
                                        <span>{record?.percentageDiscount}%</span>
                                    </>
                                    :
                                    <>
                                        <span style={{ color: "#0958d9" }}>Giảm giá: </span>
                                        <span>{record?.valueDiscount.toLocaleString("en")}</span>
                                    </>

                                }
                            </Space>
                            <Space>
                                <span style={{ color: "#0958d9" }}>Giảm giá tối đa: </span>
                                <span>{record?.maximumValueDiscount ? record?.maximumValueDiscount.toLocaleString("en") : "0"}đ</span>
                            </Space>
                        </Space>
                    </Space.Compact>
                </Space>
            </Modal>

            <div className="user-vouchers">
                <div className="dashboard-content-header1">
                    <h2>Danh sách mã khuyến mãi</h2>

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
                        <Button type="primary" onClick={() => setAddForm(true)}>
                            Thêm
                        </Button>
                        <Notification
                            type='voucher'
                            setSelectedRowKeys={setSelectedRowKeys}
                            setDataRecover={setDataRecover}
                            setData={setData}
                            isDisable={!hasSelected}
                            selectedRowData={selectedRowData}
                            description={`Bạn có chắc chắn muốn xoá ${hasSelected ? selectedRowKeys.length : ''} dịch vụ này không `}
                            placement='top'
                            buttonContent={`Xoá ${hasSelected ? selectedRowKeys.length : ''} dịch vụ`}
                        >
                        </Notification>
                        <Button type='primary' onClick={() => setAddFormRecover(true)} style={{ background: "#465d65" }}>Khôi phục</Button>
                    </div>

                    <div className="dashboard-content-header2-right">
                        <div className="dashboard-content-search">
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Search..'
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
                        defaultValue="name"
                        style={{ width: 120 }}
                        onChange={(e) => {
                            sortList(ascending, e);
                            setSortType(e)
                        }}
                        options={[
                            { value: 'name', label: 'Tên' },
                            { value: 'cost', label: 'Giá bán' },
                            { value: 'maxValue', label: 'Giá trị tối đa' },
                            { value: 'remain', label: 'Số lượng tồn' },

                        ]}
                    />
                </div>

                <Table rowSelection={rowSelection} columns={columns} dataSource={dataListShow} onRow={(record) => ({
                    onClick: () => handleTableRowClick(record),
                })} />

            </div>
        </React.Fragment>

    )

};
