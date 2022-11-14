import AxiosInceptorManager from "./AxiosInterceptorManager";
export type Methods = "get" | "GET" | "post" | "POST" | "put" | "PUT";

export interface AxiosConfig {
  url?: string;
  method?: Methods;
  params?: any;
  data?: any;
  headers?: any;
  timeout?: number;
  transformRequest?: (data: any, headers: any) => any;
  transformResponse?: (data: any) => any;
  cancelToken?: any;
}
// promise的泛型T代表变成成功态之后resolve的值 resolve(value)
export interface AxiosInstance {
  <T>(config: AxiosConfig): Promise<AxiosResponse<T>>;
  interceptors: {
    request: AxiosInceptorManager<AxiosRequestConfig>;
    response: AxiosInceptorManager<AxiosResponse>;
  };
  cancelToken?: any;
  isCancel?: any;
}

// T代表响应体的类型
export interface AxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers?: any;
  config?: AxiosConfig;
  request?: XMLHttpRequest;
}
