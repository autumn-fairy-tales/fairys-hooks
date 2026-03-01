# 使用

## 基础使用

```tsx

import { useFairysSingleQuery, FairysInstanceBase } from '@fairys/hooks';

const MainIndex = () => {
  const { store, singleInstance } = useFairysSingleQuery({
    request: async (instance) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return Promise.resolve({
        data: instance.ref(Array.from({ length: 10 }, (_, i) => i)),
        success: true,
      })
    }
  });

  console.log('store', store, singleInstance);

  return (
    <div>
      <div>loading: {store.loading}</div>
      <div>data: {JSON.stringify(store.data)}</div>
    </div>
  );
}
export default Main;
```
