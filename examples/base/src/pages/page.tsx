import { FairysMainPage } from '@fairys/admin-tools-react';
import { FairysMainPageBody, FairysMainPageFooter, FairysMainPageSearch } from '@fairys/admin-tools-react';
import {
  useFairysPageData,
  FairysPageDataContext,
  useFairysPageDataSnapshot,
  useFairysSingleQuery,
} from '@fairys/hooks';
import { Table, Form, Input, Button } from 'antd';
import { useEffect } from 'react';

const MainIndex = () => {
  const { store, singleInstance } = useFairysSingleQuery({
    request: async (instance) => {
      return Promise.resolve({
        data: instance.ref(Array.from({ length: 10 }, (_, i) => i)),
        success: true,
      });
    },
  });
  console.log('store', store, singleInstance);

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
export const Component = MainIndex;
export default Component;
