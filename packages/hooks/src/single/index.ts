import { useEffect, useRef } from 'react';
import { FairysInstanceBase } from 'base.instance';
import { proxy, useSnapshot } from 'valtio';

export interface FairysSingleInstanceState<T = any> {
  loading: boolean;
  data?: T;
}

export interface FairysSingleInstanceOptions<T = any> extends FairysSingleInstanceState<T> {
  request?: (instance: FairysSingleInstance<T>) => Promise<{ data: T; success: boolean }>;
}

export class FairysSingleInstance<T = any> extends FairysInstanceBase<FairysSingleInstanceState<T>> {
  store = proxy<FairysSingleInstanceState<T>>({
    loading: false,
    data: undefined,
  });

  /**获取数据方法*/
  request?: (instance: FairysSingleInstance<T>) => Promise<{ data: T; success: boolean }>;

  constructor(options: Partial<FairysSingleInstanceOptions<T>>) {
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

export function useFairysSingleInstance<T = any>(options: Partial<FairysSingleInstanceOptions<T>>) {
  const ref = useRef<FairysSingleInstance<T>>();
  if (!ref.current) {
    ref.current = new FairysSingleInstance(options);
  }
  return ref.current;
}

export interface FairysSingleQueryOptions<T = any> extends FairysSingleInstanceOptions<T> {
  /**是否在组件挂载时查询数据*/
  isMountedQuery?: boolean;
}

/***
 * 单例查询 hook
 * @param options
 * @returns
 */
export const useFairysSingleQuery = <T = any>(options: Partial<FairysSingleQueryOptions<T>>) => {
  const { isMountedQuery = true, ...rest } = options;
  const singleInstance = useFairysSingleInstance(rest);
  const store = useSnapshot(singleInstance.store);
  const loading = !!store.loading;

  useEffect(() => {
    if (isMountedQuery) {
      singleInstance.query();
    }
  }, []);

  return { singleInstance, store, loading };
};
