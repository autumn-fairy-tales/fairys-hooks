import { useRef } from 'react';
import { proxy, ref, unstable_getInternalStates, useSnapshot } from 'valtio';

export const isObject = (x: unknown): x is object => typeof x === 'object' && x !== null;

export interface InstanceBaseState extends Record<string, any> {}

/**
 * 实例基类
 */
export class InstanceBase<T extends InstanceBaseState = InstanceBaseState> {
  store = proxy<T>({} as T);

  ctor = (options: Partial<T>) => {
    Object.assign(this.store, options);
    return this;
  };

  /**
   * 更新状态
   * @param value
   */
  updatedStore = <M extends T>(value: Partial<M>) => {
    Object.assign(this.store, value);
    return this;
  };

  /**
   * 获取状态引用
   * @param value
   * @returns
   */
  ref = <M extends Object>(value: M) => ref(value);
  /***
   * 判断值是否为代理对象
   * @param value 值
   * @returns 是否为代理对象
   */
  isValtioProxy = (value: any) => {
    const { refSet } = unstable_getInternalStates();
    const canProxyDefault = (x: unknown): boolean =>
      isObject(x) &&
      !refSet.has(x) &&
      (Array.isArray(x) || !(Symbol.iterator in x)) &&
      !(x instanceof WeakMap) &&
      !(x instanceof WeakSet) &&
      !(x instanceof Error) &&
      !(x instanceof Number) &&
      !(x instanceof Date) &&
      !(x instanceof String) &&
      !(x instanceof RegExp) &&
      !(x instanceof ArrayBuffer) &&
      !(x instanceof Promise);
    return canProxyDefault(value);
  };
}

/**
 * 初始化实例 hook
 * @param initial
 * @returns 实例基类
 */
export function useInstanceBase<T extends InstanceBaseState = InstanceBaseState>(initial: Partial<T>) {
  const ref = useRef<InstanceBase<T>>();
  if (!ref.current) {
    ref.current = new InstanceBase<T>().ctor(initial);
  }
  return ref.current;
}

/**
 * 状态 hook
 * @param options
 * @returns
 */
export function useState<T extends InstanceBaseState = InstanceBaseState>(initial: Partial<T>) {
  const instance = useInstanceBase(initial);
  const store = useSnapshot(instance.store) as T;
  return [store, instance, store.__defaultValue] as [T, InstanceBase<T>, unknown];
}
