import { AxiosConfig, AxiosResponse } from "./types";
import qs from "qs";
import parseHeaders from "parse-headers";
import InterceptorManager, { Interceptor } from "./AxiosInterceptorManager";
let defaults: AxiosConfig = {
  method: "get",
  timeout: 0,
  headers: {
    common: {
      // 针对所有的请求生效
      accept: "application/json", // 告诉服务器返回json类型的数据
    },
  },
};
let getStyleMethods = ["get", "head", "delete", "options"];
getStyleMethods.forEach((method: string) => {
  defaults.headers[method] = {};
});
let postStyleMethods = ["post", "put", "patch"];
postStyleMethods.forEach((method: string) => {
  defaults.headers[method] = {
    "content-type": "applicatioj/json", // 请求体的格式
  };
});
let allMethods = [...getStyleMethods, ...postStyleMethods];

// 这个T是返回的数据类型
export default class Axios<T> {
  public defaults: AxiosConfig = defaults;
  public interceptor = {
    request: new InterceptorManager<AxiosConfig>(),
    response: new InterceptorManager<AxiosResponse<T>>(),
  };
  // T用来修饰响应体的类型即data的类型
  request(config: AxiosConfig): Promise<AxiosResponse<T>> {
    // return this.dispatchRequest(config);
    config.headers = Object.assign(this.defaults.headers, config.headers);
    const chain: (Interceptor<AxiosConfig> | Interceptor<AxiosResponse<T>>)[] =
      [
        {
          onFulfilled: this.dispatchRequest,
        },
      ];
    // 左侧添加拦截器
    this.interceptor.request.interceptors.forEach((interceptor) => {
      interceptor && chain.unshift(interceptor);
    });
    // 右侧添加拦截器
    this.interceptor.response.interceptors.forEach((interceptor) => {
      interceptor && chain.push(interceptor);
    });
    let promise: any = Promise.resolve(config);
    while (chain.length) {
      const { onFulfilled, onRejected } = chain.shift()!;
      promise = promise.then(onFulfilled, onRejected);
    }
    return promise;
  }
  dispatchRequest<T>(config: AxiosConfig): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      let { method, url, params, headers, data, timeout } = config;
      let request = new XMLHttpRequest();
      if (params && typeof params === "object") {
        // {name:'yq',age:18}==>name=yq&age=18
        params = qs.stringify(params);
        url += url!.indexOf("?") === -1 ? "&" + params : "?" + params;
      }
      request.open(method!, url!, true);
      request.responseType = "json";
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 0) {
          if (request.status >= 200 && request.status < 300) {
            let response: AxiosResponse<T> = {
              data: request.response ? request.response : request.responseText,
              status: request.status,
              statusText: request.statusText,
              // content-type=xxx; content-length=42===>{}
              headers: parseHeaders(request.getAllResponseHeaders()),
              config: config,
              request,
            };
            resolve(response);
          } else {
            reject(`Error:Request failed with status code ${request.status}`);
          }
        }
      };
      if (headers) {
        for (let key in headers) {
          if (key === "common" || key === method) {
            for (let key2 in headers) {
              request.setRequestHeader(key2, headers[key][key2]);
            }
          } else {
            request.setRequestHeader(key, headers[key]);
          }
        }
      }
      let body: string | null = null;
      if (data) {
        body = JSON.stringify(data);
      }
      request.send(body);
      request.onerror = function () {
        reject("net::ERR_INTERNET_DISCONECTED");
      };
      if (timeout) {
        request.timeout = timeout;
        request.ontimeout = function () {
          reject(`Erroer:time of ${timeout}ms exceeded`);
        };
      }
      if (config.cancelToken) {
        config.cancelToken.then((message: string) => {
          request.abort();
          reject(message);
        });
      }
    });
  }
}
