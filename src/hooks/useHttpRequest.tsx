"use client";

import { Method } from 'axios';
import fetch from '../config/interceptor';

function useHttpRequest() {
  // const [loading, setLoading] = useState<Boolean>(false);

  const httpRequest = async (url: string, data: any = {}, method: Method = 'post', headers = {}, options: any = {}, formData = false) => {
    // setLoading(true);
    try {
      const config = {
        ...options,
        headers,
      };

    //   @ts-ignore
      const responseServer = await fetch[method](url, data, config, formData);
      // console.log(responseServer)

      // setLoading(false);
      return responseServer;
    } catch (e: any) {
      // setLoading(false);
      // console.log( e );
      
      return {
        ...e,
        status: 400,
      };
    }
  };

  return {
    // loading,
    httpRequest,
  };
}

export default useHttpRequest;
