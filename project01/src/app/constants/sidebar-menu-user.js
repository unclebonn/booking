import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';

const sidebar_menu_user = [
    {
        id: 1,
        icon: DashboardIcon,
        path: 'customers',
        title: 'Khách hàng',
    },
    {
        id: 2,
        icon: ProductIcon,
        path: 'services',
        title: 'Các gói dịch vụ',
    },
    {
        id: 3,
        icon: ShippingIcon,
        path: 'vouchers',
        title: 'Vouchers',
    },
    {
        id: 4,
        icon: UserIcon,
        path: 'employee',
        title: 'Nhân viên',
    }
]

export default sidebar_menu_user;