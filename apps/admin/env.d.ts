/// <reference types="vite/client" />

// 先定义对象的接口类型
interface AppCustomerConfig {
  name: string
  title: string
  languages: string[]
  defaultLanguage: string
  favicon: string
  logo: string
  clubWifiVlanId: null | number
  wifiVersion: string
}

// 扩展全局类型，声明对象变量
declare global {
  const __APP_CUSTOMER_CONFIG__: AppCustomerConfig
}

// 确保文件被当作模块处理
export {}
