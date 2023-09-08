import { useNavigate } from "react-router-dom";
import { CustomerListState, CustomerState, ServicePackageState, ServiceState, UserListState, UserState, VoucherState, VoucherTypeState } from "../app/type.d";
import type { ColumnsType } from 'antd/es/table';
import { Space, Button, message } from "antd"
import { havePermission } from "./permission_proccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from "./api_function";
import api_links from "./api_links";

const tableRecovery = function (type: string) {

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
            const columnsRecover: ColumnsType<CustomerState> = [
                {
                    title: 'Tên khách hàng',
                    dataIndex: 'name',
                },
                {
                    title: 'Thông tin',
                    dataIndex: 'contact',
                    render: (_, record) =>
                        <div>
                            {record.citizenId && "CCCD/CMND: " + record.citizenId}<br />
                            {record.phoneNumber ? "ĐT: " + record.phoneNumber : record.email ? "Email: " + record.email : ""}
                        </div>
                },
                {
                    title: 'Thao tác',
                    dataIndex: 'action',
                    render: (text, record) =>
                        <div className="item-content-recover">
                            <Button type='primary' onClick={() => handleRecoverCustomer(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                        </div>
                },
            ];
            return columnsRecover;
        }
        case "employees": {
            const columnsRecover: ColumnsType<UserState> = [
                {
                    title: 'Tên nhân viên',
                    dataIndex: 'name',
                },
                {
                    title: 'Thông tin',
                    dataIndex: 'contact',
                    render: (_, record) =>
                        <div>
                            {record.citizenId && "CCCD/CMND: " + record.citizenId}<br />
                            {record.phoneNumber ? "ĐT: " + record.phoneNumber : record.email ? "Email: " + record.email : ""}
                        </div>
                },
                {
                    title: 'Thao tác',
                    dataIndex: 'action',
                    render: (text, record) =>
                        <div className="item-content-recover">
                            <Button type='primary' onClick={() => handleRecoverEmployess(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                        </div>
                },
            ];
            return columnsRecover;
        }
        case "servicePackages": {

            const columnsRecover: ColumnsType<ServicePackageState> = [
                {
                    title: 'Lựa chọn',
                    dataIndex: 'id',
                    render: (text, record, index) =>
                        <div className="item-content-recover">
                            <span>{record.id}</span>
                        </div>

                },
                {
                    title: 'Gói dịch vụ',
                    dataIndex: 'servicePackageName',
                    render: (text, record, index) =>
                        <div className="item-content-recover">
                            <a style={{ fontWeight: "bold" }}>{record.servicePackageName}</a>
                            <p>Nội dung: {record.description}</p>
                        </div>
                },
                {
                    title: 'Miêu tả',
                    dataIndex: 'description',
                    render: (text, record) =>
                        <div className="item-content-recover">
                            <Button type='primary' onClick={() => handleRecoverServicePackage(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                        </div>
                },
            ]
            return columnsRecover;
        }
        case "services": {

            const columnsRecover: ColumnsType<ServiceState> = [
                {
                    title: 'Lựa chọn',
                    dataIndex: 'id',
                    render: (text, record, index) =>
                        <div className="item-content-recover">
                            <span>{record.id}</span>
                        </div>

                },
                {
                    title: 'Gói dịch vụ',
                    dataIndex: 'servicePackageName',
                    render: (text, record, index) =>
                        <div className="item-content-recover">
                            <a style={{ fontWeight: "bold" }}>{record.serviceName}</a>
                            <p>Nội dung: {record.description}</p>
                        </div>
                },
                {
                    title: 'Miêu tả',
                    dataIndex: 'description',
                    render: (text, record) =>
                        <div className="item-content-recover">
                            <Button type='primary' onClick={() => handleRecoverService(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                        </div>
                },
            ]
            return columnsRecover;
        }
        case "vouchers": {

            const columnsRecover: ColumnsType<VoucherTypeState> = [
                {
                    title: 'Gói khuyến mãi',
                    dataIndex: 'typeName',
                    render: (text, record, index) =>
                        <div className="item-content-recover">
                            <a style={{ fontWeight: "bold" }}>{record.typeName}</a>
                        </div>

                },
                {
                    title: 'Điều kiện',
                    dataIndex: 'conditionsAndPolicies',
                    render: (text, record, index) =>
                        <div className="item-content-recover">

                            <p>Nội dung: {record.conditionsAndPolicies}</p>
                        </div>
                },
                {
                    title: 'Thao tác',
                    dataIndex: 'action',
                    render: (text, record) =>
                        <div className="item-content-recover">
                            <Button type='primary' onClick={() => handleRecoverVouchers(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                        </div>
                },
            ]
            return columnsRecover;
        }
        case "vouchersCustomer": {
            const columnsRecover: ColumnsType<VoucherState> = [
                {
                    title: 'Khách hàng',
                    dataIndex: 'typeName',
                    render: (text, record, index) =>
                        <div className="item-content-recover">
                            <a style={{ fontWeight: "bold" }}>{record?.customer?.name}</a>
                        </div>

                },
                {
                    title: 'Nhân viên',
                    dataIndex: 'conditionsAndPolicies',
                    render: (text, record, index) =>
                        <div className="item-content-recover">

                            <p>{record?.salesEmployee?.name}</p>
                        </div>
                },
                {
                    title: 'Thao tác',
                    dataIndex: 'action',
                    render: (text, record) =>
                        <div className="item-content-recover">
                            <Button type='primary' onClick={() => handleRecover(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                        </div>
                },
            ]
            return columnsRecover;
        }
        default:
            {
                const columnsRecover: ColumnsType<CustomerState> = [
                    {
                        title: 'Tên khách hàng',
                        dataIndex: 'name',
                    },
                    {
                        title: 'Thông tin',
                        dataIndex: 'contact',
                        render: (_, record) =>
                            <div>
                                {record.citizenId && "CCCD/CMND: " + record.citizenId}<br />
                                {record.phoneNumber ? "ĐT: " + record.phoneNumber : record.email ? "Email: " + record.email : ""}
                            </div>
                    },
                    {
                        title: 'Thao tác',
                        dataIndex: 'action',
                        render: (text, record) =>
                            <div className="item-content-recover">
                                <Button type='primary' onClick={() => handleRecoverCustomer(record.id)} style={{ backgroundColor: "#465d65" }}>Khôi phục</Button>
                            </div>
                    },
                ];
                return columnsRecover;
            }
    }
}

export default tableRecovery