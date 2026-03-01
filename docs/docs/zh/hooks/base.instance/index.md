# 实例基类

## 安装

```bash
npm install @fairys/hooks # yarn add @fairys/hooks  # pnpm add @fairys/hooks
```

## 引入

```ts
import { 
    FairysInstanceBase,
    useFairysInstanceBase,
    useFairysInstanceState
} from '@fairys/hooks';
```

## 类型

```ts
import { ref } from 'valtio';
export interface FairysInstanceBaseState extends Record<string, any> {
}
/**
 * 实例基类
 */
export declare class FairysInstanceBase<T extends FairysInstanceBaseState = FairysInstanceBaseState> {
    store: T;
    ctor: (options: Partial<T>) => this;
    /**
     * 更新状态
     * @param value
     */
    updatedStore: <M extends T>(value: Partial<M>) => this;
    /**
     * 获取状态引用
     * @param value
     * @returns
     */
    ref: typeof ref;
    static ref: typeof ref;
    /***
     * 判断值是否为代理对象
     * @param value 值
     * @returns 是否为代理对象
     */
    isValtioProxy: (value: any) => boolean;
}
/**
 * 初始化实例 hook
 * @param initial
 * @returns 实例基类
 */
export declare function useFairysInstanceBase<T extends FairysInstanceBaseState = FairysInstanceBaseState>(initial: Partial<T>): FairysInstanceBase<T>;
/**
 * 状态 hook
 * @param options
 * @returns
 */
export declare function useFairysInstanceState<T extends FairysInstanceBaseState = FairysInstanceBaseState>(initial: Partial<T>): [T, FairysInstanceBase<T>, unknown];

```