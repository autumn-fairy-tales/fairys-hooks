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
export const Component = MainIndex;
export default Component;
