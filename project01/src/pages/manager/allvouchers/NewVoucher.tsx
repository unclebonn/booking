import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useEffect, useState } from "react";
import type { ModalProps, SelectProps } from "antd";
import "./newvoucher.scss"
import api_links from "../../../utils/api_links";
import Cookies from "universal-cookie";
import fetch_Api from "../../../utils/api_function";
import { type } from "os";
import { ServicePackageListState, ServicePackageState, VoucherTypeState } from "../../../app/type.d";


export default function Newvoucher() {

    const [form] = Form.useForm()

    ///////// use to display the choice for user /////////// 
    const [servicePackages, getServicePackages] = useState<ServicePackageListState>([])
    const options: SelectProps['options'] = []
    servicePackages.forEach((item) => {
        options.push({
            label: `${item.servicePackageName}`,
            value: item.id
        })
    })
    /////////////////////////////////////////////////////////

    const cookies = new Cookies()
    const token = cookies.get("token")?.token
    const [typeValue, setTypeValue] = useState("percent")
    const handleFinish = (values: ServicePackageState) => {
        createServicePackage(values)
            .then((res) => {
                if (res.status === 201) {
                    message.success("Tạo thành công")
                }
            })
            .catch((error) => {
                message.error("Tạo thất bại")
            })

    }


    /////////////////////// GET API ///////////////////////////////
    const getAllServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllServicePackages
        api_link.token = token
        return fetch_Api(api_link)
    }

    const createServicePackage = (values: ServicePackageState) => {
        const api_link = api_links.user.superAdmin.createVoucherType
        api_link.token = token
        api_link.data = values
        return fetch_Api(api_link)
    }

    //useEffect
    useEffect(() => {
        getAllServicePackages()
            .then((res) => {
                if (res.status === 200) {
                    getServicePackages(res.data)
                }
            })
            .catch((reason) => {
                //console.log(reason);

            })
    }, [])

    const handleValueDiscount = (value: any) => {
        setTypeValue(value)
    }

    return (
        <div className="user-newvoucher">
            <div className="user-newvoucher--form">
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
                                    { required: true, message: "Vui lòng nhập tên mã khuyến mãi" },
                                    { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" }
                                ]}
                                label="Tên mã khuyến mãi"
                                name="typeName"
                            >
                                <Input placeholder="Tên mã khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                rules={[

                                    { required: true, message: "Vui lòng lựa chọn hiệu lực" }]}
                                label="Hiệu lực"
                                name="isAvailable"
                            >
                                <Select
                                    options={[
                                        { label: "Có hiệu lực", value: true },
                                        { label: "Không có hiệu lực", value: false }
                                    ]}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Giá trị"
                                name="commonPrice"
                                rules={[{ required: true, message: "Vui lòng nhập giá trị của mã khuyến mãi" }]}

                            >
                                <Input type="number" placeholder="Giá trị của khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Số lượng mã khuyến mãi"
                                name="availableNumberOfVouchers"
                                rules={[{ required: true, message: "Vui lòng nhập số lượng của mã khuyến mãi" }]}

                            >
                                <Input type="number" placeholder="Số lượng của mã khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Loại giảm giá"
                                rules={[{ required: true, message: "dfsf" }]}

                            >
                                <Select
                                    defaultValue={["percent"]}
                                    onChange={handleValueDiscount}
                                    options={[
                                        { label: "Phần trăm", value: "percent" },
                                        { label: "Số", value: "number" }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {typeValue == "percent" ?
                        <Row style={{ marginLeft: "20px" }}>
                            <Col span={10}>
                                <Form.Item
                                    label="Giảm giá"
                                    name="PercentageDiscount"
                                    rules={[{ required: true, message: "Vui lòng nhập giá trị giảm giá của khuyến mãi" }]}

                                >
                                    <Input type="number" placeholder="Giá trị" addonAfter="%" />
                                </Form.Item>
                            </Col>
                        </Row>
                        : <Row style={{ marginLeft: "20px" }}>
                            <Col span={10}>
                                <Form.Item
                                    label="Loại giảm giá"
                                    name="valueDiscount"
                                    rules={[{ required: true, message: "Vui lòng nhập giá trị của khuyến mãi" }]}

                                >
                                    <Input type="number" placeholder="Giá trị" addonAfter="VNĐ" />
                                </Form.Item>
                            </Col>
                        </Row>}
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Giá trị tối đa của mã khuyến mãi"
                                name="maximumValueDiscount"
                                rules={[{ required: true, message: "Vui lòng nhập giá trị tối đa của khuyến mãi" }]}

                            >
                                <Input type="number" placeholder="Giá trị tối đa của khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Điều kiện"
                                name="conditionsAndPolicies"
                                rules={[
                                    { required: true, message: "Vui lòng nhập điều kiện" }
                                    , { min: 5, max: 100, message: "Vui lòng nhập điều kiện trên 5 và dưới 100 ký tự" }
                                ]}

                            >
                                <Input.TextArea placeholder="Giá trị của khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Gói dịch vụ được áp dụng"
                                name="ServicePackageIds"
                                rules={[
                                    { required: true, message: "Vui lòng chọn gói dịch vụ" }
                                ]}
                            >
                                <Select
                                    mode="multiple"
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