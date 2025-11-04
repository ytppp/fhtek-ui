import { inject, type App, type Plugin } from 'vue'
import { createI18n, type I18n } from './utils/i18n'
import { type I18nConfig } from './types'

// 全局注入的 key
export const I18N_INJECTION_KEY = Symbol('my-library-i18n')

// Vue 插件
export const i18nPlugin: Plugin = {
  install(app: App, config: I18nConfig) {
    const i18n = createI18n(config)

    // 全局提供 i18n 实例
    app.provide(I18N_INJECTION_KEY, i18n)

    // 全局混入，为组件提供 $t 方法
    app.mixin({
      methods: {
        $t(key: string, params?: Record<string, any>) {
          const i18n = this.$i18n as I18n
          return i18n ? i18n.t(key, params) : key
        },
      },
    })

    // 配置全局属性
    // 将自定义 I18n 实例挂载到全局属性，使用类型断言绕过类型不匹配
    app.config.globalProperties.$i18n = i18n as any
  },
}

// Composition API
export const useI18n = () => {
  const i18n = inject<I18n>(I18N_INJECTION_KEY)

  if (!i18n) {
    throw new Error('useI18n must be used within app with i18n plugin')
  }

  const t = (key: string, params?: Record<string, any>) => i18n.t(key, params)
  const setLocale = (locale: string) => i18n.setLocale(locale as any)
  const getLocale = () => i18n.getLocale()

  return {
    t,
    setLocale,
    getLocale,
    i18n,
  }
}
