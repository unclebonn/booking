import { Button, Col, DatePicker, DatePickerProps, Form, Input, Row, Select, SelectProps, Space, message } from "antd"
import "./voucherextension.scss"
import { useLocation } from "react-router-dom"
import { useState } from "react"
import { RangePickerProps } from "antd/es/date-picker"
import api_links from "../../../utils/api_links"
import fetch_Api from "../../../utils/api_function"


interface VoucherExtensionProps {
    voucherId: string,
    price: number,
    newExpiredDate: string
}


interface VoucherStatusProps {
    "op": string,
    "path": string,
    "value": SelectProps["options"]
}

export default function VoucherExtension() {
    const location = useLocation()
    const { id, expiredDate, voucherStatus } = location.state
    const [endDateTime, setEndDateTime] = useState<string>(undefined!)
    const [voucherStatusUpdate, setVoucherStatusUpdate] = useState<VoucherStatusProps[]>(undefined!)


    const handleFinish = (values: VoucherExtensionProps) => {
        values.newExpiredDate = endDateTime

        createVoucherExtension(values)
            .then((res) => {
                if (res.status === 201) {
                    message.success("Cập nhật thành công")
                }
            })
            .catch((error) => {
                message.error(error.message)
            })

    }

    const handleFinishVoucherStatus = () => {
        updateVoucherStatus(voucherStatusUpdate)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    const handleEndTime = (value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: string,
    ) => {
        setEndDateTime(dateString)
    }


    const handleSelect = (values: SelectProps["options"]) => {
        const data = [
            {
                "op": "replace",
                "path": "VoucherStatus",
                "value": values
            }
        ]
        setVoucherStatusUpdate(data)
    }


    const getVoucherStatus = () => {
        switch (voucherStatus) {
            case "Expired":
                return 1
            case "Usable":
                return 2

            case "OutOfValue":
                return 3

            case "Blocked":
                return 4
            default:
                return 1
        }
    }
    //////////////////////////// GET API ///////////////////////////
    const createVoucherExtension = (values: VoucherExtensionProps) => {
        const api_link = api_links.user.superAdmin.createVoucherExtension
        api_link.data = values
        return fetch_Api(api_link)
    }


    const updateVoucherStatus = (values: VoucherStatusProps[]) => {
        const api_link = {
            url: `${api_links.user.superAdmin.updateVoucherStatus.url}${id}`,
            method: "PATCH",
            data: values
        }
        return fetch_Api(api_link)
    }
    return (
        <Space direction="horizontal" className="user-voucher-extension">
            <Space direction="vertical">
                <Row>
                    <Col>
                        <h1>Gia hạn voucher</h1>
                    </Col>
                </Row>
                <Space>
                    <Form
                        onFinish={(handleFinish)}
                    >
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Vourcher id"
                                    name="voucherId"
                                    initialValue={id}
                                    hidden
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Phí gia hạn"
                                    name="price"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập phí gia hạn" }
                                    ]}
                                >
                                    <Input type='number' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Ngày hết hạn cũ"
                                >
                                    <Input disabled value={new Date(expiredDate).toLocaleString("vi-VN")} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="Ngày hết hạn mới"
                                    name="newExpiredDate"
                                    rules={[
                                        { required: true, message: "Vui lòng chọn ngày gia hạn" }
                                    ]}
                                >
                                    <DatePicker showTime onChange={handleEndTime} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button htmlType="submit" type="primary">Cập nhật</Button>
                            </Col>
                        </Row>
                    </Form>
                </Space>
            </Space>
            <Space direction="vertical">
                <Row>
                    <Col>
                        <h1>Cập nhật trạng thái voucher</h1>
                    </Col>
                </Row>

                <Form
                    onFinish={(handleFinishVoucherStatus)}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Trạng thái"
                                name="voucherstatus"
                                rules={[
                                    { required: true, message: "Vui lòng chọn trạng thái" }
                                ]}
                                initialValue={[getVoucherStatus()]}
                            >
                                <Select
                                    onChange={handleSelect}
                                    options={[
                                        { label: "Hết hạn", value: 1 },
                                        { label: "Sử dụng", value: 2 },
                                        { label: "Không còn giá trị", value: 3 },
                                        { label: "Khoá", value: 4 },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Button htmlType="submit" type="primary">Cập nhật</Button>
                        </Col>
                    </Row>
                </Form>

            </Space>
        </Space>
    )
}