import { Button, Space, message, notification } from "antd"
import { NotificationPlacement } from "antd/es/notification/interface"
import React from "react"
import api_links from "../../utils/api_links";
import fetch_Api from "../../utils/api_function";
import Cookies from "universal-cookie";
import { BookingListState, BookingState, CustomerListState, CustomerState, ServiceListState, ServicePackageListState, ServicePackageState, VoucherTypeListState, VoucherTypeState } from "../../app/type.d";


interface DataType {
    key?: React.Key;
    id: number;
    servicePackageName: string;
    image: string;
    href: string;
    description: string,
    services: ServiceListState,
    valuableVoucherTypes: VoucherTypeListState
}

interface DataType_Customer {
    key: React.Key;
    id: string;
    name: string;
    contact: string;
    status: string;
}
interface DataType_Voucher {
    "key": React.Key;
    "href"?: string | undefined;
    "image"?: string;
    "id": number,
    "typeName": string,
    "isAvailable": boolean,
    "commonPrice": number,
    "valueDiscount": number,
    "availableNumberOfVouchers": number,
    "percentageDiscount": number,
    "maximumValueDiscount": number,
    "conditionsAndPolicies": string,
    "vouchers": [],
    "usableServicePackages": []
}


interface NotificationProps {
    type: string,
    description: string,
    placement: NotificationPlacement,
    buttonContent: string,
    children?: React.ReactNode;
    isDisable?: boolean,
    setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>,
    selectedRowData: BookingState[] | ServicePackageState[] | CustomerState[] | VoucherTypeState[],
    setDataRecover: React.Dispatch<React.SetStateAction<BookingListState>> | React.Dispatch<React.SetStateAction<DataType[]>> | React.Dispatch<React.SetStateAction<DataType_Customer[]>> | React.Dispatch<React.SetStateAction<DataType_Voucher[]>>,
    setData: React.Dispatch<React.SetStateAction<CustomerListState>> |  React.Dispatch<React.SetStateAction<CustomerListState>> | React.Dispatch<React.SetStateAction<BookingListState>> | React.Dispatch<React.SetStateAction<ServicePackageListState>> | React.Dispatch<React.SetStateAction<CustomerListState>> | React.Dispatch<React.SetStateAction<VoucherTypeListState>>
}
const Notification: React.FC<NotificationProps> = ({ type, setSelectedRowKeys, setDataRecover, setData, selectedRowData, description, placement, buttonContent, isDisable }) => {
    const key = `open${Date.now()}`;
    const [api, contextHolder] = notification.useNotification()
    const cookie = new Cookies()
    const token = cookie.get("token").token

    const btn = (
        <Space>
            <Button type="default" size="middle" onClick={() => api.destroy()}>
                Huỷ bỏ
            </Button>
            <Button type="primary" size="middle" onClick={() => handleDelete()}>
                Xoá
            </Button>
        </Space>
    );
    const openNotification = (placement: NotificationPlacement) => {
        api.warning({
            message: `Lưu ý`,
            description: `${description}`,
            placement: `${placement}`,
            btn,
            key,
        })
    }
    const handleDelete = () => {
        api.destroy(key)
        switch (type) {
            case "service": {
                deleteBatchServicePackages()
                    .then((res) => {
                        if (res.status === 200) {
                            message.success(res.data.message)
                            setSelectedRowKeys([])
                            getAllServicePackages()
                                .then((res) => {
                                    if (res.status === 200) {
                                        setData(res.data)

                                    }
                                })

                            getAllDeleteServicePackages()
                                .then((res) => {
                                    if (res.status === 200) {
                                        setDataRecover(res.data)
                                    }
                                })
                        }
                    })
                    .catch((error) => {
                        message.error(error.message);

                    })
                break;
            }
            case "voucher": {
                deleteBatchVoucherTypes()
                    .then((res) => {
                        if (res.status === 200) {
                            message.success(res.data.message)
                            setSelectedRowKeys([])
                            getAllVoucherType()
                                .then((res) => {
                                    if (res.status === 200) {
                                        setData(res.data)

                                    }
                                })

                            getAllDeleteVoucherType()
                                .then((res) => {
                                    if (res.status === 200) {
                                        setDataRecover(res.data)
                                    }
                                })
                        }
                    })
                    .catch((error) => {
                        message.error(error.message);

                    })
                break;
            }
        }


    }

    const selectedRowDataById = selectedRowData.map((data) => data.id)


    /////////////////////////// GET API //////////////////////////////////
    const deleteBatchServicePackages = () => {
        const api_link = api_links.user.superAdmin.deleteServicePackages
        api_link.token = token
        api_link.data = selectedRowDataById
        return fetch_Api(api_link)
    }
    const getAllServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllServicePackages
        api_link.token = token
        return fetch_Api(api_link)

    }
    const getAllDeleteServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteServicePackages
        api_link.token = token
        return fetch_Api(api_link)
    }
    const deleteBatchVoucherTypes = () => {
        const api_link = api_links.user.superAdmin.deleteVoucherTypes
        api_link.token = token
        api_link.data = selectedRowDataById
        return fetch_Api(api_link)
    }

    const getAllVoucherType = () => {
        const api_link =
        {
            url: api_links.user.superAdmin.getAllVoucherType,
            method: "GET"
        }

        return fetch_Api(api_link)

    }

    const getAllDeleteVoucherType = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteVoucherType
        api_link.token = token
        return fetch_Api(api_link)
    }


    return (
        <React.Fragment>
            {contextHolder}
            <Button disabled={isDisable} type="primary" style={isDisable ? { backgroundColor: "rgba(0,0,0,0.45)"} : {backgroundColor: "red" }} onClick={() => openNotification(placement)}>
                {buttonContent}
            </Button>
        </React.Fragment >
    )
}

export default Notification