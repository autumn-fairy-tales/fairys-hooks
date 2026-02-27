import type { MenuItemType } from '@fairys/admin-tools-react';

export const menuItems: MenuItemType[] = [
  {
    title: '主菜单',
    path: 'main-menu',
    icon: 'ant-design:home-outlined',
    type: 'group',
    items: [
      {
        title: '首页',
        path: '/',
        icon: 'ant-design:home-outlined',
        isTabFixed: true,
      },
    ],
  },
];
