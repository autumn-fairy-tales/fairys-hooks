# 使用

## 基础使用

```ts
import {  useFairysInstanceState } from '@fairys/hooks';

const [state, instance] = useFairysInstanceState({
    count: 0,
    data: [],
});

// 更新状态
instance.updatedStore({
    count: 1,
});

// 更新状态
instance.updatedStore({
  // 创建 ref 对象
  data: instance.ref([]),
});


```
