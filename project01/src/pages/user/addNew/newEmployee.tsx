import React, { useEffect, useState } from 'react';
import { selectToken } from '../../login/loginSlice';
import { useSelector } from 'react-redux';
import { LoginState, UserListState } from '../../../app/type.d';
import { RoleListState } from '../../../app/type.d';
import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';
import axios from 'axios';
import Cookies from 'universal-cookie';

import type { CascaderProps } from 'antd';
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
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Option } = Select;

interface DataNodeType {
    "Name": string,
    "UserName": string,
    "CitizenId": string,
    "Email": string,
    "PhoneNumber": string,
    /*"EmailConfirmed": boolean | null,
    "PhoneNumberConfirmed": boolean | null,
    "TwoFactorEnabled": boolean | null,*/
    "IsBlocked": boolean | null,
    "Password": string,
    "ConfirmPassword": string,
    "ManagerId": string | null,
    "RoleIds": string[],
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
    const [chuc_vu, setCV] = useState<RoleListState>();
    const [nhan_vien, setNV] = useState<UserListState | null>();
    const [filter_nhan_vien, setFilterNV] = useState<UserListState>();

    const [jsonData, setjsonData] = useState<LoginState>();

    const formData = new FormData();
    const cookies = new Cookies();
    const token = cookies.get("token")?.token;

    var register: DataNodeType = {
        Name: '',
        UserName: '',
        CitizenId: '',
        Email: '',
        PhoneNumber: '',
        /*EmailConfirmed: null,
        PhoneNumberConfirmed: null,
        TwoFactorEnabled: null,*/
        IsBlocked: null,
        Password: '',
        ConfirmPassword: '',
        ManagerId: '',
        RoleIds: [],
        Avatar: null,
    }

