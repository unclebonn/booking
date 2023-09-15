import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions, Radio, Tabs, Table, Space, Modal, Popconfirm, Divider, message } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { BookingListState, BookingState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from '../../utils/api_function';
import api_links from '../../utils/api_links';
import { havePermission } from '../../utils/permission_proccess';

interface DataType {
    key: React.Key;
    id: string;
    vouchers: [],
    servicePackage: null,
    bookingTitle: string,
    bookingDate: string,
    bookingStatus: string,
    totalPrice: any,
    priceDetails: string,
    note: string,
    descriptions: string,
    startDateTime: string,
    endDateTime: string,
    salesEmployee: string | undefined,
    customer: string | undefined,
}

const initialState: BookingState = {
    id: 0,
    customer: {
        id: '',
        name: ''
    },
    salesEmployee: null,
    vouchers: [],
    servicePackage: null,
    bookingTitle: '',
    bookingDate: '',
    bookingStatus: '',
    totalPrice: undefined,
    priceDetails: '',
    note: '',
    descriptions: '',
    startDateTime: '',
    endDateTime: ''
}

export default function BookingInformation({ api_link, isCustomer }: { api_link: string, isCustomer: boolean }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<BookingListState>();
    const dataListShow: BookingState[] = [];
    var cookies = new Cookies()
    var token = cookies.get("token")?.token;
    const [addFormInformationService, setAddFormInformationService] = useState(false)
    const [record, setRecord] = useState<BookingState>(undefined!)

    const addPermission = havePermission("Booking", "write");
    const deletePermission = havePermission("Booking", "delete");
    const editPermission = havePermission("Booking", "update");

    const columns: ColumnsType<BookingState> = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text, record) =>
                <Space size="small">
                    {/*<Button size={"small"} ><FontAwesomeIcon icon={faTrashCan} /></Button>*/}
                    {text}
                </Space>
        },
        {
            title: 'Tên',
            dataIndex: 'bookingTitle',
            //render: (text, record) => <a onClick={() => navigate("detail/" + record.id)}>{text}</a>,
        },
        {
            title: 'Ngày thực hiện',
            dataIndex: 'bookingDate',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'bookingStatus',
            width: '150px',
            filters: [
                {
                    text: 'Đã thanh toán',
                    value: 'Đã thanh toán',
                },
                {
                    text: 'Đang xử lý',
                    value: 'Đang xử lý',
                },
                {
                    text: 'Đã hủy',
                    value: 'Đã hủy',
                },
            ],
            onFilter: (value: any, record) => record.bookingStatus.indexOf(value) === 0,

        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            align: 'right',
        },
        {
            title: 'Giao dịch viên',
            //dataIndex: 'salesEmployee',
            render: (record) => record?.salesEmployee?.name,

        },
        {
            title: 'Khách hàng',
            //dataIndex: 'customer',
            render: (record) => record?.customer?.name,

        },];

    const minicolumns: ColumnsType<BookingState> = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (text, record) =>
                <Space size="small">
                    {/*<Button size={"small"} ><FontAwesomeIcon icon={faTrashCan} /></Button>*/}
                    {text}
                </Space>
        },
        {
            title: 'Tên',
            dataIndex: 'bookingTitle',
            render: (text, record) => <div>
                <span style={{ color: "#0958d9", fontWeight: "bold" }}>{text}</span><br />
                <span style={{ fontWeight: "bold" }}>Ngày giao dịch:</span><br /> {record.bookingDate.split(' ')[1]}<br />
                <span style={{ fontWeight: "bold" }}>Tổng tiền:</span><br /> {record.totalPrice}<br />
                {isCustomer ?
                    <><span style={{ fontWeight: "bold" }}>Khách hàng:</span><br /> {record?.customer?.name}</>
                    :
                    <><span style={{ fontWeight: "bold" }}>Giao dịch viên:</span><br /> {record?.salesEmployee?.name}</>
                }
            </div>
        },
        {
            title: 'Tình trạng',
            dataIndex: 'bookingStatus',
            //width: '50px',
            filters: [
                {
                    text: 'Đã thanh toán',
                    value: 'Đã thanh toán',
                },
                {
                    text: 'Đang xử lý',
                    value: 'Đang xử lý',
                },
                {
                    text: 'Đã hủy',
                    value: 'Đã hủy',
                },
            ],
            onFilter: (value: any, record) => record.bookingStatus.indexOf(value) === 0,

        },];


    data?.map((dataTemp, index) => {
        const date = new Date(dataTemp.bookingDate);
        let status = "";
        switch (dataTemp.bookingStatus) {
            case "Confirmed": {
                status = "Đã hoàn thành";
                break;
            }
            case "Pending": {
                status = "Đang xử lý";
                break;
            }
            case "Cancelled": {
                status = "Đã hủy";
                break;
            }
        };
        dataListShow.push({
            key: dataTemp.id,//index
            id: dataTemp.id,
            vouchers: [],
            servicePackage: null,
            bookingTitle: dataTemp.bookingTitle,
            bookingDate: date.toLocaleString(),
            bookingStatus: status,
            totalPrice: dataTemp.totalPrice.toLocaleString('en-US', {
                currency: 'USD',
            }),
            priceDetails: dataTemp.priceDetails,
            note: dataTemp.note,
            descriptions: dataTemp.descriptions,
            startDateTime: dataTemp.startDateTime,
            endDateTime: dataTemp.endDateTime,
            salesEmployee: dataTemp.salesEmployee,
            customer: dataTemp.customer,
        });
    });

    useEffect(() => {
        fetch_Api({
            url: api_link + '/' + id,
            method: 'GET',
        }).then(data => {
            setData(data.data);
        })
    }, [id]);

    const handleTableRowClick = (record: BookingState) => {
        setAddFormInformationService(!addFormInformationService)
        /*getBooking(record.id)
            .then((res) => {
                if (res.status === 200) {
                }
            })
            .catch((error) => {
                message.error("Vui lòng đăng nhập lại")
            })*/
        setRecord(data?.find((d) => d.id == record.id) ?? initialState)
    }

    const handleDelete = (id: number) => {
        deleteBooking(id)
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                    fetch_Api({
                        url: api_link + '/' + id,
                        method: 'GET',
                    }).then(data => {
                        setData(data.data);
                    })
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }
    const deleteBooking = (id: number) => {
        const api_link = {
            url: `${api_links.user.superAdmin.deleteBooking.url}${id}`,
            method: "DELETE"
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
                            <img src={record?.filePath} alt="image" width="250px" />
                        </div>
                        {(deletePermission && record?.bookingStatus === "Pending") ?
                            <Popconfirm
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
                            </Popconfirm>
                            : <></>}
                        {editPermission && record?.bookingStatus === "Pending" && <Link to={"/dashboard/giao-dich/updatebooking"} state={record}>
                            <Button size={"large"} style={{ width: "100%" }}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                        </Link>}
                    </Space.Compact>
                    <Space.Compact className='coupon-con' direction='vertical'>
                        <Divider orientation='left'>Thông tin</Divider>
                        <Space direction='vertical' className='uservoucher-record--information'>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Khách hàng: </span>
                                        <span>{record?.customer?.name}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Nhân viên: </span>
                                        <span>{record?.salesEmployee?.name}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Tổng tiền: </span>
                                        <span>{record?.totalPrice.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Ngày thực hiện: </span>
                                        <span>{new Date(record?.bookingDate).toLocaleString("vi-VN")}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Ngày kết thúc: </span>
                                        <span>{new Date(record?.endDateTime).toLocaleString("vi-VN")}</span>

                                    </Col>
                                </Row>
                            </Space>
                            <Space>
                                <Row>
                                    <Col span={24}>
                                        <span style={{ color: "#0958d9" }}>Giao dịch: </span>
                                        <span>{record?.bookingTitle}</span>
                                    </Col>
                                </Row>
                            </Space>
                            <div className="booking-information-mini" >
                            {(deletePermission && record?.bookingStatus === "Pending") ?
                            <Popconfirm
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
                                <Button size={"large"} style={{ width: "100%" }}><FontAwesomeIcon icon={faTrashCan} /></Button>
                            </Popconfirm>
                            : <></>}
                        {editPermission && record?.bookingStatus === "Pending" && <Link to={"/dashboard/giao-dich/updatebooking"} state={record}>
                            <Button size={"large"} style={{ width: "100%" }}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                        </Link>}
                            </div>
                        </Space>
                    </Space.Compact>
                </Space>
            </Modal>

            <div className="booking-information">
                {addPermission && <Link to={"/dashboard/giao-dich/createbooking"}>
                    <Button style={{ width: "100%" }} type='default' size='large'>
                        + Thêm booking
                    </Button>
                </Link>}
                    <Table className="booking-information-full"
                    columns={isCustomer ? columns.filter(col => col.title !== 'Khách hàng') : columns.filter(col => col.title !== 'Giao dịch viên')}
                        dataSource={dataListShow}
                        onRow={(record) => ({
                            onClick: () => handleTableRowClick(record),
                        })}
                    />
                    <Table className="booking-information-mini"
                    columns={minicolumns}
                        dataSource={dataListShow}
                        onRow={(record) => ({
                            onClick: () => handleTableRowClick(record),
                        })}
                    />
            </div>
        </React.Fragment>
    );
};

