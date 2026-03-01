import { proxy, ref } from 'valtio';
import { FairysPageDataState, FairysPageDataOptions } from './interface';
import { InstanceBase } from 'base.instance';
/**
 * 页面数据实例
 */
export class FairysPageData<T extends FairysPageDataState = FairysPageDataState> extends InstanceBase<T> {
  /**实例参数*/
  public _options: Partial<FairysPageDataOptions>;

  /**默认状态*/
  get defaultStore(): T {
    return {
      dataList: ref([]),
      page: 1,
      pageSize: 20,
      total: 0,
      search: {},
      selectedRows: ref([]),
      selectedRowKeys: ref([]),
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
      editVisible: false,
      editType: '',
      editFormData: {},
      refresherStatus: false,
      loadMoreStatus: false,
      hasLastPage: false,
      tabRefresherStatus: {},
      tabLoadMoreStatus: {},
      tabHasLastPage: {},
    } as unknown as T;
  }

  /**状态*/
  store = proxy<T>(this.defaultStore);

  //========================================================参数===========================================
  /**请求之前处理参数*/
  formatQuery?: (payload: Record<string, any>, instance: FairysPageData, _tabKey?: string) => Record<string, any>;
  /**获取数据列表方法*/
  getList?: (
    params: Record<string, any>,
    instance: FairysPageData<T>,
    _tabKey?: string,
  ) => Promise<{ total: number; list: Record<string, any>[] }>;
  /**重置获取值的方法*/
  getResetValues?: (instance: FairysPageData<T>, _tabKey?: string) => Record<string, any>;
  /**那些字段取值对象 code值*/
  codeFields?: string[] = [];
  /**那些字段取值对象的 value 值 */
  valueFields?: string[] = [];

