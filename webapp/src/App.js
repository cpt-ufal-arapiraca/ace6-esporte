import './App.css';
import RoutesPaths from './Routes';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0095DA',
          fontFamily: 'Inter',
        },
      }}
    >
      <RoutesPaths />
    </ConfigProvider>
  );
}

export default App;
