import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Tag, Descriptions, Radio, Tabs, Table, Space, Modal, Divider, Popconfirm, message } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { VoucherListState, VoucherState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from '../../utils/api_function';
import { havePermission } from '../../utils/permission_proccess';
import api_links from '../../utils/api_links';
/*
interface DataType {
    key?: React.Key;
    "id": any,
    "image": string,
    "customer": {
        "id": string,
        "name": string,
      },
    "salesEmployee": {
        "id": string,
        "name": string,
        "phoneNumber": string
    } | string | undefined,
    "voucherType": {
        "id": string,
        "typeName": string,
        "isAvailable": boolean,
        "commonPrice": any,
        "percentageDiscount": any,
        "valueDiscount": any,
        "maximumValueDiscount": any,
        "conditionsAndPolicies": string,
    } | string | undefined,
    "issuedDate": string,
    "expiredDate": {
        "expiredDate": string,
        "voucherStatus": boolean,
    }
    "actualPrice": any,
    "usedValueDiscount": any,
    "voucherStatus": string,
    "bookings"?: [],
    "voucherExtensions"?: []
}
*/
const initialState: VoucherState = {
    "id": 0,
    "image": '',
    "customer": {
        "id": '',
        "name": '',
      },
    "salesEmployee": {
        "id": '',
        "name": '',
        "phoneNumber": ''
    } ,
    "voucherType": {
        "id": 0,
        "typeName": '',
        "isAvailable": false,
        "commonPrice": 0,
        "percentageDiscount": 0,
        "valueDiscount": 0,
        "maximumValueDiscount": 0,
        "conditionsAndPolicies": '',
        "availableNumberOfVouchers": 0,
        "usableServicePackages": [],
        "vouchers": [],
    },
    "issuedDate": '',
    "expiredDate": '',
    "actualPrice": 0,
    "usedValueDiscount": 0,
    "voucherStatus": '',
    "bookings": [],
    "voucherExtensions": []
}

export default function VoucherInformation({ api_link,isCustomer }: { api_link: string,isCustomer:boolean }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<VoucherListState>();
    const [addFormInformationService, setAddFormInformationService] = useState(false)
    const [record, setRecord] = useState<VoucherState>(undefined!)

    const dataListShow: VoucherState[] = [];
    const aiStyle = { color: '#2F70AF', marginLeft: '5px' };

    const addPermission = havePermission("Voucher", "write");
    const deletePermission = havePermission("Voucher", "delete");
    const editPermission = havePermission("Voucher", "update");

    var cookies = new Cookies()
    var token = cookies.get("token")?.token;
{/*<div>{record.expiredDate} 
                {record.voucherStatus=="Expired" && <Tag color="volcano" style={{ width: "fit-content" }}>Đã hết hạn</Tag>}
                {record.voucherStatus=="Out of value" && <Tag color="purple" style={{ width: "fit-content" }}>Hết giá trị sử dụng</Tag>}
            </div>,*/}
    const columns: ColumnsType<VoucherState> = [
        {
            title: 'ID',
            dataIndex: 'id',
            /*render: (text, record) =>
                <Space size="small">
                    <Button size={"small"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                    <a onClick={() => navigate("detail/" + record.id)}>{text}</a>
                </Space>*/
        },
        {
            title: 'Loại',
            dataIndex: 'voucherType',
            render: (text, record) => record.voucherType?.typeName,
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiredDate',
            render: (text, record) => <div>{record.expiredDate}
            {record.voucherStatus=="Expired" && <Tag color="volcano" style={{ width: "fit-content" }}>Đã hết hạn</Tag>}
            {record.voucherStatus=="Out of value" && <Tag color="purple" style={{ width: "fit-content" }}>Hết giá trị sử dụng</Tag>}
            </div>,
                
            filters: [
                {
                    text: 'Còn hiệu lực',
                    value: "Usable",
                },
                {
                    text: 'Đã hết hạn',
                    value: "Expired",
                },
                /*{
                    text: 'Hết giá trị sử dụng',
                    value: "Out of value",
                },*/
            ],
            onFilter: (value: any, record) => record.voucherStatus===value,
        },
        {
            title: 'Thành tiền',
            dataIndex: 'actualPrice',
            align: 'right',
        },
        {
            title: 'Giao dịch viên',
            dataIndex: 'salesEmployee',
            render: (record) => record?.salesEmployee?.name,

        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
            render: (record) => record?.customer?.name,

        },];

        const userColumn = {
            title: 'Giao dịch viên',
                dataIndex: 'salesEmployee',
          };
          const cusColumn = {
            title: 'Khách hàng',
            dataIndex: 'customer',
          };

    data?.map((dataTemp, index) => {
        const date = new Date(dataTemp.expiredDate);
        let status;
        switch (dataTemp.voucherStatus) {
            case "Usable": {
                status = true;
                break;
            }
            default: {
                status = false;
                break;
            }
        };
        dataListShow.push({
            //key: dataTemp.id,
            id: dataTemp.id,
            actualPrice: dataTemp.actualPrice.toLocaleString('en-US', {
                currency: 'USD',
            }),
            expiredDate: date.toLocaleString(),
            image: dataTemp.image,
            customer: dataTemp.customer,
            usedValueDiscount: dataTemp.usedValueDiscount,
            voucherStatus: dataTemp.voucherStatus,
            voucherType: dataTemp.voucherType,
            salesEmployee: dataTemp.salesEmployee,
            issuedDate: dataTemp.issuedDate,
            bookings: dataTemp.bookings,
            voucherExtensions: dataTemp.voucherExtensions,
        });
    });

    useEffect(() => {
        fetch_Api({
            url: api_link + '/' + id,
            method: 'GET',
        }).then(data => {
            //console.log(data.data)
            setData(data.data);
        })
    }, [id]);

    const handleTableRowClick = (record: VoucherState) => {
        setAddFormInformationService(!addFormInformationService)
        setRecord(data?.find((d) => d.id == record.id) ?? initialState)
    }

    const handleDelete = (e: number) => {
        deleteVoucher(e)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                    fetch_Api({
                        url: api_link + '/' + id,
                        method: 'GET',
                    }).then(data => {
                        //console.log(data.data)
                        setData(data.data);
                    })
                        .catch((reason) => {
                            //console.log(reason);
                        })
                }
            })
            .catch((reason) => {
                message.error(reason.message)
            })
    }

    const getVoucherStatus = () => {
        switch (record?.voucherStatus) {
            case "Expired":
                return "Hết hạn"


            case "Usable":
                return "Sử dụng"

            case "OutOfValue":
                return "Không có giá trị"

            case "Blocked":
                return "Khoá"
        }
    }

    const deleteVoucher = (e: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.deleteVoucher.url}${e}`,
            method: "DELETE",
        }
        return fetch_Api(api_link)
    }


    return (
        <React.Fragment>
            <Modal
                open={addFormInformationService}
                onCancel={() => setAddFormInformationService(!addFormInformationService)}
                footer={[]}
                width="65vw"
            >
                <Space size={[25, 0]} direction='horizontal' className='uservoucher-record' align='center'>
                    <Space.Compact className='coupon-left' direction='vertical'>
                        <div>
                            <img src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" alt="image" width="250px" />
                        </div>
                        {deletePermission && <Popconfirm
                            className="ant-popconfirm"
                            title="Xoá dịch vụ"
                            description="Bạn có chắc chắn xoá không ?"
                            onConfirm={() => {
                                handleDelete(record.id)
                                setAddFormInformationService(!addFormInformationService)
                            }}
                            okText="Xoá"
                            cancelText="Huỷ"
                            placement='bottomLeft'
                        >
                            <Button size={"large"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                        </Popconfirm>}
                        {editPermission && <Link to={"../vouchers-customer/createvoucherextension"} state={record}>
                                    <Button size={"large"} style={{width:"100%"}}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                                </Link>}
                    </Space.Compact>
                    <Space.Compact className='coupon-con' direction='vertical'>
                        <Divider orientation='left'>Thông tin</Divider>
                        <Space direction='vertical' className='uservoucher-record--information'>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Tên khách hàng: </span>
                                        <span>{record?.customer?.name}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Tên nhân viên: </span>
                                        <span>{record?.salesEmployee?.name}</span>

                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Giá bán: </span>
                                        <span>{record?.actualPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>

                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Ngày bắt đầu: </span>
                                        <span>{new Date(record?.issuedDate).toLocaleString("vi-VN")}</span>
                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Ngày hết hạn: </span>
                                        <span>{new Date(record?.expiredDate).toLocaleString("vi-VN")}</span>
                                    </Col>
                                </Row>

                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Trạng thái: </span>
                                        <span>{getVoucherStatus()}</span>
                                    </Col>
                                </Row>

                            </Space>
                        </Space>
                    </Space.Compact>
                </Space>
            </Modal>
        
        <div className="voucher-information">
            {addPermission && <Link to={"../vouchers-customer/createvouchercustomer"}>
                            <Button style={{ width: "100%" }} type='default' size='large'>
                                + Thêm voucher khách hàng
                            </Button>
                           </Link>}
            {/*<Table columns={isCustomer?[...columns,userColumn]:[...columns,cusColumn]} dataSource={dataListShow} />*/}
            <Table columns={isCustomer?columns.filter(col => col.title !== 'Khách hàng'):columns.filter(col => col.title !== 'Giao dịch viên')}
                    dataSource={dataListShow}
                    onRow={(record) => ({
                        onClick: () => handleTableRowClick(record),
                    })}
                />
        </div>
        </React.Fragment>
    );
};

