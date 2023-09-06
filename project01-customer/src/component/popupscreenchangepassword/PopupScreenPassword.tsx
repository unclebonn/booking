import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import Cookies from "universal-cookie";
import api_links from "../../utils/api_links";
import fetch_Api from "../../utils/api_function";
import { RuleObject } from "antd/es/form";
import { log } from "console";

export default function PopupScreenPassword({ isPopup, setPopup }: { isPopup: boolean, setPopup: any }) {

    //watch value in form
    const [form] = Form.useForm()


    //get data from cookies
    const cookies = new Cookies()
    const role = cookies.get("token")?.role.normalizedName
    const token = cookies.get("token").token

    const handleCancel = () => {
        setPopup(false)
    }

    const validatePassword: RuleObject['validator'] = (rule, value) => {
        if (value == form.getFieldValue("OldPassword")) {
            return Promise.reject('Mật khẩu mới trùng với mật khẩu cũ');
        } else {
            return Promise.resolve();
        }
    }
    const validateConfirmPassword: RuleObject['validator'] = (rule, value) => {
        console.log(form.getFieldValue("NewPassword"));
        if (value === form.getFieldValue("NewPassword")) {
            return Promise.resolve();
        } else {
            return Promise.reject('Mật khẩu không trùng khớp');
        }
    }

    //changing password
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const api_link = role == "Customer" ? api_links.user.customer.resetPassword : api_links.user.superAdmin.resetPasswordForUser
                api_link.token = token
                api_link.data = values
                
                fetch_Api(api_link)
                    .then((res) => {
                        if (res.status === 200) {
                            form.resetFields();
                            message.success("Cập nhật mật khẩu thành công");
                            setPopup(false);
                        }
                    })
                    .catch((reason) => {
                        message.error("Mật khẩu hiện tại không đúng")
                    })

            })
            .catch((reason) => {
                console.log(reason);

            })

        // fetch_Api()

    }

    return (
        <div>
            <Modal
                title="Đổi mật khẩu"
                open={isPopup}
                onCancel={handleCancel}
                footer={[
                    <Button
                        onClick={handleCancel}
                        type="default"
                        key="back"
                    >
                        Huỷ
                    </Button>,
                    <Button
                        onClick={handleOk}
                        type="primary"
                        key="submit"
                        htmlType="submit"
                    >
                        Cập nhật mật khẩu
                    </Button>

                ]}
            >

                <Form form={form}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Mật khẩu hiện tại"
                                name="OldPassword"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                            >
                                <Input.Password placeholder="Mật khẩu hiện tại" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Mật khẩu mới"
                                name="NewPassword"
                                dependencies={["OldPassword"]}
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                                    { validator: validatePassword },
                                    { min: 5, message: "Mật khẩu phải chứa ít nhất 5 ký tự" }
                                ]}
                            >
                                <Input.Password placeholder="Mật khẩu mới" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Nhập lại mật khẩu mới"
                                name="ConfirmPassword"
                                dependencies={["NewPassword"]}
                                rules={[
                                    { required: true },
                                    { validator: validateConfirmPassword }
                                ]}

                            >
                                <Input.Password placeholder="Nhập lại mật khẩu mới" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal >
        </div>
    )
}