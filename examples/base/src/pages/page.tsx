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
export const Component = MainIndex;
export default Component;
