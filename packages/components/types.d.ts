// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, params?: Record<string, any>) => string
  }
}

declare global {
  // 扩展内置的 String 接口
  interface String {
    /**
     * 自定义方法：将字符串首字母大写
     * @returns 首字母大写后的字符串
     */
    format(): string

    /**
     * 自定义方法：移除字符串中的所有空格
     * @returns 无空格的字符串
     */
    removeSpaces(): string
  }
}

export {}
