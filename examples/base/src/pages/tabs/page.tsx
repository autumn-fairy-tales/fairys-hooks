import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageFooter, FairysMainPageSearch } from '@fairys/admin-tools-react';
import {
  useFairysPageData,
  FairysPageDataContext,
  useFairysPageDataSearchProps,
  useFairysPageDataTableProps,
  useFairysPageDataStoreSnapshot,
} from '@fairys/hooks';
import { Table, Form, Input, Button, Tabs } from 'antd';
import { useEffect } from 'react';

const ChildIndex = () => {
  const [form] = Form.useForm();
  const searchState = useFairysPageDataSearchProps();
  const tableState = useFairysPageDataTableProps();
  const state = searchState.state;
  const pageData = searchState.fairysPageData;
  const loading = tableState.loading;

  console.log('state-page', searchState, tableState);

  useEffect(() => {
    pageData.onUpdatedPage(1);
  }, []);
  return (
    <FairysMainPage>
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
    </FairysMainPage>
  );
};

const MainIndex = () => {
  const pageData = useFairysPageData({
    tabKey: 'key1',
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
export const Component = MainIndex;
export default Component;
