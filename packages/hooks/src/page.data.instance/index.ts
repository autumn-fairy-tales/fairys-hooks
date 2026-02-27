import { proxy, ref, useSnapshot } from 'valtio';
import { FairysPageDataInstanceState, FairysPageDataInstanceOptions } from './interface';
import { useRef, createContext, useContext } from 'react';
export * from './interface';

/**
 * 页面数据实例
 */
export class FairysPageDataInstance {
  private _options: FairysPageDataInstanceOptions;

  get defaultStore(): FairysPageDataInstanceState {
    return {
      dataList: [],
      page: 1,
      pageSize: 20,
      total: 0,
      search: {},
      selectedRows: [],
      selectedRowKeys: [],
      loading: {},
      isTabSearch: false,
      isTabTable: false,
      tabDataList: {},
      tabKey: '',
      tabSearch: {},
      tabPage: {},
      tabPageSize: {},
      tabTotal: {},
      tabSelectedRows: {},
      tabSelectedRowKeys: {},
    };
  }

  store = proxy<FairysPageDataInstanceState>(this.defaultStore);

  /**请求之前处理参数*/
  onBefore?: (payload: Record<string, any>, instance: FairysPageDataInstance) => Record<string, any>;
  /**获取数据列表方法*/
  getList?: (
    params: Record<string, any>,
    instance: FairysPageDataInstance,
  ) => Promise<{ total: number; list: Record<string, any>[] }>;
  /**重置获取值的方法*/
  getResetValues?: (instance: FairysPageDataInstance) => Record<string, any>;

