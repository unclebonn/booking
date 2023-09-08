import { useDispatch, useSelector } from "react-redux";
import { selectInformation } from "../../pages/login/loginSlice";
//import './popupscreen.css'
import { Button, Col, Form, Input, Modal, Row, Select, Space, message } from "antd";
import Cookies from "universal-cookie";
import React, { FormEvent, useEffect, useState } from "react";
import api_links from "../../utils/api_links";
import fetch_Api from "../../utils/api_function";
import { Rule } from 'antd/lib/form';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { RoleListState, UserListState } from "../../app/type.d";
import { useParams } from "react-router-dom";

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
    userName: string,
    salesManager: {
        id: string,
        name: string,
        phoneNumber: string,
    },
    roles: {
        id: string,
        normalizedName: string,
        isManager: boolean,
    }[],
};


export default function AssignManagerPopupScreen({ isPopup, setPopup, customerId }: { isPopup?: boolean, setPopup?: any, customerId?: string }) {
    const { id } = useParams();

    // watch value in form
    const [form] = Form.useForm()
    const [nhan_vien, setNV] = useState<UserListState>();
    const [filter_nhan_vien, setFilterNV] = useState<UserListState>();
    const [chuc_vu, setCV] = useState<RoleListState>();

    //get data
    const cookies = new Cookies()
    const data = cookies.get("token")?.information
    const role = cookies.get("token")?.role

    useEffect(() => {
        if (cookies.get("token").role.isManager) {
            fetch_Api({
                url: api_links.user.superAdmin.getAllRole,
                method: 'GET',
                data: undefined
            }).then(data => {
                setCV(data.data);
            });

            if (window.location.pathname.includes("managerdashboard")) {
                fetch_Api({
                    url: api_links.user.superAdmin.getAllUser,
                    method: 'GET',
                    data: undefined
                }).then(data => {
                    setNV(data.data.filter((d: DataType) => d.roles.findIndex((r) => r.isManager == true) > -1));
                    setFilterNV(data.data.filter((d: DataType) => d.roles.findIndex((r) => r.isManager == true) > -1));
                });
            }
            else {
                fetch_Api({
                    url: api_links.user.saleAdmin.getUserUser,
                    method: 'GET',
                    data: undefined
                }).then(data => {
                    setNV(data.data.filter((d: DataType) => d.roles.findIndex((r) => r.isManager == true) > -1));
                    setFilterNV(data.data.filter((d: DataType) => d.roles.findIndex((r) => r.isManager == true) > -1));
                });
            }
        }
    }, []);

    const handleCancel = () => {
        setPopup(false);
        form.resetFields();
    }

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log(values)
                fetch_Api({
                    url: "http://bevm.e-biz.com.vn/api/Users/Assign-Manager?ManagerId=" + values.employeename + "&UserId=" + id,
                    method: 'POST',
                })
                    .then((res) => {
                        if (res.status == 200) {
                            message.success(res.data.message)
                            form.resetFields();
                            setPopup(false);
                        }
                    })
                    .catch((reason) => {
                        console.log(reason)
                        message.error("Dữ liệu không đổi")
                    })
            })

            .catch((info) => {
                console.log('Validate Failed:', info);
            })
    }

    return (
        <Modal
            title="Thay đổi"
            open={isPopup}
            onCancel={handleCancel}
            style={{ minWidth: 450 }}
            footer={[
                <Button onClick={handleCancel} type="default" key="back">
                    Huỷ
                </Button>,
                <Button onClick={handleOk} type="primary" htmlType="submit" key="submit">
                    Lưu thay đổi
                </Button>
            ]}
        >
            <Form
                form={form}
                style={{ maxWidth: 600 }}
            >
                <Form.Item

                    name={'employeefilter'}
                >
                    <Select style={{ width: 150 }}
                        defaultValue="all"
                        onChange={(e) => {
                            if (e == "all") setFilterNV(nhan_vien);
                            else setFilterNV(nhan_vien?.filter((d) => d.roles.findIndex((r) => r.id == e) > -1));
                            form.setFieldValue(["employeename"], undefined)
                        }}
                    >
                        <Select value="all">Tất cả</Select>
                        {chuc_vu?.map((d) => {
                            if (d.isManager == true)
                                return (
                                    <Select value={d.id}>{d.normalizedName}</Select>
                                )
                        })} </Select>
                </Form.Item>

                <Form.Item

                    name={'employeename'}
                    rules={[{ required: true, message: 'Thông tin này là bắt buộc!' }]}
                    style={{ width: '100%' }}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        //placeholder=""
                        //onChange={handleChange}

                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }

                        options={
                            filter_nhan_vien?.map((d) => {
                                return ({
                                    label: d.name + " - " + (d.citizenId ? d.citizenId?.slice(-4) : ""),
                                    value: d.id,
                                })
                            })
                        }
                    />
                </Form.Item>
            </Form >
        </Modal >
    )
}