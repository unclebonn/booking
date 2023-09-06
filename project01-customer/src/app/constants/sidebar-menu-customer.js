import DashboardIcon from '../assets/icons/dashboard.svg';
import ShippingIcon from '../assets/icons/shipping.svg';
import ProductIcon from '../assets/icons/product.svg';
import UserIcon from '../assets/icons/user.svg';

const sidebar_menu_customer = [
    {
        id: 1,
        icon: DashboardIcon,
        path: 'profile',
        title: 'Thông tin cá nhân',
    },
    {
        id: 2,
        icon: ProductIcon,
        path: 'myservice',
        title: 'Gói dịch vụ của tôi',
    },
    {
        id: 3,
        icon: ShippingIcon,
        path: 'myvoucher',
        title: 'Voucher của tôi',
    },
    {
        id: 4,
        icon: UserIcon,
        path: 'history',
        title: 'Lịch sử mua hàng',
    }
]

export default sidebar_menu_customer;