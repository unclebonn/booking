import React from "react";
import { Menu as AntdMenu, SubMenuProps as AntdSubMenuProps } from "antd";

const { SubMenu: AntdSubMenu } = AntdMenu;

export type SubMenuProps = AntdSubMenuProps & {
  menuKey: React.Key;
};

const SubMenu: React.FC<SubMenuProps> = ({ menuKey, ...rest }) => {
  return <AntdSubMenu {...rest} key={menuKey} />;
};

export { SubMenu };