  constructor(options?: FairysPageDataInstanceOptions) {
    const { onBefore, getList, getResetValues, isSearchProxy, ...rest } = options || {};
    this.onBefore = onBefore;
    this.getList = getList;
    this.getResetValues = getResetValues;
    Object.assign(this.store, rest);
    this._options = options || {};
    if (isSearchProxy === false) {
      this.store.search = ref({ ...this.store.search });
      const keys = Object.keys(this.store.tabSearch);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        this.store.tabSearch[key] = ref(this.store.tabSearch[key]);
      }
    }
  }

  //========================================================查询表单===========================================
  /**更新搜索参数*/
  onUpdatedSearch = (search: Record<string, any>) => {
    if (this.store.isTabSearch) {
      if (!this.store.tabSearch) {
        this.store.tabSearch = {};
      }
      const oldSearch = this.store.tabSearch[this.store.tabKey];
      if (oldSearch) {
        Object.assign(oldSearch, search);
      } else {
        if (this._options.isSearchProxy === false) {
          this.store.tabSearch[this.store.tabKey] = ref({ ...search });
        } else {
          this.store.tabSearch[this.store.tabKey] = { ...search };
        }
      }
    } else {
      const oldSearch = this.store.search;
      if (oldSearch) {
        Object.assign(oldSearch, search);
      } else {
        if (this._options.isSearchProxy === false) {
          this.store.search = ref({ ...search });
        } else {
          this.store.search = { ...search };
        }
      }
    }
    return this;
  };
  /**重置搜索参数*/
  onResetSearch = (search?: Record<string, any>) => {
    const values = this.getResetValues?.(this) || { ...search };
    if (this.store.isTabSearch) {
      if (!this.store.tabSearch) {
        this.store.tabSearch = {};
      }
      if (this._options.isSearchProxy === false) {
        this.store.tabSearch[this.store.tabKey] = ref({ ...values, ...search });
      } else {
        this.store.tabSearch[this.store.tabKey] = { ...values, ...search };
      }
    } else {
      if (this._options.isSearchProxy === false) {
        this.store.search = ref({ ...values, ...search });
      } else {
        this.store.search = { ...values, ...search };
      }
    }
    return this;
  };
  //========================================================更新 loading===========================================

  /**更新 loading*/
  updatedLoading = (loading: Record<string, any>) => {
    this.store.loading = { ...this.store.loading, ...loading };
    return this;
  };

  /**更新查询列表 loading*/
  updatedQueryLoading = (loading: boolean = true, tabKey?: string) => {
    if (this.store.isTabTable) {
      if (!this.store.loading) {
        this.store.loading = {};
      }
      this.store.loading[`${tabKey || this.store.tabKey}_queryList`] = loading;
    } else {
      this.store.loading.queryList = loading;
    }
    return this;
  };

  //========================================================查询列表===========================================
  getQueryListParams = () => {
    const params = {
      ...this.store.search,
      ...(this.store.isTabSearch ? this.store.tabSearch[this.store.tabKey] || {} : this.store.search || {}),
      page: this.store.isTabSearch ? this.store.tabPage[this.store.tabKey] || this.store.page : this.store.page,
      pageSize: this.store.isTabSearch
        ? this.store.tabPageSize[this.store.tabKey] || this.store.pageSize
        : this.store.pageSize,
    };
    if (this.onBefore) {
      return this.onBefore?.(params, this);
    }
    return params;
  };

  /**查询列表数据*/
  queryList = async () => {
    const tabKey = this.store.isTabTable ? this.store.tabKey : undefined;
    this.updatedQueryLoading(true, tabKey);
    try {
      const query = this.getQueryListParams();
      if (!this.getList) {
        throw new Error('请实现获取数据列表方法');
      }
      const result = await this.getList(query, this);
      if (result) {
        if (this.store.isTabTable) {
          if (!this.store.tabTotal) {
            this.store.tabTotal = {};
          }
          this.store.tabTotal[tabKey] = result?.total || 0;
          if (!this.store.tabDataList) {
            this.store.tabDataList = {};
          }
          this.store.tabDataList[tabKey] = ref(result?.list || []);
          if (!this.store.tabSelectedRows) {
            this.store.tabSelectedRows = {};
          }
          this.store.tabSelectedRows[tabKey] = ref([]);
          if (!this.store.tabSelectedRowKeys) {
            this.store.tabSelectedRowKeys = {};
          }
          this.store.tabSelectedRowKeys[tabKey] = ref([]);
        } else {
          this.store.total = result?.total || 0;
          this.store.dataList = ref(result?.list || []);
          this.store.selectedRows = ref([]);
          this.store.selectedRowKeys = ref([]);
        }
      }
    } catch (error) {
      console.log('查询列表数据失败', error);
    } finally {
      this.updatedQueryLoading(false, tabKey);
    }
  };

  /**分页*/
  onUpdatedPage = (page: number, pageSize?: number) => {
    if (this.store.isTabSearch) {
      if (!this.store.tabPage) {
        this.store.tabPage = {};
      }
      this.store.tabPage[this.store.tabKey] = page;
      if (pageSize) {
        this.store.tabPageSize[this.store.tabKey] = pageSize;
      }
    } else {
      this.store.page = page;
      if (pageSize) {
        this.store.pageSize = pageSize;
      }
    }
    // 执行查询列表数据
    this.queryList();
    return this;
  };

  /**更新选择行数据*/
  onUpdatedSelected = (selectedRows: any[], selectedRowKeys: React.Key[]) => {
    if (this.store.isTabTable) {
      if (!this.store.tabSelectedRows) {
        this.store.tabSelectedRows = {};
      }
      this.store.tabSelectedRows[this.store.tabKey] = ref(selectedRows);
      if (!this.store.tabSelectedRowKeys) {
        this.store.tabSelectedRowKeys = {};
      }
      this.store.tabSelectedRowKeys[this.store.tabKey] = ref(selectedRowKeys);
    } else {
      this.store.selectedRows = ref(selectedRows);
      this.store.selectedRowKeys = ref(selectedRowKeys);
    }
    return this;
  };
}

/**
 * 初始化实例
 */
export const useFairysPageDataInstance = (options: FairysPageDataInstanceOptions = {}) => {
  const ref = useRef(new FairysPageDataInstance(options));
  return ref.current;
};

// ========================================================页面实例上下文========================================================
/**
 * 页面实例上下文
 */
export const FairysPageDataInstanceContext = createContext(undefined);

// ========================================================页面实例上下文解析========================================================
/**
 * 页面实例上下文解析
 * @returns 页面实例上下文
 */
export const useFairysPageDataInstanceContext = <M extends FairysPageDataInstance = FairysPageDataInstance>() =>
  useContext(FairysPageDataInstanceContext) as M;

