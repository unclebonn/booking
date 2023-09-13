import { useNavigate } from "react-router-dom";
import { CustomerListState, CustomerState, ServicePackageState, ServiceState, UserListState, UserState, VoucherState, VoucherTypeState } from "../app/type.d";
import type { ColumnsType } from 'antd/es/table';
import { Space, Button, message, List } from "antd"
import { havePermission } from "./permission_proccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from "./api_function";
import api_links from "./api_links";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const tableRecovery_Responsive = function (type: string, item: any) {

    const handleRecoverCustomer = (recordId: string) => {
        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Customers/restore-customer/" + recordId,
            method: "PATCH",
        })
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    const handleRecoverEmployess = (recordId: string) => {
        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Users/restore-user/" + recordId,
            method: "PATCH",
        })
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    const handleRecoverServicePackage = (recordId: number) => {
        recoverServicePackage(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    const handleRecoverService = (recordId: number) => {

        recoverService(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    const handleRecoverVouchers = (recordId: number) => {
        recoverVoucherType(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    const handleRecover = (recordId: number) => {
        recoverVoucher(recordId)
            .then((res_re) => {
                if (res_re.status === 200) {
                    message.success(res_re.data.message)
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }


    ////////////////////////////////// GET API ////////////////////////////////
    const recoverVoucherType = (recordId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverVoucherType.url}${recordId}`,
            method: "PATCH",
        }
        return fetch_Api(api_link)
    }

    const recoverServicePackage = (recordId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverServicePackage.url}${recordId}`,
            method: "PATCH"
        }
        return fetch_Api(api_link)
    }

    const recoverService = (serviceId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverService.url}${serviceId}`,
            method: "PATCH",
        }
        return fetch_Api(api_link)
    }

    const recoverVoucher = (recordId: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.recoverVoucher.url}${recordId}`,
            method: "PATCH",
        }
        return fetch_Api(api_link)
    }

    switch (type) {
        case "customers": {
            const columnsRecover: React.ReactNode = (
                <List
                    itemLayout="vertical"
                    pagination={{
                        align: "end",
                        position: "bottom"
                    }}
                    dataSource={item}
                    bordered
                    size="large"
                    renderItem={(item: any) => (
                        <List.Item
                            extra={
                                <div className="item-content-recover">
                                    <FontAwesomeIcon icon={faRotateRight} onClick={() => handleRecoverCustomer(item?.id)} />
                                </div>
                            }
                            key={item?.id}
                        >
                            <List.Item.Meta
                                title={`Tên: ${item?.name}`}
                                description={`CMND: ${item?.citizenId}`}
                            />
                            <div>
                                {item.phoneNumber ? "ĐT: " + item.phoneNumber : item.email ? "Email: " + item.email : ""}
                            </div>
                        </List.Item>
                    )}
                >

                </List>
            )



            return columnsRecover;
        }
        case "employees": {
            const columnsRecover: React.ReactNode = (
                <List
                    itemLayout="vertical"
                    pagination={{
                        align: "end",
                        position: "bottom"
                    }}
                    dataSource={item}
                    bordered
                    size="large"
                    renderItem={(item: any) => (
                        <List.Item
                            extra={
                                <div className="item-content-recover">
                                    <FontAwesomeIcon icon={faRotateRight} onClick={() => handleRecoverEmployess(item?.id)} />
                                </div>
                            }
                            key={item?.id}
                        >
                            <List.Item.Meta
                                title={`Tên: ${item?.name}`}
                                description={`CMND: ${item?.citizenId}`}
                            />
                            <div>
                                {item.phoneNumber ? "ĐT: " + item.phoneNumber : item.email ? "Email: " + item.email : ""}
                            </div>
                        </List.Item>
                    )}
                >

                </List>
            )



            return columnsRecover;
        }
        case "servicePackages": {
            const columnsRecover: React.ReactNode = (
                <List
                    itemLayout="vertical"
                    pagination={{
                        align: "end",
                        position: "bottom"
                    }}
                    dataSource={item}
                    bordered
                    size="large"
                    renderItem={(item: any) => (
                        <List.Item
                            extra={
                                <div className="item-content-recover">
                                    <FontAwesomeIcon icon={faRotateRight} onClick={() => handleRecoverServicePackage(item?.id)} />
                                </div>
                            }
                            key={item?.id}
                        >
                            <List.Item.Meta
                                title={`Tên: ${item?.servicePackageName}`}
                                description={`Miêu tả: ${item?.description}`}
                            />
                        </List.Item>
                    )}
                >

                </List>
            )



            return columnsRecover;
        }
        case "services": {

            const columnsRecover: React.ReactNode = (
                <List
                    itemLayout="vertical"
                    pagination={{
                        align: "end",
                        position: "bottom"
                    }}
                    dataSource={item}
                    bordered
                    size="large"
                    renderItem={(item: any) => (
                        <List.Item
                            extra={
                                <div className="item-content-recover">
                                    <FontAwesomeIcon icon={faRotateRight} onClick={() => handleRecoverService(item?.id)} />
                                </div>
                            }
                            key={item?.id}
                        >
                            <List.Item.Meta
                                title={`Tên: ${item?.serviceName}`}
                                description={`Miêu tả: ${item?.description}`}
                            />
                        </List.Item>
                    )}
                >

                </List>
            )


            return columnsRecover;
        }

        case "vouchers": {

            const columnsRecover: React.ReactNode = (
                <List
                    itemLayout="vertical"
                    pagination={{
                        align: "end",
                        position: "bottom"
                    }}
                    dataSource={item}
                    bordered
                    size="large"
                    renderItem={(item: any) => (
                        <List.Item
                            extra={
                                <div className="item-content-recover">
                                    <FontAwesomeIcon icon={faRotateRight} onClick={() => handleRecoverVouchers(item?.id)} />
                                </div>
                            }
                            key={item?.id}
                        >
                            <List.Item.Meta
                                title={`Tên: ${item?.typeName}`}
                                description={`Điều kiện: ${item?.conditionsAndPolicies}`}
                            />
                        </List.Item>
                    )}
                >

                </List>
            )


            return columnsRecover;
        }
        case "vouchersCustomer": {
            const columnsRecover: React.ReactNode = (
                <List
                    itemLayout="vertical"
                    pagination={{
                        align: "end",
                        position: "bottom"
                    }}
                    dataSource={item}
                    bordered
                    size="large"
                    renderItem={(item: any) => (
                        <List.Item
                            extra={
                                <div className="item-content-recover">
                                    <FontAwesomeIcon icon={faRotateRight} onClick={() => handleRecover(item?.id)} />
                                </div>
                            }
                            key={item?.id}
                        >
                            <List.Item.Meta
                                title={`Tên: ${item?.customer?.name}`}
                                description={`Tên nhân viên: ${item?.salesEmployee?.name}`}
                            />
                        </List.Item>
                    )}
                >

                </List>
            )


            return columnsRecover;
        }
        // default:
        //     {
        //         const columnsRecover: ColumnsType<CustomerState> = [
        //             {
        //                 title: 'Tên khách hàng',
        //                 dataIndex: 'name',
        //             },
        //             {
        //                 title: 'Thông tin',
        //                 dataIndex: 'contact',
        //                 render: (_, record) =>
        //                     <div>
        //                         {record.citizenId && "CCCD/CMND: " + record.citizenId}<br />
        //                         {record.phoneNumber ? "ĐT: " + record.phoneNumber : record.email ? "Email: " + record.email : ""}
        //                     </div>
        //             },
        //             {
        //                 title: 'Thao tác',
        //                 dataIndex: 'action',
        //                 render: (text, record) =>
        //                     <div className="item-content-recover">
        //                         <Button type='primary' onClick={() => handleRecoverCustomer(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
        //                     </div>
        //             },
        //         ];
        //         return columnsRecover;
        //     }
    }
}

export default tableRecovery_Responsive