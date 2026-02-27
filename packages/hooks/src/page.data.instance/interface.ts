import { FairysPageDataInstance } from 'page.data.instance';

/**
 * 页面数据状态数据类型
 */
export interface FairysPageDataInstanceState {
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
  [key: string]: any;
}

/**
 * 页面数据状态实例参数类型
 */
export interface FairysPageDataInstanceOptions extends FairysPageDataInstanceState {
  /**请求之前处理参数*/
  onBefore?: FairysPageDataInstance['onBefore'];
  /**获取数据列表方法*/
  getList?: FairysPageDataInstance['getList'];
  /**重置获取值的方法*/
  getResetValues?: FairysPageDataInstance['getResetValues'];
  [key: string]: any;
}
