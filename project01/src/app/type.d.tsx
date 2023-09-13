export type LoginState = {
  "message": string | null,
  "isSuccess": boolean,
  "errors": {/*
          "Password": string[]|null;
          UserName: string[]|null;
          AccountInformation: string[]|null;
          ConfirmPassword:string[]|null;*/
  } | string[] | null,
  "token": string | undefined,
  "userInformation"?: UserInformationLoginState | null,
  "customerInformation"?: CustomerInformationLoginState | null,
  "role": RoleState | null,
  "permission"?: undefined | string[] | null,
  "errorServer"?: string

};
export type LoginPermissionState = {
  Customer: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  User: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  Voucher: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  VoucherType: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  VoucherExtension: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  Service: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  ServicePackage: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  Booking: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  Role: {
    read: boolean,
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  Statistic: {
    read: boolean,
    //khong su dung
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
    restore: boolean,
  },
  Log: {
    read: boolean,
    restore: boolean,
    //khong su dung
    write: boolean,
    update: boolean,
    delete: boolean,
    all: boolean,
  }
};

export type RoleState = {
  "id": string,
  "normalizedName": string,
  "isManager": boolean,
  "isDeleted"?: boolean
  "roleClaims": [],
};

export type RoleListState = RoleState[];

export type UserInformationLoginState = {
  "id": string,
  "name": string | null,
  "citizenId": string | null,
  "userName": string | null,
  "normalizedUserName": string,
  "email": string | null,
  "normalizedEmail": string | null,
  "emailConfirmed": boolean,
  "phoneNumber": string | null,
  "phoneNumberConfirmed": boolean,
  "twoFactorEnabled": boolean,
  "lockoutEnd": string | null,
  "lockoutEnabled": boolean,
  "isBlocked": boolean,
  "salesManager": {} | null,
  "customers": [],
  "roles": RoleState[],
};
export type CustomerInformationLoginState = {
  "id": string,
  "name": string | null,
  "citizenId": string | null,
  "email": string | null,
  "normalizedEmail": string | null,
  "emailConfirmed": boolean,
  "phoneNumber": string | null,
  "phoneNumberConfirmed": boolean,
  "twoFactorEnabled": boolean,
  "lockoutEnd": string | null,
  "lockoutEnabled": boolean,
  "isBlocked": boolean,
  "bookings": [],
  "vouchers": []
};

export type MenuState = {
  "isOpen": boolean,
  "userRole": RoleState,
};

export type ServicePackageState = {
  "href": string | undefined;
  "image": string;
  "description": string,
  "id": number,
  "servicePackageName": string,
  "services":
  {
    "id": number,
    "serviceName": string,
    "description": string,
    "servicePackages": []
  }[],
  "valuableVoucherTypes": [],
};

export type ServicePackageListState = ServicePackageState[];

export type ServiceState = {
  href?: string | undefined;
  image?: string;

  "id": number,
  "serviceName": string,
  "description": string,
  "servicePackages": [],
};

export type ServiceListState = ServiceState[];

export type VoucherState = {
  "key"?: number,
  "href"?: string;
  "image": string,
  "id": number,
  "customer": {
    "id": string,
    "name": string,
  },
  "salesEmployee": {
    "id": string,
    "name": string,
    "phoneNumber": string,
  },
  "voucherType": VoucherTypeState,
  "issuedDate": string,
  "expiredDate": string,
  "actualPrice": number | string,
  "usedValueDiscount": number | null,
  "voucherStatus": string,
  "bookings": BookingListState,
  "voucherExtensions": VoucherExtensionListState,
}

export type VoucherListState = VoucherState[];

export type VoucherTypeState = {
  "appropriate"?: boolean,
  "href"?: string | undefined;
  "image"?: string;
  "id": number,
  "typeName": string,
  "isAvailable": boolean,
  "commonPrice": number,
  //"valueDiscount":number,
  "availableNumberOfVouchers": number,
  "percentageDiscount": number,
  "valueDiscount": number,
  "maximumValueDiscount": number,
  "conditionsAndPolicies": string,
  "vouchers": [],
  "usableServicePackages": []
};

export type VoucherTypeListState = VoucherTypeState[];

export type VoucherExtensionState = {
  "id": 2,
  "voucher": VoucherState,
  "salesEmployee": {
    "id": string,
    "name": string,
    "phoneNumber": string,
  } | null,
  "price": number,
  "extendedDateTime": string,
  "oldExpiredDate": string,
  "newExpiredDate": string,
}

export type VoucherExtensionListState = VoucherExtensionState[];


export type BookingState = {
  key?: number
  "id": number,
  "customer": {
    "id": string,
    "name": string,
  },
  "salesEmployee": {
    "id": string,
    "name": string,
    "phone": string,
  } | null,
  "vouchers": VoucherListState,
  "servicePackage": null,
  "bookingTitle": string,
  "bookingDate": string,
  "bookingStatus": string,
  "totalPrice": any,
  "priceDetails": string,
  "note": string,
  "descriptions": string,
  "startDateTime": string,
  "endDateTime": string
};

export type BookingListState = BookingState[];

export type CustomerState = {
  "id": string,
  "name": string,
  "email": string | null,
  "normalizedEmail": string | null,
  "emailConfirmed": boolean,
  "phoneNumber": string | null,
  "phoneNumberConfirmed": boolean,
  "twoFactorEnabled": boolean,
  "lockoutEnd": Date | null,
  "lockoutEnabled": boolean,
  "citizenId": string | null,
  "isBlocked": boolean,
  "bookings"?: [],
  "vouchers"?: [],
  "filePath": string | null,
};

export type CustomerListState = CustomerState[];

export type UserState = {
  "id": string,
  "name": string,
  "email": string | null,
  "normalizedEmail": string | null,
  "emailConfirmed": boolean,
  "phoneNumber": string | null,
  "phoneNumberConfirmed": boolean,
  "twoFactorEnabled": boolean,
  "lockoutEnd": Date | null,
  "lockoutEnabled": boolean,
  "citizenId": string | null,
  "bookings"?: [],
  "vouchers"?: [],
  "userName": string,
  "normalizedUserName": string,
  "isBlocked": boolean,
  "salesManager": {
    /* "id": string,
     "name": string,*/
  },
  "customers": [
    /*{
      "id": string,
      "name": string
    }*/
  ],
  "roles": RoleState[],
  "filePath": string,
};

export type UserListState = UserState[];