// ========================================================页面实例状态解析========================================================
/**
 * 页面实例状态解析
 * @param options useSnapshot参数选项
 * @returns [页面实例状态, 页面实例]
 */
export const useFairysPageDataInstanceStore = <
  T extends FairysPageDataInstanceState = FairysPageDataInstanceState,
  M extends FairysPageDataInstance = FairysPageDataInstance,
>(options?: {
  sync?: boolean;
}) => {
  const instance = useFairysPageDataInstanceContext() as M;
  const state = useSnapshot(instance.store, options);
  return [state, instance] as [T, M];
};

/**
 * 页面实例表格属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例表格属性
 */
export const useFairysPageDataInstanceTableProps = <
  T extends FairysPageDataInstanceState = FairysPageDataInstanceState,
  M extends FairysPageDataInstance = FairysPageDataInstance,
>(options?: {
  sync?: boolean;
}) => {
  const [state] = useFairysPageDataInstanceStore<T, M>(options);
  const isTabTable = state.isTabTable;

  const tabKey = isTabTable ? state.tabKey : undefined;

  const dataList = isTabTable ? state.tabDataList?.[tabKey] : state.dataList;
  const page = isTabTable ? state.tabPage?.[tabKey] || state.page : state.page;
  const pageSize = isTabTable ? state.tabPageSize?.[tabKey] || state.pageSize : state.pageSize;
  const total = isTabTable ? state.tabTotal?.[tabKey] : state.total;
  const selectedRows = isTabTable ? state.tabSelectedRows?.[tabKey] : state.selectedRows;
  const selectedRowKeys = isTabTable ? state.tabSelectedRowKeys?.[tabKey] : state.selectedRowKeys;
  const loading = isTabTable ? state.loading?.[`${tabKey}_queryList`] : state.loading?.queryList;

  return {
    isTabTable,
    tabKey,
    dataList,
    page,
    pageSize,
    total,
    selectedRows,
    selectedRowKeys,
    loading,
  };
};

/**
 * 页面实例搜索属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例搜索属性
 */
export const useFairysPageDataInstanceSearchProps = <
  T extends FairysPageDataInstanceState = FairysPageDataInstanceState,
  M extends FairysPageDataInstance = FairysPageDataInstance,
>(options?: {
  sync?: boolean;
}) => {
  const [state] = useFairysPageDataInstanceStore<T, M>(options);
  const isTabSearch = state.isTabSearch;
  const tabKey = isTabSearch ? state.tabKey : undefined;
  const search = isTabSearch ? state.tabSearch?.[tabKey] : state.search;
  return { isTabSearch, tabKey, search };
};

/**
 * 页面实例状态解析
 * @param instance 页面实例
 * @returns 页面实例状态
 */
export const useFairysPageDataInstanceSnapshot = <
  T extends FairysPageDataInstanceState = FairysPageDataInstanceState,
  M extends FairysPageDataInstance = FairysPageDataInstance,
>(
  instance: M,
) => {
  const state = useSnapshot(instance.store);
  const isTabTable = state.isTabTable;
  const tabKey = isTabTable ? state.tabKey : undefined;
  const isTabSearch = state.isTabSearch;
  const searchTabKey = isTabSearch ? state.tabKey : undefined;

  const dataList = isTabTable ? state.tabDataList?.[tabKey] : state.dataList;
  const page = isTabTable ? state.tabPage?.[tabKey] || state.page : state.page;
  const pageSize = isTabTable ? state.tabPageSize?.[tabKey] || state.pageSize : state.pageSize;
  const total = isTabTable ? state.tabTotal?.[tabKey] : state.total;
  const selectedRows = isTabTable ? state.tabSelectedRows?.[tabKey] : state.selectedRows;
  const selectedRowKeys = isTabTable ? state.tabSelectedRowKeys?.[tabKey] : state.selectedRowKeys;
  const loading = isTabTable ? state.loading?.[`${tabKey}_queryList`] : state.loading?.queryList;

  const search = isTabSearch ? state.tabSearch?.[searchTabKey] : state.search;

  return {
    isTabTable,
    tabKey,
    isTabSearch,
    searchTabKey,
    dataList,
    page,
    pageSize,
    total,
    selectedRows,
    selectedRowKeys,
    loading,
    search,
  };
};
