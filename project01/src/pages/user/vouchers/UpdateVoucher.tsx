import { Button, Col, Divider, Form, Input, Row, Select, Space, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useLocation } from "react-router-dom"
import api_links from "../../../utils/api_links"
import Cookies from "universal-cookie"
import fetch_Api from "../../../utils/api_function"
import './updatevoucher.scss'
import { VoucherTypeState } from "../../../app/type.d"
import { useState } from "react"
import { MessageType } from "antd/es/message/interface"



export default function UpdateVoucher() {
    const location = useLocation()
    const { availableNumberOfVouchers, commonPrice, conditionsAndPolicies, isAvailable, maximumValueDiscount, percentageDiscount, typeName, valueDiscount, id } = location.state
    const cookie = new Cookies()
    const token = cookie.get("token").token
    const [typeValue, setTypeValue] = useState(percentageDiscount ? "percent" : "number")

    const handleFinish = (values: VoucherTypeState) => {
        updateVoucherType(values)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                }
            })
            .catch((error) => {
                const notChangeValue = error?.error.filter((error: string) => error.includes("Maybe nothing has been changed"))
                const value = notChangeValue[0]
                if (value.includes("changed")) {
                    message.error("Giá trị cập nhật không thay đổi")
                }else{
                    message.error(error.message)
                }
            })
    }

    const handleValueDiscount = (values: any) => {
        setTypeValue(values)
    }



    //////////////////////////// GET API ///////////////////////////////
    const updateVoucherType = (data: VoucherTypeState) => {
        const api_link = {
            method: "PUT",
            url: `${api_links.user.superAdmin.updateVoucherType.url}${id}`,
            token: token,
            data: data
        };
        return fetch_Api(api_link)
    }

    return (
        <div className="user-newvoucher">
            <div className="user-newvoucher--form">
                <Row>
                    <Col span={24}>
                        <h1>Sửa mã khuyến mãi</h1>
                    </Col>
                </Row>
                <Form
                    className="newservice-form"
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
                                initialValue={typeName}
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
                                initialValue={isAvailable}
                            >
                                <Select
                                    defaultValue={isAvailable ? true : false}
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
                                initialValue={commonPrice}

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
                                initialValue={availableNumberOfVouchers}

                            >
                                <Input type="number" placeholder="Số lượng của mã khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Loại giảm giá"
                            >
                                <Select
                                    defaultValue={typeValue}
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
                                    initialValue={percentageDiscount}
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
                                    initialValue={valueDiscount}
                                >
                                    <Input type="number" placeholder="Giá trị" addonAfter="VNĐ" />
                                </Form.Item>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Giá trị tối đa của mã khuyến mãi"
                                name="maximumValueDiscount"
                                rules={[{ required: true, message: "Vui lòng nhập giá trị tối đa của khuyến mãi" }]}
                                initialValue={maximumValueDiscount}

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
                                ]}
                                initialValue={conditionsAndPolicies}

                            >
                                <Input.TextArea placeholder="Giá trị của khuyến mãi" />
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