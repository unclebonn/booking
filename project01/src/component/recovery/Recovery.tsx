import { Modal, message, Table } from "antd"
import fetch_Api from "../../utils/api_function"
import { useState, useEffect } from "react"
import { CustomerListState, CustomerState, UserListState, UserState } from "../../app/type.d"
import tableRecovery from "../../utils/table_recovery"
import type { ColumnsType } from 'antd/es/table';
interface RecoveryProps {
    isOpen: boolean,
    type: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    dataSource: DataSourceProps
}

type DataSourceProps = CustomerListState | UserListState
type ColumnsRecover = CustomerState | UserState



const Recovery: React.FC<RecoveryProps> = ({ isOpen, type, setIsOpen, dataSource }) => {
    return (
        <Modal
            open={isOpen}
            title="Khôi phục"
            footer={[]}
            onCancel={() => setIsOpen(false)}

        >
            <Table
                className='recover-table'
                columns={tableRecovery(type) as ColumnsType<any>}
                dataSource={dataSource} />
        </Modal>
    )
}

export default Recovery