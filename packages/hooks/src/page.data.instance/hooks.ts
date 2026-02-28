import { useSnapshot } from 'valtio';
import { FairysPageDataState, FairysPageDataOptions } from './interface';
import { useRef, createContext, useContext } from 'react';
import { FairysPageData } from './instance';

/**
 * 初始化实例
 */
export const useFairysPageData = <T extends FairysPageDataState = FairysPageDataState>(
  options: Partial<FairysPageDataOptions>,
) => {
  const ref = useRef<FairysPageData<T>>();
  if (!ref.current) {
    // 不存在的时候才进行初始化
    ref.current = new FairysPageData<T>(options);
  }
  return ref.current;
};

// ========================================================页面实例上下文========================================================
/**
 * 页面实例上下文
 */
export const FairysPageDataContext = createContext(undefined);

// ========================================================页面实例上下文解析========================================================
/**
 * 页面实例上下文解析
 * @returns 页面实例上下文
 */
export const useFairysPageDataContext = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>() => {
  const context = useContext(FairysPageDataContext);
  if (!context) {
    throw new Error('useFairysPageDataContext 必须在 FairysPageDataContext.Provider 中使用');
  }
  return context as M;
};

// ========================================================页面实例状态解析========================================================
/**
 * 页面实例状态解析
 * @param options useSnapshot参数选项
 * @returns [页面实例状态, 页面实例]
 */
export const useFairysPageDataStore = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>(options?: {
  sync?: boolean;
}) => {
  const instance = useFairysPageDataContext<T, M>();
  const state = useSnapshot(instance.store, options);
  return [state, instance] as [T, M];
};

/**
 * 页面实例表格属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例表格属性
 */
export const useFairysPageDataTableProps = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>(options?: {
  sync?: boolean;
}) => {
  const [state, fairysPageData] = useFairysPageDataStore<T, M>(options);
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
    fairysPageData,
    state,
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
export const useFairysPageDataSearchProps = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>(options?: {
  sync?: boolean;
}) => {
  const [state, fairysPageData] = useFairysPageDataStore<T, M>(options);
  const isTabSearch = state.isTabSearch;
  const tabKey = isTabSearch ? state.tabKey : undefined;
  const search = isTabSearch ? state.tabSearch?.[tabKey] : state.search;
  return { isTabSearch, tabKey, search, fairysPageData, state };
};

/**
 * 页面实例编辑表单属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例编辑表单属性
 */
export const useFairysPageDataEditFormProps = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>(options?: {
  sync?: boolean;
}) => {
  const [state, fairysPageData] = useFairysPageDataStore<T, M>(options);
  const editVisible = state.editVisible;
  const editType = state.editType;
  const editFormData = state.editFormData;
  return { editVisible, editType, editFormData, fairysPageData, state };
};

/**
 * 页面实例滚动加载状态解析
 * @param instance 页面实例
 * @returns 页面实例滚动加载状态
 */
export const useFairysPageDataScrollLoadProps = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>(options?: {
  sync?: boolean;
}) => {
  const [state, fairysPageData] = useFairysPageDataStore<T, M>(options);
  const isTabTable = state.isTabTable;
  const tabKey = isTabTable ? state.tabKey : undefined;

  const enableScrollLoad = state.enableScrollLoad;
  const refresherStatus = isTabTable ? state.tabRefresherStatus?.[tabKey] : state.refresherStatus;
  const loadMoreStatus = isTabTable ? state.tabLoadMoreStatus?.[tabKey] : state.loadMoreStatus;
  const hasLastPage = isTabTable ? state.tabHasLastPage?.[tabKey] : state.hasLastPage;

  return {
    state,
    fairysPageData,
    tabKey,
    isTabTable,
    enableScrollLoad,
    refresherStatus,
    loadMoreStatus,
    hasLastPage,
  };
};

/**
 * 页面实例状态解析
 * @param instance 页面实例
 * @returns 页面实例状态
 */
export const useFairysPageDataSnapshot = <
  T extends FairysPageDataState = FairysPageDataState,
  M extends FairysPageData<T> = FairysPageData<T>,
>(
  instance: M,
  options?: {
    sync?: boolean;
  },
) => {
  const state = useSnapshot<T>(instance.store, options) as T;
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

  const enableScrollLoad = state.enableScrollLoad;
  const refresherStatus = isTabTable ? state.tabRefresherStatus?.[tabKey] : state.refresherStatus;
  const loadMoreStatus = isTabTable ? state.tabLoadMoreStatus?.[tabKey] : state.loadMoreStatus;
  const hasLastPage = isTabTable ? state.tabHasLastPage?.[tabKey] : state.hasLastPage;

  return {
    state,
    fairysPageData: instance,
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
    enableScrollLoad,
    refresherStatus,
    loadMoreStatus,
    hasLastPage,
  };
};
