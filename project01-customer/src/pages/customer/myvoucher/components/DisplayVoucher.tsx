import React from 'react'
import './stypeDisplayVoucer.css';
import { VoucherState } from '../../../../app/type.d';
interface Props {
    voucher: []
}

const DisplayVoucher: React.FC<Props> = (props) => {
    const { voucher } = props;

    const voucherStatus = (voucherStatus: string) => {
        switch (voucherStatus) {
            case "Usable": {
                return "Sử dụng"
            }
            case "OutOfValue": {
                return "Không có giá trị"
            }
            case "Expired": {
                return "Hết hạn"
            }
            case "Blocked": {
                return "Khoá"
            }
        }
    }
    return (
        <>

            <div className="bossWrapp">
                {
                    voucher.map((v: VoucherState) => {
                        return (
                            <div key={v.id} className="single noBd" >
                                <div className="icon">
                                    <img className="image" src="https://ben.com.vn/tin-tuc/wp-content/uploads/2021/04/voucher-la-gi.jpg " alt="" />
                                </div>
                                <div>
                                    <div className='content'>
                                        <h3>{v.actualPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}{v.voucherType !== null ? ` ${v.voucherType.typeName}` : " Voucher"}</h3>
                                        <div className='content-date'>
                                            <p><b>Hiệu lực</b>: {new Date(v.issuedDate).toLocaleString("vi-VN")}</p>
                                            <p><b>Hết hạn</b>: {new Date(v.expiredDate).toLocaleString("vi-VN")}</p>
                                            <p><b>Trạng thái</b>: {voucherStatus(v.voucherStatus)}</p>

                                        </div>
                                    </div>

                                    {/* <div className="functions">
                                    <span >{v.expiredDate}</span>
                                    <span>Claim Voucher
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10">
                                            <polyline fill="none" stroke="#3899EC" points="105.077 13.154 101 9.077 105.077 5" transform="rotate(-180 53.038 7.077)" />
                                        </svg>
                                    </span>
                                </div> */}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </>
    )
}

export default DisplayVoucher
