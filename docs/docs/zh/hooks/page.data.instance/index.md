# 页面数据实例

## 安装

```bash
npm install @fairys/hooks # yarn add @fairys/hooks  # pnpm add @fairys/hooks
```

## 引入

```ts
import { 
  FairysPageData,
  useFairysPageData,
  FairysPageDataContext,
  useFairysPageDataContext,
  useFairysPageDataStore,
  useFairysPageDataTableProps,
  useFairysPageDataSearchProps,
  useFairysPageDataSnapshot,
  useFairysPageDataEditFormProps,
  useFairysPageDataScrollLoadProps,
} from '@fairys/hooks';
```

## 类型

```ts
/**
 * 页面数据状态数据类型
 */
export interface FairysPageDataState {
    /**编辑表单数据*/
    editFormData?: Record<string, any>;
    /**编辑类型*/
    editType?: string;
    /**编辑弹窗是否可见*/
    editVisible?: boolean;
    /**加载状态*/
    loading?: Record<string, boolean>;
    /**查询表单数据*/
    search?: Record<string, any>;
    /**查询数据列表*/
    dataList?: Record<string, any>[];
    selectedRows?: any[];
    selectedRowKeys?: React.Key[];
    page?: number;
    /**分页大小*/
    pageSize?: number;
    /**数据总数*/
    total?: number;
    /**tab键值*/
    tabKey?: string;
    /**是否为tab表格*/
    isTabTable?: boolean;
    /**是否为tab查询*/
    isTabSearch?: boolean;
    /**tab查询数据*/
    tabSearch?: Record<string, Record<string, any>>;
    /**tab数据列表*/
    tabDataList?: Record<string, Record<string, any>[]>;
    /**tab分页数据*/
    tabPage?: Record<string, number>;
    /**tab分页大小*/
    tabPageSize?: Record<string, number>;
    /**tab数据总数*/
    tabTotal?: Record<string, number>;
    /**tab选择行数据*/
    tabSelectedRows?: Record<string, any[]>;
    /**tab选择行数据键值*/
    tabSelectedRowKeys?: Record<string, React.Key[]>;
    /**是否启用滚动加载*/
    enableScrollLoad?: boolean;
    /**下拉刷新状态*/
    refresherStatus?: boolean;
    /**上拉加载状态*/
    loadMoreStatus?: boolean;
    /**是否最后一页*/
    hasLastPage?: boolean;
    /**tab多页签下拉刷新状态*/
    tabRefresherStatus?: Record<string, boolean>;
    /**tab多页签上拉加载状态*/
    tabLoadMoreStatus?: Record<string, boolean>;
    /**tab多页签是否最后一页*/
    tabHasLastPage?: Record<string, boolean>;
    [key: string]: any;
}
/**
 * 页面数据状态实例参数类型
 */
export interface FairysPageDataOptions extends FairysPageDataState {
    /**格式化查询参数*/
    formatQuery?: FairysPageData['formatQuery'];
    /**获取数据列表方法*/
    getList?: FairysPageData['getList'];
    /**重置获取值的方法*/
    getResetValues?: FairysPageData['getResetValues'];
    /**那些字段取值对象 code值*/
    codeFields?: FairysPageData['codeFields'];
    /**那些字段取值对象的 value 值 */
    valueFields?: FairysPageData['valueFields'];
    [key: string]: any;
}

/**
 * 页面数据实例
 */
export declare class FairysPageData<T extends FairysPageDataState = FairysPageDataState> {
    /**创建ref对象*/
    ref: <D extends Object>(value: D) => D & {
        $$valtioSnapshot: D;
    };
    /**实例参数*/
    _options: FairysPageDataOptions;
    /**默认状态*/
    get defaultStore(): T;
    /**状态*/
    store: T;
    /**请求之前处理参数*/
    formatQuery?: (payload: Record<string, any>, instance: FairysPageData, _tabKey?: string) => Record<string, any>;
    /**获取数据列表方法*/
    getList?: (params: Record<string, any>, instance: FairysPageData<T>, _tabKey?: string) => Promise<{
        total: number;
        list: Record<string, any>[];
    }>;
    /**重置获取值的方法*/
    getResetValues?: (instance: FairysPageData<T>, _tabKey?: string) => Record<string, any>;
    /**那些字段取值对象 code值*/
    codeFields?: string[];
    /**那些字段取值对象的 value 值 */
    valueFields?: string[];
    constructor(options?: FairysPageDataOptions);
    /**更新搜索参数*/
    onUpdatedSearch: (search: Record<string, any>) => this;
    /**重置搜索参数*/
    onResetSearch: (search?: Record<string, any>, tabKey?: string) => this;
    /**更新 loading*/
    updatedLoading: (loading: Record<string, any>) => this;
    /**更新查询列表 loading*/
    updatedQueryLoading: (loading?: boolean, tabKey?: string) => this;
    /**获取查询列表参数*/
    getQueryListParams: (tabKey?: string) => Record<string, any>;
    /**更新下拉刷新或上拉加载状态*/
    updatedRefresherOrLoadMoreStatus: (status: boolean, page: number, tabKey?: string) => this;
    /**查询列表数据*/
    queryList: () => Promise<void>;
    /**分页*/
    onUpdatedPage: (page: number, pageSize?: number) => Promise<this>;
    /**更新选择行数据*/
    onUpdatedSelected: (selectedRows: any[], selectedRowKeys: React.Key[], tabKey?: string) => this;
    /**加载更多*/
    onLoadMore: () => Promise<void>;
}
/**
 * 初始化实例
 */
export declare const useFairysPageData: <T extends FairysPageDataState = FairysPageDataState>(options?: FairysPageDataOptions) => FairysPageData<T>;
/**
 * 页面实例上下文
 */
export declare const FairysPageDataContext: import("react").Context<any>;
/**
 * 页面实例上下文解析
 * @returns 页面实例上下文
 */
export declare const useFairysPageDataContext: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>() => M;
/**
 * 页面实例状态解析
 * @param options useSnapshot参数选项
 * @returns [页面实例状态, 页面实例]
 */
export declare const useFairysPageDataStore: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>(options?: {
    sync?: boolean;
}) => [T, M];
/**
 * 页面实例表格属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例表格属性
 */
export declare const useFairysPageDataTableProps: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>(options?: {
    sync?: boolean;
}) => {
    fairysPageData: M;
    state: T;
    isTabTable: boolean;
    tabKey: string;
    dataList: Record<string, any>[];
    page: number;
    pageSize: number;
    total: number;
    selectedRows: any[];
    selectedRowKeys: import("react").Key[];
    loading: boolean;
};
/**
 * 页面实例搜索属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例搜索属性
 */
export declare const useFairysPageDataSearchProps: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>(options?: {
    sync?: boolean;
}) => {
    isTabSearch: boolean;
    tabKey: string;
    search: Record<string, any>;
    fairysPageData: M;
    state: T;
};
/**
 * 页面实例编辑表单属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例编辑表单属性
 */
export declare const useFairysPageDataEditFormProps: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>(options?: {
    sync?: boolean;
}) => {
    editVisible: boolean;
    editType: string;
    editFormData: Record<string, any>;
    fairysPageData: M;
    state: T;
};
/**
 * 页面实例滚动加载状态解析
 * @param instance 页面实例
 * @returns 页面实例滚动加载状态
 */
export declare const useFairysPageDataScrollLoadProps: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>(options?: {
    sync?: boolean;
}) => {
    state: T;
    fairysPageData: M;
    tabKey: string;
    isTabTable: boolean;
    enableScrollLoad: boolean;
    refresherStatus: boolean;
    loadMoreStatus: boolean;
    hasLastPage: boolean;
};
/**
 * 页面实例状态解析
 * @param instance 页面实例
 * @returns 页面实例状态
 */
export declare const useFairysPageDataSnapshot: <T extends FairysPageDataState = FairysPageDataState, M extends FairysPageData<T> = FairysPageData<T>>(instance: M, options?: {
    sync?: boolean;
}) => {
    state: T;
    fairysPageData: M;
    isTabTable: boolean;
    tabKey: string;
    isTabSearch: boolean;
    searchTabKey: string;
    dataList: Record<string, any>[];
    page: number;
    pageSize: number;
    total: number;
    selectedRows: any[];
    selectedRowKeys: import("react").Key[];
    loading: boolean;
    search: Record<string, any>;
    enableScrollLoad: boolean;
    refresherStatus: boolean;
    loadMoreStatus: boolean;
    hasLastPage: boolean;
};

```