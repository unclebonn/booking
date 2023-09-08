import { Button, Col, Form, Input, Row, Select, SelectProps, DatePicker, DatePickerProps, Modal, Space, Checkbox, InputRef, message } from "antd";
import api_links from "../../../utils/api_links";
import fetch_Api from "../../../utils/api_function";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { BookingState, CustomerListState, CustomerState, ServicePackageListState, ServicePackageState, VoucherListState, VoucherState, VoucherTypeState } from "../../../app/type.d";
import { RangePickerProps } from "antd/es/date-picker";
import "./newbooking.scss"
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { DefaultOptionType } from "antd/es/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';


interface BookingStateProps {
    key?: React.Key;
    VoucherIds: [],
    ServicePackageId: null,
    BookingTitle: string,
    BookingStatus: string,
    TotalPrice: number,
    PriceDetails: string,
    Note: string,
    Descriptions: string,
    StartDateTime: string,
    EndDateTime: string,
    CustomerId: null,

}


interface SelectProp extends Array<SelectProp> {
    id: number,
    label: string,
    value: number,
    price: number
}


export default function NewBooking() {
    const [form] = Form.useForm()
    const [allCustomer, setAllCustomer] = useState<CustomerListState>([])
    const [customerVoucher, setCustomerVoucher] = useState<VoucherListState>([])
    const [allservicePackage, setAllServicePackage] = useState<ServicePackageListState>([])
    const [servicePackage, setServicePackage] = useState<ServicePackageState>(undefined!)
    const [startDateTime, setStartDateTime] = useState<string>("")
    const [endDateTime, setEndDateTime] = useState<string>("")
    const [popupVoucher, setPopUpVoucher] = useState(false)
    const [options, setOptions] = useState<VoucherTypeState[]>([])
    const [selectOptions, setSelectOptions] = useState<SelectProp[]>([])
    const [tempMoney, setTempMoney] = useState<string>("")
    const [totalMoney, setTotalMoney] = useState<number>(0)
    const [moneyDiscount, setMoneyDiscount] = useState<number | undefined>(0)
    const { RangePicker } = DatePicker



    useEffect(() => {
        getAllCustomer()
            .then((res) => {
                if (res.status === 200) {
                    setAllCustomer(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);
            })

        getAllServicePackages()
            .then((res) => {
                if (res.status === 200) {
                    setAllServicePackage(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);
            })

    }, []);

    useEffect(() => {
        handleClearSelected()

    }, [selectOptions])


    const handleChangeDiscount = (value: any, option: any) => {
        if (option.length > 0) {
            const _moneyDiscount = option?.reduce((total: number, current: SelectProp) => {
                return total + Number(current.price)
            }, 0)


            setTotalMoney(Number(tempMoney) - _moneyDiscount)
            setMoneyDiscount(_moneyDiscount)




        } else {
            setMoneyDiscount(0)
            setTotalMoney(Number(tempMoney))
        }
    }

    const handlePriceServicePackage = (e: ChangeEvent<HTMLInputElement>) => {
        // const moneyDiscount = selectOptions?.reduce((total, current) => {
        //     return total + Number(current.price)
        // }, 0)
        setTempMoney(e.target.value)
        if (e.target.value && moneyDiscount) {
            const totalMoney = Number(e.target.value) - moneyDiscount
            setTotalMoney(totalMoney)
        } else {
            setTotalMoney(Number(e.target.value))
        }
    }

    const handleFinish = (values: BookingStateProps) => {
        values.StartDateTime = startDateTime
        values.EndDateTime = endDateTime
        values.TotalPrice = totalMoney


        createNewBooking(values)
            .then((res) => {
                if (res.status === 201) {
                    message.success("Tạo thành công")
                }
            })
            .catch((error) => {
                message.error(error.message)
            })


    }

    const handleClearSelected = () => {
        form.setFieldsValue({ VoucherIds: [] })
    }

    const handleSelectCustomer = (value: string) => {
        getVoucherCustomer(value)
            .then((res) => {
                if (res.status === 200) {
                    setCustomerVoucher(res.data)
                    setSelectOptions([])

                }
            })
            .catch((error) => {
                //console.log(error);

            })
    }

    const handleSelectServicePackage = (values: number) => {
        getServicePackage(values)
            .then((res) => {
                if (res.status === 200) {
                    setServicePackage(res.data)
                    setSelectOptions([])

                }
            })
            .catch((error) => {
                //console.log(error);
            })
    }

    const handleVoucher = (customerVoucher: VoucherListState, servicePackage: VoucherTypeState[]) => {
        setPopUpVoucher(!popupVoucher)
        const cusVouchersType = customerVoucher.map((voucher) => voucher.voucherType)

        const voucherValid: any = []

        // compare the lenght of customer and service package to get the object for iterable first
        // each time the first object iterate it push the voucher into the voucherValid array
        // after that compare the first object and the second object 
        // if the voucher in the first object has the same type in the second object
        // it remove the voucher right away and update the voucher with the appropriate property --- appropriate:true
        // and so on until the end of the loop

        ///////////////////////////////////////////////////////////////////////////////
        // const length = compareLenght(customerVoucher, servicePackage)
        // const compareLeng = compareLenghtContrast(customerVoucher, servicePackage)

        // if (customerVoucher.length === 0) {
        //     return
        // } else {
        //     length.map((voucher) => {
        //         voucherValid.push(voucher.voucherType)
        //         compareLeng.map((voucherCompare) => {
        //             if (voucher !== null && voucher.typeName === voucherCompare.typeName) {
        //                 const appropriateData = { ...voucher, appropriate: true }
        //                 voucherValid.pop()
        //                 voucherValid.push(appropriateData)


        //             }
        //             if (voucherValid.length === length.length) {
        //                 return
        //             }
        //         })
        //     })
        // }
        /////////////////////////////////////////////////////////////////////////////////
        if (cusVouchersType.length > servicePackage.length) {
            customerVoucher.map((voucher) => {
                if (voucher.voucherType === null) {
                } else {
                    voucherValid.push(voucher.voucherType)
                    servicePackage.map((voucherServicePackage) => {
                        if (voucher.voucherType.id === voucherServicePackage.id) {
                            const appropriateData = { ...voucher.voucherType, appropriate: true }
                            const plusId = { ...appropriateData, id: voucher.id }
                            voucherValid.pop()
                            voucherValid.push(plusId)

                        }
                    })
                }
            })
        } else {
            servicePackage.map((voucherServicePackage) => {
                voucherValid.push(voucherServicePackage)
                customerVoucher.map((voucher) => {
                    if (voucher.voucherType === null) {


                    } else if (voucher.voucherType.id === voucherServicePackage.id) {
                        const appropriateData = { ...voucher.voucherType, appropriate: true }
                        const plusId = { ...appropriateData, id: voucher.id }
                        voucherValid.pop()
                        voucherValid.push(plusId)

                    }
                })

            })
        }

        setOptions(voucherValid)

    }

    const handleCheckBoxGroup = (checkedValues: CheckboxChangeEvent) => {
        if (checkedValues.target.checked) {
            setSelectOptions(prev => {
                return [...prev as Array<DefaultOptionType>, checkedValues.target.value]
            })
        } else {

            const filterData = selectOptions?.filter((option) => option.id !== checkedValues.target.value.id)
            setSelectOptions(filterData)
        }


    }

    const handleDateTime = (value: RangePickerProps['value'], datestring: [string, string]) => {
        setStartDateTime(datestring[0])
        setEndDateTime(datestring[1])

    }
    // const handleEndTime = (value: DatePickerProps['value'] | RangePickerProps['value'],
    //     dateString: string,
    // ) => {
    //     setEndDateTime(dateString)
    // }


    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today
        return current && current < dayjs().startOf('day');
    };

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    const disabledDateTime = () => ({
        disabledHours: () => {
            if (dayjs().hour() === 0) {
                return []
            } else {
                return range(0, dayjs().hour())
            }
        },
        disabledMinutes: () => {
            if (dayjs().minute() === 0) {
                return []
            } else {
                return range(0, dayjs().minute())
            }
        },
        disabledSeconds: () => {
            if (dayjs().second() === 0) {
                return []
            } else {
                return range(0, dayjs().second())
            }
        }
    });

    ////////////////////// GET API ///////////////////////////////
    const getAllCustomer = () => {
        const api_link = {
            url: api_links.user.saleAdmin.getUserCustomer,
            method: "GET"
        }
        return fetch_Api(api_link)
    }


    const getVoucherCustomer = (customerId: string) => {
        const api_link = {
            url: `${api_links.user.superAdmin.getVoucherCustomer.url}${customerId}`,
            method: "GET"
        }
        return fetch_Api(api_link)
    }

    const getAllServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllServicePackages
        return fetch_Api(api_link)
    }

    const getServicePackage = (servicePackageId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.getServicePackage.url}${servicePackageId}`,
            method: "GET"
        }
        return fetch_Api(api_link)
    }



    const createNewBooking = (values: BookingStateProps) => {
        const api_link = {
            url: api_links.user.superAdmin.createNewBooking,
            method: "POST",
            data: values
        }
        return fetch_Api(api_link)
    }


    return (
        <div className="user-newbooking">
            <Modal
                open={popupVoucher}
                title="Voucher"
                onCancel={() => {
                    setPopUpVoucher(false)

                }}
                footer={[]}
                style={{ height: "80vh", overflowY: "scroll" }}
            >

                {/* <Checkbox.Group style={{ display: "grid" }} name="" onChange={handleCheckBoxGroup}> */}
                {options.map((option, index) => {
                    return (
                        <>
                            <Space direction="vertical">
                                {option !== null && option.appropriate && option.isAvailable ?
                                    <Checkbox key={option.typeName} onChange={handleCheckBoxGroup} name={option?.typeName} value={{ id: option.id, label: option?.typeName, value: option.id, price: option.commonPrice }} className="uservoucher-valid">
                                        <Space direction='vertical' className='uservoucher-valid'>
                                            <Space>
                                                <span style={{ color: "#0958d9" }}>Tên gói khuyến mãi: </span>
                                                <span>{option?.typeName}</span>
                                            </Space>
                                            <Space>
                                                <span style={{ color: "#0958d9", display: "inline-block", width: "4vw" }}>Điều kiện: </span>
                                                <span>{option?.conditionsAndPolicies}</span>
                                            </Space>
                                            <Space>
                                                <span style={{ color: "#0958d9" }}>Giá trị: </span>
                                                <span>{option?.commonPrice.toLocaleString("en")}đ</span>
                                            </Space>
                                            <Space>
                                                <span style={{ color: "#0958d9" }}>Số lượng khuyến mãi còn lại: </span>
                                                <span>{option?.availableNumberOfVouchers}</span>
                                            </Space>
                                            <Space>
                                                {option?.percentageDiscount ?
                                                    <>
                                                        <span style={{ color: "#0958d9" }}>Giảm giá: </span>
                                                        <span>{option?.percentageDiscount}%</span>
                                                    </>
                                                    :
                                                    <>
                                                        <span style={{ color: "#0958d9" }}>Giảm giá: </span>
                                                        <span>{option?.valueDiscount.toLocaleString("vi-VN")}</span>
                                                    </>

                                                }
                                            </Space>
                                            <Space>
                                                <span style={{ color: "#0958d9" }}>Giảm giá tối đa: </span>
                                                <span>{option?.maximumValueDiscount ? option?.maximumValueDiscount.toLocaleString("vi-VN") : "0"}đ</span>
                                            </Space>
                                        </Space>
                                    </Checkbox>
                                    :
                                    option !== null ?

                                        <Checkbox style={{ border: "1px solid black" }} className="uservoucher-invalid" disabled>
                                            {option.isAvailable === false ? <span style={{ color: "red" }}>Không thể sử dụng</span> : <span style={{ color: "red" }}>{servicePackage?.valuableVoucherTypes.length === 0 ? "Gói dịch vụ chưa áp dụng voucher" : options.length > servicePackage?.valuableVoucherTypes?.length ? "Gói dịch vụ không áp dụng voucher này" : "Khách hàng không có voucher này"}</span>}
                                            <Space direction='vertical' className='uservoucher-invalid'>
                                                <Space>
                                                    <span style={{ color: "#0958d9" }}>Tên gói khuyến mãi: </span>
                                                    <span>{option?.typeName}</span>
                                                </Space>
                                                <Space>
                                                    <span style={{ color: "#0958d9", display: "inline-block", width: "4vw" }}>Điều kiện: </span>
                                                    <span>{option?.conditionsAndPolicies}</span>
                                                </Space>
                                                <Space>
                                                    <span style={{ color: "#0958d9" }}>Giá trị: </span>
                                                    <span>{option?.commonPrice.toLocaleString("vi-VN")}đ</span>
                                                </Space>
                                                <Space>
                                                    <span style={{ color: "#0958d9" }}>Số lượng khuyến mãi còn lại: </span>
                                                    <span>{option?.availableNumberOfVouchers}</span>
                                                </Space>
                                                <Space>
                                                    {option?.percentageDiscount ?
                                                        <>
                                                            <span style={{ color: "#0958d9" }}>Giảm giá: </span>
                                                            <span>{option?.percentageDiscount}%</span>
                                                        </>
                                                        :
                                                        <>
                                                            <span style={{ color: "#0958d9" }}>Giảm giá: </span>
                                                            <span>{option?.valueDiscount.toLocaleString("vi-VN")}</span>
                                                        </>

                                                    }
                                                </Space>
                                                <Space>
                                                    <span style={{ color: "#0958d9" }}>Giảm giá tối đa: </span>
                                                    <span>{option?.maximumValueDiscount ? option?.maximumValueDiscount.toLocaleString("vi-VN") : "0"}đ</span>
                                                </Space>
                                            </Space>
                                        </Checkbox>

                                        : <div></div>}
                            </Space>
                        </>
                    )
                })}
                {/* </Checkbox.Group> */}

            </Modal>
            <div className="user-services--form">
                <Row>
                    <Col span={24}>
                        <h1>Booking</h1>
                    </Col>
                </Row>
                <Form
                    className="newservice-form"
                    onFinish={handleFinish}
                    form={form}
                >
                    {/* customer */}
                    <Row >
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên khách hàng" },
                                ]}
                                label="Tên khách hàng"
                                name="CustomerId"
                            >
                                <Select
                                    value={[]}
                                    showSearch
                                    onSelect={handleSelectCustomer}
                                    placeholder="Khách hàng"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={allCustomer.map((cus: CustomerState) => {
                                        return (
                                            {
                                                label: `${cus.name}`,
                                                value: cus.id
                                            }
                                        )
                                    })}
                                ></Select>

                            </Form.Item>
                        </Col>
                    </Row>
                    {/* service package */}
                    <Row >
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên dịch vụ" },
                                ]}
                                label="Gói dịch vụ"
                                name="ServicePackageId"
                                initialValue={null}
                            >

                                <Select
                                    showSearch
                                    onSelect={handleSelectServicePackage}
                                    placeholder="Dịch vụ"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={allservicePackage.map((sp: ServicePackageState) => {
                                        return (
                                            {
                                                label: `${sp.servicePackageName}`,
                                                value: sp.id
                                            }
                                        )
                                    })}
                                >
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* booking title */}
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" },
                                    { max: 50, required: true, message: "Vui lòng nhập tên booking" }]}
                                label="Tên booking"
                                name="BookingTitle"
                            >
                                <Input placeholder="Tên booking" />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* booking status */}
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng chọn trạng thái" }
                                ]}
                                label="Tình trạng"
                                name="BookingStatus"
                            >
                                <Select
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
                    {/* price detail  */}
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Chi tiết giá tiền"
                                name="PriceDetails"
                                initialValue={null}
                            >
                                <Input placeholder="60000đ/vé - 2 vé" />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* note */}
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Ghi chú"
                                name="Note"
                                initialValue={null}
                            >
                                <Input placeholder="2 trẻ 3 lớn" />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* description */}
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Miêu tả"
                                name="Descriptions"
                                initialValue={null}
                            >
                                <Input placeholder="Miêu tả" />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* start date time */}
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian bắt đầu"
                                name="StartDateTime"

                                rules={[
                                    { required: true, message: "Vui lòng chọn thời gian bắt đầu" }
                                ]}

                            >
                                <RangePicker
                                    showTime
                                    onChange={handleDateTime}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* end date time */}
                    {/* <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian kết thúc"
                                name="EndDateTime"
                            >
                                <RangePicker showTime 
                                // disabledDate={disabledDate}  
                                />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    {/* voucher */}
                    {
                        servicePackage && customerVoucher.length !== 0 ? <Row gutter={[8, 0]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Voucher áp dụng"
                                    name="VoucherIds"
                                    initialValue={[]}
                                >
                                    <Select
                                        onChange={handleChangeDiscount}
                                        mode="multiple"
                                        options={selectOptions?.map((option) => {
                                            return ({
                                                id: option.id,
                                                label: option.label,
                                                value: option.value,
                                                price: option.price

                                            })
                                        })}
                                        placeholder="Voucher áp dụng"
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Button onClick={() => handleVoucher(customerVoucher, servicePackage.valuableVoucherTypes)}>
                                    <PlusCircleOutlined style={{ fontSize: "16px" }} />
                                </Button>
                            </Col>
                        </Row> :
                            <div></div>
                    }

                    {/* price service package */}
                    <Row>
                        <Col span={12}>
                            <div style={{ display: "flex", margin: "0px 0px 20px 0px" }}>
                                <div>
                                    <label htmlFor="name">Tiền gói dịch vụ: </label>

                                </div>
                                <div style={{ flexGrow: 1, marginLeft: "12px" }}>
                                    <Input required type="number" min={1} onChange={handlePriceServicePackage} />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* discount */}
                    <Row>
                        <Col span={2}>
                            <Form.Item
                                label="Giảm giá"

                            >
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <h4 style={{ position: "relative", top: "6px" }}>{moneyDiscount?.toLocaleString("vi-VN")} đồng</h4>
                        </Col>
                    </Row>

                    {/* totalPrice */}
                    <Row>
                        <Col span={2}>
                            <Form.Item
                                label="Tổng tiền"
                            >
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <h4 style={{ position: "relative", top: "6px" }}>{totalMoney.toLocaleString("vi-VN")} đồng</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
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

