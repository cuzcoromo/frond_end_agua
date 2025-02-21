
import axios from 'axios';
import {APP_DATA_USER, HOST_LASS, REFRESH_TOKEN, TOKEN } from './index';

const service = axios.create({
  baseURL: HOST_LASS,
  timeout: 60000,
});

// ------------------------------ API Request interceptor
service.interceptors.request.use((requestConfig) => {
  const accessToken = localStorage.getItem(TOKEN);
  let config: any = { ...requestConfig };

  // Si la URL ya contiene http:// o https://, no se modifica
  if (!config.url.startsWith('http://') && !config.url.startsWith('https://')) {
    config.url = HOST_LASS + config.url;
  }

  // Verifica si la URL termina en .html y si el método es GET
  const isHtmlRequest = config.url.endsWith('.html') && config.method?.toUpperCase() === 'GET';
  const isAws = config.url.includes('esilecstorage.s3.amazonaws.com') && config.url.includes('.pdf');

  if (config.headers && !isAws) {
    if (isHtmlRequest) {
      // Si es una solicitud HTML, configura solo el header necesario
      config.headers = {
        'Content-Type': 'text/html'
      };
    } else {
      // Lógica existente para otras solicitudes
      if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
      }

      if (config.formData) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if(config?.headers?.responseType || config.url.includes('word')) {
        config.responseType = 'arraybuffer';
      }
      if (!config.responseType) {
        config.headers.Accept = 'application/json';
        config.headers['Content-Type'] = 'application/json';
      }
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// ----------------------------- API respone interceptor
let isRefreshing = false;
const refreshSubscribers: Array<any> = [];

const closeSession = async () => {
  const user = window.localStorage.getItem(APP_DATA_USER);
  const authToken = localStorage.getItem(TOKEN);
  try {
    if (authToken) {
      window.localStorage.clear();
      if (user) {
        const dataLocal = JSON.parse(user);
        const url = `${HOST_LASS}/laas/usuarios/cerrar_sesion/${dataLocal.servicio}`;
        await axios.post(url, {}, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
    }
    const timeOut = setTimeout(() => {
      window.location.href = '/';
    }, 7000);
    return () => clearTimeout(timeOut);
  } catch (e) {
    const timeOut = setTimeout(() => {
      window.location.href = '/';
    }, 7000);
    return () => clearTimeout(timeOut);
  }
};

// eslint-disable-next-line no-unused-vars
const subscribeTokenRefresh = (cb: (accessToken: string) => void) => {
  // @ts-ignore
  refreshSubscribers.push(cb);
};

const onRefreshed = (accessToken: string) => {
  // @ts-ignore
  refreshSubscribers.map((cb) => cb(accessToken));
};

service.interceptors.response.use((response) => response, async (error) => {
  const { config, response: { status, data } } = error;
  const originalRequest = config;

  // Remove token and redirect
  if (status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      let user: any = localStorage.getItem(APP_DATA_USER);
      if (!refreshToken) {
        closeSession();
        return Promise.reject(data);
      }
      if (user) {
        user = JSON.parse(user);
      } else {
        closeSession();
        return Promise.reject(data);
      }
      fetch(`${HOST_LASS}/laas/security/oauth/token`, {
        method: 'POST',
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${user.servicio}:LEXIS_SERVICE_${user.servicio}`)}`,
        },
      }).then((res) => res.json()).then((response: any) => {
        isRefreshing = false;
        if (response?.access_token) {
          const { access_token, refresh_token } = response;
          localStorage.setItem(TOKEN, access_token);
          localStorage.setItem(REFRESH_TOKEN, refresh_token);
        } else {
          closeSession();
          return Promise.reject(response);
        }
        isRefreshing = false;
        const { access_token: accessToken } = response;
        onRefreshed(accessToken);
        return null;
      }).catch(() => {
        closeSession();
        return Promise.reject(data);
      });
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((accessToken: string) => {
        originalRequest.headers.authorization = `Bearer ${accessToken}`;
        resolve(axios(originalRequest));
      });
    });
  }
  return Promise.reject(data);
});

export default service;
