import Axios from "./Axios";
import { AxiosInstance } from "./types";
import { CancelToken, isCancel } from "./cancel";
// axios其实就是一个函数
export function createInstace(): AxiosInstance {
  let context: Axios<any> = new Axios();
  let instance = Axios.prototype.request.bind(context);
  instance = Object.assign(instance, Axios.prototype, context);
  return instance as AxiosInstance;
}
let axios = createInstace();
axios.cancelToken = new CancelToken();
axios.isCancel = isCancel;
export default axios;

export * from "./types";
