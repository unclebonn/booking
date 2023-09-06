import React from 'react';
import './stylesProfile.css';
import Cookies from 'universal-cookie';
import { Form, Input, Space } from 'antd';


const ProfileDisplay: React.FC = () => {
    var cookies = new Cookies();
    const file = cookies.get("token").information.filePath
    let getFilePath = () => {
        if (file == null) {
            return "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
        }
        else {
            return file
        }
    }

    return (
        <Space style={{width:"100%",justifyContent:"space-evenly",marginTop:"50px"}}>

            <Space>
                <img style={{ width: "250px", height: "250px", borderRadius: "50%" }} src={getFilePath()} />
            </Space>

            <Space direction='vertical'>
                <Space direction='vertical'>
                    <Form.Item
                        label="Tên"
                    >
                        <Input type="text" className="form-control" value={cookies.get("token").information?.name} readOnly />
                    </Form.Item>

                    <Form.Item

                        label="Số điện thoại"
                    >
                        <Input type="text" className="form-control" value={cookies.get("token").information.phoneNumber} readOnly />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                    >
                        <Input type="text" className="form-control" value={cookies.get("token").information.email} readOnly />
                    </Form.Item>

                    <Form.Item
                        label="CCCD"
                    >
                        <Input type="text" className="form-control" value={cookies.get("token").information.citizenId} readOnly />
                    </Form.Item>
                </Space>
            </Space>


        </Space>
    )
}

export default ProfileDisplay