import { useDispatch, useSelector } from "react-redux";
import { selectInformation } from "../../pages/login/loginSlice";
import './popupscreen.css'
import { Avatar, Button, Col, Form, Input, InputRef, Modal, Row, Space, message } from "antd";
import Cookies from "universal-cookie";
import React, { ChangeEvent, MouseEvent, useRef, useState } from "react";
import api_links from "../../utils/api_links";
import fetch_Api_MultiForm from "../../utils/api_function_multi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import fetch_Api from "../../utils/api_function";

interface DataType {
    name: string,
    citizenid: string,
    email: string,
    phoneNumber: string,
    avatar: File
}

export default function PopupScreenInformation({ isPopup, setPopup }: { isPopup?: boolean, setPopup?: any }) {

    // watch value in form
    const [form] = Form.useForm()

    //get data
    const cookies = new Cookies()
    const token = cookies.get("token")?.token
    const data = cookies.get("token")?.information
    const role = cookies.get("token")?.role

    const [avatar, setAvatar] = useState<string>(data?.filePath)
    const [loading, setLoading] = useState<boolean>(false)
    const [fileAvatar, setFileAvatar] = useState<File | null>()



    const handleCancel = () => {
        setPopup(false);
        setAvatar(data?.filePath)
        setFileAvatar(null)
    }


    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                setLoading(true)
                if (values.avatar === undefined) {
                    values.avatar = null
                }

                ///multidataform
                updateInformation(values)
                    .then((res) => {
                        if (res.status == 200) {
                            cookies.set("token", { ...cookies.get("token"), information: res.data.loginUser ? res.data.loginUser : res.data.loginCustomer }, { path: "/", maxAge: 7200 }) // ve nha sua cai nay
                            message.success(res.data.message)
                            setLoading(false)
                        }
                    })
                    .catch((reason) => {
                        message.error(reason.message)
                        setLoading(false)

                    })
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            })
    }


    const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files
        if (file !== null && file.length == 1) {
            const dataChange: DataType = {
                name: data?.name,
                citizenid: data?.citizenId,
                email: data.email,
                phoneNumber: data?.phoneNumber,
                avatar: file[0]
            }
            const createAvatar = URL.createObjectURL(new Blob([file[0]]))
            setAvatar(createAvatar)
            setFileAvatar(file[0])
            // updateInformation(data)
        } else {
            setAvatar(data.filePath)
            setFileAvatar(null)
        }
    }

    const handleVerifyEmail = () => {
        verifyEmail()
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    ////////////////////////// GET API /////////////////////////////////////

    const updateInformation = (values: any) => {
        const api_link = role.normalizedName == "Customer" ? api_links.user.customer.updateInformation : api_links.user.superAdmin.updateInformationForUser
        api_link.data = { ...values, avatar: fileAvatar }
        api_link.token = cookies.get("token").token
        return fetch_Api_MultiForm(api_link)
    }

    const verifyEmail = () => {
        const user = role.isManager ? api_links.user.superAdmin.getVerifyEmail : api_links.user.customer.getVerifyEmail
        const api_link = {
            url: `${user.url}?userid=${data?.id}&token=${token}`,
            method: "GET"
        }
        return fetch_Api(api_link)
    }

    return (
        <Modal
            width="50vw"
            title="Thông tin"
            open={isPopup}
            onCancel={handleCancel}
            footer={[
                <Button onClick={handleCancel} type="default" key="back">
                    Huỷ
                </Button>,
                <Button loading={loading} onClick={handleOk} type="primary" htmlType="submit" key="submit">
                    Sửa đổi
                </Button>
            ]}
        >
            <Form
                form={form}
            >
                <Space direction="horizontal" align="center" style={{ justifyContent: "space-around" }}>
                    <Space>
                        <Form.Item
                            name="avatar"
                        >
                            <div className="avatar-information">
                                <img src={avatar} alt="avatar" />
                                <Input title="Chọn ảnh" onChange={handleAvatar} type="file" accept="image/*" />
                            </div>
                        </Form.Item>
                    </Space>
                    <Space direction="vertical">
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                    initialValue={data?.name}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="CMND"
                                    name="citizenId"
                                    rules={[{ required: true, message: 'Vui lòng nhập mã số chứng minh!' }]}
                                    initialValue={data?.citizenId}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[10, 0]}>
                            <Col span={20}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                    initialValue={data?.email}
                                >
                                    <Input />

                                </Form.Item>
                            </Col>
                            {data.emailConfirmed ?
                                <Col span={3}>
                                    <FontAwesomeIcon icon={faSquareCheck} size="2x" title="Đã xác thực email" />
                                </Col>
                                :
                                <Col span={3}>
                                    <FontAwesomeIcon onClick={handleVerifyEmail} className="verifyEmail" icon={faSquare} size="2x" title="Chưa xác thực email" />
                                </Col>

                            }
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Số Điện thoại"
                                    name="phoneNumber"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    initialValue={data?.phoneNumber}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Space>
                </Space>
            </Form>
        </Modal >

    )
}