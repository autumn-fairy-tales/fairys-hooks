import { FairysPageData } from 'page.data.instance';

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
  //================选择行数据========================
  // 选择行数据
  selectedRows?: any[];
  // 选择行数据键值
  selectedRowKeys?: React.Key[];
  //================分页数据========================
  // 分页数据默认值为1
  page?: number;
  /**分页大小*/
  pageSize?: number;
  /**数据总数*/
  total?: number;
  //==============tab配置===========================
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
  //====================下拉刷新、上拉加载================================
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
