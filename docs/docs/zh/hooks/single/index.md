# 单例请求实例基类

## 安装

```bash
npm install @fairys/hooks # yarn add @fairys/hooks  # pnpm add @fairys/hooks
```

## 引入

```ts
import { 
    FairysSingleInstance,
    useFairysSingleInstance,
    useFairysSingleQuery,
} from '@fairys/hooks';
```

## 类型

```ts
import { FairysInstanceBase } from '../base.instance';
export interface FairysSingleInstanceState<T = any> {
    loading: boolean;
    data?: T;
}
export interface FairysSingleInstanceOptions<T = any> extends FairysSingleInstanceState<T> {
    request?: (instance: FairysSingleInstance<T>) => Promise<{
        data: T;
        success: boolean;
    }>;
}
export declare class FairysSingleInstance<T = any> extends FairysInstanceBase<FairysSingleInstanceState<T>> {
    store: FairysSingleInstanceState<T>;
    /**获取数据方法*/
    request?: (instance: FairysSingleInstance<T>) => Promise<{
        data: T;
        success: boolean;
    }>;
    constructor(options: Partial<FairysSingleInstanceOptions<T>>);
    /**查询数据*/
    query: () => Promise<void>;
}
export declare function useFairysSingleInstance<T = any>(options: Partial<FairysSingleInstanceOptions<T>>): FairysSingleInstance<T>;
export interface FairysSingleQueryOptions<T = any> extends FairysSingleInstanceOptions<T> {
    /**是否在组件挂载时查询数据*/
    isMountedQuery?: boolean;
}
/***
 * 单例查询 hook
 * @param options
 * @returns
 */
export declare const useFairysSingleQuery: <T = any>(options: Partial<FairysSingleQueryOptions<T>>) => {
    singleInstance: FairysSingleInstance<T>;
    store: {
        readonly loading: boolean;
        readonly data?: import("valtio").Snapshot<T>;
    };
    loading: boolean;
};

```