import { Recovery, RecoveryResponsive } from "../../../component/recovery/Recovery";
import { Button, Space } from "antd"
import { useEffect, useState } from "react"
import fetch_Api from "../../../utils/api_function";
import { CustomerListState, UserListState } from "../../../app/type.d";
import api_links from "../../../utils/api_links";
import "./recovery.scss"

type DataSourceProps = CustomerListState | UserListState

export function RecoveryPage() {
    const [type, setType] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isOpenResponsive, setIsOpenResponsive] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<DataSourceProps>([])


    useEffect(() => {
        document.title = "Khôi phục"
    }, [])


    
    const recoverCustomers = () => {
        getAllRecoverCustomer()
        setType("customers")
        setIsOpen(!isOpen)
    }
    const recoverEmployees = () => {
        getAllRecoverEmployees()
        setType("employees")
        setIsOpen(!isOpen)
    }
    const recoverServicePackges = () => {
        getAllDeleteServicePackages()
        setType("servicePackages")
        setIsOpen(!isOpen)
    }
    const recoverServices = () => {
        getAllDeleteService()
        setType("services")
        setIsOpen(!isOpen)
    }
    const recoverVoucherType = () => {
        getAllDeleteVoucherType()
        setType("vouchers")
        setIsOpen(!isOpen)
    }
    const recoverVouchersCustomer = () => {
        getAllDeleteVoucher()
        setType("vouchersCustomer")
        setIsOpen(!isOpen)
    }


    
    ///////////////////////// responsive ///////////////////////////////////
    const recoverCustomersResponsive = () => {
        getAllRecoverCustomer()
        setType("customers")
        setIsOpenResponsive(!isOpenResponsive)
    }
    const recoverEmployeesResponsive = () => {
        getAllRecoverEmployees()
        setType("employees")
        setIsOpenResponsive(!isOpenResponsive)
    }
    const recoverServicePackgesResponsive = () => {
        getAllDeleteServicePackages()
        setType("servicePackages")
        setIsOpenResponsive(!isOpenResponsive)
    }
    const recoverServicesResponsive = () => {
        getAllDeleteService()
        setType("services")
        setIsOpenResponsive(!isOpenResponsive)
    }
    const recoverVoucherTypeResponsive = () => {
        getAllDeleteVoucherType()
        setType("vouchers")
        setIsOpenResponsive(!isOpenResponsive)
    }
    const recoverVouchersCustomerResponsive = () => {
        getAllDeleteVoucher()
        setType("vouchersCustomer")
        setIsOpenResponsive(!isOpenResponsive)
    }




    //////////////////////////// GET API //////////////////////////
    const getAllRecoverCustomer = () => {
        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Customers/all-deleted-customers",
            method: 'GET',
        })
            .then(res => {
                if (res.status === 200) {
                    setDataSource(res.data);
                }
            })
    }
    const getAllRecoverEmployees = () => {
        fetch_Api({
            url: "http://bevm.e-biz.com.vn/api/Users/all-deleted-users",
            method: 'GET',
        })
            .then(res => {
                if (res.status === 200) {
                    setDataSource(res.data);
                }
            })
    }

    const getAllDeleteServicePackages = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteServicePackages
        fetch_Api(api_link)
            .then((res) => {
                if (res.status === 200) {
                    setDataSource(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);

            })
    }

    const getAllDeleteService = () => {
        const api_link = {
            url: api_links.user.superAdmin.getAllDeleteService.url,
            method: "GET"
        }
        fetch_Api(api_link)

            .then((res) => {
                if (res.status === 200) {
                    setDataSource(res.data)
                }
            })
            .catch((error) => {
                //console.log(error);
            })
    }

    const getAllDeleteVoucherType = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteVoucherType
        fetch_Api(api_link)
            .then((res) => {
                if (res.status === 200) {
                    setDataSource(res.data)
                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
    }

    const getAllDeleteVoucher = () => {
        const api_link = api_links.user.superAdmin.getAllDeleteVoucher
        fetch_Api(api_link)
            .then((res) => {
                if (res.status === 200) {
                    setDataSource(res.data)
                }
            })
            .catch((reason) => {
                //console.log(reason);
            })
    }


    return (
        <div className="user-recovery">
            <Space wrap direction="horizontal" className="modal recoveryTable" style={{ alignItems: "start" }}>
                <Button type="primary" onClick={recoverCustomers}>Khôi phục khách hàng</Button>
                <Button type="primary" onClick={recoverEmployees}>Khôi phục nhân viên</Button>
                <Button type="primary" onClick={recoverServicePackges}>Khôi phục gói dịch vụ</Button>
                <Button type="primary" onClick={recoverServices}>Khôi phục loại dịch vụ</Button>
                <Button type="primary" onClick={recoverVoucherType}>Khôi phục vouchers</Button>
                <Button type="primary" onClick={recoverVouchersCustomer}>Khôi phục voucher khách hàng</Button>
                <Recovery type={type} isOpen={isOpen} setIsOpen={setIsOpen} dataSource={dataSource}></Recovery>

            </Space>
            <Space wrap direction="horizontal" className="modal recoveryTable--responsive" style={{ alignItems: "start" }}>
                <Button type="primary" onClick={recoverCustomersResponsive}>Khôi phục khách hàng</Button>
                <Button type="primary" onClick={recoverEmployeesResponsive}>Khôi phục nhân viên</Button>
                <Button type="primary" onClick={recoverServicePackgesResponsive}>Khôi phục gói dịch vụ</Button>
                <Button type="primary" onClick={recoverServicesResponsive}>Khôi phục loại dịch vụ</Button>
                <Button type="primary" onClick={recoverVoucherTypeResponsive}>Khôi phục vouchers</Button>
                <Button type="primary" onClick={recoverVouchersCustomerResponsive}>Khôi phục voucher khách hàng</Button>
                <RecoveryResponsive type={type} isOpen={isOpenResponsive} setIsOpen={setIsOpenResponsive} dataSource={dataSource}></RecoveryResponsive>
            </Space>
        </div>
    )
}