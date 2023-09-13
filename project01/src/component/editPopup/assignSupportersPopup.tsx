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
    }[],
};


export default function AssignSupportersPopupScreen({ isPopup, setPopup, customerId }: { isPopup?: boolean, setPopup?: any, customerId?: string }) {

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
                    setNV(data.data);
                    setFilterNV(data.data);
                });
            }
            else {
                fetch_Api({
                    url: api_links.user.saleAdmin.getUserUser,
                    method: 'GET',
                    data: undefined
                }).then(data => {
                    setNV(data.data);
                    setFilterNV(data.data);
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
                var d: { UserId: any; IsDeleted: false; }[] = [];
                values.employeeList?.map((v: any) => d.push({
                    "UserId": v.employeename,
                    "IsDeleted": false,
                }))
                console.log(d)
                fetch_Api({
                    url: "http://bevm.e-biz.com.vn/api/Customers/assign-supporters/" + customerId,
                    method: 'PATCH',
                    data: JSON.stringify(d),
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
            title="Thêm"
            open={isPopup}
            onCancel={handleCancel}
            style={{ minWidth: window.innerWidth>600?450:'100%' }}
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
                <Form.List name="employeeList">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Space key={field.key} align="baseline"
                                    style={{ width: '100%' }}
                                >
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, curValues) =>
                                            prevValues.employeefilter !== curValues.employeefilter
                                        }
                                        style={{ width: '100%' }}
                                    >
                                        {() => (
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'employeefilter']}
                                            >
                                                <Select style={{ width: window.innerWidth>480?150:100 }}
                                                    defaultValue="all"
                                                    onChange={(e) => {
                                                        if (e == "all") setFilterNV(nhan_vien);
                                                        else setFilterNV(nhan_vien?.filter((d) => d.roles.findIndex((r) => r.id == e) > -1));
                                                        form.setFieldValue(["employeeList", field.name, "employeename"], undefined)
                                                    }}
                                                >
                                                    <Select value="all">Tất cả</Select>
                                                    {chuc_vu?.map((d) =>
                                                        <Select value={d.id}>{d.normalizedName}</Select>
                                                    )} </Select>
                                            </Form.Item>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'employeename']}
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

                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Nhân viên khác
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal >
    )
}