    useEffect(() => {
        fetch_Api({
            url: api_links.user.superAdmin.getAllRole,
            method: 'GET',
            data: undefined
        }).then(data => {
                setCV(data.data);
                setFilterNV(data.data);
            });

            fetch_Api({
                url: api_links.user.saleAdmin.getUserUser,
                method: 'GET',
                data: undefined
            }).then(data => {
                setNV(data.data);

            });
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
        //console.log('Received values of form: ', values);
        register.CitizenId = values.citizenId;
        register.ConfirmPassword = values.confirm;
        register.Email = values.email;
        register.Name = values.name;
        register.UserName = values.username;
        register.Password = values.password;
        register.PhoneNumber = values.phone;
        register.ManagerId = values.managername;
        if (values.managerfilter == null) register.ManagerId = null;
        /*register.PhoneNumberConfirmed = null;
        register.EmailConfirmed = null;
        register.TwoFactorEnabled = null;*/
        register.IsBlocked = null;
        values.roleList?.map((d: { roleid: string; }) => register.RoleIds.push(d.roleid));
        //console.log('Received register: ', register);

        formData.append("UserName", values.username);
        formData.append("CitizenId", values.citizenId??"");
        formData.append("ConfirmPassword", values.confirm);
        formData.append("Email", values.email??"");
        formData.append("Name", values.username);
        formData.append("Password", values.password);
        formData.append("PhoneNumber", values.phone??"");
        formData.append("ManagerId", values.managername);
        values.roleList?.map((d: { roleid: string; }) => formData.append("RoleIds",d.roleid));
        formData.append("Avatar", values.upload?.[0].originFileObj);
        //console.log('Received formdata: ', formData.getAll('ManagerId'));

        axios({
            url: api_links.user.superAdmin.createNewUser,
            method: "post",
            headers: {
                "Authorization": `Bearer  ${token}`,
                "Content-Type": "multipart/form-data",//"application/x-www-form-urlencoded",
            },
            data: formData,
        }).then((response) => {
            if (response.status==200) {
                form.resetFields();
                message.success("Đã thêm nhân viên " + register.Name + ". Tiếp tục thêm nhân viên hoặc nhấn Cancel để trở về.");
            } 
            setjsonData(response.data);
            //console.log(response.data);
        })
            .catch((error) => {
                setjsonData(error.response.data);
                //console.log(error.response.data);
            }
            );
            /*
        fetch_Api({
            url: api_links.user.superAdmin.createNewUser,
            method: 'POST',
            data: undefined
        }).then(response => {
            if (response.status==200) {
                form.resetFields();
                message.success("Đã thêm nhân viên " + register.Name + ". Tiếp tục thêm nhân viên hoặc nhấn Cancel để trở về.");
            } 
            setjsonData(response.data);
        })
*/
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
                    name="name"
                    label="Tên nhân viên"
                    rules={[{ required: true, message: 'Thông tin này là bắt buộc!', whitespace: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
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
                    rules={[
                        {
                            required: true,
                            message: 'Thông tin này là bắt buộc!',
                        },
                        {
                            pattern: /^[0-9A-z]*[0-9]{4}$/,
                            message: 'Thông tin phải có độ dài ít nhất là 8 kí tự!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
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
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Thông tin này là bắt buộc!',
                        },
                        /*({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),*/
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    //name="employee"
                    label="Chức vụ"
                    //rules={[{ required: true, message: 'Thông tin này là bắt buộc!', }]}
                >
                    <Form.List name="roleList"
                        rules={[
                            {
                                validator: async (_, names) => {
                                    if (!names || names.length < 1) {
                                        return Promise.reject(new Error('Thêm ít nhất 1 vị trí cho nhân viên này!'));
                                    }
                                },
                            },
                        ]}
                    >

                        {(fields, { add, remove }, { errors }) => (
                            <>
                                                
                                {fields.map((field) => (
                                    <Space key={field.key} align="start">
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, curValues) =>
                                                prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                            }
                                        >
                                            {() => (
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'roleid']}
                                                    rules={[{ required: true, message: 'Thông tin này là bắt buộc!', whitespace: true }]}
                                                >
                                                    <Select style={{ width: "150px" }} >
                                                        {chuc_vu?.map((d) => {
                                                            return (
                                                                <Option value={d.id}>{d.normalizedName}</Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            )}
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item
                    //name="employee"
                    label="Nhân viên quản lý"
                >

                    <Space align="baseline">
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                                prevValues.managerfilter !== curValues.managerfilter
                            }
                        >
                            <Form.Item
                                name='managerfilter'
                            >
                                <Select style={{ width: 150 }}
                                    defaultValue="none"
                                    onChange={(e) => {
                                        if (e != "")
                                            setFilterNV(nhan_vien?.filter((d) => d.roles.findIndex((r) => r.normalizedName == e) > -1));
                                        form.setFieldValue(["managername"], undefined)
                                        }}
                                >
                                    <Option value="none">Không có</Option>
                                    {chuc_vu?.map((d) => {
                                        if (d.isManager)
                                            return (
                                                <Option value={d.normalizedName}>{d.normalizedName}</Option>
                                            )
                                    })} </Select>
                            </Form.Item>

                        </Form.Item>
                        <Form.Item
                            name='managername'
                            rules={[{ 
                                required: !(form.getFieldValue('managerfilter')=="none"||!form.getFieldValue('managerfilter')), 
                                message: 'Thêm người quản lý hoặc chọn "Không có"!', 
                            }]}
                        >
                            <Select
                                showSearch
                                disabled={form.getFieldValue('managerfilter')=="none"||!form.getFieldValue('managerfilter')}
                                style={{ width: 200 }}
                                placeholder=""
                                //onChange={handleChange}
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }

                                options={
                                    filter_nhan_vien?.map((d) => {
                                        /* if (d.name == undefined)
                                         return ({
                                             label: "",
                                             //value: ,
                                         })
                                         else*/
                                        return ({
                                            label: d.name + " - " + (d.citizenId ? d.citizenId?.slice(-4) : ""),
                                            value: d.id,
                                        })
                                    })
                                }
                            />
                        </Form.Item>
                    </Space>
                </Form.Item>
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