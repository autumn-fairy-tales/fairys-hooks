# 页面数据实例

## 安装

```bash
npm install @fairys/hooks # yarn add @fairys/hooks  # pnpm add @fairys/hooks
```

## 引入

```ts
import { 
  FairysPageDataInstance,
  useFairysPageDataInstance,
  FairysPageDataInstanceContext,
  useFairysPageDataInstanceContext,
  useFairysPageDataInstanceStore,
  useFairysPageDataInstanceTableProps,
  useFairysPageDataInstanceSearchProps,
  useFairysPageDataInstanceSnapshot,
  useFairysPageDataInstanceEditFormProps
} from '@fairys/hooks';
```

## 类型

```ts
import { FairysPageDataInstance } from './';
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

/**
 * 页面数据实例
 */
export declare class FairysPageDataInstance<T extends FairysPageDataInstanceState = FairysPageDataInstanceState> {
    /**创建ref对象*/
    ref: <D extends Object>(value: D) => D & {
        $$valtioSnapshot: D;
    };
    /**实例参数*/
    _options: FairysPageDataInstanceOptions;
    /**默认状态*/
    get defaultStore(): T;
    /**状态*/
    store: T;
    /**请求之前处理参数*/
    onBefore?: (payload: Record<string, any>, instance: FairysPageDataInstance) => Record<string, any>;
    /**获取数据列表方法*/
    getList?: (params: Record<string, any>, instance: FairysPageDataInstance<T>) => Promise<{
        total: number;
        list: Record<string, any>[];
    }>;
    /**重置获取值的方法*/
    getResetValues?: (instance: FairysPageDataInstance<T>) => Record<string, any>;
    constructor(options?: FairysPageDataInstanceOptions);
    /**更新搜索参数*/
    onUpdatedSearch: (search: Record<string, any>) => this;
    /**重置搜索参数*/
    onResetSearch: (search?: Record<string, any>) => this;
    /**更新 loading*/
    updatedLoading: (loading: Record<string, any>) => this;
    /**更新查询列表 loading*/
    updatedQueryLoading: (loading?: boolean, tabKey?: string) => this;
    /**获取查询列表参数*/
    getQueryListParams: () => Record<string, any> 
    /**查询列表数据*/
    queryList: () => Promise<void>;
    /**分页*/
    onUpdatedPage: (page: number, pageSize?: number) => this;
    /**更新选择行数据*/
    onUpdatedSelected: (selectedRows: any[], selectedRowKeys: React.Key[]) => this;
}
/**
 * 初始化实例
 */
export declare const useFairysPageDataInstance: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState>(options?: FairysPageDataInstanceOptions) => FairysPageDataInstance<T>;
/**
 * 页面实例上下文
 */
export declare const FairysPageDataInstanceContext: import("react").Context<any>;
/**
 * 页面实例上下文解析
 * @returns 页面实例上下文
 */
export declare const useFairysPageDataInstanceContext: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState, M extends FairysPageDataInstance<T> = FairysPageDataInstance<T>>() => M;
/**
 * 页面实例状态解析
 * @param options useSnapshot参数选项
 * @returns [页面实例状态, 页面实例]
 */
export declare const useFairysPageDataInstanceStore: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState, M extends FairysPageDataInstance<T> = FairysPageDataInstance<T>>(options?: {
    sync?: boolean;
}) => [T, M];
/**
 * 页面实例表格属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例表格属性
 */
export declare const useFairysPageDataInstanceTableProps: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState, M extends FairysPageDataInstance<T> = FairysPageDataInstance<T>>(options?: {
    sync?: boolean;
}) => {
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
export declare const useFairysPageDataInstanceSearchProps: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState, M extends FairysPageDataInstance<T> = FairysPageDataInstance<T>>(options?: {
    sync?: boolean;
}) => {
    isTabSearch: boolean;
    tabKey: string;
    search: Record<string, any>;
};
/**
 * 页面实例编辑表单属性解析
 * @param options useSnapshot参数选项
 * @returns 页面实例编辑表单属性
 */
export declare const useFairysPageDataInstanceEditFormProps: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState, M extends FairysPageDataInstance<T> = FairysPageDataInstance<T>>(options?: {
    sync?: boolean;
}) => {
    editVisible: boolean;
    editType: string;
    editFormData: Record<string, any>;
};
/**
 * 页面实例状态解析
 * @param instance 页面实例
 * @returns 页面实例状态
 */
export declare const useFairysPageDataInstanceSnapshot: <T extends FairysPageDataInstanceState = FairysPageDataInstanceState, M extends FairysPageDataInstance<T> = FairysPageDataInstance<T>>(instance: M) => {
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
};
```

## 使用

### 基础使用

