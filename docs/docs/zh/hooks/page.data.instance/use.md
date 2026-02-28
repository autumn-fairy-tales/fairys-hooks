# 使用

## 基础使用

```tsx
import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageFooter, FairysMainPageSearch } from '@fairys/admin-tools-react';
import {
  useFairysPageData,
  FairysPageDataContext,
  useFairysPageDataSnapshot,
} from '@fairys/hooks';
import { Table, Form, Input, Button } from 'antd';
import { useEffect } from 'react';

const MainIndex = () => {
  const [form] = Form.useForm();
  const PageData = useFairysPageData({
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

  const state = useFairysPageDataSnapshot(PageData);
  console.log('state-page', state, PageData);

  useEffect(() => {
    PageData.onUpdatedPage(1);
  }, []);

  return (
    <FairysPageDataContext.Provider value={PageData}>
      <FairysMainPage>
        <FairysMainPageSearch>
          <Form
            form={form}
            initialValues={state.search}
            onValuesChange={(values) => {
              PageData.onUpdatedSearch(values);
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
              <Button type="primary" onClick={() => PageData.onUpdatedPage(1)}>
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
                PageData.onUpdatedPage(page, pageSize);
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
              PageData.onResetSearch({
                name: undefined,
                age: undefined,
              });
            }}
          >
            重置
          </Button>
        </FairysMainPageFooter>
      </FairysMainPage>
    </FairysPageDataContext.Provider>
  );
};
export default MainIndex;
```

## 重写实例

```tsx
import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageSearch } from '@fairys/admin-tools-react';
import {
  FairysPageDataContext,
  useFairysPageDataSnapshot,
  FairysPageData,
  type FairysPageDataOptions,
  type FairysPageDataState,
} from '@fairys/hooks';
import { Table, Form, Input, Button } from 'antd';
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

interface FairysPageDataCustomState extends FairysPageDataState {
  editType?: 'add' | 'edit';
  editFormData?: Record<string, any>;
  editVisible?: boolean;
}

class FairysPageDataCustom extends FairysPageData<FairysPageDataCustomState> {
  /**重写父级的默认状态*/
  get defaultStore(): FairysPageDataCustomState {
    return {
      ...super.defaultStore,
      editType: 'add',
      editFormData: this.ref({}),
      editVisible: false,
    };
  }

  /**编辑*/
  onEditOrAdd = (type: FairysPageDataCustomState['editType'], formData?: Record<string, any>) => {
    this.store.editFormData = this.ref(formData || {});
    this.store.editType = type;
    this.store.editVisible = true;
  };
}

const useFairysPageDataCustom = (options: FairysPageDataOptions) => {
  const ref = useRef<FairysPageDataCustom>();
  if (!ref.current) {
    // 不存在的时候才进行初始化
    ref.current = new FairysPageDataCustom(options);
  }
  return ref.current;
};

const MainIndex = () => {
  const [form] = Form.useForm();
  const PageData = useFairysPageDataCustom({
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

  const state = useFairysPageDataSnapshot<FairysPageDataCustomState>(PageData);
  console.log('state-custom', state, PageData);
  console.log('customState-edit数据', state.state.editFormData, state.state.editType, state.state.editVisible);

  useEffect(() => {
    PageData.onUpdatedPage(1);
  }, []);

  return (
    <FairysPageDataContext.Provider value={PageData}>
      <FairysMainPage>
        <FairysMainPageSearch>
          <Form
            form={form}
            initialValues={state.search}
            onValuesChange={(values) => {
              PageData.onUpdatedSearch(values);
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
              <Button type="primary" onClick={() => PageData.onUpdatedPage(1)}>
                查询
              </Button>
              <Button
                onClick={() => {
                  form.setFieldsValue({
                    name: undefined,
                    age: undefined,
                  });
                  PageData.onResetSearch({
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
                  PageData.onEditOrAdd('add');
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
                    <Button onClick={() => PageData.onEditOrAdd('edit', record)}>编辑</Button>
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
                PageData.onUpdatedPage(page, pageSize);
              },
            }}
          />
        </FairysMainPageBody>
      </FairysMainPage>
    </FairysPageDataContext.Provider>
  );
};
export default MainIndex;

```

## 多tabs示例

```tsx
import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageFooter, FairysMainPageSearch } from '@fairys/admin-tools-react';
import { useFairysPageData, FairysPageDataContext, useFairysPageDataSearchProps, useFairysPageDataTableProps, useFairysPageDataStoreSnapshot } from '@fairys/hooks';
import { Table, Form, Input, Button, Tabs } from 'antd';
import { useEffect } from 'react';

const ChildIndex = () => {
  const [form] = Form.useForm();
  const searchState = useFairysPageDataSearchProps();
  const tableState = useFairysPageDataTableProps();
  const state = searchState.state;
  const pageData = searchState.fairysPageData
  const loading = tableState.loading;

  console.log('state-page', searchState, tableState);

  useEffect(() => {
    pageData.onUpdatedPage(1);
  }, []);
  return <FairysMainPage>
    <FairysMainPageSearch>
      <Form
        form={form}
        initialValues={state.search}
        onValuesChange={(values) => {
          pageData.onUpdatedSearch(values);
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
          <Button type="primary" onClick={() => pageData.onUpdatedPage(1)}>
            查询
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue({
                name: undefined,
                age: undefined,
              });
              pageData.onResetSearch({
                name: undefined,
                age: undefined,
              });
            }}
          >
            重置
          </Button>
        </Form.Item>
      </Form>
    </FairysMainPageSearch>
    <FairysMainPageBody>
      <Table
        loading={!!loading}
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
        dataSource={tableState.dataList}
        pagination={{
          total: tableState.total,
          current: tableState?.page || 1,
          pageSize: tableState?.pageSize || 20,
          onChange(page, pageSize) {
            pageData.onUpdatedPage(page, pageSize);
          },
        }}
      />
    </FairysMainPageBody>
  </FairysMainPage>;
};


const MainIndex = () => {
  const pageData = useFairysPageData({
    tabKey: "key1",
    isTabTable: true,
    isTabSearch: true,
    getList: async (params, _, _tabKey) => {
      console.log('打印查询参数', params, _tabKey);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return Promise.resolve({
        total: 100,
        list: Array.from({ length: 20 }, (_, i) => ({
          name: `姓名_${_tabKey}____${i + 1 + (params.page - 1) * params.pageSize}`,
          age: 20 + i,
        })),
      });
    },
  });

  const store = useFairysPageDataStoreSnapshot(pageData);
  const tabKey = store.state.tabKey;

  return (
    <FairysPageDataContext.Provider value={pageData}>
      <Tabs
        activeKey={tabKey}
        onChange={(key) => {
          pageData.store.tabKey = key;
        }}
      >
        <Tabs.TabPane tab="子组件1" key="key1">
          <ChildIndex />
        </Tabs.TabPane>
        <Tabs.TabPane tab="子组件2" key="key2">
          <ChildIndex />
        </Tabs.TabPane>
      </Tabs>
    </FairysPageDataContext.Provider>
  );
};
export default MainIndex;
```