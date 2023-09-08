import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Col, Descriptions, Divider, List, Modal, Row, Select, Space, Tag, message } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { CustomerState, RoleListState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import api_links from '../../utils/api_links';
import fetch_Api from '../../utils/api_function';
import { faPenToSquare, faSquareMinus, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css'
import { faSquareCheck, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import AssignSupportersPopupScreen from '../editPopup/assignSupportersPopup';
import PersonalInformationPopupScreen from '../editPopup/personalEdit';
import { havePermission } from '../../utils/permission_proccess';
import AssignManagerPopupScreen from '../editPopup/assignManager';

interface DataType {
    id: string,
    name: string,
    email: string | null,
    phoneNumber: string | null,
    citizenId: string | null,
    isBlocked: boolean,
    bookings?: [],
    vouchers?: [],
    filePath: string,

    //only Customer
    users: {
        id: string,
        name: string,
        phoneNumber: string,
    }[],

    //only User
    //userName: string,
    managers: {
        id: string,
        name: string,
        phoneNumber: string,
    }[],
    managedUsers: {
        id: string,
        name: string,
        phoneNumber: string | null,
        filePath: string | null
    }[],
    customers: {
        id: string,
        name: string,
    }[],
    roles: {
        id: string,
        normalizedName: string,
        isManager: boolean,
    }[],  
    permission?: string[] | null,
};

export default function PersonalInformation({ api_link }: { api_link: string }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<DataType>();
    const [chuc_vu, setCV] = useState<RoleListState>();
    var cookies = new Cookies();
    const editPermission = (cookies.get("token")?.role.id == "0") ? havePermission("Customer", "update") : havePermission("User", "update");

    const [isChangeInformation, setIsChangeInformation] = useState(false);
    const [isChangeRoles, setIsChangeRoles] = useState(false);
    const [isChangeManager, setIsChangeManager] = useState(false);
    const [isChangeEmployees, setIsChangeEmployees] = useState(false);
    const [isAddChangeEmployees, setIsAddChangeEmployees] = useState(false);
    const [componentDisabled, setComponentDisabled] = useState<boolean>();

    useEffect(() => {
        fetch_Api({
            url: api_link + '/' + id,
            method: 'GET',
        }).then(data => {
            setData(data.data);
        })
        if (cookies.get("token").role.isManager)
            fetch_Api({
                url: api_links.user.superAdmin.getAllRole,
                method: 'GET',
                data: undefined
            }).then(data => {
                setCV(data.data);
            });
    }, [id, isChangeInformation, isChangeRoles, isAddChangeEmployees, isChangeManager]);

    var isDelete: boolean;
    const changeRoles = () => {

        const handleChangeRole = (value: string) => {
            const d = [{
                "RoleId": value,
                "IsDeleted": isDelete,
            }]
            fetch_Api({
                url: api_link + '/' + id + '/Roles',
                method: 'PATCH',
                data: JSON.stringify(d),
            })
                .then((res) => {
                    if (res.status == 200) {
                        message.success(res.data.message)
                    }
                })
                .catch((reason) => {
                    message.error("Dữ liệu không đổi")
                })
        }

        return (
            <List size="small" bordered>
                {data?.roles.map((d) => {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <List.Item style={{ textAlign: "left", width: "100%" }}>{d.normalizedName}</List.Item>
                            <FontAwesomeIcon
                                size='xl'
                                icon={faSquareMinus}
                                onClick={() => { isDelete = true; handleChangeRole(d.id) }}
                                style={{ cursor: "pointer", margin: "10px 15px" }} />
                        </div>
                    )
                })}
                <List.Item style={{ textAlign: "left" }}>
                    <Select
                        suffixIcon={<FontAwesomeIcon size='2xl' icon={faSquarePlus} />}
                        style={{ width: "100%" }}
                        onChange={(value) => { isDelete = false; handleChangeRole(value) }}>
                        {chuc_vu?.map((d) =>
                            <Select value={d.id} >{d.normalizedName}</Select>
                        )}
                    </Select>
                </List.Item>
            </List>
        )
    }

    const changeManager = () => {

        return (
            <List size="small" bordered>

            </List>)
    }

    const changeEmployees = () => {
        const handleChangeEmployee = (value: string) => {
            const d = [{
                "UserId": value,
                "IsDeleted": isDelete,
            }]
            fetch_Api({
                url: "http://bevm.e-biz.com.vn/api/Customers/assign-supporters/" + id,
                method: 'PATCH',
                data: JSON.stringify(d),
            })
                .then((res) => {
                    if (res.status == 200) {
                        message.success(res.data.message)
                    }
                })
                .catch((reason) => {
                    message.error("Dữ liệu không đổi")
                })
            fetch_Api({
                url: api_link + '/' + id,
                method: 'GET',
            }).then(data => {
                setData(data.data);
            })
        }
        return (
            <List size="small" bordered>
                {data?.users?.map((d) => {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <List.Item style={{ textAlign: "left", width: "100%" }}>{d.name}{d.phoneNumber ? " - " + d.phoneNumber : ""}</List.Item>
                            <FontAwesomeIcon
                                size='xl'
                                icon={faSquareMinus}
                                onClick={() => { isDelete = true; handleChangeEmployee(d.id) }}
                                style={{ cursor: "pointer", margin: "10px 15px" }} />
                        </div>
                    )
                })}
                <List.Item style={{ textAlign: "left" }}>
                    <Button type="dashed" onClick={() => setIsAddChangeEmployees(true)} block icon={<PlusOutlined />}>
                        Thêm
                    </Button>
                </List.Item>
            </List>)
    }

    return (
        <React.Fragment>
            <div className="detail-left">
                {cookies.get("token").role.isManager && <AssignSupportersPopupScreen
                    isPopup={isAddChangeEmployees}
                    setPopup={setIsAddChangeEmployees}
                    customerId={id} />}

                <PersonalInformationPopupScreen
                    isPopup={isChangeInformation}
                    setPopup={setIsChangeInformation}
                    data={data}
                    componentDisabled={componentDisabled}
                    setComponentDisabled={setComponentDisabled}
                />
                <AssignManagerPopupScreen
                    isPopup={isChangeManager}
                    setPopup={setIsChangeManager}
                    customerId={id} />

                <div className="personal-information">
                    {data?.isBlocked && <Tag color="orange" style={{ width: "fit-content" }}>Tài khoản đã bị khóa</Tag>}
                    <Descriptions title={<Space>{data?.name}{editPermission && <FontAwesomeIcon size='sm' icon={faPenToSquare}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setComponentDisabled(data?.isBlocked)
                            setIsChangeInformation(true)
                        }
                        } />}</Space>}
                        column={1}>
                        <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>
                        <Descriptions.Item label="CitizenId">{data?.citizenId}</Descriptions.Item>
                        <Descriptions.Item label="Telephone">{data?.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
                    </Descriptions>
                    <img src={data?.filePath} />
                </div>

                {data?.roles ?

                    <div className="more-information">
                        <Divider orientation="left">Chức vụ&ensp;
                            {editPermission &&
                                (!isChangeRoles ? <FontAwesomeIcon size='sm' icon={faPenToSquare} onClick={() => setIsChangeRoles(true)} style={{ cursor: "pointer" }} />
                                    : <FontAwesomeIcon size='sm' icon={faFloppyDisk} onClick={() => setIsChangeRoles(false)} style={{ cursor: "pointer" }} />)
                            }</Divider>
                        {isChangeRoles ? changeRoles() :
                            <List size="small" bordered>
                                {data?.roles?.length != 0 ?
                                    data.roles?.map((d) => {
                                        return <List.Item style={{ textAlign: "left", width: "100%" }}>{d.normalizedName}</List.Item>
                                    })
                                    : <List.Item style={{ textAlign: "left" }}>Không có</List.Item>}
                            </List>
                        }
                        <Divider orientation="left">Quản lý&ensp;
                            {editPermission &&
                                <FontAwesomeIcon size='sm' icon={faPenToSquare} onClick={() => setIsChangeManager(true)} style={{ cursor: "pointer" }} />
                            }
                        </Divider>
                        <List size="small" bordered>
                            {data?.managers?.length != 0 ?
                                data?.managers?.map((d) =>
                                    <List.Item style={{ textAlign: "left" }}> {d.name}{d.phoneNumber ? " - " + d.phoneNumber : ""}</List.Item>
                                ) : <List.Item style={{ textAlign: "left" }}>Không có</List.Item>}
                        </List>
                    </div>
                    :
                    <div className="more-information">
                        <Divider orientation="left">Nhân viên tư vấn&ensp;
                            {editPermission &&
                                (!isChangeEmployees ? <FontAwesomeIcon size='sm' icon={faPenToSquare} onClick={() => setIsChangeEmployees(true)} style={{ cursor: "pointer" }} />
                                    : <FontAwesomeIcon size='sm' icon={faFloppyDisk} onClick={() => setIsChangeEmployees(false)} style={{ cursor: "pointer" }} />
                                )}</Divider>
                        {isChangeEmployees ? changeEmployees() :
                            <List size="small" bordered>
                                {data?.users?.length != 0 ?
                                    data?.users?.map((d) =>
                                        <List.Item style={{ textAlign: "left" }}> {d.name}{d.phoneNumber ? " - " + d.phoneNumber : ""}</List.Item>
                                    ) : <List.Item style={{ textAlign: "left" }}>Không có</List.Item>}
                            </List>}
                    </div>}
            </div>
        </React.Fragment>
    );
};


