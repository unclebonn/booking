import { Button, Col, Form, Input, Row, message } from "antd";
import './newservice.scss'
import api_links from "../../../../utils/api_links";
import fetch_Api from "../../../../utils/api_function";
export default function NewService() {


    interface NewServiceProps {
        "ServiceName": string,
        "Description": string
    }

    const handleFinish = (values: NewServiceProps) => {
        createService(values)
            .then((res) => {
                if (res.status === 201) {
                    message.success("Tạo thành công")
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }

    /////////////////////////// GET API //////////////////////////
    const createService = (values: NewServiceProps) => {
        const api_link = {
            url: api_links.user.superAdmin.createNewService,
            method: "POST",
            data: values
        }
        return fetch_Api(api_link)
    }
    return (
        <div className="user-newservices">
            <div className="user-services--form">
                <Row>
                    <Col span={24}>
                        <h1>Thêm dịch vụ</h1>
                    </Col>
                </Row>
                <Form
                    className="newservice-form"
                    onFinish={handleFinish}
                >
                    <Row >
                        <Col span={10}>
                            <Form.Item
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên dịch vụ" },
                                    { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" }
                                ]}
                                label="Tên gói dịch vụ"
                                name="ServiceName"
                            >
                                <Input placeholder="Tên gói dịch vú" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                rules={[
                                    { min: 5, max: 50, message: "Vui lòng nhập trên 5 hoặc dưới 50 ký tự" },
                                    { max: 50, required: true, message: "Vui lòng nhập miêu tả dịch vụ" }]}
                                label="Miêu tả"
                                name="Description"
                            >
                                <Input placeholder="Miêu tả" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Form.Item>
                                <Button htmlType="submit" type="primary">Tạo dịch vụ</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
}