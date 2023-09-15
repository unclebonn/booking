import { Modal, message, Table, List } from "antd"
import { useState, useEffect } from "react"
import tableRecovery from "../../utils/table_recovery"
import type { ColumnsType } from 'antd/es/table';
import tableRecovery_Responsive from "../../utils/card_recovery";
import "../../pages/user/recovery/recovery.scss"


interface RecoveryProps {
    isOpen: boolean,
    type: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    dataSource: any
}


export const Recovery: React.FC<RecoveryProps> = ({ isOpen, type, setIsOpen, dataSource }) => {
    return (
        <Modal
            open={isOpen}
            className="recoveryModal"
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
export const RecoveryResponsive: React.FC<RecoveryProps> = ({ isOpen, type, setIsOpen, dataSource }) => {
    return (
        <Modal
            className="recoveryModal--responsive"
            open={isOpen}
            title="Khôi phục"
            footer={[]}
            onCancel={() => setIsOpen(false)}

        >
            {tableRecovery_Responsive(type, dataSource)}
        </Modal>
    )
}

