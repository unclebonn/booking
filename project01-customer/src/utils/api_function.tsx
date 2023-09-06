import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState } from 'react';
import Cookies from 'universal-cookie';

interface Api {
    url: string,
    method: string,
    token?: string,
    data?: any
}






const fetch_Api = async function (params: Api): Promise<AxiosResponse> {
    const cookies = new Cookies()
    const token = cookies.get("token")?.token
    const config: AxiosRequestConfig = {
        headers: {
            "Authorization": `Bearer  ${token}`,
            "Content-Type": "application/json"
        },
        url: params.url,
        method: params.method,
        data: params.data,
    }
    try {
        const response: AxiosResponse = await axios(config);
        return response
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data;
            throw errorMessage
        } else {
            throw new Error(`Lỗi khi đưa yêu cầu: ${error}`)
        }
    }
}


export default fetch_Api

