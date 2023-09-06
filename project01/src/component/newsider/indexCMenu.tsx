import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu, SubMenuProps } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBills, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

import { useSubMenu } from "./useSubMenu";
const { SubMenu } = Menu;

function CMenuNew() {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };
  const handleTitleClick: Pick<SubMenuProps, "onTitleClick">["onTitleClick"] = (
    e
  ) => {
    //console.log("titleclick, key", e.key);
  };

  const subMenuProps = useSubMenu();

  return (
    <div className="sidebar-container">
    <Menu
      expandIcon={" "}
      onClick={onClick}
      defaultSelectedKeys={[location.pathname.split('/')[2]]}
      mode="inline"
      openKeys={['service']}
      style={{
        width: '250px',
        minWidth: '215px',
        height: '100vh',
        position: 'sticky',
        background: 'linear-gradient(#b0bdc3, #487f9e, #91d5ff)',
        borderBottomRightRadius: '50px',
        color: '#FFFFFF',
        fontSize: 'medium',
        fontWeight: '600',
      }}

    >
      <Menu.Item
        key="profile"
        icon={<FontAwesomeIcon style={{marginRight:'10px'}} icon={faUser} />}
        style={{
          padding: '2em',
          textAlign:'left',
        }}
      >Thông tin cá nhân</Menu.Item>
      <Menu.Item
        key="myvoucher"
        icon={<FontAwesomeIcon style={{marginRight:'10px'}} icon={faMoneyBills} />}
        style={{
          padding: '2em',
          textAlign:'left',
        }}>Voucher của tôi</Menu.Item>
      <Menu.Item
        key="history"
        icon={<FontAwesomeIcon style={{marginRight:'10px'}}icon={faCalendarCheck} />}
        style={{
          padding: '2em',
          textAlign:'left',
        }}>Lịch sử mua hàng</Menu.Item>
    </Menu >
    </div>
  );
};

export default CMenuNew;