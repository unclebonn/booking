import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu, SubMenuProps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBills, faIdCard, faTags, faCalendarCheck, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

import { useSubMenu } from "./useSubMenu";
import { LogoutOutlined } from '@ant-design/icons/lib/icons';
import { havePermission } from '../../utils/permission_proccess';
import Cookies from 'universal-cookie';
import './styles.css';
const { SubMenu } = Menu;

function UMenuNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const cookies = new Cookies()
  const role = cookies.get("token")?.role




  const onClick: MenuProps['onClick'] = (e) => {
    navigate("/dashboard/" + e.key);
  };
  const handleTitleClick: Pick<SubMenuProps, "onTitleClick">["onTitleClick"] = (
    e
  ) => {
    //console.log("titleclick, key", e.key);
  };




  const subMenuProps = useSubMenu();

  const readCustomerPermission = havePermission("Customer", "read");
  const readUserPermission = havePermission("User", "read");
  const readServicePermission = havePermission("Service", "read");
  const readServicePackagePermission = havePermission("ServicePackage", "read");
  const readVoucherTypePermission = havePermission("Voucher", "read");
  const readBookingPermission = havePermission("Booking", "read");

  return (

    <Menu
      expandIcon={" "}
      onClick={onClick}
      defaultSelectedKeys={[location.pathname.split('/')[2]]}
      mode="inline"
      openKeys={['service']}
      /*style={{
        width: '250px',
        minWidth: '230px',
        height: '100vh',
        position: 'sticky',
        background: 'linear-gradient(#b0bdc3, #487f9e, #91d5ff)',
        borderBottomRightRadius: '50px',
        color: '#FFFFFF',
        fontSize: 'medium',
        fontWeight: '600',
      }}*/
      className='sidebarmenu'
    >
      {readCustomerPermission &&
        <Menu.Item
          key="khach-hang"
          icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faUser} />}
          style={{
            padding: '2em',
            textAlign: 'left',
          }}
        >
          Khách hàng
        </Menu.Item>
      }
      {readUserPermission && <Menu.Item
        key="nhan-vien"
        icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faIdCard} />}
        style={{
          padding: '2em',
          textAlign: 'left',
        }}>Nhân viên</Menu.Item>}
      <SubMenu
        style={{
          textAlign: 'left',
          paddingLeft: '10px'
        }}
        icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faTags} />}
        {...subMenuProps("service", "Dịch vụ", handleTitleClick)}
      >
        {readServicePackagePermission && <Menu.Item
          key="goi-dich-vu"
          style={{
            padding: '2em',
          }}
        >
          Các gói dịch vụ
        </Menu.Item>}
        {readServicePermission && <Menu.Item
          key="loai-dich-vu"
          style={{
            padding: '2em',
          }}
        >
          Các loại dịch vụ
        </Menu.Item>}
      </SubMenu>
      {readVoucherTypePermission &&
        <Menu.Item
          key="vouchers"
          icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faMoneyBills} />}
          style={{
            padding: '2em',
            textAlign: 'left',
          }}
        >
          Vouchers
        </Menu.Item>}
      {role?.isManager &&
        <Menu.Item
          key="khoi-phuc"
          icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faRotateLeft} />}
          style={{
            padding: '2em',
            textAlign: 'left',
          }}
        >
          Khôi phục
        </Menu.Item>}

      {/*<Menu.Item
        key="vouchers-customer"
        icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faMoneyBills} />}
        style={{
          padding: '2em',
          textAlign: 'left',
        }}
      >
        Vouchers khách hàng
      </Menu.Item>}
      {readBookingPermission && <Menu.Item
        key="giao-dich"
        icon={<FontAwesomeIcon style={{ marginRight: '10px' }} icon={faCalendarCheck} />}
        style={{
          padding: '2em',
          textAlign: 'left',
        }}>Giao dịch
      </Menu.Item>*/}
    </Menu>

  );
};

export default UMenuNew;