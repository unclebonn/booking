import React, { useEffect, useState } from 'react';
import { LoginState, RoleListState } from '../../../app/type.d';
import { UserListState } from '../../../app/type.d';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';

import axios from 'axios';
import Cookies from 'universal-cookie';

import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    message,
    Upload,
} from 'antd';
import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Option } = Select;

interface DataNodeType {
    "Name": string,
    "CitizenId": string,
    "Email": string,
    "PhoneNumber": string,
    //"EmailConfirmed": boolean | null,
    //"PhoneNumberConfirmed": boolean | null,
    //"TwoFactorEnabled": boolean | null,
    "IsBlocked": boolean | null,
    "Password": string,
    "ConfirmPassword": string,
    "SalesEmployeeIds": string[],
    "Avatar": string | null,
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const normFile = (e: any) => {
    /*if (Array.isArray(e)) {
        return e;
    }*/
    return e?.fileList;
};

function Add() {
    /*
        const [fullName, setUserName] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [email, setEmail] = useState("");
        const [phone, setPhone] = useState("");
        const [citizenID, setcitizenID] = useState("");
    */
    const [form] = Form.useForm();
    const [nhan_vien, setNV] = useState<UserListState>();
    const [filter_nhan_vien, setFilterNV] = useState<UserListState>();
    const [chuc_vu, setCV] = useState<RoleListState>();

    const [jsonData, setjsonData] = useState<LoginState>();

    const formData = new FormData();
    const cookies = new Cookies();
    const token = cookies.get("token")?.token;
    const role = cookies.get("token")?.role;
    const thisUserId = cookies.get("token")?.information.id;

    var register: DataNodeType = {
        Name: '',
        CitizenId: '',
        Email: '',
        PhoneNumber: '',
        //EmailConfirmed: null,
        //PhoneNumberConfirmed: null,
        //TwoFactorEnabled: null,
        IsBlocked: null,
        Password: '',
        ConfirmPassword: '',
        SalesEmployeeIds: [],
        Avatar: null,
    }

    useEffect(() => {
        if (role.isManager) {
            fetch_Api({
                url: api_links.user.superAdmin.getAllRole,
                method: 'GET',
                data: undefined
            }).then(data => {
                setCV(data.data);
            });

            fetch_Api({
                url: api_links.user.saleAdmin.getUserUser,
                method: 'GET',
                data: undefined
            }).then(data => {
                //setNV(data.data);
                setNV([...data.data,cookies.get("token").information]);
                setFilterNV([...data.data,cookies.get("token").information]);
                //console.log(nhan_vien);
            });
        }
    }, []);

    const errorMessage = () => {
        if (jsonData?.errors != null) {
            if (typeof Object.values(jsonData?.errors)[0] == "string") {
                return Object.values(jsonData?.errors)[0];
            }
            else return Object.values(jsonData?.errors)[0][0];
        }
        if (jsonData?.message)
            return jsonData?.message;
        return "";
    };

    const onFinish = (values: any) => {
        // console.log('Received values of form: ', values);
        // register.CitizenId = values.citizenId;
        // register.ConfirmPassword = values.confirm;
        // register.Email = values.email;
        // register.Name = values.username;
        // register.Password = values.password;
        // register.PhoneNumber = values.phone;
        //register.PhoneNumberConfirmed = null;
        //register.EmailConfirmed = null;
        //register.TwoFactorEnabled = null;
        // register.IsBlocked = null;
        // values.employeeList?.map((d: { employeename: string; }) => register.SalesEmployeeIds.push(d.employeename));
        // console.log('Received register: ', register);

        formData.append("CitizenId", values.citizenId ?? "");
        formData.append("ConfirmPassword", values.confirm);
        formData.append("Email", values.email ?? "");
        formData.append("Name", values.username);
        formData.append("Password", values.password);
        formData.append("PhoneNumber", values.phone ?? "");
        if (role.isManager) {
            values.employeeList?.map((d: { employeename: string; }) => formData.append("SalesEmployeeIds", d.employeename));
        }
        else { formData.append("SalesEmployeeIds", thisUserId) }
        formData.append("Avatar", values.upload?.[0].originFileObj);
        //console.log(formData.get("CitizenId"));

         axios({
             url: api_links.user.superAdmin.createNewCustomer,
             method: "post",
             headers: {
                 "Authorization": `Bearer  ${token}`,
                 "Content-Type": "multipart/form-data",//"application/x-www-form-urlencoded",
             },
             data: formData,
         }).then((response) => {
             if (response.status == 200) {
                 form.resetFields();
                 message.success("Đã thêm khách hàng " + register.Name + ". Tiếp tục thêm khách hàng hoặc nhấn Cancel để trở về.");
             }
             setjsonData(response.data);
         })
             .catch((error) => {
                 setjsonData(error.response.data);
                 //console.log(error.response.data);
             }
             );
    };

    return (
        <div>

            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                //initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: 'Tất ' }}
                style={{ maxWidth: 600 }}
                scrollToFirstError
            >

                <Form.Item
                    name="username"
                    label="Tên khách hàng"
                    rules={[{ required: true, message: 'Thông tin này là bắt buộc!', whitespace: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                /*rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                        whitespace: false,
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}*/
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                /*rules={[
                    {
                        pattern: /^((\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4}))||)$/,
                        message: 'The input is not valid phone number!'
                    }
                ]}*/
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="citizenId"
                    label="CCCD/CMND"
                //rules={[{ whitespace: false }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        {
                            required: true,
                            message: 'Thông tin này là bắt buộc!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Nhập lại mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Thông tin này là bắt buộc!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Xác nhận mật khẩu không đúng!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                {role.isManager &&
                    <Form.Item
                        //name="employee"
                        label="Nhân viên phụ trách"
                    >
                        <Form.List name="employeeList">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Space key={field.key} align="baseline">
                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, curValues) =>
                                                    prevValues.employeefilter !== curValues.employeefilter
                                                }
                                            >
                                                {() => (
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'employeefilter']}
                                                    >
                                                        <Select style={{ width: 150 }}
                                                            defaultValue="all"
                                                            onChange={(e) => {
                                                                if (e == "all") setFilterNV(nhan_vien);
                                                                else setFilterNV(nhan_vien?.filter((d) => d.roles.findIndex((r) => r.id == e) > -1));
                                                                form.setFieldValue(["employeeList", field.name, "employeename"], undefined)
                                                            }}
                                                        >
                                                            <Option value="all">Tất cả</Option>
                                                            {chuc_vu?.map((d) =>
                                                                <Option value={d.id}>{d.normalizedName}</Option>
                                                            )} </Select>
                                                    </Form.Item>
                                                )}
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'employeename']}
                                                rules={[{ required: true, message: 'Thông tin này là bắt buộc!' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    //placeholder=""
                                                    //onChange={handleChange}

                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                    filterSort={(optionA, optionB) =>
                                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                    }

                                                    options={
                                                        filter_nhan_vien?.map((d) => {
                                                            return ({
                                                                label: d.name + " - " + (d.citizenId ? d.citizenId?.slice(-4) : ""),
                                                                value: d.id,
                                                            })
                                                        })
                                                    }
                                                />
                                            </Form.Item>

                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Thêm nhân viên
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                }
                <Form.Item name="upload" label="Ảnh đại diện" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        maxCount={1}
                        name="avatar"
                        listType="picture-circle"
                        beforeUpload={beforeUpload}
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Thay đổi</div>
                        </div>
                    </Upload>
                </Form.Item>

                {(errorMessage()) &&
                    <span style={{
                        color: "red",
                        textAlign: "center",
                        fontSize: "13px"
                    }}> {errorMessage()}<br /></span>}
                <Form.Item {...tailFormItemLayout}>
                    <Space size={'large'}>
                        <Button type="primary" htmlType="submit">
                            Tạo mới
                        </Button>
                        <Button type="default" htmlType="reset"
                            onClick={() => form.resetFields()}>
                            Làm mới
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}
export default Add;