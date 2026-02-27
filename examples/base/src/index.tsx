import ReactDOM from 'react-dom/client';
import { settingDataInstance, authDataInstance } from '@fairys/admin-tools-react';
import { AuthRoot } from './auth';
import logo from './assets/logo.png';
import './index.css';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'antd-style';

// for date-picker i18n
import 'dayjs/locale/zh-cn';

settingDataInstance.ctor({
  logo: logo,
  projectName: 'Fairys Admin',
  themeColor: '#af52de',
});

/**挂载退出登录事件*/
authDataInstance.onLogout = () => {
  console.log('onLogout');
  localStorage.removeItem('token');
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <ConfigProvider locale={zhCN} componentSize="small">
      <ThemeProvider themeMode={'auto'}>
        <AuthRoot />
      </ThemeProvider>
    </ConfigProvider>,
  );
}
