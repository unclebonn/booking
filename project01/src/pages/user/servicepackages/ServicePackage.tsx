import React, { useState, useEffect, ReactNode, useRef } from 'react';
import './servicepackage.scss';
//import Add from './addNew';D
import { ServiceListState, ServicePackageListState, ServicePackageState, VoucherTypeListState } from '../../../app/type.d';
import { Avatar, Form, Input, List, Modal, Popconfirm, Select, Space, Tag, message } from 'antd';
import { Button, Table, Divider, Card, Col, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import Cookies from 'universal-cookie';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import Notification from '../../../component/notification/Notification';
import { Link } from 'react-router-dom';
import { havePermission } from '../../../utils/permission_proccess';



interface DataType {
    key?: React.Key;
    id: number;
    servicePackageName: string;
    image: string;
    href: string;
    description: string,
    services: ServiceListState,
    valuableVoucherTypes: VoucherTypeListState
}




export default function ServicePackage() {
    const [all_data, setAllData] = useState<ServicePackageListState>([]);
    const [data, setData] = useState<ServicePackageListState>(all_data);
    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [addForm, setAddForm] = useState(false);
    const [addFormRecover, setAddFormRecover] = useState(false);
    const [dataRecover, setDataRecover] = useState<DataType[]>([])
    const [addFormInformationService, setAddFormInformationService] = useState(false)
    const [record, setRecord] = useState<DataType>(undefined!)

    const addPermission = havePermission("ServicePackage", "write");
    const deletePermission = havePermission("ServicePackage", "delete");
    const restorePermission = havePermission("ServicePackage", "restore");

    //get data from cookie
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;
    // call api to get data
    useEffect(() => {
        getAllServicePackages()
            .then((res) => {
                if (res.status === 200) {
                    setAllData(res.data);
                    setData(res.data);
                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
        // getAllDeleteServicePackages()
        //     .then((res) => {
        //         if (res.status === 200) {
        //             setDataRecover(res.data)
        //         }
        //     })
        //     .catch((error) => {
        //         //console.log(error);

        //     })
    }, []);

    const handleDelete = (e: number) => {
        deleteServicePackages(e)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Xoá thành công")
                    getAllServicePackages()
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
                message.error("Xoá thất bại")
            })
    }

    // const handleRecover = (recordId: number) => {
    //     const recoverData = dataRecover.filter((data) => data.id !== recordId)
    //     recoverServicePackage(recordId)
    //         .then((res_re) => {
    //             if (res_re.status === 200) {
    //                 setDataRecover(recoverData)
    //                 message.success(res_re.data.message)
    //                 getAllServicePackages()
    //                     .then((res) => {
    //                         if (res.status === 200) {
    //                             setAllData(res.data)
    //                         }
    //                     })
    //             }
    //         })
    //         .catch((error) => {
    //             message.error(error.message)
    //         })
    // }


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
                    <a style={{ fontWeight: "bold" }}>{record.servicePackageName}</a>
                    <span>Nội dung: {record.description}</span>
                </div>
                <div className="bonus-content">
                    <div>Đã bán: </div>
                </div></>,
        },
        {
            title: 'Thao tác',
            key: 'id',
            width: '112px',
            render: (text, record, index) => (
                <Space size="small">
                    <Link to={"updateservicepackage"} state={record}>
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

    // const columnsRecover: ColumnsType<DataType> = [
    //     {
    //         title: 'Lựa chọn',
    //         dataIndex: 'id',
    //         render: (text, record, index) =>
    //             <div className="item-content-recover">
    //                 <span>{record.id}</span>
    //             </div>

    //     },
    //     {
    //         title: 'Gói dịch vụ',
    //         dataIndex: 'servicePackageName',
    //         render: (text, record, index) =>
    //             <div className="item-content-recover">
    //                 <a style={{ fontWeight: "bold" }}>{record.servicePackageName}</a>
    //                 <p>Nội dung: {record.description}</p>
    //             </div>
    //     },
    //     {
    //         title: 'Miêu tả',
    //         dataIndex: 'description',
    //         render: (text, record) =>
    //             <div className="item-content-recover">
    //                 <Button type='primary' onClick={() => handleRecover(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
    //             </div>
    //     },
    // ]


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

    // put data into table to display
    const dataListShow: DataType[] = [];
    data?.map((dataTemp, index) => dataListShow.push({
        key: index,
        id: dataTemp.id,
        servicePackageName: dataTemp.servicePackageName,
        href: 'https://ant.design',
        image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        description: dataTemp.description,
        services: dataTemp.services,
        valuableVoucherTypes: dataTemp.valuableVoucherTypes
    }));


    // search data
    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            let search_results = all_data?.filter((item) => {
                return String(item.id).toLowerCase().includes(event.target.value.toLowerCase()) ||
                    item.servicePackageName.toLowerCase().includes(event.target.value.toLowerCase())
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
                    data?.sort((a, b) => (a.servicePackageName > b.servicePackageName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.servicePackageName < b.servicePackageName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
    }

    //=========================== GET API ====================================
    const getAllServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllServicePackages
        api_link.token = token
        return fetch_Api(api_link)

    }
    const deleteServicePackages = (e: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.deleteServicePackage.url}${e}`,
            method: "DELETE",
            token: token
        }
        return fetch_Api(api_link)
    }

    const getAllDeleteServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteServicePackages
        api_link.token = token
        return fetch_Api(api_link)
    }

    const recoverServicePackage = (recordId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverServicePackage.url}${recordId}`,
            method: "PATCH",
            token: token
        }
        return fetch_Api(api_link)
    }



    // ====================================================================

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
                        <Link to={"createservicepackage"}>
                            <Button style={{ width: "100%" }} type='default' size='large'>
                                Thêm dịch vụ
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Modal>

            {/* <Modal
                width="40vw"
                style={{ top: "5vh" }}
                open={addFormRecover}
                title="Khôi phục"
                onCancel={() => {
                    setAddFormRecover(!addFormRecover)
                    getAllServicePackages()
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

            </Modal> */}


            <Modal
                open={addFormInformationService}
                onCancel={() => setAddFormInformationService(!addFormInformationService)}
                footer={[]}
                width="65vw"
            >
                <Space className='userservice-record' direction='horizontal' align='start' size="large">
                    <Space.Compact direction='vertical'>
                        <div>
                            <img src={record?.image} alt="image" width="300px" />
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
                    <Space.Compact direction='vertical'>
                        <Divider orientation='left'>Thông tin</Divider>
                        <Space direction='vertical' className='userservice-record--information'>
                            <Space>
                                <span style={{ color: "#0958d9" }}>Tên gói dịch vụ: </span>
                                <span>{record?.servicePackageName}</span>
                            </Space>
                            <Space>
                                <span style={{ color: "#0958d9" }}>Miêu tả: </span>
                                <span>{record?.description}</span>
                            </Space>
                            <Divider orientation='left'>Dịch vụ</Divider>
                            <Space wrap direction='horizontal'>
                                {record?.services.map((service) => {
                                    return (
                                        <Tag color='blue'>{service.serviceName}:{service.description}</Tag>
                                    )
                                })}
                            </Space>

                        </Space>
                    </Space.Compact>
                </Space>
                <Divider orientation='left'>Mã khuyến mãi</Divider>
                <Space className='userservice-record--voucher' size={[10, 8]} style={{ width: "100%", alignItems: "start" }} direction='horizontal' wrap>
                    {record?.valuableVoucherTypes.map((voucher) => {
                        return (
                            <Space align='baseline' className='userservice-record--information-voucher' direction='vertical'>
                                <span style={{ color: "#0958d9" }}>{voucher?.typeName}</span>
                                <span><b>Giá trị: </b>{voucher?.commonPrice}</span>
                                <span><b>Điều kiện: </b>{voucher?.conditionsAndPolicies}</span>
                            </Space>
                        )
                    })}
                </Space>
            </Modal>





            <div className="user-services">
                <div className="dashboard-content-header1">
                    <h2>Danh sách gói dịch vụ</h2>

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
                            Thêm
                        </Button>}
                        {deletePermission && <Notification
                            type='service'
                            setSelectedRowKeys={setSelectedRowKeys}
                            setDataRecover={setDataRecover}
                            setData={setData}
                            isDisable={!hasSelected}
                            selectedRowData={selectedRowData}
                            description={`Bạn có chắc chắn muốn xoá ${hasSelected ? selectedRowKeys.length : ''} dịch vụ này không `}
                            placement='top'
                            buttonContent={`Xoá ${hasSelected ? selectedRowKeys.length : ''} dịch vụ`}
                        >
                        </Notification>}
                        {restorePermission && <Button type='primary' onClick={() => setAddFormRecover(true)} style={{ background: "#465d65" }}>Khôi phục</Button>}
                    </div>

                    <div className="dashboard-content-header2-right">
                        <div className="dashboard-content-search">
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Gói dịch vụ...'
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
                        onChange={(e) => {
                            sortList(ascending, e);
                            setSortType(e)
                        }}
                        options={[
                            { value: 'name', label: 'Tên' },
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
