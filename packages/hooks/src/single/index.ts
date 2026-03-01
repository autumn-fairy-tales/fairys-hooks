import { useEffect, useRef } from 'react';
import { InstanceBase } from 'base.instance';
import { proxy, useSnapshot } from 'valtio';

export interface SingleInstanceState<T = any> {
  loading: boolean;
  data?: T;
}

export interface SingleInstanceOptions<T = any> extends SingleInstanceState<T> {
  request?: (instance: SingleInstance<T>) => Promise<{ data: T; success: boolean }>;
}

export class SingleInstance<T = any> extends InstanceBase<SingleInstanceState<T>> {
  store = proxy<SingleInstanceState<T>>({
    loading: false,
    data: undefined,
  });

  /**获取数据方法*/
  request?: (instance: SingleInstance<T>) => Promise<{ data: T; success: boolean }>;

  constructor(options: Partial<SingleInstanceOptions<T>>) {
    super();
    const { request, ...rest } = options;
    this.request = request;
    Object.assign(this.store, rest);
  }

  /**查询数据*/
  query = async () => {
    this.store.loading = true;
    try {
      if (!this.request) {
        throw new Error('请实现获取数据方法');
      }
      const result = await this.request(this);
      if (result.success) {
        this.store.data = result.data;
      }
    } catch (error) {
      console.log('查询失败', error);
    } finally {
      this.store.loading = false;
    }
  };
}

export function useSingleInstance<T = any>(options: Partial<SingleInstanceOptions<T>>) {
  const ref = useRef<SingleInstance<T>>();
  if (!ref.current) {
    ref.current = new SingleInstance(options);
  }
  return ref.current;
}

export interface SingleQueryOptions<T = any> extends SingleInstanceOptions<T> {
  /**是否在组件挂载时查询数据*/
  isMountedQuery?: boolean;
}

/***
 * 单例查询 hook
 * @param options
 * @returns
 */
export const useSingleQuery = <T = any>(options: Partial<SingleQueryOptions<T>>) => {
  const { isMountedQuery = true, ...rest } = options;
  const singleInstance = useSingleInstance(rest);
  const store = useSnapshot(singleInstance.store);
  const loading = !!store.loading;

  useEffect(() => {
    if (isMountedQuery) {
      singleInstance.query();
    }
  }, []);

  return { singleInstance, store, loading };
};
