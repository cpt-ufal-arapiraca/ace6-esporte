import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import RoutesPaths from './components/Routes'
import './styles/globalStyles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#0095DA',
        fontFamily: 'Inter',
      },
    }}
  >
    <React.StrictMode>
      <RoutesPaths />
    </React.StrictMode>
  </ConfigProvider>,
)