import { useLocation } from "react-router-dom"
import "./updatebooking.scss"
import { Button, Col, DatePicker, DatePickerProps, Form, Input, Row, Select, message } from "antd"
import { BookingState } from "../../../app/type.d"
import { useState } from 'react'
import dayjs from 'dayjs';
import { RangePickerProps } from "antd/es/date-picker"
import api_links from "../../../utils/api_links"
import fetch_Api from "../../../utils/api_function"





interface BookingProps {
    totalPrice: string,
    bookingStatus: number,
    bookingTitle: string,
    descriptions: string,
    endDateTime: string,
    note: string,
    priceDetails: string,
    startDateTime: string
}

export default function UpdateBooking() {
    const location = useLocation()
    const [endDateTimeUpdate, setEndDateTimeUpdate] = useState<string>("")
    const { bookingTitle, bookingStatus, totalPrice, priceDetails, note, descriptions, startDateTime, endDateTime, id } = location.state

    const handleFinish = (values: BookingProps) => {
        if (endDateTimeUpdate !== "") {
            values.endDateTime = endDateTimeUpdate
        } else {
            values.endDateTime = endDateTime
        }
        values.totalPrice = totalPrice

        updateBooking(values)
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
        setEndDateTimeUpdate(dateString)
    }


    ///////////////////////////////// GET API ////////////////////////////////////////
    const updateBooking = (value: BookingProps) => {
        const api_link = {
            url: `${api_links.user.superAdmin.updateBooking.url}${id}`,
            method: "PUT",
            data: value
        }

        return fetch_Api(api_link)
    }
    return (
        <div className="user-booking-update">
            <Row>
                <Col span={24}>
                    <h1>Cập nhật Booking</h1>
                </Col>
            </Row>
            <Form
                onFinish={handleFinish}
            >
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="Tên booking"
                            name="bookingTitle"
                            initialValue={bookingTitle}
                            rules={[
                                { required: true, message: "Vui lòng nhập tên booking" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            rules={[
                                { required: true, message: "Vui lòng chọn trạng thái" }
                            ]}
                            label="Tình trạng"
                            name="BookingStatus"
                            initialValue={1}
                        >
                            <Select
                                defaultValue={[1]}
                                showSearch
                                placeholder="Trạng thái"
                                options={[
                                    { label: "Đang xử lí", value: 1 },
                                    { label: "Đã thanh toán", value: 2 },
                                    { label: "Đã huỷ", value: 3 },
                                ]}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="Chi tiết giá tiền"
                            name="priceDetails"
                            initialValue={priceDetails}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="Miêu tả"
                            name="descriptions"
                            initialValue={descriptions}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="Ngày bắt đầu"
                            name="startDateTime"
                            initialValue={startDateTime}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="Ngày kết thúc"
                            name="endDateTime"
                            initialValue={dayjs(endDateTime)}
                            rules={[
                                { required: true, message: "Vui lòng chọn ngày kết thúc" }
                            ]}
                        >
                            <DatePicker defaultValue={dayjs(endDateTime)} showTime onChange={handleEndTime} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}>
                        <Form.Item
                            label="Tổng tiền"
                            name="totalPrice"
                        >
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Input disabled defaultValue={totalPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })} />
                    </Col>
                </Row>

                <Button htmlType="submit" type="primary" >Cập nhật</Button>

            </Form>
        </div>
    )
}