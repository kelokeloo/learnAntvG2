import axios from "axios";
import { AxiosPromise, AxiosRequestConfig } from "axios";

const request = axios.create({
  timeout: 3000,
});
request.interceptors.response.use((config) => {
  return config.data;
});

// 重载函数接口
function _innerRequest<T>(config: AxiosRequestConfig): Promise<T>;
function _innerRequest<T>(url: string, config?: AxiosRequestConfig): Promise<T>;

// 重载过后不用在原函数定义范型
function _innerRequest(...args) {
  return request(...args);
}

export { _innerRequest as request };
