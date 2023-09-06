import { Button, Col, Divider, Modal, Popover, Row, Select, Space, Tag, message, Table, Popconfirm, Input, Form, InputRef } from "antd";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { ServiceListState, ServicePackageState, ServiceState } from "../../../app/type.d";
import api_links from "../../../utils/api_links";
import fetch_Api from "../../../utils/api_function";
import './service.scss'
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { CompoundedComponent } from "antd/es/float-button/interface";
import { havePermission } from "../../../utils/permission_proccess";


interface DataType {
    "id": number,
    "serviceName": string,
    "description": string,
    "servicePackages": []
}

interface ServiceProps {
    "serviceName": string | undefined,
    "description": string | undefined,
}
export default function Service() {
    const [addForm, setAddForm] = useState(false);
    const [dataRecover, setDataRecover] = useState<DataType[]>([])
    const [addFormRecover, setAddFormRecover] = useState(false);
    const [all_data, setAllData] = useState<ServiceListState>([]);
    const [data, setData] = useState<ServiceListState>(all_data);
    const [ascending, setAscending] = useState(true);
    const [sortType, setSortType] = useState('name');
    const [service, setService] = useState<ServiceState>(undefined!)
    const colors = [
        "magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple",
        "#F7D9AA", "#E9EFB2", "#C6E6C2",
        "#F6E9C7",
        "#D5F5E7",
        "#F3F5F9",
        "#E3C0A1",
        "#FFEBB0",
        "#CDE4EB",
        "#F8EEDC",
        "#F4DFF1",
        "#E6E6FA",
        "#F5F5DC",
        "#FFFACD",
        "#C6D6BC",
        "#E8F6F3",
        "#FDD9B5",
        "#F0F8FF",
        "#FFE4C4",
        "#E0FFFF",
        "#F0FFF0",
        "#FFF8DC",
        "#B0E0E6",
        "#FFF5EE",
        "#FAFAD2",
        "#F5F5F5",
        "#FFDAB9",
        "#E0FFFF",
        "#F8F8FF",
        "#FFF0F5",
        "#FAEBD7",
        "#FDF5E6",
        "#FFEBCD",
        "#F0E68C",
        "#FFFFF0",
        "#FFFDE7",
        "#FFFACD",
        "#F0FFF0",
        "#FDF5E6",
        "#FFF8DC",
        "#FAEBD7",
        "#F5F5F5",
        "#FFEFD5",
        "#FFF0F5",
        "#F8F8FF",
        "#E0FFFF",
        "#FFDAB9",
        "#FFE4C4",
        "#F0F8FF",
        "#F5F5DC",
    ]
    const [updateBtn, setUpdateBtn] = useState(true)
    const [openPopover, setOpenPopOver] = useState(false)
    const serviceNameRef = useRef<InputRef>(undefined!)
    const descriptionRef = useRef<InputRef>(undefined!)

    const addPermission = havePermission("Service", "write");
    const deletePermission = havePermission("Service", "delete");
    const restorePermission = havePermission("Service", "restore");
    const editPermission = havePermission("Service", "update");

    useEffect(() => {
        getAllService()
            .then((res) => {
                if (res.status === 200) {
                    setAllData(res.data)
                    setData(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);
            })
        getAllDeleteService()
            .then((res) => {
                if (res.status === 200) {
                    setDataRecover(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);
            })

    }, [])

    function sortList(tang_dan: boolean, sorttype: string) {
        if (tang_dan) {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.serviceName > b.serviceName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.serviceName < b.serviceName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
    }


    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            let search_results = all_data?.filter((item) => {
                return String(item.id).toLowerCase().includes(event.target.value.toLowerCase()) ||
                    item.serviceName.toLowerCase().includes(event.target.value.toLowerCase())
            }
            );
            setData(search_results);
        }
        else {
            setData(all_data);
        }
    };

    const handleBtn = (id: number) => {
        getServiceById(id)
            .then((res) => {
                if (res.status === 200) {
                    setService(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);

            })
    }

    const handleRecover = (recordId: number) => {
        const recoverData = dataRecover.filter((data) => data.id !== recordId)
        recoverService(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    setDataRecover(recoverData)
                    message.success(res_re.data.message)
                    getAllService()
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

    const handleDelete = (e: number) => {
        deleteService(e)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Xoá thành công")
                    getAllService()
                        .then((res) => {
                            setAllData(res.data);
                            setData(res.data);
                        })
                        .catch((reason) => {
                            //console.log(reason);
                        })
                    getAllDeleteService()
                        .then((res) => {
                            if (res.status === 200) {
                                setDataRecover(res.data)
                            }
                        })
                        .catch((error) => {
                            //console.log(error);
                        })
                }
            })
            .catch((reason) => {
                message.error("Xoá thất bại")
            })
    }

    const handleFinish = (id: number) => {
        const updateData = {
            "serviceName": serviceNameRef.current.input?.value,
            "description": descriptionRef.current.input?.value,
        }

        updateService(id, updateData)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                    setUpdateBtn(!updateBtn)
                    getAllService()
                        .then((res) => {
                            setAllData(res.data);
                            setData(res.data);
                        })
                        .catch((reason) => {
                            //console.log(reason);
                        })
                    getServiceById(id)
                        .then((res) => {
                            if (res.status === 200) {
                                setService(res.data)
                            }
                        })
                        .catch((error) => {
                            //console.log(error);

                        })
                }
            })
            .catch((error) => {
                message.error(error.message)
            })


    }

    const handleUpdate = () => {
        setUpdateBtn(!updateBtn)
    }

    const columnsRecover: ColumnsType<DataType> = [
        {
            title: 'Lựa chọn',
            dataIndex: 'id',
            render: (text, record, index) =>
                <div className="item-content-recover">
                    <span>{record.id}</span>
                </div>

        },
        {
            title: 'Gói dịch vụ',
            dataIndex: 'servicePackageName',
            render: (text, record, index) =>
                <div className="item-content-recover">
                    <a style={{ fontWeight: "bold" }}>{record.serviceName}</a>
                    <p>Nội dung: {record.description}</p>
                </div>
        },
        {
            title: 'Miêu tả',
            dataIndex: 'description',
            render: (text, record) =>
                <div className="item-content-recover">
                    <Button type='primary' onClick={() => handleRecover(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                </div>
        },
    ]

    //////////////////////////////// GET API //////////////////////////////////////
    const getAllService = () => {
        const api_link = {
            url: api_links.user.superAdmin.getAllService,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    const getAllDeleteService = () => {
        const api_link = {
            url: api_links.user.superAdmin.getAllDeleteService.url,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    const deleteService = (e: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.deleteService.url}${e}`,
            method: "DELETE"
        }
        return fetch_Api(api_link)
    }

    const getServiceById = (id: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.getServiceById.url}${id}`,
            method: "GET"
        }
        return fetch_Api(api_link)
    }

    const recoverService = (serviceId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverService.url}${serviceId}`,
            method: "PATCH",
        }
        return fetch_Api(api_link)
    }

    const updateService = (serviceId: number, data: ServiceProps) => {
        const api_link = {
            url: `${api_links.user.superAdmin.updateService.url}${serviceId}`,
            method: "PUT",
            data: data
        }

        return fetch_Api(api_link)
    }

    return (
        <>
            <Modal
                open={addForm}
                footer={[]}
                onCancel={() => setAddForm(false)}
                style={{ top: "25vh", width: " 500px" }}
            >
                <Row>
                    <Col span={24}>
                        <Link to={"createservice"}>
                            <Button style={{ width: "100%" }} type='default' size='large'>
                                Thêm dịch vụ
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Modal>

            <Modal
                width="40vw"
                style={{ top: "5vh" }}
                open={addFormRecover}
                title="Khôi phục"
                onCancel={() => {
                    setAddFormRecover(!addFormRecover)
                    getAllService()
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
            <div className="user-services">
                <div className="dashboard-content-header1">
                    <h2>Danh sách loại dịch vụ</h2>

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
                        {restorePermission && <Button type='primary' onClick={() => setAddFormRecover(true)} style={{ background: "#465d65" }}>Khôi phục</Button>}
                    </div>

                    <div className="dashboard-content-header2-right">
                        <div className="dashboard-content-search">
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Loại dịch vụ...'
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

                <div>
                    <Space wrap size={[5, 10]}>
                        {data?.map((data) => {
                            return (
                                <Popover
                                    afterOpenChange={() => setUpdateBtn(true)}
                                    key={data.id}
                                    placement="bottomLeft"
                                    title="Thông tin"
                                    trigger="click"
                                    content={
                                        <>
                                            <Space className="service" style={{ marginLeft: "10px", gap: "0" }} direction="vertical">
                                                <Space style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        <div>
                                                            <h5 style={{ color: "rgb(71 71 71)" }}>Tên</h5>
                                                            {updateBtn ? <Tag className="tag">
                                                                <span style={{ color: "black" }}>{service?.serviceName}</span>
                                                            </Tag>
                                                                :
                                                                <Input size="small" ref={serviceNameRef} name="serviceName" defaultValue={service?.serviceName} />
                                                            }

                                                        </div>
                                                        <div>
                                                            <h5 style={{ color: "rgb(71 71 71)" }}>Miêu tả</h5>
                                                            {updateBtn ? <Tag className="tag">
                                                                <span style={{ color: "black" }}>{service?.description}</span>
                                                            </Tag>
                                                                :
                                                                <Input size="small" ref={descriptionRef} name="description" defaultValue={service?.description} />
                                                            }

                                                        </div>
                                                        {updateBtn ? "" : <Button size="small" style={{ marginTop: "10px" }} onClick={() => handleFinish(data.id)} type="primary">Cập nhật</Button>}



                                                    </div>

                                                    <div className="service-information">
                                                        <h5 style={{ color: "rgb(71 71 71)" }}>Thẻ</h5>
                                                        <Tag className="tag" color="blue">
                                                            <span style={{ color: "black" }}>{service?.serviceName}:{service?.description}</span>
                                                        </Tag>
                                                    </div>

                                                    <div>
                                                        {editPermission && <Button onClick={handleUpdate} className="ant-update--service" size={"large"} ><FontAwesomeIcon icon={faPenToSquare} /></Button>}
                                                    </div>
                                                    {deletePermission && <div className="service--popover">
                                                        <Button className="ant-popconfirm--service" size={"large"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                                                        <div className="deleteForm--service">
                                                            <div className="form--service">
                                                                <div>
                                                                    <span><FontAwesomeIcon style={{ backgroundColor: "#FAAD14", color: "white" }} icon={faExclamationCircle} /> Lưu ý</span>
                                                                </div>
                                                                <div>
                                                                    <span>Bạn có chắc chắn xoá không ?</span>
                                                                </div>
                                                                <div className="form--serviceBtn">
                                                                    <Button onClick={() => handleDelete(data.id)} style={{ backgroundColor: "red" }} type="primary">Xoá</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </Space>
                                            </Space>
                                            <Space className="service" align="start" style={{ marginLeft: "10px" }} direction="vertical">
                                                <h5 style={{ margin: "0", color: "rgb(71 71 71)" }}>Các gói dịch vụ đang sử dụng dịch vụ này</h5>
                                                <Space wrap>
                                                    {service?.servicePackages.map((service: ServicePackageState, index: number) => {
                                                        return (
                                                            <div key={index} className="service--servicepackages">
                                                                <div>
                                                                    <h6>Tên</h6>
                                                                    <p>{service.servicePackageName}</p>
                                                                </div>
                                                                <div>
                                                                    <h6>Miêu tả</h6>
                                                                    <p>{service.description}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </Space>
                                            </Space>
                                        </>
                                    }
                                >
                                    <Button type="default" onClick={() => handleBtn(data.id)}>
                                        {data.serviceName}:{data.description}
                                    </Button>
                                </Popover>
                            )
                        })}
                    </Space>
                </div>
            </div >
        </>
    )
}