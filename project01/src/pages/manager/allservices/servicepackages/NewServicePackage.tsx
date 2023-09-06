import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useEffect, useState } from "react";
import type { ModalProps, SelectProps } from "antd";
import "./newservicepackage.scss"
import api_links from "../../../../utils/api_links";
import Cookies from "universal-cookie";
import fetch_Api from "../../../../utils/api_function";


interface getService {
    "serviceName": string
    "description": string
    "id": number,
    "servicePackages"?: []
}


interface createServicePackage {
    "ServicePackageName": string,
    "Description": string,
    "ServicesIds": []
}

// interface CustomError extends Error {
//     response?: {
//         "isSuccess"?: boolean,
//         "message"?: string,
//         "error"?: []
//     }
// }

export default function NewServicePackage() {

    const [form] = Form.useForm()

    ///////// use to display the choice for user /////////// 
    const [service, getService] = useState<getService[]>([])
    const options: SelectProps['options'] = []
    service.forEach((item) => {
        options.push({
            label: `${item.serviceName}: ${item.description}`,
            value: item.id
        })
    })
    /////////////////////////////////////////////////////////
    const handleFinish = (values: createServicePackage) => {
        createServicePackage(values)
            .then((res) => {
                if (res.status === 201) {
                    message.success("Tạo thành công")
                    form
                        .resetFields()
                }
            })
            .catch((error) => {
                message.error(error.message)
            })

    }

    const cookies = new Cookies()
    const token = cookies.get("token")?.token

    const getAllServices = () => {
        const api_link = api_links.user.superAdmin.getAllServices
        api_link.token = token
        return fetch_Api(api_link)
    }

    const createServicePackage = (values: createServicePackage) => {
        const api_link = api_links.user.superAdmin.createServicePackage
        api_link.token = token
        api_link.data = values
        return fetch_Api(api_link)
    }

    //useEffect
    useEffect(() => {
        getAllServices()
            .then((res) => {
                if (res.status === 200) {
                    getService(res.data)
                }
            })
            .catch((reason) => {
                //console.log(reason);

            })
    }, [])

    return (
        <div className="user-services">
            <div className="user-services--form">
                <Row>
                    <Col span={24}>
                        <h1>Thêm dịch vụ</h1>
                    </Col>
                </Row>
                <Form
                    className="newservice-form"
                    form={form}
                    onFinish={handleFinish}
                >
                    <Row >
                        <Col span={10}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên gói dịch vụ" },
                                    { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" }
                                ]}
                                label="Tên gói dịch vụ"
                                name="ServicePackageName"
                            >
                                <Input placeholder="Tên gói dịch vú" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                rules={[
                                    { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" },
                                    { max: 50, required: true, message: "Vui lòng nhập miêu tả dịch vụ" }]}
                                label="Miêu tả"
                                name="Description"
                            >
                                <Input placeholder="Miêu tả" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Các dịch vụ"
                                name="ServicesIds"
                                rules={[{ required: true, message: "Vui lòng lựa chọn dịch vụ" }]}

                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Lựa chọn dịch vụ"
                                    options={options}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item>
                                <Button htmlType="submit" type="primary">Tạo dịch vụ</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
}