import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, Button, Rate, Carousel, Descriptions, Radio, Tabs, Table, Space, Popconfirm, message, Avatar, Input } from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone, SearchOutlined } from '@ant-design/icons';
import type { InputRef, RadioChangeEvent } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { CustomerListState, CustomerState } from '../../app/type.d';
import Cookies from 'universal-cookie';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import fetch_Api from '../../utils/api_function';
import api_links from '../../utils/api_links';
import { havePermission } from '../../utils/permission_proccess';
import Highlighter from 'react-highlight-words';
import { FilterConfirmProps } from 'antd/es/table/interface';

interface DataType {
    key: React.Key;
    id: string;
    name: string;
    phoneNumber: string;
    filePath: string;
}
type DataIndex = keyof DataType;

export default function SupportedUserInformation({ api_link }: { api_link: string }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CustomerListState>();
    const dataListShow: DataType[] = [];
    //var cookies = new Cookies()
    //var token = cookies.get("token")?.token;

    const addPermission = havePermission("User", "write");
    const deletePermission = havePermission("User", "delete");

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: '',
            dataIndex: 'action',
            render: (text, record) =>
                deletePermission &&
                <Popconfirm
                    className="ant-popconfirm"
                    title="Xoá nhân viên"
                    description="Bạn có chắc chắn xoá không ?"
                    onConfirm={() => {
                        handleDelete(record.id)
                    }}
                    okText="Xoá"
                    cancelText="Huỷ"
                    placement='bottomLeft'
                >
                    <Button size={"small"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
                </Popconfirm>,
            align:'center',
            width: '20px',
        },
        {
            title: '',
            dataIndex: 'filePath',
            align:'center',
            render: (record) =>
            record.filePath&&<Avatar size="large" src={record.filePath} />
},
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: (a, b) => a.name > b.name ? 1:-1,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Liên hệ',
            dataIndex: 'phoneNumber',
        },

    ];
    data?.map((dataTemp, index) => dataListShow.push({
        key: dataTemp.id,//index
        id: String(dataTemp.id),
        name: dataTemp.name,
        phoneNumber: dataTemp.phoneNumber??"",
        filePath: dataTemp.filePath??"",
    }));


    useEffect(() => {
        fetch_Api({
            url: api_link + '/' + id,
            method: 'GET',
        }).then(data => {
            setData(data.data.managedUsers);
        })
    }, [id]);

    const handleTableRowClick = (record: DataType) => {
        navigate("../nhan-vien/detail/"+record.id);
    }
    const handleDelete = (id: string) => {
        fetch_Api({
            url: api_links.user.superAdmin.blockCustomer + '/' + id,
            method: 'delete',
        })
            .then((res) => {
                if (res.status === 200) {
                    message.success(res.data.message)
                    fetch_Api({
                        url: api_link + '/' + id,
                        method: 'GET',
                    }).then(data => {
                        setData(data.data.managedUsers);
                    })
                }
            })
            .catch((error) => {
                message.error(error.message)
            })
    }
    return (
        <div className="supporteduser-information">
            {addPermission && <Link to={"../nhan-vien"}>
                <Button style={{ width: "100%" }} type='default' size='large'>
                    + Thêm nhân viên
                </Button>
            </Link>}
            <Table columns={columns} dataSource={dataListShow}
                onRow={(record) => ({
                    onClick: () => handleTableRowClick(record),
                })} />
        </div>
    );
};