```tsx
import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageFooter, FairysMainPageSearch } from '@fairys/admin-tools-react';
import {
  useFairysPageDataInstance,
  FairysPageDataInstanceContext,
  useFairysPageDataInstanceSnapshot,
} from '@fairys/hooks';
import { Table, Form, Input, Button } from 'antd';
import { useEffect } from 'react';

const MainIndex = () => {
  const [form] = Form.useForm();
  const pageDataInstance = useFairysPageDataInstance({
    getList: async (params) => {
      console.log('打印查询参数', params);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return Promise.resolve({
        total: 100,
        list: Array.from({ length: 20 }, (_, i) => ({
          name: `姓名${i + 1 + (params.page - 1) * params.pageSize}`,
          age: 20 + i,
        })),
      });
    },
  });

  const state = useFairysPageDataInstanceSnapshot(pageDataInstance);
  console.log('state-page', state, pageDataInstance);

  useEffect(() => {
    pageDataInstance.onUpdatedPage(1);
  }, []);

  return (
    <FairysPageDataInstanceContext.Provider value={pageDataInstance}>
      <FairysMainPage>
        <FairysMainPageSearch>
          <Form
            form={form}
            initialValues={state.search}
            onValuesChange={(values) => {
              pageDataInstance.onUpdatedSearch(values);
            }}
            layout="inline"
          >
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="年龄" name="age">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => pageDataInstance.onUpdatedPage(1)}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </FairysMainPageSearch>
        <FairysMainPageBody>
          <Table
            loading={!!state.loading}
            rowKey="name"
            columns={[
              {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
              },
            ]}
            dataSource={state.dataList}
            pagination={{
              total: state.total,
              current: state?.page || 1,
              pageSize: state?.pageSize || 20,
              onChange(page, pageSize) {
                pageDataInstance.onUpdatedPage(page, pageSize);
              },
            }}
          />
        </FairysMainPageBody>
        <FairysMainPageFooter>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue({
                name: undefined,
                age: undefined,
              });
              pageDataInstance.onResetSearch({
                name: undefined,
                age: undefined,
              });
            }}
          >
            重置
          </Button>
        </FairysMainPageFooter>
      </FairysMainPage>
    </FairysPageDataInstanceContext.Provider>
  );
};
export default MainIndex;
```

### 重写实例

```tsx
import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageSearch } from '@fairys/admin-tools-react';
import {
  FairysPageDataInstanceContext,
  useFairysPageDataInstanceSnapshot,
  FairysPageDataInstance,
  type FairysPageDataInstanceOptions,
  type FairysPageDataInstanceState,
} from '@fairys/hooks';
import { Table, Form, Input, Button } from 'antd';
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

interface FairysPageDataInstanceCustomState extends FairysPageDataInstanceState {
  editType?: 'add' | 'edit';
  editFormData?: Record<string, any>;
  editVisible?: boolean;
}

class FairysPageDataInstanceCustom extends FairysPageDataInstance<FairysPageDataInstanceCustomState> {
  /**重写父级的默认状态*/
  get defaultStore(): FairysPageDataInstanceCustomState {
    return {
      ...super.defaultStore,
      editType: 'add',
      editFormData: this.ref({}),
      editVisible: false,
    };
  }

  /**编辑*/
  onEditOrAdd = (type: FairysPageDataInstanceCustomState['editType'], formData?: Record<string, any>) => {
    this.store.editFormData = this.ref(formData || {});
    this.store.editType = type;
    this.store.editVisible = true;
  };
}

const useFairysPageDataInstanceCustom = (options: FairysPageDataInstanceOptions) => {
  const ref = useRef<FairysPageDataInstanceCustom>();
  if (!ref.current) {
    // 不存在的时候才进行初始化
    ref.current = new FairysPageDataInstanceCustom(options);
  }
  return ref.current;
};

const MainIndex = () => {
  const [form] = Form.useForm();
  const pageDataInstance = useFairysPageDataInstanceCustom({
    getList: async (params) => {
      console.log('打印查询参数', params);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return Promise.resolve({
        total: 100,
        list: Array.from({ length: 20 }, (_, i) => ({
          name: `姓名${i + 1 + (params.page - 1) * params.pageSize}`,
          age: 20 + i,
        })),
      });
    },
  });

  const state = useFairysPageDataInstanceSnapshot(pageDataInstance);
  console.log('state-custom', state, pageDataInstance);
  const customState = useSnapshot(pageDataInstance.store);

  console.log('customState-edit数据', customState.editFormData, customState.editType, customState.editVisible);

  useEffect(() => {
    pageDataInstance.onUpdatedPage(1);
  }, []);

  return (
    <FairysPageDataInstanceContext.Provider value={pageDataInstance}>
      <FairysMainPage>
        <FairysMainPageSearch>
          <Form
            form={form}
            initialValues={state.search}
            onValuesChange={(values) => {
              pageDataInstance.onUpdatedSearch(values);
            }}
            layout="inline"
          >
            <Form.Item label="姓名" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="年龄" name="age">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => pageDataInstance.onUpdatedPage(1)}>
                查询
              </Button>
              <Button
                onClick={() => {
                  form.setFieldsValue({
                    name: undefined,
                    age: undefined,
                  });
                  pageDataInstance.onResetSearch({
                    name: undefined,
                    age: undefined,
                  });
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  pageDataInstance.onEditOrAdd('add');
                }}
              >
                新增
              </Button>
            </Form.Item>
          </Form>
        </FairysMainPageSearch>
        <FairysMainPageBody>
          <Table
            loading={!!state.loading}
            rowKey="name"
            columns={[
              {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 120,
                fixed: 'right',
                render: (_, record) => (
                  <>
                    <Button onClick={() => pageDataInstance.onEditOrAdd('edit', record)}>编辑</Button>
                  </>
                ),
              },
              {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
              },
            ]}
            dataSource={state.dataList}
            pagination={{
              total: state.total,
              current: state?.page || 1,
              pageSize: state?.pageSize || 20,
              onChange(page, pageSize) {
                pageDataInstance.onUpdatedPage(page, pageSize);
              },
            }}
          />
        </FairysMainPageBody>
      </FairysMainPage>
    </FairysPageDataInstanceContext.Provider>
  );
};

export default MainIndex;
```