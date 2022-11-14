interface OnFulFilled<V> {
  (value: V): V | Promise<V>;
}
interface OnRejected {
  (error: any): any;
}

export default class InterceptorManager<V> {
  public interceptors: (Interceptor<V> | null)[] = [];
  use(onFulfilled?: OnFulFilled<V>, onRejected?: OnRejected): number {
    this.interceptors.push({
      onFulfilled,
      onRejected,
    });
    return this.interceptors.length - 1;
  }
  ejcted(id: number) {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
// 某一个拦截器
export interface Interceptor<V> {
  onFulfilled?: OnFulFilled<V>;
  onRejected?: OnRejected;
}
