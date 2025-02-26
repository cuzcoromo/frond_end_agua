import { HOST_LASS } from '@/config';
import axios, { Method } from 'axios';

const httpRequestServer = async (
  url: string,
  data: any = {},
  method: Method = 'post',
  headers = {},
  options: any = {},
  formData = false
) => {
  try {
    let requestData = data;

    // Si es FormData, convierte el objeto a FormData
    if (formData) {
      const formDataObj = new FormData();
      Object.keys(data).forEach((key) => {
        formDataObj.append(key, data[key]);
      });
      requestData = formDataObj;
    }

    // Realiza la solicitud usando axios
    const response = await axios({
      method,
      url: HOST_LASS + url,
      data: requestData,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      ...options,
    });

    return response.data;
  } catch (error: any) {
    return {
      ...error.response,
      status: error.response?.status || 400,
    };
  }
};

export default httpRequestServer;