  constructor(options: Partial<FairysPageDataOptions>) {
    super();
    const { formatQuery, getList, getResetValues, codeFields, valueFields, ...rest } = options;
    this.formatQuery = formatQuery;
    this.getList = getList;
    this.getResetValues = getResetValues;
    this.codeFields = codeFields || [];
    this.valueFields = valueFields || [];
    Object.assign(this.store, rest);
    this._options = options;
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
        this.store.tabSearch[this.store.tabKey] = { ...search };
      }
    } else {
      const oldSearch = this.store.search;
      if (oldSearch) {
        Object.assign(oldSearch, search);
      } else {
        this.store.search = { ...search };
      }
    }
    return this;
  };
  /**重置搜索参数*/
  onResetSearch = (search?: Record<string, any>, tabKey?: string) => {
    const _tabKey = this.store.isTabSearch
      ? typeof tabKey === 'string' || typeof tabKey === 'number'
        ? tabKey
        : this.store.tabKey
      : undefined;
    const values = this.getResetValues?.(this, _tabKey) || { ...search };
    if (this.store.isTabSearch) {
      if (!this.store.tabSearch) {
        this.store.tabSearch = {};
      }
      this.store.tabSearch[_tabKey] = { ...values, ...search };
    } else {
      this.store.search = { ...values, ...search };
    }
    this.onUpdatedPage(1);
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
  /**获取查询列表参数*/
  getQueryListParams = (tabKey?: string) => {
    const _tabKey = this.store.isTabTable
      ? typeof tabKey === 'string' || typeof tabKey === 'number'
        ? tabKey
        : this.store.tabKey
      : undefined;

    const search = this.store.isTabSearch ? this.store.tabSearch?.[_tabKey] || {} : this.store.search || {};

    const params: Record<string, any> = {
      ...search,
      page: this.store.isTabTable ? this.store.tabPage?.[_tabKey] || this.store.page : this.store.page,
      pageSize: this.store.isTabTable ? this.store.tabPageSize?.[_tabKey] || this.store.pageSize : this.store.pageSize,
    };

    const _query: Record<string, any> = { ...params };

    if (Array.isArray(this.valueFields) && this.valueFields.length) {
      for (let index = 0; index < this.valueFields.length; index++) {
        const key = this.valueFields[index];
        _query[key] = params[key]?.value;
      }
    }

    if (Array.isArray(this.codeFields) && this.codeFields.length) {
      for (let index = 0; index < this.codeFields.length; index++) {
        const key = this.codeFields[index];
        _query[key] = params[key]?.code;
      }
    }

    if (this.formatQuery) {
      return this.formatQuery?.(_query, this, _tabKey);
    }
    return _query;
  };

  /**更新下拉刷新或上拉加载状态*/
  updatedRefresherOrLoadMoreStatus = (status: boolean, page: number, tabKey?: string) => {
    if (tabKey) {
      if (!this.store.tabRefresherStatus) {
        this.store.tabRefresherStatus = {};
      }
      if (!this.store.tabLoadMoreStatus) {
        this.store.tabLoadMoreStatus = {};
      }
      if (page === 1) {
        this.store.tabRefresherStatus[tabKey] = status;
      } else {
        this.store.tabLoadMoreStatus[tabKey] = status;
      }
    } else {
      if (page === 1) {
        this.store.refresherStatus = status;
      } else {
        this.store.loadMoreStatus = status;
      }
    }
    return this;
  };

  /**查询列表数据*/
  queryList = async () => {
    const tabKey = this.store.isTabTable ? this.store.tabKey : undefined;
    const page = this.store.isTabTable ? this.store.tabPage[tabKey] || this.store.page : this.store.page;
    this.updatedQueryLoading(true, tabKey);
    try {
      const query = this.getQueryListParams(tabKey);
      if (!this.getList) {
        throw new Error('请实现获取数据列表方法');
      }
      this.updatedRefresherOrLoadMoreStatus(true, page, tabKey);
      const result = await this.getList(query, this, tabKey);
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
          if (this.store.enableScrollLoad) {
            if (page === 1) {
              this.onUpdatedSelected([], [], tabKey);
            }
          } else {
            this.onUpdatedSelected([], [], tabKey);
          }
        } else {
          this.store.total = result?.total || 0;
          this.store.dataList = ref(result?.list || []);
          this.onUpdatedSelected([], []);
        }
      }
    } catch (error) {
      console.log('查询列表数据失败', error);
    } finally {
      this.updatedQueryLoading(false, tabKey);
      this.updatedRefresherOrLoadMoreStatus(false, page, tabKey);
    }
  };

  /**分页*/
  onUpdatedPage = async (page: number, pageSize?: number) => {
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
    /**执行查询列表数据*/
    await this.queryList();
    return this;
  };

  /**更新选择行数据*/
  onUpdatedSelected = (selectedRows: any[], selectedRowKeys: React.Key[], tabKey?: string) => {
    const _tabKey = this.store.isTabTable
      ? typeof tabKey === 'string' || typeof tabKey === 'number'
        ? tabKey
        : this.store.tabKey
      : undefined;
    if (this.store.isTabTable) {
      if (!this.store.tabSelectedRows) {
        this.store.tabSelectedRows = {};
      }
      this.store.tabSelectedRows[_tabKey] = ref(selectedRows);
      if (!this.store.tabSelectedRowKeys) {
        this.store.tabSelectedRowKeys = {};
      }
      this.store.tabSelectedRowKeys[_tabKey] = ref(selectedRowKeys);
    } else {
      this.store.selectedRows = ref(selectedRows);
      this.store.selectedRowKeys = ref(selectedRowKeys);
    }
    return this;
  };

  /**加载更多*/
  onLoadMore = async () => {
    const isTabs = this.store.isTabTable;
    const tabKey = this.store.isTabTable ? this.store.tabKey : undefined;
    const loading = this.store.isTabTable ? this.store.loading?.[`${tabKey}_queryList`] : this.store.loading.queryList;
    if (loading) {
      // 加载中，不进行请求
      return;
    }
    if (isTabs) {
      if (!this.store.tabHasLastPage) {
        this.store.tabHasLastPage = {};
      }
      if (!this.store.tabTotal) {
        this.store.tabTotal = {};
      }
      if (!this.store.tabPage) {
        this.store.tabPage = {};
      }
      if (!this.store.tabPageSize) {
        this.store.tabPageSize = {};
      }
      if (!this.store.tabLoadMoreStatus) {
        this.store.tabLoadMoreStatus = {};
      }
      const total = this.store.tabTotal[tabKey] || 0;
      const page = this.store.tabPage[tabKey] || 1;
      const pageSize = this.store.tabPageSize[tabKey] || this.store.pageSize || 20;
      const count = Math.ceil(total / pageSize);

      let hasLastPage = false;
      if (page >= count && total) {
        // 已经最后一页数据了
        hasLastPage = true;
        this.store.tabHasLastPage[tabKey] = hasLastPage;
        return;
      }
      const nextPage = page + 1;
      if (nextPage >= count && total) {
        // 当前是最后一页数据
        hasLastPage = true;
      }
      this.store.tabLoadMoreStatus[tabKey] = true;
      // 判断是否最后一页数据
      this.store.tabPage[tabKey] = nextPage;
      await this.queryList();
      this.store.tabHasLastPage[tabKey] = hasLastPage;
      return;
    } else {
      const total = this.store.total || 0;
      const page = this.store.page || 1;
      const pageSize = this.store.pageSize || 20;
      const count = Math.ceil(total / pageSize);
      let hasLastPage = false;
      if (page >= count && total) {
        // 已经最后一页数据了
        hasLastPage = true;
        this.store.hasLastPage = hasLastPage;
        return;
      }
      const nextPage = page + 1;
      if (nextPage >= count && total) {
        // 当前是最后一页数据
        hasLastPage = true;
      }
      this.store.loading.loadMore = true;
      // 判断是否最后一页数据
      this.store.page = nextPage;
      await this.queryList();
      this.store.hasLastPage = hasLastPage;
    }
  };
}
