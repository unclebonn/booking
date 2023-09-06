import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CustomerState } from '../../../app/type.d';
import { calculateRange, sliceData } from '../../table-pagination';
import { LikeOutlined, MessageOutlined, StarOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, List, Select, Space } from 'antd';
import { Button, Table, Divider,Card, Col, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
/*
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { addToCart } from '../../redux/bazaarSlice';
import { ToastContainer, toast } from 'react-toastify';



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
        width:'300px',
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
        width:'112px',
        render: (_, record) => (
            <Space size="small">
                <Button size={"large"} ><FontAwesomeIcon icon={faPenToSquare} /></Button>
                <Button size={"large"} ><FontAwesomeIcon icon={faTrashCan} /></Button>
            </Space>
        ),
    },
];*/

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


export default function DetailOfCustomer() {
/*    const dispatch = useDispatch() 

    const [details, setDetails] = useState({})
    let [baseQty, setBaseQty] = useState(1) 
  
    const location = useLocation()
    useEffect(()=>{
      setDetails(location.state.item)
    }, [])
  
    return (
      <div>
        <div className='max-w-screen-xl mx-auto my-10 flex gap-10'>
          <div className='w-2/5 relative'>
            <img className='w-full h-[550px] object-cover' src={details.image} alt="" />
            <div className='absolute top-2 right-2'>
              {details.isNew && (
                <p className='bg-black text-white px-8 py-1'>Sale</p>
            )}
            </div>
          </div>
          <div className='w-3/5 flex flex-col justify-center gap-12'>
              <div>
                <h2 className='text-3xl fot-semibold'>{details.title}</h2>
                <div className='flex items-center gap-4 mt-3'>
                  <div className='line-through font-base text-gray-500'>
                    ${details.oldPrice}
                  </div>
                  <div className='text-2xl font-medium text-gray-900'>
                    ${details.price}
                  </div>
                </div>
              </div>
              <div className='flex align-center gap-3 flex-start'>
                <div>
                <StarIcon/>
                <StarIcon/>
                <StarIcon/>
                <StarIcon/>
                <StarIcon/>
                </div>
                <p className='text-sm mt-1 text-gray-500'>({details.rating} Customer reviews)</p>
              </div>
                <p className='text-base text-gray-500 mt-3'>{details.description}</p>
                <div className='flex gap-4'>
                  <div className='w-52 flex items-center justify-between text-gray-500 gap-4 border p-3'>
                    <p className='text-base text-black'>Quantity</p>
                    <div className='flex items-center gap-4 text-sm font-semibold'>
                      <button onClick={()=>  setBaseQty(baseQty>1?baseQty-1:1)} className='border text-black h-5 font-normal text-1g flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer py-3 duration-300 active:bg-black'>-</button>
                      <span>{baseQty}</span>
                      <button onClick={()=>setBaseQty(baseQty+1)} className='border h-5 text-black font-normal text-1g flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer py-3 duration-300 active:bg-black'>+</button>
                    </div>
                  </div>
                  <button onClick={()=>dispatch(addToCart({
                     _id: details._id, 
                     title: details.title,
                     image: details.image,
                     price: details.price,
                     quantity: baseQty,
                     description: details.description
                  })) && toast.success(`${details.title} is added`)}  className='bg-black text-white py-3 px-6 active:bg-gray-800'>add To Cart</button>
                </div>
                <p className='text-base text-gray-500'>Category: <span className='font-medium capitalize'>{details.category}</span></p>
          </div>
        </div> 
        <ToastContainer
          position='top-left'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
        
      </div>
    )*/
  }