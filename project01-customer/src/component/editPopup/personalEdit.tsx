import { useDispatch, useSelector } from "react-redux";
import { selectInformation } from "../../pages/login/loginSlice";
//import './popupscreen.css'
import { Button, Checkbox, Col, Form, Input, Modal, Row, Upload, message } from "antd";
import Cookies from "universal-cookie";
import React, { FormEvent, useEffect, useState } from "react";
import api_links from "../../utils/api_links";
import fetch_Api from "../../utils/api_function";
import { Rule } from 'antd/lib/form';
import { UserState } from "../../app/type.d";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

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

export default function PersonalInformationPopupScreen({ isPopup, setPopup, data, componentDisabled, setComponentDisabled }: { isPopup?: boolean, setPopup?: any, data?: DataType, componentDisabled?: boolean, setComponentDisabled?: any }) {

    // watch value in form
    const [form] = Form.useForm();
    const [checkForm] = Form.useForm();
    //const [componentDisabled, setComponentDisabled] = useState(data?.isBlocked );
    //var componentDisabled = data?.isBlocked ?? false;
    //get data
    const cookies = new Cookies()
    //const data = cookies.get("token")?.information
    const role = cookies.get("token")?.role

    const handleCancel = () => {
        form.resetFields();
        checkForm.resetFields();
        setPopup(false);
    }

    const handleBlock = () => {
        const api_link = data?.roles ? api_links.user.superAdmin.blockUser : api_links.user.superAdmin.blockCustomer;
        fetch_Api({
            url: api_link + '/' + data?.id,
            method: 'PATCH',
            data: JSON.stringify([{
                "op": "replace",
                "path": "IsBlocked",
                "value": componentDisabled,
            }])
        })
            .then((res) => {
                if (res.status == 200) {
                    message.success(res.data.message)
                    setPopup(false);
                }
            })
            .catch((reason) => {
                message.error("Dữ liệu không đổi (block)")

            })
    }

    const handleOk = () => {
        if (componentDisabled == true) {
            if (data?.isBlocked == false) handleBlock();
            return;
        }
        else {
            if (data?.isBlocked == true) handleBlock();
        }
        form
            .validateFields()
            .then((values) => {
                //console.log(values);
                //console.log(data);
                const api_link = role.normalizedName == "Customer" ? api_links.user.customer.updateInformation : api_links.user.superAdmin.updateInformationForUser
                api_link.data = values
                api_link.token = cookies.get("token").token

                // thay doi thong tin ca nhan
                // chua co api
                fetch_Api({
                    url: api_link + '/',
                    method: 'GET',

                })
                    .then((res) => {
                        if (res.status == 200) {
                            message.success(res.data.message)
                            setPopup(false);
                        }
                    })
                    .catch((reason) => {
                        message.error("Dữ liệu không đổi")

                    })
            })
            .catch((info) => {
                //console.log('Validate Failed:', info);
            })
    }

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const normFile = (e: any) => {
        return e.fileList;
    };

    return (
        <Modal
            title="Thông tin"
            open={isPopup}
            onCancel={handleCancel}
            footer={[
                <Button onClick={handleCancel} type="default" key="back">
                    Huỷ
                </Button>,
                <Button onClick={handleOk} type="primary" htmlType="submit" key="submit">
                    Sửa đổi
                </Button>
            ]}
        >
            <Form
                form={checkForm}
            >
                <Form.Item
                    name="checkbox"
                    valuePropName="checked"
                    initialValue={data?.isBlocked}
                >
                    <Checkbox
                        //defaultChecked={componentDisabled}
                        onChange={(e) => setComponentDisabled(e.target.checked)}
                    >
                        Khóa tài khoản
                    </Checkbox>
                </Form.Item>
            </Form>
            <Form
                form={form}
                disabled={componentDisabled}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                            initialValue={data?.name}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="CMND"
                            name="citizenId"
                            rules={[{ required: true, message: 'Please input your citizen id!' }]}
                            initialValue={data?.citizenId}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            name="email"
                            //rules={[{ required: true, message: 'Please input your email!' }]}
                            initialValue={data?.email}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Số Điện thoại"
                            name="phoneNumber"
                            //rules={[{ required: true, message: 'Please input your phone number!' }]}
                            initialValue={data?.phoneNumber}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="upload" label="Ảnh đại diện" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        maxCount={1}
                        name="avatar"
                        listType="picture-card"
                        beforeUpload={beforeUpload}
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Thay đổi</div>
                        </div>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal >
    )
}