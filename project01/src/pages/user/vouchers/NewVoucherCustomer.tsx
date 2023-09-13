import { Button, Col, DatePicker, DatePickerProps, Form, Input, Row, Select, message } from "antd"
import "./newvouchercustomer.scss"
import api_links from "../../../utils/api_links"
import fetch_Api from "../../../utils/api_function"
import { useEffect, useState } from "react"
import { CustomerListState, CustomerState, VoucherTypeListState, VoucherTypeState } from "../../../app/type.d"
import { RangePickerProps } from "antd/es/date-picker"

const layout = {
    labelCol: {
        xs: { span: 24 },
        sm: { offset:2, span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};


interface NewVoucherForCustomerProps {
    customerId: string,
    voucherTypeId: number,
    expiredDate: string,
    actualPurchasePrice: number
}


export default function NewVoucherCustomer() {
    const [allCustomer, setAllCustomer] = useState<CustomerListState>([])
    const [customer, setCustomer] = useState<CustomerState>()
    const [allVoucherType, setAllVoucherType] = useState<VoucherTypeListState>([])
    const [endDateTime, setEndDateTime] = useState<string>(undefined!)


    useEffect(() => {
        getAllCustomer()
            .then((res) => {
                if (res.status === 200) {
                    setAllCustomer(res.data)
                }
            })
            .catch((error) => {
                //console.log(error.message);
            })

        getAllVoucherType()
            .then((res) => {
                if (res.status === 200) {
                    setAllVoucherType(res.data)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }, [])


    const handleSelect = (customerId: string) => {
        getCustomer(customerId)
            .then((res) => {
                if (res.status === 200) {
                    setCustomer(res.data)
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

    const handleFinish = (values: NewVoucherForCustomerProps) => {
        values.expiredDate = endDateTime
        createVoucher(values)
            .then((res) => {
                if (res.status === 201) {
                    message.success("Tạo thành công")
                }
            })
            .catch((error) => {
                message.error(error.message)
            })

    }

    /////////////////////////// GET API ////////////////////////////
    const getAllCustomer = () => {
        const api_link = {
            url: api_links.user.saleAdmin.getUserCustomer,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    const getCustomer = (customerId: string) => {
        const api_link = {
            url: `${api_links.user.saleAdmin.getUserCustomer}/${customerId}`,
            method: "GET"
        }
        return fetch_Api(api_link)
    }
    const getAllVoucherType = () => {
        const api_link = {
            url: api_links.user.superAdmin.getAllVoucherType,
            method: "GET"
        }
        return fetch_Api(api_link)
    }

    const createVoucher = (voucher: NewVoucherForCustomerProps) => {
        const api_link = api_links.user.superAdmin.createVoucher
        api_link.data = voucher
        return fetch_Api(api_link)
    }

    return (
        <div className="user-newvoucher">
            <Row>
                <Col>
                    <h1>Tạo voucher cho khách hàng</h1>
                </Col>
            </Row>
            <Form
                onFinish={handleFinish}
                labelAlign="left"
                {...layout}
                labelWrap 
                colon={false}
            >
                
                        <Form.Item

                            label="Khách hàng"
                            name="customerId"
                            rules={[
                                { required: true, message: "Vui lòng lựa chọn khách hàng" }
                            ]}
                        >
                            <Select
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                                onSelect={handleSelect}
                                options={allCustomer?.map((customer) => {
                                    return (
                                        {
                                            label: customer.name,
                                            value: customer.id
                                        }
                                    )
                                })}
                            />
                        </Form.Item>
                   
                        <Form.Item
                            label="Voucher"
                            name="voucherTypeId"
                            rules={[
                                { required: true, message: "Vui lòng lựa chọn voucher" }
                            ]}
                        >
                            <Select
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                                options={allVoucherType?.map((voucherType) => {
                                    return (
                                        {
                                            label: voucherType.typeName,
                                            value: voucherType.id
                                        }
                                    )
                                })}
                            />
                        </Form.Item>
                    
                        <Form.Item
                            label="Thời gian hết hạn"
                            name="expiredDate"
                            rules={[
                                { required: true, message: "Vui lòng lựa chọn ngày hết hạn" }
                            ]}
                        >
                            <DatePicker showTime onChange={handleEndTime} />
                        </Form.Item>
                    
                        <Form.Item
                            label="Giá voucher"
                            name="actualPurchasePrice"
                            rules={[
                                { required: true, message: "Vui lòng nhập giá tiền" }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button htmlType="submit" type="primary">Tạo</Button>
                        </Form.Item>

            </Form>
        </div>
    )
}