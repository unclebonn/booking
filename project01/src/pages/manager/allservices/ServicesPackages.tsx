import React, { useState, useEffect } from 'react';
import './stylesServices.css';
//import Add from './addNew';
import { ServicePackageListState } from '../../../app/type.d';
import { calculateRange, sliceData } from '../../table-pagination';
import { LikeOutlined, MessageOutlined, StarOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, List, Select, Space } from 'antd';
import { Button, Table, Divider, Card, Col, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import api_links from '../../../utils/api_links';
import fetch_Api from '../../../utils/api_function';

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    image: string;
    href: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: '',
        dataIndex: 'image',
        width: '300px',
        render: (text) => <a>
            <img
                width={272}
                alt="logo"
                src={text}
            /></a>,
    },
    {
        title: '',
        dataIndex: 'name',
        render: (item) => <>
            <div className='item-content'>
                <a>{item}</a>
                <span>Nội dung </span></div>
            <div className='bonus-content'>
                <div>Đã bán: </div>
            </div></>,
    },
    {
        title: 'Action',
        key: 'action',
        width: '112px',
        render: (_, record) => (
            <Space size="small">
                <Button size={"large"} ><FontAwesomeIcon icon={faPenToSquare} /></Button>
                <Button size={"large"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
            </Space>
        ),
    },
];

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
    /* Usage
     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />
            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />
            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />*/
);

const { Meta } = Card;


export default function ServicePackages() {
    const [addForm, setAddForm] = useState(false);
    const [all_data, setAllData] = useState<ServicePackageListState>();
    const [search, setSearch] = useState('');
    const [data, setData] = useState(all_data);

    const [sortType, setSortType] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetch_Api({
            url: api_links.user.superAdmin.getAllServicePackage,
            method: 'GET',
            data: undefined
        }).then(data => {
                setAllData(data.data);
                setData(data.data);
            })
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    }, []);

    const dataListShow: DataType[] = [];
    data?.map((dataTemp, index) => dataListShow.push({
        key: dataTemp.id,//index
        id: String(dataTemp.id),
        name: dataTemp.servicePackageName,
        href: 'https://ant.design',
        image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",

    }));

    const __handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = all_data?.filter((item) =>
                String(item.id).toLowerCase().includes(search.toLowerCase()) ||
                item.servicePackageName.toLowerCase().includes(search.toLowerCase())
            );
            setData(search_results);
        }
        else {
            setData(all_data);
        }
    };

    function sortList(tang_dan: boolean, sorttype: string) {
        if (tang_dan) {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.servicePackageName > b.servicePackageName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sorttype) {
                case "name":
                    data?.sort((a, b) => (a.servicePackageName < b.servicePackageName) ? 1 : -1);
                    break;
                default:
                    break;
            }
        }
    }

    function filterList(filtype: number) {
        switch (filtype) {
            case 0:
                setData(all_data);
                sortList(ascending, sortType);
                break;
            default:
                break;
        }
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className='user-services'>
            {!addForm && <>
                <div className='dashboard-content-header1'>
                    <h2>Danh sách dịch vụ</h2>

                    <hr
                        style={{
                            borderTop: '1px solid black',
                            width: '100%',
                            opacity: '.25',
                        }}
                    />
                </div>
                <div className='dashboard-content-header2'>
                    <div className='dashboard-content-header2-left'>
                        <button type="button" className="btn btn-primary" >
                            Thêm
                        </button>
                        <button type="button" className="btn btn-danger" >
                            Xóa
                        </button></div>

                    <div className='dashboard-content-header2-right'>
                        <div className='dashboard-content-search'>
                            <input
                                type='text'
                                onChange={e => __handleSearch(e)}
                                placeholder='Search..'
                                className='dashboard-content-input'
                            />
                        </div>

                    </div>

                </div>
                <div className='dashboard-content-header3'>
                    <span>Sắp xếp theo </span>
                    <button type="button" className="btn" onClick={() => {
                        sortList(!ascending, sortType);
                        setAscending(!ascending)
                    }}>
                        {ascending ? "Tăng dần" : "Giảm dần"}
                    </button>
                    <Select
                        defaultValue="name"
                        style={{ width: 120 }}
                        onChange={(e) => {
                            sortList(ascending, e);
                            setSortType(e)
                        }}
                        options={[
                            { value: 'name', label: 'Tên' },
                        ]}
                    />
                </div>

                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
  {false &&              
                    <Table rowSelection={rowSelection} columns={columns} dataSource={dataListShow} />
                }
                <Row gutter={16}>

                    {dataListShow.map((d) => {
                        return (
                            <Col span={8}> <Card
                                style={{ width: 300 }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                }
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    title={d.name}
                                    description="This is the description"
                                />
                            </Card></Col>)
                    })}
                </Row>
                {/*<table>
                <thead>
                    <th>ID</th>
                    <th>TÊN</th>
                    <th>MÔ TẢ</th>
                    <th>GÓI DỊCH VỤ</th>
                </thead>


                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            //console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={dataListShow}
                    header={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                    }
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            ]}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src={item.image}
                                />
                            }
                        >
                            <List.Item.Meta
                                //avatar={<Avatar src={item.avatar} />}
                                title={<a href={item.href}>{item.name}</a>}
                            />
                            Miêu tả tóm tắt
                        </List.Item>
                    )}
                />

                {/*orders.map((order, index) => (
                            <tr key={index}>
                                <td><span>{order.id}</span></td>
                                <td><span>{order.serviceName}</span></td>
                                {/*<td>
                                    <div>
                                        {order.status === 'Paid' ?
                                            <img
                                                src={DoneIcon}
                                                alt='paid-icon'
                                                className='dashboard-content-icon' />
                                            : order.status === 'Canceled' ?
                                                <img
                                                    src={CancelIcon}
                                                    alt='canceled-icon'
                                                    className='dashboard-content-icon' />
                                                : order.status === 'Refunded' ?
                                                    <img
                                                        src={RefundedIcon}
                                                        alt='refunded-icon'
                                                        className='dashboard-content-icon' />
                                                    : null}
                                        <span>{order.status}</span>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <img
                                            src={order.avatar}
                                            className='dashboard-content-avatar'
                                            alt={order.first_name + ' ' + order.last_name} />
                                        <span>{order.first_name} {order.last_name}</span>
                                    </div>
                                </td>*}
                                <td><span>{order.description}</span></td>
                                <td><span>{order.servicePackages}</span></td>
                            </tr>
                        ))}
                  </table>*/}


            </>}

            {/*addForm && <><Add />        
            <button type="submit" className="btn btn-primary"
                    onClick={() => setAddForm(!addForm)}>Cancel</button>
                            </>*/}

        </div>
    )
};
