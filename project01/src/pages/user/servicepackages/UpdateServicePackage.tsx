import { Button, Col, Divider, Form, Input, Row, Select, Space, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useLocation } from "react-router-dom"
import api_links from "../../../utils/api_links"
import Cookies from "universal-cookie"
import fetch_Api from "../../../utils/api_function"
import './updateservicepackage.scss'
import { ServiceListState, ServicePackageState, ServiceState, VoucherTypeListState, VoucherTypeState } from "../../../app/type.d"
import { useEffect, useState } from "react"


interface ServicePackageProps {
    "ServicePackageName": string,
    "Description": string
}

export default function UpdateServicePackage() {
    const { Option } = Select
    const location = useLocation()
    const { description, href, id, image, key, servicePackageName, services, valuableVoucherTypes } = location.state
    const cookie = new Cookies()
    const token = cookie.get("token").token
    const [servicesData, setServicesDate] = useState<ServiceListState>([])
    const [vouchersData, setVouchersDate] = useState<VoucherTypeListState>([])


    const handleFinish = (values: ServicePackageProps) => {
        updateServicePackage(values)
            .then((res) => {
                if (res.status) {
                    message.success("Sửa đổi thành công")
                }

            })
            .catch((reason) => {
                message.error(reason.message)
            })


    }

    const handleFinishService = (values: any) => {
        updateServicePackage_Services(values.servicename)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })


    }
    const handleFinishVoucher = (values: any) => {
        updateServicePackage_VoucherType(values.vouchers)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    useEffect(() => {
        getAllServices()
            .then((res) => {
                if (res.status === 200) {
                    setServicesDate(res.data)
                }
            })
            .catch((error) => {
                //console.log(error.message);

            })
        getAllVoucher()
            .then((res) => {
                if (res.status === 200) {
                    setVouchersDate(res.data)
                }
            })
            .catch((error) => {
                //console.log(error.message);

            })

    }, [])

    //////////////////////////// GET API ///////////////////////////////
    const updateServicePackage = (data: ServicePackageProps) => {
        const api_link = {
            method: "PUT",
            url: `${api_links.user.superAdmin.updateServicePackage.url}${id}`,
            token: token,
            data: data
        };
        return fetch_Api(api_link)
    }

    const getAllServices = () => {
        const api_link = api_links.user.superAdmin.getAllServices
        api_link.token = token
        return fetch_Api(api_link)
    }
    const getAllVoucher = () => {
        const api_link =
        {
            url: api_links.user.superAdmin.getAllVoucherType,
            method: "GET"
        }
        return fetch_Api(api_link)
    }


    const updateServicePackage_VoucherType = (values: []) => {
        const api_link =
        {
            url: `${api_links.user.superAdmin.updateServicePackage_VoucherType.url}${id}`,
            token: token,
            data: values,
            method: "PATCH"
        }
        return fetch_Api(api_link)
    }
    const updateServicePackage_Services = (values: []) => {
        const api_link =
        {
            url: `${api_links.user.superAdmin.updateServicePackage_Services.url}${id}`,
            token: token,
            data: values,
            method: "PATCH"
        }
        return fetch_Api(api_link)
    }



    return (
        <div className="user-services-update">
            <Row>
                <Col span={24}>
                    <h1>Cập nhật gói dịch vụ</h1>
                </Col>
            </Row>

            <Space direction="horizontal" className="user-services-update--form" wrap>
                <Space className="user-services-update--form-item" align="start" direction="vertical">
                    <Divider orientation="left">Sửa thông tin</Divider>
                    <Form
                        className="newservice-form"
                        onFinish={handleFinish}
                    >
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên gói dịch vụ" },
                                        { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" }
                                    ]}
                                    label="Tên gói dịch vụ"
                                    name="ServicePackageName"
                                    initialValue={servicePackageName}
                                >
                                    <Input placeholder="Tên gói dịch vú" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    rules={[
                                        { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" },
                                        { max: 50, required: true, message: "Vui lòng nhập miêu tả dịch vụ" }]}
                                    label="Miêu tả"
                                    name="Description"
                                    initialValue={description}
                                >
                                    <Input placeholder="Miêu tả" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={10}>
                                <Form.Item>
                                    <Button htmlType="submit" type="primary">Sửa thông tin</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Space>

                <Space className="user-services-update--form-item" align="start" direction="vertical">
                    <Divider orientation="left">Sửa dịch vụ</Divider>
                    <Form
                        className="newservice-form"
                        onFinish={handleFinishService}
                    >
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng chọn dịch vụ" },
                                    ]}
                                    label="Tên dịch vụ"
                                    name="servicename"
                                    initialValue={services.map((service: ServiceState) => service.id)}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: "100%" }}
                                        placeholder="Chọn dịch vụ"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        defaultValue={services.map((service: ServiceState) => {
                                            return (
                                                {
                                                    label: `${service.serviceName}:${service.description}`,
                                                    value: service.id
                                                }
                                            )
                                        })}
                                        options={servicesData.map((service: ServiceState) => {
                                            return (
                                                {
                                                    label: `${service.serviceName}:${service.description}`,
                                                    value: service.id
                                                }
                                            )
                                        })}
                                    >

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <Form.Item>
                                    <Button htmlType="submit" type="primary">Sửa dịch vụ</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Space>

                <Space className="user-services-update--form-item" align="start" direction="vertical">
                    <Divider orientation="left">Sửa mã khuyến mãi</Divider>
                    <Form
                        className="newservice-form"
                        onFinish={handleFinishVoucher}
                    >
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    rules={[
                                        { required: true, message: "Vui lòng chọn mã khuyến mãi" },
                                    ]}
                                    label="Mã khuyến mãi"
                                    name="vouchers"
                                    initialValue={valuableVoucherTypes.map((voucher: VoucherTypeState) => voucher.id)}>
                                    <Select
                                        mode="multiple"
                                        style={{ width: "100%" }}
                                        placeholder="Chọn khuyến mãi"
                                        defaultValue={valuableVoucherTypes.map((voucher: VoucherTypeState) => {
                                            return (
                                                {
                                                    label: `${voucher.typeName}`,
                                                    value: voucher.id
                                                }
                                            )
                                        })}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={vouchersData.map((voucher: VoucherTypeState) => {
                                            return (
                                                {
                                                    label: `${voucher.typeName}`,
                                                    value: voucher.id
                                                }
                                            )
                                        })}

                                    >

                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <Form.Item>
                                    <Button htmlType="submit" type="primary">Sửa mã khuyến mãi</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Space>

            </Space>

        </div>
    )
}