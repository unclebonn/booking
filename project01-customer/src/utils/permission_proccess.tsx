import { LoginPermissionState } from '../app/type.d';
import Cookies from 'universal-cookie';

var permission: LoginPermissionState = {
  Customer: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  User: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  Voucher: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  VoucherType: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  VoucherExtension: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  Service: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  ServicePackage: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  Booking: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  Role: {
    read: false,
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  Statistic: {
    read: false,
    //khong su dung
    write: false,
    update: false,
    delete: false,
    all: false,
    restore: false,
  },
  Log: {
    read: false,
    restore: false,
    //khong su dung
    write: false,
    update: false,
    delete: false,
    all: false,
  }
};
var titleList: string[] = [];
var actionList: string[] = [];

export default function handlePermission(permissionString: string[] | undefined) {
  if (permissionString?.length == 0) return permission;
  permissionString?.map((data) => {
    const perData = data.split(':');
    titleList.push(perData[0]);
    actionList.push(perData[1]);
  })

  const handleActionPermission = (unproccessData: string) => {
    var obj = {
      read: false,
      write: false,
      update: false,
      delete: false,
      all: false,
      restore: false,
    };
    if (unproccessData) {
      obj.read = unproccessData.includes("read");
      obj.write = unproccessData.includes("write");
      obj.update = unproccessData.includes("update");
      obj.delete = unproccessData.includes("delete");
      obj.all = unproccessData.includes("all");
      obj.restore = unproccessData.includes("restore");
    }
    return obj;
  };

  const handleProcessPermission = () => {
    permission.Customer = handleActionPermission(actionList[titleList.indexOf("Customer")]);
    permission.User = handleActionPermission(actionList[titleList.indexOf("User")]);
    permission.Voucher = handleActionPermission(actionList[titleList.indexOf("Voucher")]);
    permission.VoucherType = handleActionPermission(actionList[titleList.indexOf("VoucherType")]);
    permission.VoucherExtension = handleActionPermission(actionList[titleList.indexOf("VoucherExtension")]);
    permission.Service = handleActionPermission(actionList[titleList.indexOf("Service")]);
    permission.ServicePackage = handleActionPermission(actionList[titleList.indexOf("ServicePackage")]);
    permission.Booking = handleActionPermission(actionList[titleList.indexOf("Booking")]);
    permission.Role = handleActionPermission(actionList[titleList.indexOf("Role")]);
    permission.Statistic = handleActionPermission(actionList[titleList.indexOf("Statistic")]);
    permission.Log = handleActionPermission(actionList[titleList.indexOf("Log")]);
    return permission;
  };

  return handleProcessPermission();
};







export function havePermission(title: string, action: string) {
  const cookies = new Cookies()
  const permissions = cookies.get("token")?.information?.permission;
  var r = false;
  if (permissions !== undefined) {
    permissions.map((data: string) => {
      const perData = data.split(':');
      if (perData[0] == title) {
        if (perData[1]?.includes(action)) r = true;
        //else return false;
      }
    })
  }
  return r;

};