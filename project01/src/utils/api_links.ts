const authUrl = "http://bevm.e-biz.com.vn/";

const api_links = {
    user: {
        superAdmin: {
            //GET
            getAllBooking: `${authUrl}api/Bookings/all`,
            getAllCustomer: `${authUrl}api/Customers/all-customers`,
            getAllRole: `${authUrl}api/Roles/all`,
            getAllServicePackage: `${authUrl}api/ServicePackages/all`,
            getAllService: `${authUrl}api/Services/all`,
            getAllUser: `${authUrl}api/Users/all-users`,
            getAllVoucher: `${authUrl}api/Voucher/all`,
            getAllVoucherType: `${authUrl}api/VoucherTypes/all`,
            //POST
            createNewBooking: `${authUrl}api/Bookings`,
            createNewCustomer: `${authUrl}api/Register/Customer`,
            createNewRole: `${authUrl}api/Roles`,
            createNewServicePackage: `${authUrl}api/ServicePackages`,
            createNewService: `${authUrl}api/Services`,
            createNewUser: `${authUrl}api/Register/User`,
            createNewVoucher: `${authUrl}api/Voucher`,
            createNewVoucherType: `${authUrl}api/VoucherTypes`,

            /*createNewRole: `${authUrl}api/Roles`,
            createNewBooking: `${authUrl}api/Bookings`,
            registerNewUser: `${authUrl}api/Register/User`,
            registerNewCustomer: `${authUrl}api/Register/Customer`,*/
            blockUser: `${authUrl}api/Users`,
            blockCustomer: `${authUrl}api/Customers`,


            ////////////////////// EMAIL //////////////////////
            getVerifyEmail:{
                url:`${authUrl}api/Auth/confirmemail/user`,
                method:"GET",
            },

            ///////////// SERVICE PACKAGES ////////////////////
            getAllServicePackages: {
                url: `${authUrl}api/ServicePackages/all`,
                method: "GET",
                token: ""
            },
            createServicePackage: {
                url: `${authUrl}api/ServicePackages`,
                method: "POST",
                token: "",
                data: {}
            },
            getAllDeleteServicePackages: {
                url: `${authUrl}api/ServicePackages/all-delete`,
                method: "GET",
                token: "",
            },

            deleteServicePackage: {
                url: `${authUrl}api/ServicePackages/`,
                method: "DELETE",
                token: "",
            },
            deleteServicePackages: {
                url: `${authUrl}api/ServicePackages/batch`,
                method: "DELETE",
                token: "",
                data: [1, "2", 3]
            },
            recoverServicePackage: {
                url: `${authUrl}api/ServicePackages/restore-servicepackage/`,
                method: "PATCH",
                token: "",
            },
            updateServicePackage: {
                url: `${authUrl}api/ServicePackages/`,
                method: "PUT",
                token: "",
                data: {}
            },
            updateServicePackage_VoucherType: {
                url: `${authUrl}api/ServicePackages/VoucherTypes/`,
                method: "PATCH",
                token: "",
                data: [1, 2, 3]
            },
            updateServicePackage_Services: {
                url: `${authUrl}api/ServicePackages/Services/`,
                method: "PATCH",
                token: "",
                data: [1, 2, 3]
            },
            getServicePackage: {
                url: `${authUrl}api/ServicePackages/`,
                method: "GET",
            },


            ///////////////////// VOUCHER ////////////////////////////
            getVoucherCustomer: {
                url: `${authUrl}api/Voucher/Customer/`,
                method: "GET"
            },
            createVoucher: {
                url: `${authUrl}api/Voucher/`,
                method: "POST",
                data: {}
            },
            getAllDeleteVoucher: {
                url: `${authUrl}api/Voucher/all-delete`,
                method: "GET"
            },
            deleteVoucher: {
                url: `${authUrl}api/Voucher/`,
                method: "DELETE"
            },
            getVoucher: {
                url: `${authUrl}api/Voucher/`,
                method: "GET"
            },
            updateVoucherStatus: {
                url: `${authUrl}api/Voucher/`,
                method: "PATCH",
                data: []
            },

            recoverVoucher: {
                url: `${authUrl}api/Voucher/restore-voucher/`,
                method: "PATCH"
            },
            //////////////////// VOUCHER TYPE ///////////////////////
            getAllDeleteVoucherType: {
                url: `${authUrl}api/VoucherTypes/all-delete`,
                method: "GET",
                token: ""
            },
            updateVoucherType: {
                url: `${authUrl}api/VoucherTypes/`,
                method: "PUT",
                token: "",
                data: {}
            },
            isAvailableVoucherType: {
                url: `${authUrl}api/VoucherTypes/`,
                method: "PATCH",
                token: "",
                data: {}
            },
            createVoucherType: {
                url: `${authUrl}api/VoucherTypes/`,
                method: "POST",
                token: "",
                data: {}
            },
            deleteVoucherType: {
                url: `${authUrl}api/VoucherTypes/`,
                method: "DELETE",
                token: "",
                data: {}
            },
            deleteVoucherTypes: {
                url: `${authUrl}api/VoucherTypes/batch`,
                method: "DELETE",
                token: "",
                data: [1, "2", 3]
            },
            recoverVoucherType: {
                url: `${authUrl}api/VoucherTypes/restore-vouchertype/`,
                method: "PATCH",
                token: "",
                data: {}
            },


            //////////////////////////// VOUCHER EXTENSION ///////////////////////////
            createVoucherExtension: {
                url: `${authUrl}api/VoucherExtensions`,
                method: "POST",
                data: {}
            },

            //////////////// USER ////////////////
            updateInformationForUser:
            {
                url: `${authUrl}api/Users`,
                method: "PUT",
                data: {},
                token: ""
            },
            resetPasswordForUser: {
                url: `${authUrl}api/Users/Reset-Password`,
                method: "POST",
                data: {},
                token: ""
            },
            updateInformationForCus: {
                url: `${authUrl}api/Customers`,
                method: "PUT",
                data: {},
                token: ""
            },
            resetPasswordForCus: {
                url: `${authUrl}api/Customers/Reset-Password`,
                method: "POST",
                data: {},
                token: ""
            },
            login: `${authUrl}api/auth/Login/User`,
            getAllServices: {
                url: `${authUrl}api/Services/all`,
                method: "GET",
                token: ""
            },

            /////////////////////// SERVICE ////////////////////////////
            getServiceById: {
                url: `${authUrl}api/Services/`,
                method: "GET",
            },
            recoverService: {
                url: `${authUrl}api/Services/restore-service/`,
                method: "PATCH",
            },
            getAllDeleteService: {
                url: `${authUrl}api/Services/all-delete`,
                method: "GET",
            },
            deleteService: {
                url: `${authUrl}api/Services/`,
                method: "DELETE",
            },
            updateService: {
                url: `${authUrl}api/Services/`,
                method: "PUT"
            },

            /////////////////////// CUSTOMER //////////////////////////
            getCustomer: {
                url: `${authUrl}api/Customers/`,
                method: "GET"
            },


            ////////////////////// BOOKING /////////////////////////////
            updateBooking: {
                url: `${authUrl}api/Bookings/`,
                method: "PUT",
                data: {}
            },
            deleteBooking: {
                url: `${authUrl}api/Bookings/`,
                method: "DELETE"
            },
            getBooking: {
                url: `${authUrl}api/Bookings/`,
                method: "GET"
            }

        },
        saleAdmin: {
            //GET
            getUserBooking: `${authUrl}api/Bookings/User`,
            getUserCustomer: `${authUrl}api/Customers/All-Supported-Customers`,
            //getUserRole: `${authUrl}api/Roles/all`,
            //getUserServicePackage: `${authUrl}api/ServicePackages/all`,
            //getUserService: `${authUrl}api/Services/all`,
            getUserUser: `${authUrl}api/Users/All-Managed-Users`,
            getUserVoucher: `${authUrl}api/Voucher/User`,
            //getUserVoucherType: `${authUrl}api/VoucherTypes/all`,

            updateInformation: `${authUrl}api/Users`,
            resetPassword: `${authUrl}api/Users/Reset-Password`,
            login: `${authUrl}api/Login/User`
        },
        sales: {
            updateInformation: `${authUrl}api/Users`,
            resetPassword: `${authUrl}api/Users/Reset-Password`,
            login: `${authUrl}api/Login/User`

        },
        customer: {
            //GET
            getCustomerBooking: `${authUrl}api/Bookings/Customer`,
            getCustomerSupport: `${authUrl}api/Users/All-Supporting-Users`,
            getCustomerVoucher: `${authUrl}api/Voucher/Customer`,


            getVerifyEmail:{
                url:`${authUrl}api/Auth/confirmemail/customer`,
                method:"GET",
            },

            updateInformation: {
                url: `${authUrl}api/Customers`,
                method: "PUT",
                data: {},
                token: ""
            },
            resetPassword: {
                url: `${authUrl}api/Customers/Reset-Password`,
                method: "POST",
                data: {},
                token: ""
            },
            login: `${authUrl}api/auth/Login/Customer`
        }
    }
}

export default api_links